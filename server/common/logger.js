const { createLogger, transports, format } = require('winston');

const { combine, timestamp, prettyPrint } = format;

module.exports = createLogger({
  format: combine(
    timestamp(),
    prettyPrint(),
  ),
  transports: [
    new transports.Console({
      level: 'debug', // be more verbose for console statements
      handleExceptions: true,
      json: false,
      colorize: true,
    }),
  ],
  exitOnError: false,
});
