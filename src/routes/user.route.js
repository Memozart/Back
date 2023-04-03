const router = require('express').Router();
const userController = require('../controllers/user.controller');
const { isConnected } = require('../middlewares/user.middleware');

router.put('/change-current-organisation', isConnected, userController.changeCurrentOrganisation);

module.exports = router;