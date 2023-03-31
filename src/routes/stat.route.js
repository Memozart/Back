const router = require('express').Router();
const statController = require('../controllers/stat.controller');
// const validate = require('../middlewares/validate');
const { isConnected } = require('../middlewares/user.middleware');

router.get(
  '/info-review',
  isConnected,
  statController.getInfoReview
);

router.get(
  '/reviews-of-all-themes',
  isConnected,
  statController.getReviewsOfAllThemes
);

module.exports = router;