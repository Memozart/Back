const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const config = require('./config');

const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/config', (req, res) => {
  const { version, env } = config;
  res.send({ version, env });
})

module.exports = app;