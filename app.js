const express = require('express');

const config = require('./config');
const routes = require('./app/routes');

const PORT = config.get('port');
const IP = config.get('ip');

const app = express();

app.use(express.static(__dirname + '/public'));

routes.forEach(appendRouter => appendRouter(app));

app.listen(PORT, IP, () => {
  console.log(`Server started @ ${IP}:${PORT}`);
});
