const routes = require('express').Router()
const path = require('path')
const config = require('config')
const fs = require('fs')

// Compatibility.
routes.get('/turnos', (req, res) => {
  res.redirect('/data')
})

// Return Data.json if exist.
routes.get('/data', (req, res) => {
  const dataPath = config.data_path
  // Devuelvo el json guardado
  // res.json(config.sql);
  fs.readFile(path.resolve(`${dataPath}/data.json`), (err, items) => {
    if (err) {
      res.send({
        status: 'error',
        message: `Can't read file ${dataPath}/data.json`
      })
    } else {
      const file = path.resolve(`${dataPath}/data.json`)
      res.sendFile(file)
    }
  })
})

module.exports = routes
