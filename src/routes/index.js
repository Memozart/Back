const router = require('express').Router();
const authRoutes = require('./auth.route');
const themeRoutes = require('./theme.route');
const cardRoutes = require('./card.route');
const organisationRoutes = require('./organisation.route');

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
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
