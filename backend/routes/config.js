const routes = require('express').Router();
const path = require('path');
const config = require('config');


// Execute Query
routes.get('/config', (req, res) => {
  res.send({
      'timezone':config.mssql.timezone,
      'interval':config.interval
  });
});

module.exports = routes;
