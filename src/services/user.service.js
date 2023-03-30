const { User } = require('../models');
const bcrypt = require('bcryptjs');
const organisationService = require('../services/organisation.service');
const mongoose = require('mongoose');

const create = async (userBody) => {
  userBody.password = await bcrypt.hash(userBody.password, 10);
  // on génère l'id de l'organisation pour l'attribuer à l'utilisateur 
  // 1/18.4 quintillions de conflits
  userBody.currentOrganisation = new mongoose.Types.ObjectId();
  const user = await User.create(userBody);
  organisationService.createPersonnalOrganisation(user);
  user.password = undefined;
  user._id = undefined;
  return user;
};

const login = async (userBody) => {
  const user = await User.findOne({ email: userBody.email })
    .populate({
      path: 'currentOrganisation',
      select: 'name _id', // inclus uniquement le champs 'name'
    });
  if (!user) {
    throw new Error('User not found');
  }
  const isPasswordMatch = await bcrypt.compare(userBody.password, user.password);
  if (!isPasswordMatch) {
    throw new Error('User not found');
  }
  user.password = undefined;
  return user;
};


const getById = async (id) => {
  return User.findById(id);
};

module.exports = {
  create,
  login,
  getById,
};