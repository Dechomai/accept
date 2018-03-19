const path = require('path');
const dotenv = require('dotenv');
const convict = require('convict');

dotenv.config();

const config = convict({
  env: {
    format: ['production', 'development', 'test'],
    default: 'development',
    arg: 'nodeEnv',
    env: 'NODE_ENV'
  },
  ip: {
    doc: 'The IP address to bind.',
    format: 'ipaddress',
    default: '127.0.0.1',
    arg: 'ipAdress',
    env: 'IP_ADDRESS'
  },
  port: {
    doc: 'The PORT to bind.',
    format: 'port',
    default: 8000,
    arg: 'port',
    env: 'PORT'
  },
  db: {
    username: {
      format: '*',
      default: null,
      arg: 'dbUsername',
      env: 'DB_USERNAME'
    },
    password: {
      format: '*',
      default: null,
      arg: 'dbPassword',
      env: 'DB_PASSWORD'
    },
    host: {
      format: String,
      default: 'localhost:27017',
      arg: 'dbHost',
      env: 'DB_HOST'
    },
    name: {
      format: String,
      default: 'test',
      arg: 'dbName',
      env: 'DB_NAME'
    }
  }
});

const env = config.get('env');
config.loadFile(path.resolve(__dirname, `./env/${env}.json`));

// throws error if config does not conform to schema
config.validate({allowed: 'strict'});

module.exports = config;
