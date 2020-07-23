// This file try to have a copy of remote directory (Google Drive)
// Use API version: 'v3'

const config = require('config')
const panelName = config.panel_name
const mediaPath = config.media_path

const fs = require('fs')
const readline = require('readline')
const { google } = require('googleapis')

// Solicitud de permisos de Google Drive
const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.metadata'
]
const TOKEN_PATH = 'token.json'

// Return time Ej:01/06/2020 19:16:4.
function getDateTime () {
  const date = new Date(Date.now())
  const day = date.getDate().toString().padStart(2, '0')
  const mount = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  const second = date.getSeconds().toString().padStart(2, '0')
  return `${day}/${mount}/${year} ${hour}:${minute}:${second}`
}

// Authorize a client with credentials, then call the Google Drive API.
function authorize (credentials, callback) {
  const clientSecret = credentials.installed.client_secret
  const clientID = credentials.installed.client_id
  const redirectURIs = credentials.installed.redirect_uris
  const oAuth2Client = new google.auth.OAuth2(clientID, clientSecret, redirectURIs[0])

  // Check if we have previously stored a token (token.json).
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback)
    oAuth2Client.setCredentials(JSON.parse(token))
    callback(oAuth2Client)
  })
}

// Get Token and save in token.json
function getAccessToken (oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })
  console.log('Authorize this app by visiting this url:', authUrl)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close()
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err)
      oAuth2Client.setCredentials(token)
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err)
        console.log('Token stored to', TOKEN_PATH)
      })
      callback(oAuth2Client)
    })
  })
}

// Callback de la autorización. Gets the ID of folder [panelName].
function getParentID (auth) {
  const drive = google.drive({ version: 'v3', auth })
  const q = `name = '${panelName}'`
  drive.files.list({
    q: q,
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)'
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err)
    const files = res.data.files
    if (files.length) {
      files.map((file) => {
        listFiles(drive, file.id)
      })
    } else {
      console.log(`Not found folder with name "${panelName}" in Google Drive`)
    }
  })
}

// Gets the list of files into [parentsID] folder.
function listFiles (drive, parentsID) {
  drive.files.list({
    q: `'${parentsID}' in parents AND trashed = false`,
    pageSize: 10,
    fields: 'nextPageToken, files(id, name, modifiedTime)'
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err)
    const files = res.data.files
    if (config.drive.remove_local) { RemoveOtherFiles(files) }
    if (files.length) {
      console.log(`Sincronizando (${getDateTime()})`)
      files.map((file) => {
        CheckFile(drive, file)
      })
    } else {
      console.log('No files found.')
    }
  })
}

// Check if exist "mediaPath" else try to create it.
function CheckMediaPath (drive, file) {
  if (fs.existsSync(mediaPath)) {
    DownloadFile(drive, file)
  } else {
    // Try to create mediaPath
    fs.mkdir(mediaPath, { recursive: true }, (err) => {
      if (err) {
        console.log(`Can't create "${mediaPath}", please check the path and permissions`)
      } else {
        console.log(`Creating "${mediaPath}"`)
        DownloadFile(drive, file)
      }
    })
  }
}

// Will be remove other files which are not present in Google Drive
function RemoveOtherFiles (remote) {
  // If you want that the process remove local file, you need to set "remove_local" in "true" in config file.
  // Default value for "remove_local" is false.
  const remoteFiles = remote.map(x => x.name)
  fs.readdir(mediaPath, (err, localfiles) => {
    if (!err) {
      localfiles.forEach(file => {
        if (!remoteFiles.includes(file)) {
          console.log(`Remove local file "${file}"`)
          fs.unlinkSync(`${mediaPath}/${file}`)
        }
      })
    }
  })
}

// TODO - Agregar descripsion.
function CheckFile (drive, file) {
  const fileName = `${mediaPath}/${file.name}`
  if (fs.existsSync(fileName)) {
    const stats = fs.statSync(fileName)
    // Paso los 2 tiempos a numero para poder compararlos
    const remoteTime = Date.parse(file.modifiedTime)
    const localTime = Date.parse(stats.mtime)

    // console.log(`${localTime} - ${remoteTime}`);

    if (remoteTime > localTime) {
      console.log(`La copia local de ${fileName} es antigua, descargando ultima versión`)
      CheckMediaPath(drive, file)
    }
  } else {
    console.log(`No existe una copia local de ${fileName}`)
    CheckMediaPath(drive, file)
  }
}

// Download file into mediaPath
function DownloadFile (drive, file) {
  // TODO - Tengo que controlar la fechas de los archivos
  // para no descargar dos veces el mismo archivo

  var dest = fs.createWriteStream(`${mediaPath}/${file.name}`)

  drive.files.get(
    { fileId: file.id, alt: 'media' },
    { responseType: 'stream' },
    (err, res) => {
      if (err) {
        // console.log(err);
        return console.log('Download file error: ' + err.response.statusText)
      } else {
        const data = res.data
        data.on('end', function () { console.log(`Archivo: ${file.name} ✓`) })
        data.on('error', function (err) { console.log('Error during download', err) })
        data.pipe(dest)
      }
    }
  )
}

// Load client secrets from a local file (credentials.json).
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file "credentials.json".\nGo to "https://console.developers.google.com/apis/credentials" for more info')
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(JSON.parse(content), getParentID)
})
