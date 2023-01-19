const request = require("supertest")

describe('Create User with Valid Payload', (response) => {
    it(`Request API`, async () => {
        response = await request(process.env.HOST)
            .post(`/users`)
            .send({
                email: 'john@test.com',
                password: 'P@ssw0rd',
                confirmPassword: 'P@ssw0rd'
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
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.id).toBe(parseInt(process.env.JOHN_ID));

        process.env.JOHN_ID = response.body.data.id;
    });
});

describe('Create User with Invalid Payload', (response) => {
    const badPayloads = [
        {},
        { email: 0 },
        { email: true },
        { email: 'john@test.com' },
        { email: 'john@test.com', password: true },
        { email: 'john@test.com', password: 'secret' },
        { email: 'john@test.com', password: 'secret', confirmCassword: 0 },
        { email: 'john@test.com', password: 'secret', confirmCassword: true },
        { email: 'john@test.com', password: 'secret', confirmCassword: 'notsecret' }
    ];

    badPayloads.forEach((payload, i) => {
        it(`Request API #${i + 1}`, async () => {
            response = await request(process.env.HOST)
                .post(`/users`)
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

describe('Create User with Already Taken Email', (response) => {
    it(`Request API`, async () => {
        response = await request(process.env.HOST)
            .post(`/users`)
            .send({
                email: 'john@test.com',
                password: 'P@ssw0rd',
                confirmPassword: 'P@ssw0rd'
            });
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

describe('Get All Users', (response) => {
    it('Request API', async () => {
        response = await request(process.env.HOST).get(`/users`);
    });

    test('it should response 200 status code', () => {
        expect(response.statusCode).toBe(200);
    });
    test('response body should be an object', () => {
        expect(typeof response.body).toBe('object');
    });
    test('response body have correct property and value', () => {
        expect(response.body.code).toBe(200);

        response.body.data.forEach(data => {
            expect(typeof data.id).toBe('number');
            expect(typeof data.email).toBe('string');
            expect(typeof data.imageUrl).toBe('string');
        });
    });
});

describe('Get User by Id', (response) => {
    it('Request API', async () => {
        response = await request(process.env.HOST).get(`/users/${process.env.JOHN_ID}`);
    });

    test('it should response 200 status code', () => {
        expect(response.statusCode).toBe(200);
    });
    test('response body should be an object', () => {
        expect(typeof response.body).toBe('object');
    });
    test('response body have correct property and value', () => {
        expect(response.body.code).toBe(200);

        expect(response.body.data.id).toBe(1);
        expect(response.body.data.email).toBe('john@test.com');
        expect(typeof response.body.data.imageUrl).toBe('string');
    });
});

describe('Get User by Non-Exist Id', (response) => {
    it('Request API', async () => {
        response = await request(process.env.HOST).get(`/users/xxxxx`);
    });

    test('it should response 404 status code', () => {
        expect(response.statusCode).toBe(404);
    });
    test('response body should be an object', () => {
        expect(typeof response.body).toBe('object');
    });
    test('response body have correct property and value', () => {
        expect(response.body.code).toBe(404);
        expect(response.body.message).toBe('User Not Found');
    });
});

describe('[Prequisites] Login with email John', (response) => {
    it('Request API', async () => {
        response = await request(process.env.HOST)
            .post(`/auth`)
            .send({
                email: 'john@test.com',
                password: 'P@ssw0rd'
            });

        process.env.ACCESS_TOKEN_JOHN = response.body.data.accessToken;
    });
});

describe('(John) Update Email with Invalid Payload', (response) => {
    const badPayloads = [
        {},
        { email: 0 },
        { email: true },
        { email: 'john@test' },
    ];

    badPayloads.forEach((payload, i) => {
        it(`Request API #${i + 1}`, async () => {
            response = await request(process.env.HOST)
                .put(`/users/email`)
                .set('Authorization', 'Bearer ' + process.env.ACCESS_TOKEN_JOHN)
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

describe('(John) Update Password with Invalid Payload', (response) => {
    const badPayloads = [
        {},
        { password: 0 },
        { password: true },
        { password: 'NEWP@ssw0rd' },
        { confirmPassword: 0 },
        { confirmPassword: true },
        { confirmPassword: 'NEWP@ssw0rd' },
        { password: true, confirmPassword: 'NEWP@ssw0rdx' },
        { password: 'NEWP@ssw0rd', confirmPassword: true },
        { password: 'NEWP@ssw0rd', confirmPassword: 'NEWP@ssw0rdx' },
    ];

    badPayloads.forEach((payload, i) => {
        it(`Request API #${i + 1}`, async () => {
            response = await request(process.env.HOST)
                .put(`/users/password`)
                .set('Authorization', 'Bearer ' + process.env.ACCESS_TOKEN_JOHN)
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

describe('(John) Update Email with Valid Payload', (response) => {
    it(`Request API`, async () => {
        response = await request(process.env.HOST)
            .put(`/users/email`)
            .set('Authorization', 'Bearer ' + process.env.ACCESS_TOKEN_JOHN)
            .send({
                email: 'newjohn@test.com'
            });
    });

    test('it should response 200 status code', () => {
        expect(response.statusCode).toBe(200);
    });
    test('response body should be an object', () => {
        expect(typeof response.body).toBe('object');
    });
    test('response body have correct property and value', () => {
        expect(response.body.code).toBe(200);

        expect(response.body.message).toBe('Email Updated Succesfully');
        expect(response.body.data.email).toBe('newjohn@test.com');
    });
});

describe('(John) Update Password with Valid Payload', (response) => {
    it(`Request API`, async () => {
        response = await request(process.env.HOST)
            .put(`/users/password`)
            .set('Authorization', 'Bearer ' + process.env.ACCESS_TOKEN_JOHN)
            .send({
                password: 'NEWP@ssw0rd',
                confirmPassword: 'NEWP@ssw0rd'
            });
    });

    test('it should response 200 status code', () => {
        expect(response.statusCode).toBe(200);
    });
    test('response body should be an object', () => {
        expect(typeof response.body).toBe('object');
    });
    test('response body have correct property and value', () => {
        expect(response.body.code).toBe(200);

        expect(response.body.message).toBe('Password Updated Succesfully');
    });
});

describe('Get User by Id (John) After Update Email', (response) => {
    it('Request API', async () => {
        response = await request(process.env.HOST).get(`/users/${process.env.JOHN_ID}`);
    });

    test('it should response 200 status code', () => {
        expect(response.statusCode).toBe(200);
    });
    test('response body should be an object', () => {
        expect(typeof response.body).toBe('object');
    });
    test('response body have correct property and value', () => {
        expect(response.body.code).toBe(200);

        expect(response.body.data.id).toBe(1);
        expect(response.body.data.email).toBe('newjohn@test.com');
    });
});

describe('(John) Delete User', (response) => {
    it(`Request API`, async () => {
        response = await request(process.env.HOST)
            .delete(`/users`)
            .set('Authorization', 'Bearer ' + process.env.ACCESS_TOKEN_JOHN);
    });

    test('it should response 200 status code', () => {
        expect(response.statusCode).toBe(200);
    });
    test('response body should be an object', () => {
        expect(typeof response.body).toBe('object');
    });
    test('response body have correct property and value', () => {
        expect(response.body.code).toBe(200);

        expect(response.body.message).toBe('User Deleted Succesfully');
    });
});