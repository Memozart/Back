const router = require('express').Router();
const themeController = require('../controllers/theme.controller');
// const validate = require("../middlewares/validate");

router.get('/:id', [], themeController.get);
router.get('/', [], themeController.getAll);

module.exports = router;
