const routes = require('express').Router();
const fs = require('fs');
const path = require('path');
const mime = require('mime');

const extensions = [
  'jpeg',
  'png'
]

// Muestro una imagen
routes.get('/media', (req, res) => {
  // Hace un rando entre los archivos del directorio ""../media"
  // y devuelve un json con la url del archivo y el tipo

  fs.readdir(path.resolve(__dirname,'../media/'), (err, items) => {
    if (err) {
      res.send({
        'file': path.resolve(__dirname,'../default.png'),
        'type': 'image'
      })
    } else {

      // Filtro solo los archivos permitidos
      // V1 solo imagenes
      // V2 imagenes y videos
      let files = items.filter( (i) => {
        let f = path.resolve(__dirname,`../media/${i}`)
        let extension = mime.lookup(f).split("/")[1]

        if ( extensions.includes(extension) ) {
          return i
        } else {
          return false
        }
      })

      // Devuelvo un solo elemento del objeto
      let item = files[Math.floor(Math.random() * files.length)]
      let file = encodeURI('http://localhost:5555/file/' + item);

      console.log(file);

      let type = mime.lookup(file).split("/")[1]

      res.send({
        'file': file,
        'type': type
      })

    };
  });
});

routes.get('/file/:file', (req, res) => {
  // Devuelve un archivo
  let file = path.resolve(__dirname,'../media/'+req.params.file);
  // let file = path.resolve(__dirname,'../media/example.png');
  // let file = path.resolve(__dirname,'../media/example.mp4');
  // console.log(file);
  res.sendFile(file);
});

module.exports = routes;
