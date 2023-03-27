const app = require('./app');
const config = require('./config');
const mongoose = require('mongoose');
const { createLogger } = require('./utils/log');

const port = config.port || 3000;
const urlBack = config.urlBack || 'http://localhost';
const logger = createLogger();

mongoose.set('strictQuery', false);
mongoose.connect(`${config.db.url}${config.db.dbName}?authSource=admin&replicaSet=db-mongodb-fra1-85036&tls=true`,()=>{
  logger.info('Connected to database');
  app.listen(port, () => {
    logger.info(`Server running on ${urlBack}:${port}`);
  });
});
