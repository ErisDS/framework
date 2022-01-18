const httpMocks = require('node-mocks-http');
const express = require('express');
const agent = {};

// borrowed from superagent
function isJSON(mime) {
// should match /json or +json
    // but not /json-seq
    return /[/+]json($|[^-\w])/i.test(mime);
}

module.exports.getAgent = (app) => {
    agent.app = app;
    return agent;
};

function doRequest(reqOptions = {}, resOptions = {}) {
    let data = null;
    const {req, res} = httpMocks.createMocks(reqOptions, resOptions);

    function json() {
        return express.response.json.apply(res, arguments);
    }

    function send(body) {
        // This can be called multiple times, the value is set to the last value send sees
        data = body;
        return express.response.send.apply(res, arguments);
    }

    return new Promise(function (resolve) {
        res.send = send;
        res.json = json;
        res.end = function end() {
            const statusCode = res.statusCode;
            const headers = res._headers;
            const text = data;
            let body = {};

            if (isJSON(res.getHeader('Content-Type'))) {
                body = text && JSON.parse(text);
            }

            return resolve({statusCode, headers, text, body, response: res});
        };

        agent.app(req, res);
    });
}

agent.get = async (url, options) => {
    const reqOptions = {
        method: 'GET',
        url
    };

    return await doRequest(reqOptions);
};
