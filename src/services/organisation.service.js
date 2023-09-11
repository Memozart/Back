const { error } = require('winston');
const { Organisation } = require('../models');
const { TYPE_ACCOUNT } = require('../utils/constants');
const { createLogger } = require('../utils/log');
const logger = createLogger();

/**
 * permets de créer l'espace personnel (qui est une organisation de type 1)
 * @param {*} userId l'utilisateur qui sera administrateur de l'organisation
 * @returns l'organisation crée
 */
const createPersonnalOrganisation = async (user) => {
  return Organisation.create({
    _id: user.currentOrganisation,
    name: TYPE_ACCOUNT.Personal.name,
    accountUserLimit: TYPE_ACCOUNT.Personal.limit_user,
    accountTypeName: TYPE_ACCOUNT.Personal.name,
    accountTypeId: TYPE_ACCOUNT.Personal.id,
    havePaid: true,
    siren: '0',
    cards: [],
    admin: [user._id],
  });
};

/**
 * Créer une organisation de type professionnel (voir TYPE_ACCOUNT)
 * @param {*} userId l'utilisateur qui va créer l'organisation
 * @param {*} organisationName le nom de l'organisation
 * @param {TYPE_ACCOUNT} organisationType le type d'organisation qui va être créé.
 */
const createProfessionalOrganisation = async (
  userId,
  organisationName,
  organisationType,
  siren,
  customerId
) => {
  if (organisationType === TYPE_ACCOUNT.Personal) {
    logger.error(
      'tentative de création [organisation personnel] dans la method [createProfessionalOrganisation]'
    );
    throw new error('Le paramètre ne peut pas être un compte personnel');
  }

  return await Organisation.create({
    name: organisationName,
    accountUserLimit: organisationType.limit_user,
    accountTypeName: organisationType.name,
    accountTypeId: organisationType.id,
    cards: [],
    admin: [userId],
    customerId: customerId,
    siren: siren,
  });
};

/**
 *
 * Récupérer les informations non confidentielle de l'organisation (peut importe son type) par son id
 * @param {*} userId l'utilisateur qui réalise la demande
 * @param {*} organisationId l'organisation qui doit être récupérer
 * @returns l'organisation si l'utilisateur est PRÉSENT sinon rien
 */
const getOrganisationById = async (userId, organisationId) => {
  return await Organisation.findOne({
    _id: organisationId,
    $or: [{ users: userId }, { admin: userId }],
  });
};

/**
 * Récupérer les informations de l'organisation (peut importe son type) par son id
 * @param {*} userId l'utilisateur qui réalise la demande
 * @param {*} organisationId l'organisation qui doit être récupérer
 * @returns l'organisation si l'utilisateur est ADMINISTRATEUR sinon rien
 */
const getOrganisationIfAdmin = async (userId, organisationId) => {
  const organisation = await Organisation.findOne({
    _id: organisationId,
    admin: userId,
  });
  return organisation;
};

/**
 * Récupérer toutes les organisations dans laquel l'utilisateur est présent
 * peut importe leurs types
 * @param {*} userId l'utilisateur qui réalise la demande
 * @returns les organisations dans laquelle l'utilisateur est PRÉSENT sinon rien
 */
const getAllOrganisationsByUserId = async (userId) => {
  // users = userId || admin = userId and havePaid = true or unset
  return await Organisation.find({
    $or: [{ users: userId }, { admin: userId }],
    $and: [{ havePaid: true }, { havePaid: { $ne: null } }],
  });
};

/**
 * Ajoute un utilisateur dans l'organisation
 *
 * ⚠ passe par un pre 'findOneAndUpdate' dans le model organisation avant la requete
 * @param {*} userId l'utilisateur qui réalise la demande
 * @param {*} organisationId l'organisation dans laquelle l'utilisateur doit être rajouter
 * @param {*} userIdAdded  l'utilisateur à ajouter
 * @returns l'organisation avec la nouvelle personne ajouté (étant donné que seul un admin peut ajouter il peut récupérer la liste de tous les membres)
 */
