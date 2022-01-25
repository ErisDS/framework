const express = require('express');
const app = express();

const fs = require('fs').promises;
const path = require('path');

app.use(express.json());

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

module.exports = app;
