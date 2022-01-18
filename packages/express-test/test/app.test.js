// Switch these lines once there are useful utils
// const testUtils = require('./utils');
const mockProvider = require('../lib/express-test-mock');
const wrappedProvider = require('../lib/express-test-wrapper');
const reqresProvider = require('../lib/express-test-reqres');
const supertest = require('supertest');
require('./utils');

const app = require('./fixtures/app');

describe.only('Testing with our express mock', function () {
    let agent;
    before(function () {
        agent = mockProvider.getAgent(app);
    });

    it('Simple string', async function () {
        const {statusCode, headers, body, text} = await agent.get('/');

        statusCode.should.eql(200);
        headers.should.be.an.Object().with.properties('x-powered-by', 'content-type', 'content-length', 'etag');
        body.should.eql({});
        text.should.eql('Hello World!');
    });

    it('JSON and params', async function () {
        const {statusCode, headers, body, text} = await agent.get('/posts/42/');

        statusCode.should.eql(200);
        headers.should.be.an.Object().with.properties('x-powered-by', 'content-type', 'content-length', 'etag');
        body.should.eql({id: 42});
        text.should.eql('{"id":42}');
    });
});

describe('Testing with our express wrapper', function () {
    let agent;
    before(function () {
        agent = wrappedProvider.getAgent(app);
    });

    it('Simple string', async function () {
        const {statusCode, headers, body, text} = await agent.get('/');

        statusCode.should.eql(200);
        headers.should.be.an.Object().with.properties('x-powered-by', 'content-type', 'content-length', 'etag');
        body.should.eql({});
        text.should.eql('Hello World!');
    });

    // it('JSON and params', async function () {
    //     const {statusCode, headers, body, text} = await agent.get('/posts/42/');

    //     statusCode.should.eql(200);
    //     headers.should.be.an.Object().with.properties('x-powered-by', 'content-type', 'content-length', 'etag');
    //     body.should.eql({id: 42});
    //     text.should.eql('{"id":42}');
    // });
});

describe.only('Testing with reqresnext', function () {
    let agent;
    before(function () {
        agent = reqresProvider.getAgent(app);
    });

    it('Simple string', async function () {
        const {statusCode, headers, body, text} = await agent.get('/');

        statusCode.should.eql(200);
        headers.should.be.an.Object().with.properties('x-powered-by', 'content-type', 'content-length', 'etag');
        body.should.eql({});
        text.should.eql('Hello World!');
    });

    it('JSON and params', async function () {
        const {statusCode, headers, body, text} = await agent.get('/posts/42/');

        statusCode.should.eql(200);
        // headers.should.be.an.Object().with.properties('x-powered-by', 'content-type', 'content-length', 'etag');
        body.should.eql({id: 42});
        text.should.eql('{"id":42}');
    });
});

describe('Testing with supertest', function () {
    let superagent;
    before(function () {
        superagent = supertest(app);
    });
    it('Simple string', async function () {
        const {statusCode, headers, body, text} = await superagent.get('/');

        statusCode.should.eql(200);
        headers.should.be.an.Object().with.properties('x-powered-by', 'content-type', 'content-length', 'etag');
        body.should.eql({});
        text.should.eql('Hello World!');
    });

    it('JSON and params', async function () {
        const {statusCode, headers, body, text} = await superagent.get('/posts/42/');

        statusCode.should.eql(200);
        headers.should.be.an.Object().with.properties('x-powered-by', 'content-type', 'content-length', 'etag');
        body.should.eql({id: 42});
        text.should.eql('{"id":42}');
    });
});
