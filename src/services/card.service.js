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

const get = async (id) => {
  return Card.findById(id);
};

const getAll = async () => {
  return Card.find().populate('theme');
};
/**
 * Mets à jour la carte grâce à son id et toutes les reviews
 * associés pour prévenir le changement de thème
 * @param {*} cardId identifiant de la carte
 * @param {*} card les données de la carte
 * @returns la carte modifiée
 */
const update = async (cardId, card, organisationId) => {
  const updatedCard = await Card.findByIdAndUpdate(cardId, card, {
    new: true,
  }).populate('theme');
  await reviewService.updateThemeByIdCardAndIdOrganisation(cardId,organisationId, card.theme);
  return updatedCard;
};

const remove = async (id) => {
  try {
    await Card.findByIdAndDelete(id);
    return await Review.deleteMany({ card: id });
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
