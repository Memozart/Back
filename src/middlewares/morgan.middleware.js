const morgan = require('morgan');
const { createLogger } = require('../utils/log');
const split = require('split');

const stream = split().on('data', (message) => {
  createLogger('http').info(message);
});

const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream }
);

module.exports = morganMiddleware;
