const express = require('express');
const config = require('./config');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/config', (req, res) => {
  const { version, env } = config;
  res.send({ version, env });
});


module.exports = app;