const app = require('./app');
const config = require('./config');
const { createLogger } = require('./utils/log');

const port = config.port || 3000;
const urlBack = config.urlBack || 'http://localhost';
const logger = createLogger();

app.listen(port, () => {
  logger.info(`Server running on  ${urlBack}:${port}`);
});
