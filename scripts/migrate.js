const getConnectionString = require('../app/db/connection').getConnectionString;

const dbMigrate = require('db-migrate');
const dbmigrate = dbMigrate.getInstance(true, {
  config: {
    db: getConnectionString()
  },
  env: 'db'
});

dbmigrate.run();
