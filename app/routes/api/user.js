const express = require('express');
const {body} = require('express-validator/check');
const {pick} = require('ramda');
const userController = require('../../controllers/api/user');
const validationMiddleware = require('../../middlewares/validation');

const PATH = '/user';

const userRouter = express.Router();

userRouter
  .route('/')
  .get((req, res) => {
    const {userId} = req;
    userController.getUserInfo(userId).then(
      user => {
        res.status(200).send({
          status: 'success',
          user
        });
      },
      () => {
        res.status(404).send({
          status: 'error',
          message: 'User not found'
        });
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
        .trim()
    ),
    (req, res) => {
      const {userId} = req;
      const data = pick(['firstName', 'lastName', 'address', 'phone', 'username'], req.body);
      userController.createUser(userId, data).then(
        user =>
          res.status(200).send({
            status: 'success',
            user
          }),
        (/* err */) => {
          // TODO: handle error
          res.status(400).send({
            status: 'error',
            message: 'Unable to create user'
          });
        }
      );
    }
  );

module.exports = app => {
  app.use(PATH, userRouter);
};
