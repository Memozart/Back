const router = require('express').Router();
const messagingController = require('../controllers/messaging.controller');
const { isConnected } = require('../middlewares/user.middleware'); 

router.post('/token', isConnected, messagingController.devicesChanges);

module.exports = router;