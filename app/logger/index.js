const winston = require('winston');
const CloudWatchTransport = require('winston-aws-cloudwatch');
const {assoc, isEmpty} = require('ramda');
const config = require('../../config');

const LOG_LEVEL = config.get('logLevel');
const NODE_ENV = config.get('env');
const DEPLOY_ENV = config.get('deployEnv');

const consoleLogger = new winston.transports.Console({
  level: LOG_LEVEL,
  handleExceptions: true,
  json: false,
  colorize: true,
  timestamp: () => new Date().toISOString()
});

const transports = [consoleLogger];

// log to files in prod
if (NODE_ENV === 'production') {
  const fileLogger = new winston.transports.File({
    filename: 'app_.log', // will be application.
    level: LOG_LEVEL,
    handleExceptions: true,
    maxsize: 10485760, // 10MB
    maxFiles: 5,
    timestamp: () => new Date().toISOString()
  });
  // log to file
  transports.push(fileLogger);
}

// log to AWS CloudWatch in prod
if (NODE_ENV === 'production') {
  const CLOUDWATCH_ACCESS_KEY_ID = config.get('cloudwatch.accessKeyId');
  const CLOUDWATCH_SECRET_ACCESS_KEY = config.get('cloudwatch.secretAccessKey');
  const CLOUDWATCH_REGION = config.get('cloudwatch.region');

  if (!CLOUDWATCH_ACCESS_KEY_ID || !CLOUDWATCH_SECRET_ACCESS_KEY || !CLOUDWATCH_REGION) {
    /* eslint no-console: 0 */
    console.log('Cloudwatch configuration not provided, skipping adding CloudWatch logger');
  } else {
    const cloudWatchFormatter = logItem =>
      `${new Date(logItem.date).toISOString()} - [${logItem.level.toUpperCase()}] ${
        logItem.message
      } ${!isEmpty(logItem.meta) ? JSON.stringify(logItem.meta) : ''}`;

    const cloudWatchLogger = new CloudWatchTransport({
      logGroupName: `/accept/${DEPLOY_ENV}`,
      logStreamName: new Date().toISOString().substring(0, 10), // use environment name alternatively
      createLogGroup: true,
      createLogStream: true,
      awsConfig: {
        accessKeyId: CLOUDWATCH_ACCESS_KEY_ID,
        secretAccessKey: CLOUDWATCH_SECRET_ACCESS_KEY,
        region: CLOUDWATCH_REGION
      },
      formatLog: cloudWatchFormatter
    });
    // log to cloudwatch
    transports.push(cloudWatchLogger);
  }
}

const logger = new winston.Logger({transports, exitOnError: false});

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
