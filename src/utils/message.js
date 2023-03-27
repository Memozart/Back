const responses = require('../models/responses');
const config = require('../config/index');

const errorF = (message, error, code, res, next) => {
  res.status(code);
  if (config.environment == 'prod') {
    res.json(
      new responses(message, {})
    );
  } else {
    res.json(
      new responses(message, `${error}`)
    );
  }
  return next(res);
};

const successF = (message, body, code, res, next) => {
  res.status(code);
  res.json(
    new responses(message, body)
  );
  return next(res);
};

module.exports = {
  errorF,
  successF,
};