const { Theme } = require('../models');
const { isEmpty } = require('../utils/tool');
const get = async (id) => {
  if (isEmpty(id)) throw new Error('The parameter must cannot be empty');
  const theme = Theme.findById(id);
  return theme;
};

const getAll = async () => {
  const themes = Theme.find();
  return themes;
};

module.exports = {
  get,
  getAll,
};
