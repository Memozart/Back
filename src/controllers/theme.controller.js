const themeService = require('../services/theme.services');
const catchAsync = require('../utils/catchAsync');
const { successF, errorF } = require('../utils/message');
const { isEmpty } = require('../utils/tool');

const get = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (isEmpty(id)) {
    const error = new Error('The parameter [id] is empty');
    errorF('The parameter [id] is empty', error, 400, res, next);
    return;
  }
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
