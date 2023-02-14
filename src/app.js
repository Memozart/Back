const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const config = require('./config');
const morganMiddleware = require('./middlewares/morgan.middleware');

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morganMiddleware);

// * Handle syntax error
app.use((error, response, next) => {
  if (error instanceof SyntaxError) {
    return response.status(400).send({ error: 'Syntax error' });
  }
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/config', (req, res) => {
  const { version, env } = config;
  res.send({ version, env });
});

// * Handle not found
app.use((request, response) => {
  const error = new Error(`🔍 - Not Found - ${request.originalUrl}`);
  response.status(404);
  response.json({
    message: error.message,
  });
});

module.exports = app;
