const organisationService = require('../services/organisation.service');
const catchAsync = require('../utils/catchAsync');
const { successF } = require('../utils/message');
const { TYPE_ACCOUNT } = require('../utils/constants');




const create = catchAsync(async (req, res, next) => {
  const { _id: userId } = req.user._doc || 1;/// 
  const { name, type: idTypeAccount } = req.body;
  const typeAccount = Object.values(TYPE_ACCOUNT).find(e => e.id === idTypeAccount);
  const organisation = organisationService.createProfessionalOrganisation(userId, name, typeAccount);
  successF(`${typeAccount.name} organisation as created`, organisation, 200, res, next);
});

const getById = catchAsync(async (req, res, next) => {
  const userId = req.body.user.id || 1;/// 
  const organisationId = req.params.id || 1;/// 
  const organisation = organisationService.getOrganisationByUserId(userId, organisationId);
  successF('organisation fetch', organisation, 200, res, next);
});

const getAll = catchAsync(async (req, res, next) => {
  const userId = req.body.user.id || 1;/// 
  const organisations = organisationService.getAllOrganisationsByUserId(userId);
  successF('organisations fetch', organisations, 200, res, next);
});

/**
 * methode qui permet à l'utilisateur courant de quitter l'organisation
 */
const leave = catchAsync(async () => {
  throw new Error('not implemented');
});

module.exports = {
  create,
  getById,
  getAll,
  leave
};
