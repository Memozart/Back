const { Card, Review } = require('../models');
const reviewService = require('./review.service');
const organisationService = require('./organisation.service');

/**
 * Créer un carte si le demandeur est admin de l'organisation
 * et créer une révision à tous les membres de cette organisation.
 * @param {*} cardBody les informations obligatoires d'une carte
 * @param {*} userId l'utilisateur qui réalise la demande
 * @param {*} organisationId l'organisation dans laquelle l'utilisateur va ajouter la carte
 * @returns
 */
const create = async (cardBody, userId, organisationId) => {
  const organisation = await organisationService.getOrganisationIfAdmin(
    userId,
    organisationId
  );
  if (!organisation) {
    throw new Error(
      'You did not add card because you are not an admin of organisation'
    );
  }
  const { datePresentation, theme: themeId } = cardBody;
  const card = await Card.create(cardBody);

  await organisationService.addCardToOrganisation(
    userId,
    organisationId,
    card.id,
    false
  );

  // ajout pour chaque utilisateur de l'organisation une review
  const allUsers = organisation.users.concat(organisation.admin);
  const reviewCards = allUsers.map(async (user) => {
    await reviewService.createReview(
      user,
      organisationId,
      card.id,
      themeId,
      datePresentation
    );
  });

  await Promise.all(reviewCards);

  return card;
};

const get = (id) => {
  return Card.findById(id);
};

const getAll = () => {
  return Card.find().populate('theme');
};

const update = (id, card) => {
  return Card.findByIdAndUpdate(id, card, { new: true });
};

const remove = (id) => {
  try {
    Card.findByIdAndDelete(id);
    return Review.deleteMany({ card: id });
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
