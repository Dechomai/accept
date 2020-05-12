const path = require('path');
const express = require('express');

const PATH = '';

const appRouter = express.Router();

appRouter.get('*', (req, res) => {
  res.sendFile(path.resolve('public', 'index.html'));
});

module.exports = app => {
  app.use(PATH, appRouter);
};
