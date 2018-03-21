const express = require('express');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const config = require('./config');
const routes = require('./app/routes');
const connectDB = require('./app/db/connection');
const {outLoggerMiddleware, errLoggerMiddleware} = require('./app/middlewares/logger');

const PORT = config.get('port');
const IP = config.get('ip');

const app = express();

// App-level middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(cookieParser(config.get('cookieSecret')));
app.use(compression());
app.use(helmet());
app.use(express.static(__dirname + '/public'));
app.use(outLoggerMiddleware);
app.use(errLoggerMiddleware);

connectDB();
routes.forEach(appendRouter => appendRouter(app));

// Attach error handlers
// TODO: add separate error handlers for XHR
// eslint-disable-next-line
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send({error: 'Application Error 💩'});
});

app.listen(PORT, IP, () => {
  console.log(`Server started @ ${IP}:${PORT}`);
});
