const mongoose = require('mongoose');
const config = require('../../config');
const logger = require('../logger');

const DB_USERNAME = config.get('db.username');
const DB_PASSWORD = config.get('db.password');
const DB_HOST = config.get('db.host');
const DB_NAME = config.get('db.name');

const connectionString = () => {
  let uri = 'mongodb://';
  if (DB_USERNAME && DB_PASSWORD) uri += `${DB_USERNAME}:${DB_PASSWORD}@`;
  return (uri += `${DB_HOST}/${DB_NAME}`);
};

module.exports = () => {
  mongoose.connect(connectionString());
  const db = mongoose.connection;
  db.on('error', (...errs) => logger.error('Mongoose connection error: ', ...errs));
  db.once('open', function() {
    logger.info(
      `Mongoose connection established @ mongodb://${
        DB_USERNAME && DB_PASSWORD ? '**@' : ''
      }${DB_HOST}/${DB_NAME}`
    );
  });
};
