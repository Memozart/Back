const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const authValidation = require('../validations/auth.validation');
const validate = require('../middlewares/validate');
const { isConnected } = require('../middlewares/user.middleware'); 

router.post(
  '/register',
  validate(authValidation.register),
  authController.register
);
router.post('/login', validate(authValidation.login), authController.login);
router.post(
  '/disconnect',
  isConnected,
  authController.disconnect
);
router.post(
  '/refresh-token',
  authController.refreshToken
);

module.exports = router;
