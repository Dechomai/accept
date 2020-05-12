const fetch = require('node-fetch');
const CognitoExpress = require('cognito-express');
const config = require('../../config');
const {atob} = require('../utils');

const COGNITO_APP_CLIENT_ID = config.get('cognito.clientId');
const COGNITO_APP_CLIENT_SECRET = config.get('cognito.clientSecret');
const COGNITO_DOMAIN = config.get('cognito.domain');
const COGNITO_USER_POOL_ID = config.get('cognito.userPoolId');
const COGNITO_REGION = config.get('cognito.region');
const COGNITO_LOGIN_REDIRECT_URI = config.get('cognito.loginRedirectUri');
const COGNITO_LOGOUT_REDIRECT_URI = config.get('cognito.logoutRedirectUri');

// Cognito hosted UI links
const LOGIN_URI = `https://${COGNITO_DOMAIN}/login?response_type=code&client_id=${COGNITO_APP_CLIENT_ID}&redirect_uri=${COGNITO_LOGIN_REDIRECT_URI}`;
const SIGNUP_URI = `https://${COGNITO_DOMAIN}/signup?response_type=code&client_id=${COGNITO_APP_CLIENT_ID}&redirect_uri=${COGNITO_LOGIN_REDIRECT_URI}`;
const LOGOUT_URI = `https://${COGNITO_DOMAIN}/logout?client_id=${COGNITO_APP_CLIENT_ID}&logout_uri=${COGNITO_LOGOUT_REDIRECT_URI}`;

// helper to verify token signature
const cognitoExpress = new CognitoExpress({
  region: COGNITO_REGION,
  cognitoUserPoolId: COGNITO_USER_POOL_ID,
  tokenUse: 'access'
});

const cognito = {
  getLoginUri() {
    return LOGIN_URI;
  },
  getSignUpUri() {
    return SIGNUP_URI;
  },
  getLogoutUri() {
    return LOGOUT_URI;
  },

  getTokensByCode(code) {
    return fetch(`https://${COGNITO_DOMAIN}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${atob(`${COGNITO_APP_CLIENT_ID}:${COGNITO_APP_CLIENT_SECRET}`)}`
      },
      body: `grant_type=authorization_code&client_id=${COGNITO_APP_CLIENT_ID}&code=${code}&redirect_uri=${encodeURIComponent(
        COGNITO_LOGIN_REDIRECT_URI
      )}`
    })
      .then(res => res.json())
      .then(token => {
        if (!token || token.error) return Promise.reject(token);
        return token;
      });
  },

  refreshToken(refreshToken) {
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
  },

  isTokenValid(accessToken) {
    return new Promise((resolve, reject) => {
      cognitoExpress.validate(accessToken, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });
  }
};

module.exports = cognito;
