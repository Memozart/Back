const winston = require('winston');

const myFormat = winston.format.printf(({ level, message, timestamp }) => {
  const date = new Date(timestamp);
  const formattedDate = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return `${formattedDate} ${level}: ${message}`;
});

const createTransports = (fileName) => {
  const transports = [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ];
  if (fileName) {
    transports.push(
      new winston.transports.File({
        filename: 'logs/' + fileName,
        format: winston.format.combine(winston.format.timestamp(), myFormat),
      })
    );
  }

  return transports;
};

const createLogger = (logPath) => {
  const logger = winston.createLogger({
    transports: createTransports(logPath),
  });

  return logger;
};

module.exports = {createLogger} ;
