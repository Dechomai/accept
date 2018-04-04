const express = require('express');
const authMiddleware = require('../../middlewares/auth');

const userRouter = require('./user');
const mediaRouter = require('./media');
const productsRouter = require('./products');

const routers = [userRouter, mediaRouter, productsRouter];

const PATH = '/api';
const apiRouter = express.Router();
apiRouter.use(authMiddleware);

module.exports = app => {
  routers.forEach(appendRouter => appendRouter(apiRouter));

  apiRouter.all('*', (req, res) => {
    res.status(404).send({
      message: `No such endpoint: ${req.originalUrl}`
    });
  });

  app.use(PATH, apiRouter);
};
