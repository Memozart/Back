const { User, Organisation, Review } = require('../models');
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
  const user = await User.findOne({ email: userBody.email }).populate({
    path: 'currentOrganisation',
    select: 'name _id', // inclus uniquement le champs 'name'
  });
  if (!user) {
    throw new Error('User not found');
  }
  const isPasswordMatch = await bcrypt.compare(
    userBody.password,
    user.password
  );
  if (!isPasswordMatch) {
    throw new Error('User not found');
  }
  user.password = undefined;
  return user;
};

const getById = async (id) => {
  return User.findById(id);
};

const changeCurrentOrganisation = async (userId, organisationId) => {
  // find one and update a user and populate the currentOrganisation but as key 'organisation' and keep the currentOrgasation as key 'currentOrganisation'
  return User.findOneAndUpdate(
    {_id: userId},
    {currentOrganisation: organisationId},
    {new: true, useFindAndModify: false}
  ).populate({
    path: 'currentOrganisation',
    select: 'name _id', // inclus uniquement le champs 'name'
  }).select('-password');
};

const deleteUser = async(userId) => {
  // on va regarder s'il est le seul admin dans une organisation 
  // et qu'il y a des utilisateurs dans cette organisation
  const organisationAdminWithUser = await Organisation.find({
    $and: [
      { admin: userId },
      { users: { $exists: true, $not: { $size: 0 } } },
      { admin: { $size: 1 } },
    ]
  });

  // alors on lui dit impossible supprimer le compte 
  // veuillez le transférer
  if (organisationAdminWithUser.length != 0){
    throw new Error(
      `Impossible de supprimer le compte ! Vous êtes le seul administrateur dans ${organisationAdminWithUser.length} compte(s) et vous avez des utilisateurs. Veuillez transférer les droits.`
    );
  }

  // supprime les organisation ou l'utilisateur est le seul admin
  // et n'a pas d'utilisateur sous son organisation (prends compte personnel et +)
  await Organisation.deleteOne({
    $and: [
      { admin: userId },
      { admin: { $size: 1 } },
      { users: { $size: 0 } }
    ]
  });
  
  await Organisation.updateMany({
    $or : [
      { admin: userId }, // Cherchez dans le tableau admin
      { user: userId },  // Cherchez dans le tableau user
    ],
    $pull: {   // Utilisez $pull pour supprimer l'userID des tableaux
      admin: userId,
      user: userId,
    },
  });

  await User.findByIdAndDelete(userId);
  await Review.deleteMany({
    user : userId
  });
};

module.exports = {
  create,
  login,
  getById,
  changeCurrentOrganisation,
  deleteUser
};
