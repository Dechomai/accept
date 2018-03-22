const jwt = require('jsonwebtoken');
const authService = require('../services/auth');
const tokenStorage = require('../services/tokenStorage');
const {getTokenCookie, appendTokenCookie, clearTokenCookie} = require('../helpers/auth');
const logger = require('../logger');

const sendUnauthorizedError = res =>
  res.status(401).send({
    message: 'Unauthorized'
  });

const authMiddleware = (req, res, next) => {
  const accessToken = getTokenCookie(req);
  if (!accessToken) {
    logger.debug('[AuthMiddleware] no token');
    sendUnauthorizedError(res);
    return;
  }
  logger.debug('[AuthMiddleware] got token');
  logger.silly('[AuthMiddleware] got token', accessToken);
  authService.validateToken(accessToken).then(
    token => {
      req.userId = token.sub;
      logger.debug('[AuthMiddleware] token valid');
      next();
    },
    err => {
      logger.debug('[AuthMiddleware] token validation failed');
      const token = jwt.decode(accessToken);
      if (!token || !token.sub) {
        logger.error('[AuthMiddleware] can not decode token', accessToken);
        clearTokenCookie(res);
        sendUnauthorizedError(res);
        return;
      }
      const {sub: userId} = token;
      logger.debug('[AuthMiddleware] got userId from token: ', userId);
      if (err.name === 'TokenExpiredError') {
        // if token expired try to update using refresh token
        // if refresh token expired - delete it
        logger.debug('[AuthMiddleware] token expired');
        tokenStorage
          .getUserToken(userId)
          .then(token => authService.updateToken(token))
          .then(tokens => tokens.access_token)
          .then(token => {
            logger.debug('[AuthMiddleware] token refreshed');
            logger.silly('[AuthMiddleware] token refreshed', token);
            appendTokenCookie(res, token);
            const {sub: userId} = jwt.decode(token);
            req.userId = userId;
            next();
          })
          .catch(err => {
            logger.debug('[AuthMiddleware] token refresh failed', err);
            if (err.error === 'invalid_grant') {
              logger.debug('[AuthMiddleware] refresh token revoked/expired', err);
              tokenStorage.removeUserToken(userId).then(() => {
                clearTokenCookie(res);
                sendUnauthorizedError(res);
              });
            } else {
              logger.error('[AuthMiddleware] token refresh failed', err);
              clearTokenCookie(res);
              sendUnauthorizedError(res);
            }
          });
      } else {
        // handle other errors
        // Validation errors:
        // "TokenNotFound", "InvalidTokenUse", "InvalidUserPool"
        logger.debug('[AuthMiddleware] token invalid - reason', err);
        clearTokenCookie(res);
        sendUnauthorizedError(res);
      }
    }
  );
};

module.exports = authMiddleware;
