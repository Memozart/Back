const organisationService = require('../services/organisation.service');
const catchAsync = require('../utils/catchAsync');
const { successF } = require('../utils/message');
const { TYPE_ACCOUNT } = require('../utils/constants');
const tool = require('../utils/tool');
const stripe = require('../services/stripe.service');

const create = catchAsync(async (req, res, next) => {
  const { userId } = tool.getUserIdAndOrganisationId(req);
  const { name, siren } = req.body;
  const nbEmployes = await stripe.getNbEmployes(siren);
  const customer = await stripe.createCustomer(name, req.user.email);
  const id = customer.id;
  let typeAccount = TYPE_ACCOUNT.MicroEntreprise;
  if (nbEmployes <= 50 && nbEmployes > 10) {
    typeAccount = TYPE_ACCOUNT.PetiteEntreprise;
  } else if (nbEmployes <= 250 && nbEmployes > 50) {
    typeAccount = TYPE_ACCOUNT.MoyenneEntreprise;
  }
  const randomString = await stripe.createRandomStringInRedis(id);
  await organisationService.createProfessionalOrganisation(
    userId,
    name,
    typeAccount,
    siren,
    id
  );
  const subscription = await stripe.subscribeCustomer(id, typeAccount, randomString);
  successF(
    'organisation as created',
    subscription,
    200,
    res,
    next
  );
});

const getById = catchAsync(async (req, res, next) => {
  const { userId } = tool.getUserIdAndOrganisationId(req);
  const organisationId = req.params.id;
  const organisation = await organisationService.getOrganisationById(
    userId,
    organisationId
  );
  successF('organisation fetch', organisation, 200, res, next);
});

const getAll = catchAsync(async (req, res, next) => {
  const { userId } = tool.getUserIdAndOrganisationId(req);
  const organisations = await organisationService.getAllOrganisationsByUserId(
    userId
  );
  successF('organisations fetch', organisations, 200, res, next);
});

/**
 * methode qui permet à l'utilisateur courant de quitter l'organisation
 */
const leave = catchAsync(async (req, res, next) => {
  const { userId } = tool.getUserIdAndOrganisationId(req);
  const organisationId = req.params.id;
  const { userIdDeleted } = req.body;
  const organisation = await organisationService.userLeaveInOrganisation(
    userId,
    organisationId,
    userIdDeleted
  );
  successF('the user was leave the organisation', organisation, 200, res, next);
});

const join = catchAsync(async (req, res, next) => {
  const { userId } = tool.getUserIdAndOrganisationId(req);
  const organisationId = req.params.id;
  const { userIdAdded } = req.body;
  const organisation = await organisationService.addUserInOrganisation(
    userId,
    organisationId,
    userIdAdded
  );
  successF('the user was join the organisation', organisation, 200, res, next);
});

/**
 * Récupérer toutes les cartes de l'organisation
 */
const getAllCards = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { userId } = tool.getUserIdAndOrganisationId(req);
  const cards = await organisationService.getAllUserCard(userId, id);
  successF('cards fetch', cards, 200, res, next);
});

const validPayment = catchAsync(async (req, res, next) => {
  const { userId } = tool.getUserIdAndOrganisationId(req);
  const hash = req.body.hash;
  const customerId = await stripe.getKeyFromValueInRedis(hash);
  const organisation = await organisationService.updateOrganisationHavePaid(
    customerId,
    userId
  );
  await stripe.removeKeyFromRedis(hash);
  successF('Payement valid', organisation, 200, res, next);  
});

module.exports = {
  create,
  getById,
  getAll,
  leave,
  join,
  getAllCards,
  validPayment
};
