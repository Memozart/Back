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
const cron = require('node-cron');
const messagingService = require('./services/messaging.service');

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
    cron.schedule('*/10 * * * * *', async () => {
      try {
        const users = await messagingService.getAllReviewForUsersHaveDevices();
        users.forEach(user => {
          messagingService.sendNotification(user.devices, 'Test', 'Test');
        });
      } catch (error) {
        console.log(error);
      }
    });
    app.listen(port, () => {
      logger.info(`Server running on ${urlBack}:${port}`);
    });
  },
);
