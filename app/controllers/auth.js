const jwt = require('jsonwebtoken');
const User = require('../models/user');
const tokenStorage = require('../services/tokenStorage');
const authService = require('../services/auth');
const {createLoggerWith} = require('../logger');

const logger = createLoggerWith('[CTRL:Auth]');

const authController = {
  getLoginUri() {
    return authService.getLoginUri();
  },

  getSignUpUri() {
    return authService.getSignUpUri();
  },

  getLogoutUri() {
    return authService.getLogoutUri();
  },

  userLoggedIn(code) {
    return authService
      .getTokenByCode(code)
      .then(tokens => {
        logger.verbose('Got tokens from AuthService');
        logger.silly('Got tokens from AuthService', tokens);
        const {sub: userId, email} = jwt.decode(tokens.id_token);
        return Promise.all([
          User.findOneOrCreate(userId, email).then(
            user => {
              logger.debug('User info found/created: ', user.toObject());
            },
            err => {
              // TODO: handle error
              throw err;
            }
          ),
          tokenStorage.updateUserToken(userId, tokens.refresh_token).then(
            token => {
              logger.debug('Refresh token saved');
              logger.silly('Refresh token saved', token);
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
  },

  userLogOut(userId) {
    return tokenStorage.removeUserToken(userId).then(
      () => {
        logger.info(`Refresh token removed for ${userId}`);
      },
      err => {
        logger.error(`Error removing refresh token for ${userId}`, err);
        return Promise.reject(err);
      }
    );
  },

  userLoggedOutConfirmed() {
    logger.info('User logout confirmend by Cognito');
    return Promise.resolve();
  }
};

module.exports = authController;
