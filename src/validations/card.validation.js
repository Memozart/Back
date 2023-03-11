const Joi = require('joi');

const create = {
  body: Joi.object().keys({
    question: Joi.string().required().min(2),
    answer: Joi.string().required(),
    help: Joi.string(),
    theme: Joi.string().hex().length(24).required(),
  }),
};

const update = {
  body: Joi.object().keys({
    question: Joi.string().required().min(2),
    answer: Joi.string().required(),
    help: Joi.string(),
    theme: Joi.string().hex().length(24).required(),
  }),
};

module.exports = {
  create,
  update,
};
