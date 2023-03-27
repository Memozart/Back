const router = require('express').Router();
const cardController = require('../controllers/card.controller');
const cardValidation = require('../validations/card.validation');
const validate = require('../middlewares/validate');
const userMiddleware = require('../middlewares/user.middleware');

router.get('/:id',userMiddleware.isConnected, cardController.get);
router.get('/', userMiddleware.isConnected, cardController.getAll);
router.post( '/', [userMiddleware.isConnected ,validate(cardValidation.create)], cardController.create);
router.put( '/:id', [userMiddleware.isConnected ,validate(cardValidation.update)], cardController.update);
router.delete( '/:id', userMiddleware.isConnected, cardController.remove);

module.exports = router;
