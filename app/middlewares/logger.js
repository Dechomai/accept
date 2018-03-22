const morgan = require('morgan');
const config = require('../../config');

morgan.format('development', (...args) => `${new Date().toISOString()} - ${morgan.dev(...args)}`);

const morganFormat = config.get('env') === 'development' ? 'development' : 'combined';

const outLoggerMiddleware = morgan(morganFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: process.stderr
});
const errLoggerMiddleware = morgan(morganFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: process.stdout
});

module.exports = {
  outLoggerMiddleware,
  errLoggerMiddleware
};
