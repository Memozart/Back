const router = require('express').Router();
const stepController = require('../controllers/step.controller');
const userMiddleware = require('../middlewares/user.middleware');

router.get('/:id',userMiddleware.isConnected, stepController.get);
router.get('/', userMiddleware.isConnected, stepController.getAll);
// router.post( '/', userMiddleware.isConnected , stepController.create);
// router.put( '/:id', userMiddleware.isConnected , stepController.update);
// router.delete( '/:id', userMiddleware.isConnected, stepController.remove);

module.exports = router;
