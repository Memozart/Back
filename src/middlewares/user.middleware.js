const { User } = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { errorF } = require('../utils/message');

const isConnected = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      throw new Error('Not authorized');
    }
    token = token.replace('Bearer ', '');
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error('Not authorized');
    }
    user.password = undefined;
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    errorF(error.message, error, 401, res, next);
  }
};

module.exports = {
  isConnected,
};