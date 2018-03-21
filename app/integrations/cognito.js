const fetch = require('node-fetch');
const CognitoExpress = require('cognito-express');
const config = require('../../config');
const {atob} = require('../utils');

const COGNITO_APP_CLIENT_ID = config.get('cognito.clientId');
const COGNITO_APP_CLIENT_SECRET = config.get('cognito.clientSecret');
const COGNITO_DOMAIN = config.get('cognito.domain');
const COGNITO_USER_POOL_ID = config.get('cognito.userPoolId');
const COGNITO_REGION = config.get('cognito.region');

// helper to verify token signature
const cognitoExpress = new CognitoExpress({
  region: COGNITO_REGION,
  cognitoUserPoolId: COGNITO_USER_POOL_ID,
  tokenUse: 'access'
});

const REDIRECT_URI = 'http://localhost:7000/auth/logincb';
const LOGIN_URI = `https://${COGNITO_DOMAIN}/login?response_type=code&client_id=${COGNITO_APP_CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
const SIGNOUT_URI = ''; // TODO: construct signout URI

const getLoginUri = () => LOGIN_URI;
const getSignoutUri = () => SIGNOUT_URI;
// TODO
// Verify token signature !!!!!!!!!!!!

const getTokensByCode = code => {
  return fetch(`https://${COGNITO_DOMAIN}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${atob(`${COGNITO_APP_CLIENT_ID}:${COGNITO_APP_CLIENT_SECRET}`)}`
    },
    body: `grant_type=authorization_code&client_id=${COGNITO_APP_CLIENT_ID}&code=${code}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}`
  })
    .then(res => res.json())
    .then(token => {
      if (!token || token.error) return Promise.reject(token);
      return token;
    });
};

const refreshToken = refreshToken => {
  // TODO: test!
  return fetch(`https://${COGNITO_DOMAIN}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${atob(`${COGNITO_APP_CLIENT_ID}:${COGNITO_APP_CLIENT_SECRET}`)}`
    },
    body: `grant_type=refresh_token&client_id=${COGNITO_APP_CLIENT_ID}&refresh_token=${refreshToken}`
  })
    .then(res => res.json())
    .then(tokens => {
      if (!tokens || tokens.error) return Promise.reject(tokens);
      return tokens;
    });
};

const isTokenValid = accessToken => {
  return new Promise((resolve, reject) => {
    cognitoExpress.validate(accessToken, (err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
};

module.exports = {
  getLoginUri,
  getSignoutUri,
  getTokensByCode,
  refreshToken,
  isTokenValid
};
