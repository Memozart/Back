const app = require('./app');
const config = require('./config');
const mongoose = require('mongoose');
const { createLogger } = require('./utils/log');

const port = config.port || 3000;
const urlBack = config.urlBack || 'http://localhost';
const logger = createLogger();

mongoose.set('strictQuery', false);
mongoose.connect(
  `${config.db.url}${config.db.dbName}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,
    replicaSet: config.db.replicaSet,
    authSource: config.db.authSource,
  },
  () => {
    logger.info('Connected to database');
    app.listen(port, () => {
      logger.info(`Server running on ${urlBack}:${port}`);
    });
  },
  (error) => {
    logger.error(error);
  }
);
