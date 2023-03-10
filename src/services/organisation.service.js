const { error } = require('winston');
const { Organisation } = require('../models');
const { TYPE_ACCOUNT } = require('../utils/constants');
const { createLogger } = require('../utils/log');
const logger = createLogger();



/**
 * permets de créer l'espace personnel (qui est une organisation de type 1)
 * @param {*} userId l'utilisateur
 * @returns 
 */
const createPersonnalOrganisation = async (user) => {
  return Organisation.create({
    _id : user.currentOrganisation ,
    name: TYPE_ACCOUNT.Personal.name,
    accountUserLimit: TYPE_ACCOUNT.Personal.limit_user,
    accountTypeName: TYPE_ACCOUNT.Personal.name,
    accountTypeId: TYPE_ACCOUNT.Personal.id,
    cards: [],
    users: [user._id]
  });
};


/**
 * 
 * Créer une organisation de type professionnel
 * @param {*} userId l'utilisateur qui va créer l'organisation
 * @param {*} organisationName le nom de l'organisation 
 * @param {TYPE_ACCOUNT} organisationType le type d'organisation qui va être créé.
 */
const createProfessionalOrganisation = async (userId, organisationName, organisationType) => {

  if(organisationType === TYPE_ACCOUNT.Personal){
    logger.error('tentative de création d\'organisationpersonnel dans la method [createProfessionalOrganisation]');    
    throw new error('Le paramètre ne peut pas être un compte personnel');
  }

  Organisation.create({
    name: organisationName,
    accountUserLimit: organisationType.limit_user,
    accountTypeName: organisationType.name,
    accountTypeId: organisationType.id,
    cards: [],
    users: [userId]
  });
};

/**
 * Récupérer l'organisation (peut importe son type) par son id si l'utilisateur est présent dedans
 * sinon ne renvoi rien
 */
const getOrganisationByUserId = async (userId, idOrganisation) => {
  return await Organisation.findOne({ _id: idOrganisation, users: userId });
};

/**
 * Récupérer toutes les organisations dans laquel l'utilisateur est présent
 * peut importe leurs types
 */
const getAllOrganisationsByUserId = async (userId) => {
  return await Organisation.find({ users: userId });
};

module.exports = {
  createPersonnalOrganisation,
  createProfessionalOrganisation,
  getOrganisationByUserId,
  getAllOrganisationsByUserId
};