// Switch these lines once there are useful utils
// const testUtils = require('./utils');
const agentProvider = require('../');

const supertest = require('supertest');

require('./utils');

const app = require('./fixtures/app');

const agents = {
    // MockAgent: agentProvider.getAgent(app, 'mock')
    // WrappedAgent: agentProvider.getAgent(app, 'wrapper'),
    ReqResAgent: agentProvider.getAgent(app, 'reqres')
};

Object.keys(agents).forEach((agentName) => {
    let agent = agents[agentName];
    describe(`Testing with ${agentName}`, function () {
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
            body.should.eql({posts: [{id: 42, title: 'Hello World!'}]});
            text.should.eql('{"posts":[{"id":42,"title":"Hello World!"}]}');
        });

        it('wrong param', async function () {
            const {statusCode, headers, body, text} = await agent.get('/posts/404/');

            statusCode.should.eql(404);
            headers.should.be.an.Object().with.properties('x-powered-by', 'content-type', 'content-length', 'etag');
            body.should.eql({});
            text.should.eql('Not Found');
        });

        it('PUT JSON', async function () {
            const {statusCode, headers, body, text} = await agent.put('/posts/42/', {
                body: {posts: [{title: 'So long and thanks for all the fish.'}]}
            });

            statusCode.should.eql(200);
            headers.should.be.an.Object().with.properties('x-powered-by', 'content-type', 'content-length', 'etag');
            body.should.eql({posts: [{id: 42, title: 'So long and thanks for all the fish.'}]});
            text.should.eql('{"posts":[{"id":42,"title":"So long and thanks for all the fish."}]}');
        });

        it('login', async function () {
            const {statusCode, headers, body, text} = await agent.post('/login/', {
                body: {
                    username: 'hello',
                    password: 'world'
                }
            });

            statusCode.should.eql(200);
            headers.should.be.an.Object().with.properties('x-powered-by', 'content-type', 'content-length', 'etag', 'set-cookie');
            body.should.eql({});
            text.should.eql('OK');
        });

        it.skip('authenticated request', async function () {
            const {statusCode, headers, body, text} = await agent.get('/api/posts/42/');

            statusCode.should.eql(200);
            headers.should.be.an.Object().with.properties('x-powered-by', 'content-type', 'content-length', 'etag');
            body.should.eql({posts: [{id: 42, title: 'Hello World!'}]});
            text.should.eql('{"posts":[{"id":42,"title":"Hello World!"}]}');
        });
    });
});

describe('Testing with supertest', function () {
    let agent;
    before(function () {
        agent = supertest.agent(app);
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
        body.should.eql({posts: [{id: 42, title: 'Hello World!'}]});
        text.should.eql('{"posts":[{"id":42,"title":"Hello World!"}]}');
    });

    it('wrong param', async function () {
        const {statusCode, headers, body, text} = await agent.get('/posts/404/');

        statusCode.should.eql(404);
        headers.should.be.an.Object().with.properties('x-powered-by', 'content-type', 'content-length', 'etag');
        body.should.eql({});
        text.should.eql('Not Found');
    });

    it('PUT JSON', async function () {
        const {statusCode, headers, body, text} = await agent
            .put('/posts/42/')
            .send({posts: [{title: 'So long and thanks for all the fish.'}]});

        statusCode.should.eql(200);
        headers.should.be.an.Object().with.properties('x-powered-by', 'content-type', 'content-length', 'etag');
        body.should.eql({posts: [{id: 42, title: 'So long and thanks for all the fish.'}]});
        text.should.eql('{"posts":[{"id":42,"title":"So long and thanks for all the fish."}]}');
    });

    it('login', async function () {
        const {statusCode, headers, body, text} = await agent.post('/login/')
            .send({
                username: 'hello',
                password: 'world'
            });

        statusCode.should.eql(200);
        headers.should.be.an.Object().with.properties('x-powered-by', 'content-type', 'content-length', 'etag', 'set-cookie');
        body.should.eql({});
        text.should.eql('OK');
    });

    it('authenticated request', async function () {
        const {statusCode, headers, body, text} = await agent.get('/api/posts/42/');

        statusCode.should.eql(200);
        headers.should.be.an.Object().with.properties('x-powered-by', 'content-type', 'content-length', 'etag');
        body.should.eql({posts: [{id: 42, title: 'Hello World!'}]});
        text.should.eql('{"posts":[{"id":42,"title":"Hello World!"}]}');
    });
});
