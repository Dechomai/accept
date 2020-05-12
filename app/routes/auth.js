const express = require('express');
const authController = require('../controllers/auth');
const {appendTokenCookie} = require('../helpers/auth');
const {createLoggerWith} = require('../logger');
const {sendError} = require('../helpers/response');
const authMiddleware = require('../middlewares/auth');
const {clearTokenCookie} = require('../helpers/auth');

const logger = createLoggerWith('[RTR]:Auth');

const PATH = '/auth';

const rootRouter = express.Router(); // handle root endpoints (/login, /signout)
const authRouter = express.Router();

rootRouter.get('/login', (req, res) => {
  const LOGIN_URI = authController.getLoginUri();
  res.redirect(LOGIN_URI);
});

rootRouter.get('/signup', (req, res) => {
  const SIGNUP_URI = authController.getSignUpUri();
  res.redirect(SIGNUP_URI);
});

rootRouter.get(
  '/logout',
  authMiddleware(res => res.redirect('/')),
  (req, res) => {
    const {userId} = req;
    authController
      .userLogOut(userId)
      .then(() => {
        clearTokenCookie(res);
        res.redirect(authController.getLogoutUri());
      })
      .catch(err => {
        logger.error('Unable to logout', err);
        sendError(res, {message: 'Error logging out'});
      });
  }
);

// Cognito login callback
authRouter.get('/logincb', (req, res) => {
  const {code} = req.query;
  authController.userLoggedIn(code).then(
    token => {
      appendTokenCookie(res, token);
      res.redirect('/');
    },
    err => {
      logger.error('Unable to login', err);
      sendError(res, {message: 'Unable to login'}, {status: 401});
    }
  );
});

// Cognito signout callback
authRouter.get('/logoutcb', (req, res) => {
  authController.userLoggedOutConfirmed().then(() => {
    res.redirect('/');
  });
});

module.exports = app => {
  app.use(rootRouter);
  app.use(PATH, authRouter);
};
