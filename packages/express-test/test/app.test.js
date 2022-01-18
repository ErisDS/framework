// Switch these lines once there are useful utils
// const testUtils = require('./utils');
const agentProvider = require('../lib/express-test');
const supertest = require('supertest');
require('./utils');

const app = require('./fixtures/app');

describe('Testing with our express mock', function () {
    let agent;
    before(function () {
        agent = agentProvider.getAgent(app);
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
