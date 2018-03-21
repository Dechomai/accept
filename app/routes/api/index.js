const express = require('express');
const authMiddleware = require('../../middlewares/auth');

const userRouter = require('./user');

const routers = [userRouter];

const PATH = '/api';
const apiRouter = express.Router();
apiRouter.use(authMiddleware);

module.exports = app => {
  routers.forEach(appendRouter => appendRouter(apiRouter));
  app.use(PATH, apiRouter);
};
