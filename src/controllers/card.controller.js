const cardService = require('../services/card.service');
const catchAsync = require('../utils/catchAsync');
const { successF } = require('../utils/message');
const tool = require('../utils/tool');

const create = catchAsync(async (req, res, next) => {
  const { userId, currentOrganisationId } = tool.getUserIdAndOrganisationId(req);
  const card = await cardService.create(req.body, userId, currentOrganisationId);
  successF('Card created', card, 201, res, next);
});

const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const card = await cardService.update(id, req.body);
  successF('Card updated', card, 200, res, next);
});

const remove = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const statut = await cardService.remove(id);
  successF('Card deleted', statut, 200, res, next);
});

module.exports = {
  create,
  update,
  remove
};
