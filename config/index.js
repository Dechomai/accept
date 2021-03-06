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
  host: {
    doc: 'The IP address to bind.',
    format: 'ipaddress',
    default: '0.0.0.0',
    arg: 'ipAdress',
    env: 'HOST'
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
  deployEnv: {
    doc: 'Deployment environment name',
    format: String,
    default: 'develop',
    arg: 'deployEnv',
    env: 'DEPLOY_ENV'
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
    loginRedirectUri: {
      doc: 'AWS Cognito App Client LOGIN redirect_uri',
      format: 'url',
      default: null,
      arg: 'cognitoLoginRedirectUri',
      env: 'COGNITO_LOGIN_REDIRECT_URI'
    },
    logoutRedirectUri: {
      doc: 'AWS Cognito App Client LOGOUT redirect_uri',
      format: 'url',
      default: null,
      arg: 'cognitoLogoutRedirectUri',
      env: 'COGNITO_LOGOUT_REDIRECT_URI'
    }
  },
  cloudinary: {
    name: {
      doc: 'Cloudinary Clound name',
      format: String,
      default: null,
      arg: 'cloudinaryName',
      env: 'CLOUDINARY_CLOUD_NAME'
    },
    apiKey: {
      doc: 'Cloudinary API Key',
      format: String,
      default: null,
      arg: 'cloudinaryApiKey',
      env: 'CLOUDINARY_API_KEY'
    },
    apiSecret: {
      doc: 'Cloudinary API Secret',
      format: String,
      default: null,
      arg: 'cloudinaryApiSecret',
      env: 'CLOUDINARY_API_SECRET'
    }
  },
  blockchain: {
    httpAddress: {
      doc: 'Blockchain address for HTTP provider',
      format: String,
      default: null,
      arg: 'blockchainHttpAddress',
      env: 'BLOCKCHAIN_HTTP_ADDRESS'
    },
    wsAddress: {
      doc: 'Blockchain address for WebSocker provider',
      format: String,
      default: null,
      arg: 'blockchainWsAddress',
      env: 'BLOCKCHAIN_WS_ADDRESS'
    },
    tokenContractAddress: {
      doc: 'Token contract address',
      format: String,
      default: null,
      arg: 'tokenContractAddress',
      env: 'BLOCKCHAIN_TOKEN_CONTRACT_ADDRESS'
    },
    tokenSponsorAddress: {
      doc: 'Token Sponsor Public Address',
      format: String,
      default: null,
      arg: 'tokenSponsorAddress',
      env: 'BLOCKCHAIN_TOKEN_SPONSOR_ADDRESS'
    },
    tokenSponsorPrivateKey: {
      doc: 'Token Sponsor Private Key',
      format: String,
      default: null,
      arg: 'tokenSponsorPrivateKey',
      env: 'BLOCKCHAIN_TOKEN_SPONSOR_PRIVATE_KEY'
    }
  }
});

const env = config.get('env');
config.loadFile(path.resolve(__dirname, `./env/${env}.json`));

// throws error if config does not conform to schema
try {
  config.validate({allowed: 'strict'});
} catch (err) {
  /* eslint no-console: 0 */
  console.log('Application configuration failed');
  console.log(err.message);
  process.exit(1);
}

module.exports = config;
