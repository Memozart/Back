const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT,
  version: require('../../package.json').version,
  env: process.env.NODE_ENV,
}