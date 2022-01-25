// Switch these lines once there are useful utils
// const testUtils = require('./utils');
const agentProvider = require('../lib/agent');

const supertest = require('supertest');

require('./utils');

const app = require('./fixtures/app');

const agents = {
    MockAgent: agentProvider.getAgent(app, 'mock'),
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

        it('PUT JSON', async function () {
            const {statusCode, headers, body, text} = await agent.put('/posts/42/', {
                body: {posts: [{title: 'So long and thanks for all the fish.'}]}
            });

            statusCode.should.eql(200);
            headers.should.be.an.Object().with.properties('x-powered-by', 'content-type', 'content-length', 'etag');
            body.should.eql({posts: [{id: 42, title: 'So long and thanks for all the fish.'}]});
            text.should.eql('{"posts":[{"id":42,"title":"So long and thanks for all the fish."}]}');
        });
    });
});

describe('Testing with supertest', function () {
    let agent;
    before(function () {
        agent = supertest(app);
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

    it('PUT JSON', async function () {
        const {statusCode, headers, body, text} = await agent
            .put('/posts/42/')
            .send({posts: [{title: 'So long and thanks for all the fish.'}]});

        statusCode.should.eql(200);
        headers.should.be.an.Object().with.properties('x-powered-by', 'content-type', 'content-length', 'etag');
        body.should.eql({posts: [{id: 42, title: 'So long and thanks for all the fish.'}]});
        text.should.eql('{"posts":[{"id":42,"title":"So long and thanks for all the fish."}]}');
    });
});
