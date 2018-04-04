const express = require('express');
const {body} = require('express-validator/check');
const {pick} = require('ramda');
const userController = require('../../controllers/api/user');
const validationMiddleware = require('../../middlewares/validation');
const {sendSuccess, sendError} = require('../../helpers/response');

const PATH = '/user';

const userRouter = express.Router();

userRouter
  .route('/')
  .get((req, res) => {
    const {userId} = req;
    userController.getUserInfo(userId).then(
      user => sendSuccess(res, {user}),
      err => {
        if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
        sendError(res, {message: 'Error getting user'});
      }
    );
  })
  .post(
    validationMiddleware(
      body('firstName')
        .exists()
        .isLength({min: 1, max: 225}) // science
        .trim(),
      body('lastName')
        .exists()
        .isLength({min: 1, max: 50}) // science
        .trim(),
      body('address')
        .optional()
        .isLength({min: 1, max: 100})
        .trim(),
      body('phone')
        .optional()
        .isMobilePhone('any')
        .trim(),
      body('username')
        .exists()
        .isLength({min: 1, max: 100})
        .isAlphanumeric()
        .trim(),
      body('photoUrl')
        .optional()
        .trim()
    ),
    (req, res) => {
      const {userId} = req;
      const data = pick(
        ['firstName', 'lastName', 'address', 'phone', 'username', 'photoUrl'],
        req.body
      );
      userController.createUser(userId, data).then(
        user => sendSuccess(res, {user}),
        err => {
          if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
          sendError(res, {message: 'Error creating user'});
        }
      );
    }
  )
  .put(
    validationMiddleware(
      body('description')
        .optional()
        .isLength({min: 0, max: 800})
        .trim()
    ),
    (req, res) => {
      const data = pick(['description'], req.body);

      userController.updateUser(req.userId, data).then(
        user => {
          res.status(200).send({
            status: 'success',
            user
          });
        },
        err => {
          if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
          res.status(400).send({
            status: 'error',
            message: 'Unable to update user'
          });
        }
      );
    }
  );

userRouter.route('/unique-username').post(
  validationMiddleware(
    body('username')
      .exists()
      .isLength({min: 1, max: 100})
      .isAlphanumeric()
      .trim()
  ),
  (req, res) => {
    const {username} = req.body;
    userController.isUsernameUnique(username).then(
      user =>
        sendSuccess(res, {
          unique: !user,
          message: user ? 'Username is unavailable' : 'Username is available'
        }),
      () =>
        sendError(res, {
          message: 'Unable to check username'
        })
    );
  }
);

module.exports = app => {
  app.use(PATH, userRouter);
};
