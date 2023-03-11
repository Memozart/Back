const { Card } = require('../models');
const reviewService = require('./review.service');
const organisationService = require('./organisation.service');

const create = async (cardBody, userId, organisationId) => {

  const organisation  = await organisationService.getOrganisationIfAdmin(userId, organisationId);
  if(!organisation){
    throw new Error('You did not add card because you are not an admin of organisation');
  }
  const card = await Card.create(cardBody);
  const allUsers = organisation.users.concat(organisation.admin);

  const reviewCards = allUsers.map(async (user) => {
    await reviewService.createReview(user,organisationId, card.id);
  });
  
  await Promise.all(reviewCards);

  return card;
};

const get = (id) => {
  return Card.findById(id);
};

const getAll = () => {
  return Card.find();
};

const update = (id, card) => {
  return Card.findByIdAndUpdate(id, card,  { new: true });
};

const remove = (id) => {
  try {
    Card.findByIdAndDelete(id);
    return true;
  } catch (error) {
    return error;
  }
};

module.exports = {
  create,
  get,
  getAll,
  update,
  remove,
};
