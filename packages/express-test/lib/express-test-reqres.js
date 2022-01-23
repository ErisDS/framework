const {Request, Response} = require('reqresnext');

const {isJSON} = require('./utils');

module.exports.doRequest = function doRequest(reqOptions = {}, resOptions = {}) {
    const req = new Request(Object.assign({}, reqOptions, {app: this.app}));
    const res = new Response(Object.assign({}, resOptions, {app: this.app, req: req}));

    res._headers = res.header;

    return new Promise((resolve) => {
        res.on('finish', () => {
            const statusCode = res.statusCode;
            const headers = Object.assign({}, res.getHeaders());
            const text = res.body.toString('utf8');
            let body = {};

            if (isJSON(res.getHeader('Content-Type'))) {
                body = text && JSON.parse(text);
            }

            resolve({statusCode, headers, text, body, response: res});
        });

        this.app(req, res);
    });
};
