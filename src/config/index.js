/* eslint-disable no-undef */
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT,
  version: require('../../package.json').version,
  env: process.env.NODE_ENV,
  urlBack: process.env.URL_BACK,
  isDemo: process.env.IS_DEMO === 'true' ? true : false,
  db: {
    url: process.env.DB_URL,
    replicaSet: process.env.DB_REPLICA_SET,
    authSource: process.env.DB_AUTH_SOURCE,
    dbName: process.env.DB_NAME,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  stripe: {
    secret: process.env.STRIPE_SECRET,
    cancelUrl: process.env.STRIPE_CANCEL_URL,
    successUrl: process.env.STRIPE_SUCCESS_URL,
  },
  insee: {
    secret: process.env.INSEE_SECRET,
  },
  messagingKey: process.env.MESSAGING_KEY,
};
