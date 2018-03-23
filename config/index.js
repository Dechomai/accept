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
    default: 7000,
    arg: 'port',
    env: 'PORT'
  },
  cookieSecret: {
    doc: 'Secret used to sign cookies',
    format: String,
    default: 'super-secret',
    arg: 'cookieSecret',
    env: 'COOKIE_SECRET'
  },
  logLevel: {
    format: ['error', 'warn', 'info', 'verbose', 'debug', 'silly'],
    default: 'debug',
    arg: 'logLevel',
    env: 'LOG_LEVEL'
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
      sensitive: true,
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
      default: 'accept-dev-local',
      arg: 'dbName',
      env: 'DB_NAME'
    }
  },
  cognito: {
    clientId: {
      doc: 'AWS Cognito "App client id"',
      format: String,
      default: null,
      arg: 'cognitoClientId',
      env: 'COGNITO_CLIENT_ID'
    },
    clientSecret: {
      doc: 'AWS Cognito "App client secret"',
      format: String,
      sensitive: true,
      default: null,
      arg: 'cognitoClientSecret',
      env: 'COGNITO_CLIENT_SECRET'
    },
    domain: {
      doc: 'AWS Cognito "Domain name"',
      format: String,
      default: null,
      arg: 'cognitoDomain',
      env: 'COGNITO_DOMAIN'
    },
    region: {
      doc: 'AWS Cognito Region',
      format: String,
      default: null,
      arg: 'cognitoRegion',
      env: 'COGNITO_REGION'
    },
    userPoolId: {
      doc: 'AWS Cognito User Pool ID',
      format: String,
      default: null,
      arg: 'cognitoUserPoolId',
      env: 'COGNITO_USER_POOL_ID'
    },
    redirectUri: {
      doc: 'AWS Cognito App Client redirect_uri',
      format: 'url',
      default: null,
      arg: 'cognitoRedirectUri',
      env: 'COGNITO_REDIRECT_URI'
    }
  }
});

const env = config.get('env');
config.loadFile(path.resolve(__dirname, `./env/${env}.json`));

// throws error if config does not conform to schema
config.validate({allowed: 'strict'});

module.exports = config;
