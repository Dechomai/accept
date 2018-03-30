const express = require('express');

const PATH = '/media';

const mediaRouter = express.Router();
const uploadRouter = express.Router();
uploadRouter
  .post('/user', (req, res) => {
    const {userId} = req;
    res.send(`upload user photo: ${userId}`);
  })
  .post('/product', (req, res) => {
    res.send('upload product picture');
  })
  .post('/service', (req, res) => {
    res.send('upload service picture');
  });

mediaRouter.use('/upload', uploadRouter);

module.exports = app => {
  app.use(PATH, mediaRouter);
};
