const stepService = require('../services/step.service');
const catchAsync = require('../utils/catchAsync');
const { successF } = require('../utils/message');

// const create = catchAsync(async (req, res, next) => {
//   const step = await stepService.create(req.body);
//   successF('step created', step, 201, res, next);
// });

const get = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const step = await stepService.get(id);
  successF('step fetch', step, 200, res, next);
});

const getAll = catchAsync(async (req, res, next) => {
  const steps = await stepService.getAll();
  successF('steps fetch', steps, 200, res, next);
});

// const update = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   const step = await stepService.update(id, req.body);
//   successF('steps update', step, 200, res, next);
// });

// const remove = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   const statut = await stepService.remove(id);
//   successF('steps delete', statut, 200, res, next);
// });

module.exports = {
  // create,
  get,
  getAll,
  // update,
  // remove,
};