const express = require('express')
const routes = express()

routes.use(require('./home'))
routes.use(require('./status'))
routes.use(require('./data'))
routes.use(require('./media'))
routes.use(require('./config'))

module.exports = routes
