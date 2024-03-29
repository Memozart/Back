const router = require('express').Router();
const themeController = require('../controllers/theme.controller');

const userMiddleware = require('../middlewares/user.middleware');
router.get('/:id', userMiddleware.isConnected, themeController.get);
router.get('/', themeController.getAll);

module.exports = router;
