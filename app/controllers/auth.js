const jwt = require('jsonwebtoken');
const User = require('../models/user');
const tokenStorage = require('../services/tokenStorage');
const authService = require('../services/auth');

const authController = {
  getLoginUri() {
    return authService.getLoginUri();
  },
  getSignoutUri() {
    return authService.getSignoutUri();
  },
  userLoggedIn(code) {
    return authService
      .getTokenByCode(code)
      .then(tokens => {
        console.log('Tokens in ctrl: ', tokens);
        const {sub: userId, email} = jwt.decode(tokens.id_token);
        return Promise.all([
          User.findOneOrCreate(userId, email).then(
            user => {
              console.log('user info: ', user);
            },
            err => {
              // TODO: handle error
              throw err;
            }
          ),
          tokenStorage.updateUserToken(userId, tokens.refresh_token).then(
            token => {
              console.log('token saved: ', token);
            },
            err => {
              // TODO: handle error
              throw err;
            }
          )
        ]).then(() => {
          return tokens.access_token;
        });
      })
      .catch(err => {
        // TODO:
        // gracefully handle error
        // https://docs.aws.amazon.com/cognito/latest/developerguide/token-endpoint.html
        // 1. if "invalid_grant" or "unauthorized_client" cleanup token storage
        // 2. determine flow for other errors
        return Promise.reject(err);
      });
  }
};

module.exports = authController;
