const router = require('express').Router();
const organisationController = require('../controllers/organisation.controller');
const userMiddleware = require('../middlewares/user.middleware');

router.get('/:id',userMiddleware.isConnected, organisationController.getById);
router.get('/', userMiddleware.isConnected, organisationController.getAll);
router.get('/users/all', userMiddleware.isConnected, organisationController.getAllUserInOrganisation);
router.post( '/', userMiddleware.isConnected , organisationController.create);
router.put( '/leave/:id', userMiddleware.isConnected , organisationController.leave);
router.put( '/join/:id', userMiddleware.isConnected , organisationController.join);
router.get( '/:id/cards', userMiddleware.isConnected , organisationController.getAllCards);
router.post('/valid_payment', userMiddleware.isConnected, organisationController.validPayment);

module.exports = router;
