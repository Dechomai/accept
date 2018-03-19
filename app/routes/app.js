const path = require('path');
const express = require('express');

const appRouter = express.Router();

const PATH = '';

appRouter.get('*', (req, res) => {
  res.sendFile(path.resolve('public', 'index.html'));
});

module.exports = app => {
  app.use(PATH, appRouter);
};
