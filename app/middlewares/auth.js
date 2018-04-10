const jwt = require('jsonwebtoken');
const authService = require('../services/auth');
const tokenStorage = require('../services/tokenStorage');
const {getTokenCookie, appendTokenCookie, clearTokenCookie} = require('../helpers/auth');
const {createLoggerWith} = require('../logger');
const {sendError} = require('../helpers/response');

const logger = createLoggerWith('[MDLWR:Auth]');

const sendUnauthorizedError = res => sendError(res, {message: 'Unauthorized'}, {status: 401});

const authMiddleware = (req, res, next) => {
  const accessToken = getTokenCookie(req);
  if (!accessToken) {
    logger.debug('no token');
    sendUnauthorizedError(res);
    return;
  }
  logger.debug('got token');
  logger.silly('got token', accessToken);
  authService.validateToken(accessToken).then(
    token => {
      req.userId = token.sub;
      logger.debug('token valid');
      next();
    },
    err => {
      logger.debug('token validation failed');
      const token = jwt.decode(accessToken);
      if (!token || !token.sub) {
        logger.error('can not decode token', accessToken);
        clearTokenCookie(res);
        sendUnauthorizedError(res);
        return;
      }
      const {sub: userId} = token;
      logger.debug('got userId from token: ', userId);
      if (err.name === 'TokenExpiredError') {
        // if token expired try to update using refresh token
        // if refresh token expired - delete it
        logger.debug('token expired');
        tokenStorage
          .getUserToken(userId)
          .then(token => authService.updateToken(token))
          .then(tokens => tokens.access_token)
          .then(token => {
            logger.debug('token refreshed');
            logger.silly('token refreshed', token);
            appendTokenCookie(res, token);
            const {sub: userId} = jwt.decode(token);
            req.userId = userId;
            next();
          })
          .catch(err => {
            logger.debug('token refresh failed', err);
            if (err === null) {
              logger.debug('refresh token not found', err);
              clearTokenCookie(res);
              sendUnauthorizedError(res);
            }
            if (err.error === 'invalid_grant') {
              logger.debug('refresh token revoked/expired', err);
              tokenStorage.removeUserToken(userId).then(() => {
                clearTokenCookie(res);
                sendUnauthorizedError(res);
              });
            } else {
              logger.error('token refresh failed', err);
              clearTokenCookie(res);
              sendUnauthorizedError(res);
            }
          });
      } else {
        // handle other errors
        // Validation errors:
        // "TokenNotFound", "InvalidTokenUse", "InvalidUserPool"
        logger.debug('token invalid - reason', err);
        clearTokenCookie(res);
        sendUnauthorizedError(res);
      }
    }
  );
};

module.exports = authMiddleware;
