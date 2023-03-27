const { Step } = require('../models');

const get = (id) => {
  return Step.findById(id);
};

const getAll = () => {
  return Step.find();
};

const create = (stepBody) =>{
  return Step.create(stepBody);
};

const update = (id, Step) => {
  return Step.findByIdAndUpdate(id, Step, { new: true });
};

const remove = (id) => {
  try {
    return Step.findByIdAndDelete(id);
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
