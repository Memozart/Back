const { Card } = require("../models");

const create = (card) => {
  return Card.create(card);
};

const get = (id) => {
  return Card.findById(id);
};

const getAll = () => {
  return Card.find();
};

const update = (id, card) => {
  return Card.findByIdAndUpdate(id, card,  { new: true });
};

const remove = (id) => {
  try {
    Card.findByIdAndDelete(id);
    return true;
  } catch (error) {
    return error;
  }
};

module.exports = {
  create,
  get,
  getAll,
  update,
  remove,
};
