const userService = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');
const { successF } = require('../utils/message');

const register = catchAsync(async (req, res, next) => {
  const user = await userService.create(req.body);
  successF('User created', user, 201, res, next);
});

const login = catchAsync(async (req, res, next) => {
  const user = await userService.login(req.body);
  successF('User logged in', user, 200, res, next);
});

const disconnect = catchAsync(async (req, res) => {
  await userService.disconnect(req);
  res.status(204).json();
});

module.exports = {
  register,
  login,
  disconnect,
};
