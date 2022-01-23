const httpMocks = require('node-mocks-http');
const express = require('express');
const {isJSON} = require('./utils');

module.exports.doRequest = function doRequest(reqOptions = {}, resOptions = {}) {
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

    return new Promise((resolve) => {
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

        this.app(req, res);
    });
};
