class Agent {
    constructor(app) {
        this.app = app;
    }

    async _doRequest(reqOptions = {}, resOptions = {}) {
        console.log('this.type', this.type);
        let agentProvider;
        if (this.type === 'mock') {
            agentProvider = require('./express-test-mock');
        } else if (this.type === 'reqres') {
            agentProvider = require('./express-test-reqres');
        } else {
            agentProvider = require('./express-test-wrapper');
        }

        return await agentProvider.doRequest.call(this, reqOptions, resOptions);
    }

    async get(url) {
        const reqOptions = {
            method: 'GET',
            url
        };

        return await this._doRequest(reqOptions);
    }
}

module.exports.getAgent = (app, type) => {
    const agent = new Agent(app);

    // This is totally temporary so don't pollute the constructor
    agent.type = type;

    return agent;
};
