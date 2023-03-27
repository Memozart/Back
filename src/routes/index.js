const router = require('express').Router();
const authRoutes = require('./auth.route');
const themeRoutes = require('./theme.route');
const cardRoutes = require('./card.route');
const organisationRoutes = require('./organisation.route');
const reviewRoutes = require('./review.route');
const stepRoutes = require('./step.route');

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/themes',
    route: themeRoutes,
  },
  {
    path: '/cards',
    route: cardRoutes,
  },
  {
    path: '/organisations',
    route: organisationRoutes,
  },
  {
    path: '/reviews',
    route: reviewRoutes,
  },
  {
    path: '/steps',
    route: stepRoutes,
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
