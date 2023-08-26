const jwt = require('jsonwebtoken');
const config = require('../config');
const { errorF } = require('../utils/message');
const userService = require('../services/user.service');
const redis = require('redis');
const client = redis.createClient({
  password: config.redis.password,
  socket: {
    host: config.redis.host,
    port: config.redis.port,
  },
});


const generateAccessToken = (user) => {
  return jwt.sign(user, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
};

const generateRefreshToken = async (userObject) => {
  const refreshToken = jwt.sign(userObject, config.jwt.refreshSecret);
  await insertRefreshToken(userObject.user, refreshToken);
  return refreshToken;
};

const isConnected = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return errorF('Not authorized', '', 401, res, next);
  }
  const accessToken = authHeader.split(' ')[1];
  if (!accessToken) {
    return errorF('Not authorized', '', 401, res, next);
  }
  jwt.verify(accessToken, config.jwt.secret, (err, user) => {
    if (err) {
      return errorF('Not authorized', err, 401, res, next);
    }
    req.user = user.user;
    delete req.user.password;
  });
  next();
};

const insertRefreshToken = async (user, refreshToken) => {
  delete user.password;
  await client.connect();
  const key = `refreshToken:${user._id}`;
  await client.set(key, refreshToken);
  await client.quit();
};

const verifyRefreshToken = async (refreshToken) => {
  const userId = jwt.decode(refreshToken).user._id;
  const key = `refreshToken:${userId}`;

  await client.connect();
  const data = await client.get(key);
  await client.quit();
  if (!data) {
    return false;
  }
  if (refreshToken !== data) {
    return false;
  }
  const testJwt = await jwt.verify(refreshToken, config.jwt.refreshSecret);
  if (!testJwt) {
    return false;
  }
  const user = await userService.getById(userId);
  if (!user) {
    return false;
  }
  return true;
};

const removeRefreshToken = async (userId) => {
  const key = `refreshToken:${userId}`;
  await client.connect();
  await client.del(key);
  await client.quit();
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  isConnected,
  verifyRefreshToken,
  removeRefreshToken
};
