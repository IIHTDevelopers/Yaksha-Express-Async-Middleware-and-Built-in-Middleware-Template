// tests/app.test.js
const request = require('supertest');
const app = require('../app'); // Import the Express app
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

// Create a mock adapter instance for axios
const mock = new MockAdapter(axios);

let appBoundaryTest = `AppController boundary test`;

describe('App Controller', () => {
    describe('boundary', () => {
        beforeEach(() => {
            // Reset all requests and responses before each test
            mock.reset();
        });

        it(`${appBoundaryTest} should fetch all users from JSONPlaceholder API on GET /users`, async () => {
            // Mock the response for the GET /users request
            const mockResponse = [
                { id: 1, name: 'Leanne Graham' },
                { id: 2, name: 'Ervin Howell' }
            ];
            mock.onGet('https://jsonplaceholder.typicode.com/users').reply(200, mockResponse);

            // Send the GET request to the route
            const response = await request(app).get('/users');

            // Validate the response
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResponse);
        });

        it(`${appBoundaryTest} should fetch a specific user by ID from JSONPlaceholder API on GET /users/:id`, async () => {
            // Mock the response for the GET /users/:id request
            const mockUserResponse = { id: 1, name: 'Leanne Graham' };
            mock.onGet('https://jsonplaceholder.typicode.com/users/1').reply(200, mockUserResponse);

            // Send the GET request to the route with user ID 1
            const response = await request(app).get('/users/1');

            // Validate the response
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUserResponse);
        });

        it(`${appBoundaryTest} should return an error when the GET /users/:id API call fails`, async () => {
            // Mock an error response for the GET /users/:id request
            mock.onGet('https://jsonplaceholder.typicode.com/users/1').reply(500);

            // Send the GET request to the route with user ID 1
            const response = await request(app).get('/users/1');

            // Validate the error response
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Error fetching user');
        });

        it(`${appBoundaryTest} should update user data on PUT /users/:id`, async () => {
            // Mock the response for the PUT /users/:id request
            const updatedUser = { id: 1, name: 'Updated Name' };
            mock.onPut('https://jsonplaceholder.typicode.com/users/1').reply(200, updatedUser);

            // Send the PUT request with updated data
            const response = await request(app).put('/users/1').send({ name: 'Updated Name' });

            // Validate the response
            expect(response.status).toBe(200);
            expect(response.body).toEqual(updatedUser);
        });

        it(`${appBoundaryTest} should return an error when the PUT /users/:id API call fails`, async () => {
            // Mock an error response for the PUT /users/:id request
            mock.onPut('https://jsonplaceholder.typicode.com/users/1').reply(500);

            // Send the PUT request to update user data
            const response = await request(app).put('/users/1').send({ name: 'Updated Name' });

            // Validate the error response
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Error updating user data');
        });

        it(`${appBoundaryTest} should process incoming data and fetch user data with POST /process`, async () => {
            // Mock the response for the custom async middleware to fetch user data
            const mockUserResponse = { id: 1, name: 'Leanne Graham' };
            mock.onGet('https://jsonplaceholder.typicode.com/users/1').reply(200, mockUserResponse);

            // Send the POST request with user data
            const requestData = { userId: 1 };
            const response = await request(app).post('/process').send(requestData);

            // Validate the response
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Processing completed successfully');
            expect(response.body.incomingData).toEqual(requestData);
            expect(response.body.fetchedData).toEqual(mockUserResponse);
        });

        it(`${appBoundaryTest} should return an error if user data is not fetched on POST /process`, async () => {
            // Simulate an error fetching user data
            mock.onGet('https://jsonplaceholder.typicode.com/users/1').reply(500);

            // Send the POST request with user data
            const requestData = { userId: 1 };
            const response = await request(app).post('/process').send(requestData);

            // Validate the error response
            expect(response.status).toBe(500);
        });
    });
});
