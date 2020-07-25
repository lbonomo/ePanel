const routes = require('express').Router()
const config = require('config')
const network = require('../libs/network')

// Execute Query
routes.get('/', (req, res) => {
  res.send({
    config: `http://${network.address}:${config.node_port}/config`,
    media: `http://${network.address}:${config.node_port}/media`,
    status: `http://${network.address}:${config.node_port}/status`,
    data: `http://${network.address}:${config.node_port}/data`
  })
})

module.exports = routes
