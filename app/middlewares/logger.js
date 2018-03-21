const morgan = require('morgan');
const config = require('../../config');

const morganFormat = config.get('env') === 'development' ? 'dev' : 'combined';

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
