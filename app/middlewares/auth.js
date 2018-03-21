const jwt = require('jsonwebtoken');
const authService = require('../services/auth');
const tokenStorage = require('../services/tokenStorage');
const {getTokenCookie, appendTokenCookie, clearTokenCookie} = require('../helpers/auth');

const sendUnauthorizedError = res =>
  res.status(401).send({
    message: 'Unauthorized'
  });

const authMiddleware = (req, res, next) => {
  const accessToken = getTokenCookie(req);
  if (!accessToken) {
    sendUnauthorizedError(res);
    return;
  }
  console.log('[token from cookie]: ', accessToken);
  authService.validateToken(accessToken).then(
    token => {
      req.userId = token.sub;
      console.log('[token from cookie] VALID');
      next();
    },
    err => {
      console.log('[token from cookie] INVALID', err);
      const {sub: userId} = jwt.decode(accessToken);
      console.log('[token from cookie] User ID: ', userId);
      if (err.name === 'TokenExpiredError') {
        console.log('[token from cookie] refreshing token');
        tokenStorage
          .getUserToken(userId)
          .then(token => token.rt)
          .then(token => authService.updateToken(token))
          .then(tokens => tokens.access_token)
          .then(token => {
            console.log('[token from cookie] got new token', token);
            appendTokenCookie(res, token);
            const {sub: userId} = jwt.decode(token);
            req.userId = userId;
            next();
          })
          .catch(err => {
            console.log('[token from cookie] Error with refreshing token', err);
            sendUnauthorizedError(res);
          });
      } else {
        clearTokenCookie(res);
        sendUnauthorizedError(res);
      }
    }
  );
};

module.exports = authMiddleware;
