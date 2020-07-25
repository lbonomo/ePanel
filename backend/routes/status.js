const routes = require('express').Router()
const network = require('../libs/network')

// Execute Query
routes.get('/status', (req, res) => {
  res.send({
    network: network,
    date: Date(Date.now()).toLocaleString()
  })
})

module.exports = routes
