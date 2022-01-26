const {CookieJar, CookieAccessInfo} = require('cookiejar');
const {parse} = require('url');
class Agent {
    constructor(app, defaults = {}) {
        this.app = app;
        this.jar = new CookieJar();

        this.defaults = defaults;
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
    Agent.prototype[method] = async function (url, options = {}) { // eslint-disable-line no-unused-vars
        if (this.defaults.baseUrl) {
            url = `${this.defaults.baseUrl}/${url}`.replace(/(^|[^:])\/\/+/g, '$1/');
        }

        const reqOptions = {
            method: method.toUpperCase(),
            url
        };

        reqOptions.headers = Object.assign({}, this.defaults.headers, options.headers);
        reqOptions.body = Object.assign({}, this.defaults.body, options.body);

        return await this._provider.doRequest.call(this, reqOptions, {});
    };
});

module.exports.getAgent = (app, type, defaults) => {
    const agent = new Agent(app, defaults);

    // This is totally temporary so don't pollute the constructor
    agent._provider = getProvider(type);

    return agent;
};
