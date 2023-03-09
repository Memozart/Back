const router = require('express').Router();
const authRoutes = require('./auth.route');
const themeRoutes = require('./theme.route');

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/theme',
    route: themeRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
