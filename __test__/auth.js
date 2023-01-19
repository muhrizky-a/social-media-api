const request = require("supertest")

describe('[Prequisites] Create User John again', (response) => {
    it('Request API', async () => {
        response = await request(process.env.HOST)
            .post(`/users`)
            .send({
                email: 'john@test.com',
                password: 'P@ssw0rd',
                confirmPassword: 'P@ssw0rd'
            });

        process.env.JOHN_ID = response.body.data.id;
    });
});

describe('Login with with Invalid Payload', (response) => {
    const badPayloads = [
        {},
        { email: 0 },
        { email: true },
        { password: true },
        { email: 'john@test.com' },
        { email: 'john@test.com', password: true }
    ];

    badPayloads.forEach((payload, i) => {
        it(`Request API #${i + 1}`, async () => {
            response = await request(process.env.HOST)
                .post(`/auth`)
                .send(payload);
        });

        test('it should response 400 status code', () => {
            expect(response.statusCode).toBe(400);
        });
        test('response body should be an object', () => {
            expect(typeof response.body).toBe('object');
        });
        test('response body have correct property and value', () => {
            expect(response.body.code).toBe(400);

            expect(typeof response.body.errors).toBe('object');
        });
    });
});

describe('Login with Invalid Password', (response) => {
    it('Request API', async () => {
        response = await request(process.env.HOST)
            .post(`/auth`)
            .send({
                email: 'john@test.com',
                password: 'xxxxx'
            });
    });

    test('it should response 401 status code', () => {
        expect(response.statusCode).toBe(401);
    });
    test('response body should be an object', () => {
        expect(typeof response.body).toBe('object');
    });
    test('response body have correct property and value', () => {
        expect(response.body.code).toBe(401);
        expect(response.body.message).toBe('Invalid Password');
    });
});

describe('Login with Email John', (response) => {
    it('Request API', async () => {
        response = await request(process.env.HOST)
            .post(`/auth`)
            .send({
                email: 'john@test.com',
                password: 'P@ssw0rd'
            });
    });

    test('it should response 201 status code', () => {
        expect(response.statusCode).toBe(201);
    });
    test('response body should be an object', () => {
        expect(typeof response.body).toBe('object');
    });
    test('response body have correct property and value', () => {
        expect(response.body.code).toBe(201);

        expect(typeof response.body.data.accessToken).toBe('string');
        process.env.ACCESS_TOKEN_JOHN = response.body.data.accessToken;
    });
});