const addUserInOrganisation = async (userId, organisationId, userIdAdded) => {
  const data = await Organisation.findOneAndUpdate(
    { _id: organisationId, admin: userId },
    { $push: { users: userIdAdded } },
    {
      new: true, // return the updated document instead of the original
      runValidators: true, // run pre query on schema
    }
  )
    .select('name admin users accountUserLimit')
    .populate({
      path: 'admin',
      select: 'firstName lastName _id',
    })
    .populate({
      path: 'users',
      select: 'firstName lastName _id',
    });
  return data;
};

/**
 * supprime un utilisateur de l'organisation
 *
 * ⚠ passe par un pre 'findOneAndUpdate' dans le model organisation avant la requete
 * @param {*} userId l'utilisateur qui réalise la demande
 * @param {*} organisationId l'organisation dans laquelle l'utilisateur doit être rajouter
 * @param {*} userIdAdded  l'utilisateur à supprimer
 * @returns l'organisation sans la personne (étant donné que seul un admin peut ajouter il peut récupérer la liste de tous les membres)
 */
const userLeaveInOrganisation = async (
  userId,
  organisationId,
  userIdDeleted
) => {
  return await Organisation.findOneAndUpdate(
    { _id: organisationId, admin: userId },
    { $pull: { users: userIdDeleted } },
    {
      new: true, // return the updated document instead of the original
      runValidators: true, // run pre query on schema
    }
  ).select('name admin users accountUserLimit')
    .populate({
      path: 'admin',
      select: 'firstName lastName _id',
    })
    .populate({
      path: 'users',
      select: 'firstName lastName _id',
    });
};

const addCardToOrganisation = async (
  userId,
  organisationId,
  cardId,
  runPreValidator = true
) => {
  return await Organisation.findOneAndUpdate(
    { _id: organisationId, admin: userId },
    { $push: { cards: cardId } },
    {
      new: true, // return the updated document instead of the original
      runValidators: runPreValidator,
    }
  );
};

const removeCardToOrganisation = async (
  userId,
  organisationId,
  cardId,
  runPreValidator = true
) => {
  return await Organisation.findOneAndUpdate(
    { _id: organisationId, admin: userId },
    { $pull: { card: cardId } },
    {
      new: true, // return the updated document instead of the original
      runValidators: runPreValidator,
    }
  );
};

/**
 * Récupérer toutes les cartes d'un utilisateur dans une organisation
 * @param {number} userId
 * @param {number} organisationId
 * @returns
 */
const getAllUserCard = async (userId, organisationId) => {
  return await Organisation.findOne({
    _id: organisationId,
    $or: [{ users: userId }, { admin: userId }],
  }).populate({
    path: 'cards',
    populate: {
      path: 'theme',
    },
  });
};

/**
 * vérifie que l'utilisateur à bien les droit de modification sur la carte
 * en vérifiant si l'utilisateur est adminisatrateur et si la carte existe.
 * @param {*} userId l'utilisateur qui réalise la demande
 * @paraym {*} organisationId l'organisation qui doit être récupérer
 * @paraym {*} cardId lde la carte à modifier
 * @returns true si a les droits sinon false
 */
const hasRoleToManageCard = async (userId, organisationId, cardId) => {
  const organisation = await Organisation.findOne({
    _id: organisationId,
    admin: userId,
    cards: cardId,
  });
  return organisation ? true : false;
};

const updateOrganisationHavePaid = async (customerId, userId) => {
  return Organisation.findOneAndUpdate(
    { customerId: customerId, admin: userId },
    { havePaid: true },
    {
      new: true,
      runValidators: false,
    }
  );
};


/**
 * Retour 
 * @param {*} userId 
 * @param {*} organisationId 
 */
const getAllUserInOrganisation = async (userId, organisationId) => {
  return await Organisation.findOne({
    _id: organisationId,
    admin: userId
  }).select('name admin users accountUserLimit')
    .populate({
      path: 'admin',
      select: 'firstName lastName _id',
    })
    .populate({
      path: 'users',
      select: 'firstName lastName _id',
    });
};

module.exports = {
  createPersonnalOrganisation,
  createProfessionalOrganisation,
  getOrganisationById,
  getAllOrganisationsByUserId,
  addUserInOrganisation,
  userLeaveInOrganisation,
  getOrganisationIfAdmin,
  addCardToOrganisation,
  removeCardToOrganisation,
  getAllUserCard,
  hasRoleToManageCard,
  updateOrganisationHavePaid,
  getAllUserInOrganisation
};
