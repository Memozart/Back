const router = require('express').Router();
const reviewController = require('../controllers/review.controller');
const userMiddleware = require('../middlewares/user.middleware');

router.get('/:id',userMiddleware.isConnected, reviewController.getReviewByTheme);

module.exports = router;
