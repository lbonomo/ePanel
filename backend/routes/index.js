const express = require('express');
const routes = express();

routes.use(require('./turnos'));
routes.use(require('./media'));
routes.use(require('./config'));

module.exports = routes;
