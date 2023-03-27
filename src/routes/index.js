const router = require('express').Router();
const authRoutes = require('./auth.route');
const themeRoutes = require('./theme.route');
const cardRoutes = require('./card.route');

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
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
