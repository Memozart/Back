const router = require('express').Router();
const organisationController = require('../controllers/organisation.controller');
const userMiddleware = require('../middlewares/user.middleware');

router.get('/:id',userMiddleware.isConnected, organisationController.getById);
router.get('/', userMiddleware.isConnected, organisationController.getAll);
router.post( '/', userMiddleware.isConnected , organisationController.create);
router.put( '/leave/:id', userMiddleware.isConnected , organisationController.leave);
router.put( '/join/:id', userMiddleware.isConnected , organisationController.join);

module.exports = router;
