const request = require("supertest")

describe('Access Nonxistent Endpoint', (response) => {
    const badEndpoint = [
        request(process.env.HOST)
            .post(`/xxxxx`)
            .send({}),
        request(process.env.HOST)
            .get(`/xxxxx`),
        request(process.env.HOST)
            .put(`/xxxxx`)
            .send({}),
        request(process.env.HOST)
            .delete(`/xxxxx`)
            .send({}),
    ];

    badEndpoint.forEach((endpoint, i) => {
        it(`Request API #${i + 1}`, async () => {
            response = await endpoint;
        });

        test('it should response 404 status code', () => {
            expect(response.statusCode).toBe(404);
        });
        test('response body should be an object', () => {
            expect(typeof response.body).toBe('object');
        });
        test('response body have correct property and value', () => {
            expect(response.body.code).toBe(404);
            expect(response.body.message).toBe('Not Found');
        });
    });
});