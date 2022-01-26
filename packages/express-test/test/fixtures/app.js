const express = require('express');
const session = require('express-session');

const app = express();

const fs = require('fs').promises;
const path = require('path');

const isLoggedIn = function (req, res, next) {
    if (req.session.loggedIn) {
        return next();
    }

    res.sendStatus(403);
};

app.use(express.json());

app.use(session({
    secret: 'verysecretstring',
    name: 'testauth',
    resave: false,
    saveUninitialized: false
}));

app.get('/', (req, res) => {
    return res.send('Hello World!');
});

app.get('/posts/:id/', async (req, res) => {
    if (req.params.id !== '42') {
        return res.sendStatus(404);
    }

    const response = await fs.readFile(path.join(__dirname, 'post.json'), {encoding: 'utf8'});
    const json = JSON.parse(response);
    return res.json(json);
});

app.put('/posts/:id', async (req, res) => {
    if (req.params.id !== '42') {
        return res.sendStatus(404);
    }
    const response = await fs.readFile(path.join(__dirname, 'post.json'), {encoding: 'utf8'});
    const json = JSON.parse(response);
    json.posts[0] = Object.assign(json.posts[0], req.body.posts[0]);

    return res.json(json);
});

app.post('/login/', async (req, res) => {
    if (req.body.username && req.body.password && req.body.username === 'hello' && req.body.password === 'world') {
        req.session.loggedIn = true;
        req.session.username = req.body.username;
        return res.sendStatus(200);
    }

    return res.sendStatus(401);
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
});
app.get('/api/posts/:id', isLoggedIn, async (req, res) => {
    if (req.params.id !== '42') {
        return res.sendStatus(404);
    }
    const response = await fs.readFile(path.join(__dirname, 'post.json'), {encoding: 'utf8'});
    const json = JSON.parse(response);
    return res.json(json);
});

module.exports = app;
