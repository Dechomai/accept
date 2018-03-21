const express = require('express');
const authController = require('../controllers/auth');
const {appendTokenCookie} = require('../helpers/auth');

const PATH = '/auth';

const rootRouter = express.Router(); // handle root endpoints (/login, /signout)
const authRouter = express.Router();

rootRouter.get('/login', (req, res) => {
  const LOGIN_URI = authController.getLoginUri();
  res.redirect(LOGIN_URI);
});

rootRouter.get('/signout', (req, res) => {
  const SIGNOUT_URI = authController.getSignoutUri();
  res.redirect(SIGNOUT_URI);
});

// Cognito login callback
authRouter.get('/logincb', (req, res) => {
  const {code} = req.query;
  authController.userLoggedIn(code).then(
    token => {
      appendTokenCookie(res, token);
      res.redirect('/');
    },
    err => {
      console.log(err);
      res.send(401, {message: 'Unable to login'});
    }
  );
});

// Cognito signout callback
authRouter.get('/signoutcb', (req, res) => {
  // TODO
  // everything
  authController.userSignedOut();
  res.redirect('/');
});

module.exports = app => {
  app.use(rootRouter);
  app.use(PATH, authRouter);
};
