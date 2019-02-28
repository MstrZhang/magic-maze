const winston = require('winston');

module.exports = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'debug', // be more verbose for console statements
      handleExceptions: true,
      json: false,
      colorize: true,
    }),
  ],
  exitOnError: false,
});
