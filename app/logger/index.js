const winston = require('winston');
const {assoc} = require('ramda');
const config = require('../../config');

const LOG_LEVEL = config.get('logLevel');

// TODO:
// add file logger, CloudWatch, etc.
// add custom format
const consoleLogger = new winston.transports.Console({
  level: LOG_LEVEL,
  handleExceptions: true,
  json: false,
  colorize: true,
  timestamp: () => new Date().toISOString()
});

const logger = new winston.Logger({
  transports: [consoleLogger]
});

logger.createLoggerWith = (...prefixes) => {
  return [...Object.keys(logger.levels), 'log'].reduce(
    (acc, level) =>
      assoc(
        level,
        (...args) => {
          logger[level](...prefixes, ...args);
        },
        acc
      ),
    {}
  );
};

/*

  Logger Levels:

  silly
  debug
  verbose
  info
  warn
  error

  Logger API:

  logger.log('silly', '.log: Silly info');
  logger.log('debug', '.log: Debugging info');
  logger.log('verbose', '.log: Verbose info');
  logger.log('info', '.log: Hello world');
  logger.log('warn', '.log: Warning message');
  logger.log('error', '.log: Error info');

  logger.silly('Silly info');
  logger.debug('Debugging info');
  logger.verbose('Verbose info');
  logger.info('Hello world');
  logger.warn('Warning message');
  logger.error('Error info');

*/

module.exports = logger;
