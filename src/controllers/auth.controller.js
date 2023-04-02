const userService = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');
const { successF, errorF } = require('../utils/message');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  removeRefreshToken,
} = require('../middlewares/user.middleware');
const jwt = require('jsonwebtoken');

const register = catchAsync(async (req, res, next) => {
  const user = await userService.create(req.body);
  successF('User created', user, 201, res, next);
});

const login = catchAsync(async (req, res, next) => {
  const user = await userService.login(req.body);
  delete user.password;
  const accessToken = generateAccessToken({ user });
  const refreshToken = await generateRefreshToken({ user });
  successF(
    'User logged in',
    { accessToken, refreshToken, user },
    200,
    res,
    next
  );
});

const disconnect = catchAsync(async (req, res) => {
  const user = req.user;
  await removeRefreshToken(user._id);
  res.status(204).json();
});

const refreshToken = catchAsync(async (req, res, next) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return errorF('Refresh token not found', '', 403, res, next);
  }
  const verify = await verifyRefreshToken(refresh_token);
  const user = jwt.decode(refresh_token).user;
  if (!verify) {
    return errorF('Not authorized', '', 401, res, next);
  }

  const accessToken = generateAccessToken({ user });
  successF('Token refreshed', { accessToken }, 200, res, next);
});

module.exports = {
  register,
  login,
  disconnect,
  refreshToken,
};
