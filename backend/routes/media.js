const routes = require('express').Router()
const fs = require('fs')
const path = require('path')
const mime = require('mime')
const config = require('config')
const network = require('../libs/network')

const defaultImg = {
  file: `http://${network.address}:${config.node_port}/file/default.png`,
  type: 'image'
}

const extensions = [
  'jpeg',
  'png'
]

// Muestro una imagen
routes.get('/media', (req, res) => {
  // Hace un rando entre los archivos del directorio ""../media"
  // y devuelve un json con la url del archivo y el tipo

  fs.readdir(path.resolve(config.media_path), (err, items) => {
    // if can't read media_path return defaultImg
    if (err) {
      res.send(defaultImg)
    } else {
      // Filtro solo los archivos permitidos
      // V1 solo imagenes
      // V2 imagenes y videos
      const files = items.filter((i) => {
        const f = path.resolve(`${config.media_path}/${i}`)
        const extension = mime.lookup(f).split('/')[1]
        if (extensions.includes(extension)) {
          return i
        } else {
          return false
        }
      })
      // If not have images in media_path return Default
      if (files.length >= 1) {
        const item = files[Math.floor(Math.random() * files.length)]
        console.log(item)
        const file = encodeURI(`http://${network.address}:${config.node_port}/file/${item}`)
        const type = mime.lookup(file).split('/')[1]
        res.send({
          file: file,
          type: type
        })
      } else {
        res.send(defaultImg)
      }
    }
  })
})

routes.get('/file/:file', (req, res) => {
  // Devuelve un archivo
  // path.resolve(),
  let file = ''
  if (req.params.file === 'default.png') {
    file = path.resolve(__dirname, '../default.png')
  } else {
    file = path.resolve(`${config.media_path}/${req.params.file}`)
  }
  res.sendFile(file)
})

module.exports = routes
