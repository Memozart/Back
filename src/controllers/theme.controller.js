const themeService = require('../services/theme.service');
const catchAsync = require('../utils/catchAsync');
const { successF } = require('../utils/message');

const get = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const theme = await themeService.get(id);
  successF('theme fetch', theme, 200, res, next);
});

const getAll = catchAsync(async (req, res, next) => {
  const theme = await themeService.getAll();
  successF('themes fetch', theme, 200, res, next);
});

module.exports = {
  get,
  getAll,
};
