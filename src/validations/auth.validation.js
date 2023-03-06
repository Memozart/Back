const Joi = require('joi');

const register = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
};
