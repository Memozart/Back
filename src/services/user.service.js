const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const organisationService = require('../services/organisation.service');
const mongoose = require('mongoose');

const create = async (userBody) => {
  userBody.password = await bcrypt.hash(userBody.password, 10);
  userBody.currentOrganisation = new mongoose.Types.ObjectId();// on génère l'id de l'organisation pour l'attribuer à l'utilisateur 1/18.4 quintillions de conflits
  const user = await User.create(userBody);
  organisationService.createPersonnalOrganisation(user);
  user.password = undefined;
  user._id = undefined;
  return user;
};

const login = async (userBody) => {
  const user = await User.findOne({ email: userBody.email });
  if (!user) {
    throw new Error('User not found');
  }
  const isPasswordMatch = await bcrypt.compare(userBody.password, user.password);
  if (!isPasswordMatch) {
    throw new Error('User not found');
  }
  const token = jwt.sign({ id: user._id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

  return { token };
};

const disconnect = async (req) => {
  jwt.verify(req.token, config.jwt.secret);
  // * revoke the token later
};

module.exports = {
  create,
  login,
  disconnect,
};