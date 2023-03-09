const { Theme } = require('../models');

const get = async (id) => {
  if(isNaN(parseInt(id)))
    throw new Error('The parameter must be number and cannot be empty');
  const theme=  Theme.findById(id);
  return theme;
};

const getAll = async () => {
  const themes=  Theme.find();
  return themes;
};


module.exports = {
  get,
  getAll
};