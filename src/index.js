/* eslint-disable no-undef */
const app = require('./app');
const config = require('./config');
const mongoose = require('mongoose');
const { createLogger } = require('./utils/log');
const process = require('process');
const { createUser, initialiseDataset } = require('../tests/config/setup.config');
const port = config.port || 3000;
const urlBack = config.urlBack || 'http://localhost';
const logger = createLogger();
const { MongoMemoryServer } = require('mongodb-memory-server');


if (!config.db.url) {
  logger.error('No .env file found');
  process.exit(1);
}
mongoose.set('strictQuery', false);

const args = process.argv.slice(2);

const startMongoMemory = async () => {
  mongo = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      dbName: 'test'
    }
  });
  const uri = mongo.getUri();
  await mongoose.connect(uri,
    () => {
      logger.info('Connected to 🧠 memory database 🧠');
      console.log('création des données en mémoire');
      createUser();
      initialiseDataset();
      console.log('création des données en mémoire terminé');

      app.listen(port, () => {
        logger.info(`Server running on ${urlBack}:${port}`);
      });
    });
};



if (args[0] === 'memory') {
  startMongoMemory();
}

else {
  mongoose.connect(
    `${config.db.url}${config.db.dbName}?authSource=admin&replicaSet=db-mongodb-fra1-85036&tls=true`,
    () => {
      logger.info('Connected to database');
      app.listen(port, () => {
        logger.info(`Server running on ${urlBack}:${port}`);
      });
    }
  );
}
