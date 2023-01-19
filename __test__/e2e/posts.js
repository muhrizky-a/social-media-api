const request = require("supertest")

describe('[Prequisites] Create User Jane', (response) => {
    it('Request API', async () => {
        response = await request(process.env.HOST)
            .post(`/users`)
            .send({
                email: 'jane@test.com',
                password: 'P@ssw0rd',
                confirmPassword: 'P@ssw0rd'
            });
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

describe('[Prequisites] Login with email Jane', (response) => {
    it('Request API', async () => {
        response = await request(process.env.HOST)
            .post(`/auth`)
            .send({
                email: 'jane@test.com',
                password: 'P@ssw0rd'
            });

        process.env.ACCESS_TOKEN_JANE = response.body.data.accessToken;
    });
});

describe('Create Post with Invalid Payload', (response) => {
    const badPayloads = [
        {},
        { contents: 0 },
        { contents: true }
    ];

    badPayloads.forEach((payload, i) => {
        it(`Request API #${i + 1}`, async () => {
            response = await request(process.env.HOST)
                .post(`/posts`)
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

describe('(John) Create Post with Valid Payload', (response) => {
    it(`Request API`, async () => {
        response = await request(process.env.HOST)
            .post(`/posts`)
            .set('Authorization', 'Bearer ' + process.env.ACCESS_TOKEN_JOHN)
            .send({
                contents: 'Hello world!'
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
        expect(response.body.data.id).toBe(1);
        expect(response.body.data.userId).toBe(parseInt(process.env.JOHN_ID));
        expect(response.body.data.contents).toBe('Hello world!');
    });
});

describe('(John) Create Another Post', (response) => {
    it(`Request API`, async () => {
        response = await request(process.env.HOST)
            .post(`/posts`)
            .set('Authorization', 'Bearer ' + process.env.ACCESS_TOKEN_JOHN)
            .send({
                contents: 'Welcome to Socmed!'
            });
    });
});

describe('Get Posts from John', (response) => {
    it('Request API', async () => {
        response = await request(process.env.HOST).get(`/users/${process.env.JOHN_ID}/posts`);
    });

    test('it should response 200 status code', () => {
        expect(response.statusCode).toBe(200);
    });
    test('response body should be an object', () => {
        expect(typeof response.body).toBe('object');
    });
    test('response body have correct property and value', () => {
        expect(response.body.code).toBe(200);

        expect(response.body.data).toHaveLength(2);

        response.body.data.forEach(post => {
            expect(typeof post.id).toBe('number');
            expect(typeof post.userId).toBe('number');
            expect(typeof post.contents).toBe('string');
        });
    });
});

describe('Get Posts from Non-Existent User Id', (response) => {
    it('Request API', async () => {
        response = await request(process.env.HOST).get(`/users/xxxxx/posts`);
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

describe('Get Posts by Id', (response) => {
    it('Request API', async () => {
        response = await request(process.env.HOST).get(`/posts/1`);
    });

    test('it should response 200 status code', () => {
        expect(response.statusCode).toBe(200);
    });
    test('response body should be an object', () => {
        expect(typeof response.body).toBe('object');
    });
    test('response body have correct property and value', () => {
        expect(response.body.code).toBe(200);


        expect(typeof response.body.data.id).toBe('number');
        expect(typeof response.body.data.userId).toBe('number');
        expect(typeof response.body.data.contents).toBe('string');

        expect(response.body.data.id).toBe(1);
        expect(response.body.data.userId).toBe(parseInt(process.env.JOHN_ID));
        expect(response.body.data.contents).toBe('Hello world!');
    });
});

describe('Get Post by Non-Existent Id', (response) => {
    it('Request API', async () => {
        response = await request(process.env.HOST).get(`/posts/xxxxx`);
    });

    test('it should response 404 status code', () => {
        expect(response.statusCode).toBe(404);
    });
    test('response body should be an object', () => {
        expect(typeof response.body).toBe('object');
    });
    test('response body have correct property and value', () => {
        expect(response.body.code).toBe(404);

        expect(response.body.message).toBe('Post Not Found');
    });
});


describe('(John) Update Post with Invalid Payload', (response) => {
    const badPayloads = [
        {},
        { contents: 0 },
        { contents: true }
    ];

    badPayloads.forEach((payload, i) => {
        it(`Request API #${i + 1}`, async () => {
            response = await request(process.env.HOST)
                .put(`/posts/1`)
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

describe("(Jane) Update John's Post with Id 1", (response) => {
    it(`Request API`, async () => {
        response = await request(process.env.HOST)
            .put(`/posts/1`)
            .set('Authorization', 'Bearer ' + process.env.ACCESS_TOKEN_JANE)
            .send({
                contents: 'Hello world guys!'
            });
    });

    test('it should response 403 status code', () => {
        expect(response.statusCode).toBe(403);
    });
    test('response body should be an object', () => {
        expect(typeof response.body).toBe('object');
    });
    test('response body have correct property and value', () => {
        expect(response.body.code).toBe(403);

        expect(response.body.message).toBe('Unauthorized');
    });
});

describe('(John) Update Post with Id 1', (response) => {
    it(`Request API`, async () => {
        response = await request(process.env.HOST)
            .put(`/posts/1`)
            .set('Authorization', 'Bearer ' + process.env.ACCESS_TOKEN_JOHN)
            .send({
                contents: 'Hello world!'
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

        expect(response.body.message).toBe('Post Updated Succesfully');
        expect(response.body.data.contents).toBe('Hello world!');
    });
});

describe("(Jane) Delete John's Post with Id 1", (response) => {
    it(`Request API`, async () => {
        response = await request(process.env.HOST)
            .delete(`/posts/1`)
            .set('Authorization', 'Bearer ' + process.env.ACCESS_TOKEN_JANE);
    });

    test('it should response 403 status code', () => {
        expect(response.statusCode).toBe(403);
    });
    test('response body should be an object', () => {
        expect(typeof response.body).toBe('object');
    });
    test('response body have correct property and value', () => {
        expect(response.body.code).toBe(403);

        expect(response.body.message).toBe('Unauthorized');
    });
});

describe('(John) Delete Post with Id 1', (response) => {
    it(`Request API`, async () => {
        response = await request(process.env.HOST)
            .delete(`/posts/1`)
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

        expect(response.body.message).toBe('Post Deleted Succesfully');
    });
});

describe('Get Posts from John after Delete 1 Post', (response) => {
    it('Request API', async () => {
        response = await request(process.env.HOST).get(`/users/${process.env.JOHN_ID}/posts`);
    });

    test('it should response 200 status code', () => {
        expect(response.statusCode).toBe(200);
    });
    test('response body should be an object', () => {
        expect(typeof response.body).toBe('object');
    });
    test('response body have correct property and value', () => {
        expect(response.body.code).toBe(200);

        expect(response.body.data).toHaveLength(1);

        response.body.data.forEach(post => {
            expect(typeof post.id).toBe('number');
            expect(typeof post.userId).toBe('number');
            expect(typeof post.contents).toBe('string');
        });
    });
});