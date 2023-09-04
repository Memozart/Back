/* eslint-disable no-undef */
const app = require('./app');
const config = require('./config');
const mongoose = require('mongoose');
const { createLogger } = require('./utils/log');
const process = require('process');
const { checkIfConnectionStringIsLocal } = require('./utils/tool');
const port = config.port || 3000;
const urlBack = config.urlBack || 'http://localhost';
const logger = createLogger();

if (!config.db.url) {
  logger.error('No .env file found');
  process.exit(1);
}

const isLocal = checkIfConnectionStringIsLocal(config.db.url);

mongoose.set('strictQuery', false);

mongoose.connect(
  `${config.db.url}${config.db.dbName}${isLocal === true ? '' : '?authSource=admin&replicaSet=db-mongodb-fra1-85036&tls=true'}`,
  (retourConnexionDb) => {
    if(retourConnexionDb != null){
      console.error('erreur connexion database: ', retourConnexionDb);
      return;
    }
    logger.info(`Connected to database ${ isLocal ? 'en local' :''}`);
    app.listen(port, () => {
      logger.info(`Server running on ${urlBack}:${port}`);
    });
  },
);
