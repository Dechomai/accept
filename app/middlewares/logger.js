const morgan = require('morgan');
const {createLoggerWith} = require('../logger');
const config = require('../../config');

const logger = createLoggerWith('[HTTP]');

const loggerStream = {
  write: msg => logger.info(msg.replace(/\n$/, ''))
};

morgan.format(
  'accept-prod',
  ':remote-addr HTTP/:http-version :method :url :status (:res[content-length]) :response-time[3]ms ":referrer" ":user-agent"'
);

morgan.format('accept-dev', morgan.dev);

const morganFormat = config.get('env') === 'development' ? 'accept-dev' : 'accept-prod';

const outLoggerMiddleware = ({stream, ...rest} = {}) =>
  morgan(morganFormat, {
    skip: (req, res) => res.statusCode < 400,
    stream: stream || loggerStream,
    ...rest
  });

const errLoggerMiddleware = ({stream, ...rest} = {}) =>
  morgan(morganFormat, {
    skip: (req, res) => res.statusCode >= 400,
    stream: stream || loggerStream,
    ...rest
  });

module.exports = {
  outLoggerMiddleware,
  errLoggerMiddleware
};
