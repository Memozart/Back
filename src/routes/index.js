const router = require('express').Router();
const authRoutes = require('./auth.route');

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
