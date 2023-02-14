const app = require('./app');
const config = require('./config');
const { createLogger } = require('./utils/log');

const port = config.port || 3000;
const urlBack = config.urlBack || 'http://localhost';
const date = new Date();
const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
const logger = createLogger(`app/${formattedDate}.log`);

app.listen(port, () => {
  logger.info(`Server running on  ${urlBack}:${port}`);
});
