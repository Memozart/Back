const { Theme } = require('../models');
const { isEmpty } = require('../utils/tool');

/**
 * récupère un thème par son id
 * @param {*} id du thème
 * @returns retourne le thème ou null si non trouvé
 */
const get = async (id) => {
  if (isEmpty(id)) throw new Error('The parameter cannot be empty');
  return Theme.findById(id);
};

/**
 * récupère tous les thèmes de la base
 * @returns retourne tous les thèmes
 */
const getAll = async () => {
  return Theme.find();
};

module.exports = {
  get,
  getAll,
};
