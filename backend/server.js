const express = require('express')

// var path = require('path');
var cors = require('cors')

// Config file
// npm install config
// lee el archivo de configuracion config/default.json
// https://www.npmjs.com/package/config
const config = require('config')
const nodePort = config.node_port
const apiServer = express()

// Then use it before your routes are set up:
// Use cors to prevente CORS ERRORS
apiServer.use(cors())

// Parse URL-encoded bodies (as sent by HTML forms)
apiServer.use(express.urlencoded({ extended: true }))

// Parse JSON bodies (as sent by API clients)
// Reemplaza el app.use(bodyParser.json)
apiServer.use(express.json())

// Routes
apiServer.use(require('./routes/index'))

// Turn on that server!
apiServer.listen(nodePort, () => {
  console.log(`App listening on port ${nodePort}`)
})

module.export = apiServer
