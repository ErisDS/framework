const {Request, Response} = require('express');
const {request} = require('http');
const url = require('url');
const {response} = require('../test/fixtures/app');

function mixinProperties(obj, proto) {
    for (let prop in proto) {
        if (!Object.prototype.hasOwnProperty.call(obj, prop)) {
            console.log(prop, obj);
            obj[prop] = proto[prop];
        }
    }
    return obj;
}

// class Request {
//     constructor(reqOptions) {
//         this.connection = {encrypted: false};

//         mixinProperties(this, request);

//         this.method = reqOptions.method;
//         this.url = reqOptions.url;
//     }
// }

// class Response {
//     constructor(resOptions) {
//         this.__P

//         this.status(200);
//         this.body = {};
//         this.req = resOptions.req || {};
//         this.app = resOptions.app;

//         this.end = (chunk) => {
//             console.log('ending', chunk);
//             if (chunk) {
//                 this.body = chunk;
//             }
//             console.log('emmitting finish');
//             this.emit('finish');
//             return this;
//         };
//     }

function createRequest(reqOptions) {
    request.url = reqOptions.url;
    return request;
}

function createResponse(resOptions) {
    response.req = resOptions.req;
    response._headers = {};
    return response;
}

module.exports.doRequest = function doRequest(reqOptions = {}, resOptions = {}) {
    // const req = new Request(Object.assign({}, reqOptions, {app: this.app}));
    // const res = new Response(Object.assign({}, resOptions, {app: this.app, req: req}));

    const req = createRequest(Object.assign({}, reqOptions, {app: this.app}));
    const res = createResponse(Object.assign({}, resOptions, {app: this.app, req: req}));

    // console.log(req, res);

    return new Promise((resolve, reject) => {
        try {
            res.on('finish', () => {
                console.log('finishing', res);
                const statusCode = res.statusCode;
                const headers = res.getHeaders();
                const text = res.body;
                let body = {};

                // if (isJSON(res.getHeader('Content-Type'))) {
                //     body = text && JSON.parse(text);
                // }

                console.log('doing resolve');
                resolve({statusCode, headers, text, body, response: res});
            });

            res.on('error', (error) => {
                console.log('error', error);
            });

            this.app(req, res);
        } catch (error) {
            reject(error);
        }
    });
};
