const router = require('express').Router();
const themeController = require('../controllers/theme.controller');

const userMiddleware = require('../middlewares/user.middleware');
router.get('/:id', userMiddleware.isConnected, themeController.get);
router.get('/', userMiddleware.isConnected, themeController.getAll);

module.exports = router;
