const Joi = require('joi').extend(require('@joi/date'));

const create = {
  body: Joi.object().keys({
    question: Joi.string().required().min(2),
    answer: Joi.string().required(),
    help: Joi.string().allow(null, ''),
    theme: Joi.string().hex().length(24).required(),
    datePresentation: Joi.date().format('DD/MM/YYYY')
  }),
};

const update = {
  body: Joi.object().keys({
    question: Joi.string().required().min(2),
    answer: Joi.string().required(),
    help: Joi.string(),
    theme: Joi.string().hex().length(24).required()
  }),
};

module.exports = {
  create,
  update,
};
