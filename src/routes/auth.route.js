const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const authValidation = require('../validations/auth.validation');
const validate = require('../middlewares/validate');
const userMiddleware = require('../middlewares/user.middleware');

router.post(
  '/register',
  validate(authValidation.register),
  authController.register
);
router.post('/login', validate(authValidation.login), authController.login);
router.post(
  '/disconnect',
  userMiddleware.isConnected,
  authController.disconnect
);

module.exports = router;
