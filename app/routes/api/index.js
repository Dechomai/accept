const express = require('express');

const userRouter = require('./user');
const mediaRouter = require('./media');
const productsRouter = require('./products');

const routers = [userRouter, mediaRouter, productsRouter];

const PATH = '/api';
const apiRouter = express.Router();

module.exports = app => {
  routers.forEach(appendRouter => appendRouter(apiRouter));

  apiRouter.all('*', (req, res) => {
    res.status(404).send({
      message: `No such endpoint: ${req.originalUrl}`
    });
  });

  app.use(PATH, apiRouter);
};
