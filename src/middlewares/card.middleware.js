const tool = require('../utils/tool');
const organisationService = require('../services/organisation.service');
const { errorF } = require('../utils/message');


/**
 * Vérifie si la carte qui souhaite etre modifiée existe bien dans l'organisation 
 * et si l'utilisateur courant est adminisatrateur de l'organisation
 * @param {*} req la requete en entrée
 * @param {*} res la réponse renvoyé a l'user
 * @param {*} next continue le pipe vers la suite des middleware ou vers le controller
 * @returns next si tout ce passe bien ou renvoi une erreur
 */
const hasRoleToManageCard = async (req, res, next) => {
  const {userId ,currentOrganisationId } = tool.getUserIdAndOrganisationId(req);
  const {id :cardId} = req.params;
  if (!userId ||!currentOrganisationId || !cardId) {
    return errorF('Not authorized', '', 401, res, next);
  }

  // si la carte existe dans l'organisation et si on est adminisantrateur

  const hasRole = await organisationService.hasRoleToManageCard(userId,currentOrganisationId, cardId);
  if(!hasRole){
    return errorF('Vous n\'êtes pas administrateur de l\'organisation ou la carte n\'existe pas dans l\'organisation','', 403, res, next);
  }
  next();
};

module.exports = {
  hasRoleToManageCard
};