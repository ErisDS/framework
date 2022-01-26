const {Request, Response} = require('reqresnext');
const {isJSON} = require('./utils');

module.exports.doRequest = function doRequest(reqOptions = {}, resOptions = {}) {
    const req = new Request(Object.assign({}, reqOptions, {app: this.app}));
    const res = new Response(Object.assign({}, resOptions, {app: this.app, req: req}));

    // Without this express errors when there is no matching route and finalHandler is called
    req.unpipe = () => {};

    // reqresnext has a bug where end overwrites the data
    res.end = (chunk, encoding) => {
        if (chunk) {
            res.write(chunk, encoding);
        }
        res.emit('finish');
        return this;
    };

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
