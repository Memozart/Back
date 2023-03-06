const { User } = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config');

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
    res.status(401).json({ error: error.message });
  }
};

module.exports = {
  isConnected,
};