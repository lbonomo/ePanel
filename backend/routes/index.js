const express = require('express');
const routes = express();

routes.use(require('./turnos'));
routes.use(require('./media'));

module.exports = routes;
