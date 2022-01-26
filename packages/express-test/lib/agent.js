const {CookieJar, CookieAccessInfo} = require('cookiejar');
const {parse} = require('url');
class Agent {
    constructor(app) {
        this.app = app;
        this.jar = new CookieJar();
    }

    _getCookies(req) {
        const url = parse(req.url);

        const access = new CookieAccessInfo(
            url.hostname,
            url.pathname,
            url.protocol === 'https:'
        );

        return this.jar.getCookies(access).toValueString();
    }

    _saveCookies(res) {
        const cookies = res.getHeader('set-cookie');

        if (cookies) {
            this.jar.setCookies(cookies);
        }
    }
}

const getProvider = (type) => {
    let agentProvider;
    if (type === 'mock') {
        agentProvider = require('./express-test-mock');
    } else if (type === 'reqres') {
        agentProvider = require('./express-test-reqres');
    } else {
        agentProvider = require('./express-test-wrapper');
    }
    return agentProvider;
};

const methods = ['get', 'put', 'post', 'delete'];

methods.forEach(function (method) {
    Agent.prototype[method] = async function (url, options) { // eslint-disable-line no-unused-vars
        const reqOptions = {
            method: method.toUpperCase(),
            url
        };

        return await this._provider.doRequest.call(this, Object.assign(reqOptions, options), {});
    };
});

module.exports.getAgent = (app, type) => {
    const agent = new Agent(app);

    // This is totally temporary so don't pollute the constructor
    agent._provider = getProvider(type);

    return agent;
};
