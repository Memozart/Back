const router = require('express').Router();
const authRoutes = require('./auth.route');
const themeRoutes = require('./theme.route');
const cardRoutes = require('./card.route');
const organisationRoutes = require('./organisation.route');
const reviewRoutes = require('./review.route');
const stepRoutes = require('./step.route');
const statRoutes = require('./stat.route');
const userRoute = require('./user.route');
const messagingRoute = require('./messaging.route');

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
  },
  {
    path: '/stats',
    route: statRoutes,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/messaging',
    route: messagingRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
