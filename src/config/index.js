/* eslint-disable no-undef */
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT,
  version: require('../../package.json').version,
  env: process.env.NODE_ENV,
  urlBack: process.env.URL_BACK,
  db: {
    url: process.env.DB_URL,
    replicaSet: process.env.DB_REPLICA_SET,
    authSource: process.env.DB_AUTH_SOURCE,
    dbName: process.env.DB_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
};
