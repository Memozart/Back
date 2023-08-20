const router = require('express').Router();
const cardController = require('../controllers/card.controller');
const cardValidation = require('../validations/card.validation');
const validate = require('../middlewares/validate');
const userMiddleware = require('../middlewares/user.middleware');
const cardMiddleware = require('../middlewares/card.middleware');

router.get(
  '/:id',
  [userMiddleware.isConnected, cardMiddleware.hasRoleToManageCard],
  cardController.getbyId
);
router.post(
  '/',
  [userMiddleware.isConnected, validate(cardValidation.create)],
  cardController.create
);
router.put(
  '/:id',
  [
    userMiddleware.isConnected,
    cardMiddleware.hasRoleToManageCard,
    validate(cardValidation.update),
  ],
  cardController.update
);
router.delete(
  '/:id',
  userMiddleware.isConnected,
  cardMiddleware.hasRoleToManageCard,
  cardController.remove
);

module.exports = router;
