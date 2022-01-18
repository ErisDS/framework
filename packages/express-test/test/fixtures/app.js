const express = require('express');
const app = express();

const fs = require('fs').promises;
const path = require('path');

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/posts/:id/', async (req, res) => {
    const response = await fs.readFile(path.join(__dirname, 'response.json'), {encoding: 'utf8'});
    const json = JSON.parse(response);
    res.send(json);
});

module.exports = app;
