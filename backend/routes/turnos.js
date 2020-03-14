const routes = require('express').Router();
const path = require('path');

// Execute Query
routes.get('/turnos', (req, res) => {
  // Devuelvo el json guardado
  // res.json(config.sql);
  let file = path.resolve(__dirname,'../turnos/data.json');
  console.log(file);
  res.sendFile(file);
});

module.exports = routes;
