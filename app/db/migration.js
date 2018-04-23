const {createLoggerWith} = require('../logger');
const getConnectionString = require('./connection').getConnectionString;

const logger = createLoggerWith('[DB Migrations]');

const dbMigrate = require('db-migrate');
const dbmigrate = dbMigrate.getInstance(true, {
  config: {
    db: getConnectionString()
  },
  env: 'db'
});

module.exports = {
  sync() {
    logger.info('Start up migrations');
    return dbmigrate.up().then(() => {
      logger.info('End up migrations');
    });
  }
};
