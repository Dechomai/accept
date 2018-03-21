const appRouter = require('./app');
const authRouter = require('./auth');
const apiRouter = require('./api');

module.exports = [
  authRouter, // should be first
  apiRouter,
  appRouter // should be last
];
