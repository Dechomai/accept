const express = require('express');

const userRouter = require('./user');
const productsRouter = require('./products');
const servicesRouter = require('./services');
const exchangesRouter = require('./exchanges');

const routers = [userRouter, productsRouter, servicesRouter, exchangesRouter];

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
