const routes = require('express').Router()
const config = require('config')

// Export config
routes.get('/config', (req, res) => {
  res.send({
    timezone: config.mssql.timezone,
    interval: config.interval
  })
})

module.exports = routes
