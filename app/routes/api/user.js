const express = require('express');
const {body, param} = require('express-validator/check');
const {pick} = require('ramda');
const userController = require('../../controllers/api/user');
const authMiddleware = require('../../middlewares/auth');
const {createSingleUploadMiddleware} = require('../../middlewares/upload');
const validationMiddleware = require('../../middlewares/validation');
const {sendSuccess, sendError} = require('../../helpers/response');
const {createLoggerWith} = require('../../logger');
const {ADDRESS_REGEX} = require('../../utils/blockchain');

const logger = createLoggerWith('[RTR]:User');

const PATH = '/user';

const userRouter = express.Router();

const uploadMiddleware = createSingleUploadMiddleware({field: 'avatar'});

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

userRouter.route('/confirm').post(
  authMiddleware(),
  validationMiddleware(
    body('address')
      .exists()
      .custom(val => ADDRESS_REGEX.test(val))
  ),
  (req, res) => {
    const {userId} = req;
    const {address} = req.body;

    userController.confirmUser(userId, {address}).then(
      user => sendSuccess(res, {user}),
      err => {
        if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
        sendError(res, {message: 'Error confirming user'});
      }
    );
  }
);

userRouter
  .route('/:userId')
  .all(
    validationMiddleware(
      param('userId')
        .exists()
        .isUUID()
    )
  )
  .get((req, res) => {
    const {userId} = req.params;

    userController.getUserInfo(userId).then(
      user => sendSuccess(res, {user}),
      err => {
        if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
        sendError(res, {message: 'Error getting user'});
      }
    );
  });

userRouter
  .route('/')
  .get(authMiddleware(), (req, res) => {
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
    authMiddleware(),
    uploadMiddleware({logger, logPrefix: 'post:user'}),
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
      userController.createUser(userId, data, req.file).then(
        user => sendSuccess(res, {user}),
        err => {
          if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
          sendError(res, {message: 'Error creating user'});
        }
      );
    }
  )
  .put(
    authMiddleware(),
    validationMiddleware(
      body('description')
        .optional()
        .isLength({min: 0, max: 800})
        .trim()
    ),
    (req, res) => {
      const data = pick(['description'], req.body);

      userController.updateUser(req.userId, data).then(
        user => sendSuccess(res, {user}),
        err => {
          if (err === null) return sendError(res, {message: 'Not found'}, {status: 404});
          sendError(res, {message: 'Unable to update user'}, {status: 400});
        }
      );
    }
  );

module.exports = app => {
  app.use(PATH, userRouter);
};
