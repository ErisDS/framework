const express = require('express');
const app = express();

const fs = require('fs').promises;
const path = require('path');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/posts/:id/', async (req, res) => {
    const response = await fs.readFile(path.join(__dirname, 'post.json'), {encoding: 'utf8'});
    const json = JSON.parse(response);
    res.json(json);
});

app.put('/posts/:id', async (req, res) => {
    const response = await fs.readFile(path.join(__dirname, 'post.json'), {encoding: 'utf8'});
    const json = JSON.parse(response);
    json.posts[0] = Object.assign(json.posts[0], req.body.posts[0]);

    res.json(json);
});

module.exports = app;
