const organisationService = require('../services/organisation.service');
const catchAsync = require('../utils/catchAsync');
const { successF } = require('../utils/message');
const { TYPE_ACCOUNT } = require('../utils/constants');
const tool = require('../utils/tool');

const create = catchAsync(async (req, res, next) => {
  const { userId } = tool.getUserIdAndOrganisationId(req);
  const { name, type: idTypeAccount } = req.body;
  const typeAccount = Object.values(TYPE_ACCOUNT).find(
    (e) => e.id === idTypeAccount
  );
  const organisation = await organisationService.createProfessionalOrganisation(
    userId,
    name,
    typeAccount
  );
  successF(
    `${typeAccount.name} organisation as created`,
    organisation,
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

module.exports = {
  create,
  getById,
  getAll,
  leave,
  join,
};
