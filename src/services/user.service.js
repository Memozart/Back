const { User } = require('../models');
const bcrypt = require('bcryptjs');

const create = async (userBody) => {
  userBody.password = await bcrypt.hash(userBody.password, 10);
  const user = await User.create(userBody);
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