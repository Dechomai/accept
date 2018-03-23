const express = require('express');
const userController = require('../../controllers/api/user');

const PATH = '/user';

const userRouter = express.Router();

userRouter
  .route('/')
  .get((req, res) => {
    const {userId} = req;
    userController.getUserInfo(userId).then(
      user => {
        res.status(200).send(user);
      },
      () => {
        res.status(404).send({
          message: 'User not found'
        });
      }
    );
  })
  .post((req, res) => {
    // userController.updateUser(req.userId);
    res.send({userId: req.userId});
  });

module.exports = app => {
  app.use(PATH, userRouter);
};
