// De momento es un archivo aparte
// https://github.com/googleapis/google-api-nodejs-client/tree/master/samples/drive

// La primera vez que lo ejecutamos nos solicita una autorizacion y
// tenemos que ingrasar el codigo que genera...
// TODO - Ver si se puede automatizar este paso

// Es necesario tener acceso al API
// https://developers.google.com/drive/api/v3/quickstart/nodejs
// Configurar en config/default.json
// "drive": {
//   "client_ID":"",
//   "client_secret":""
// }

const config = require('config');
const client_id = config.drive.client_ID;
const client_secret = config.drive.client_secret;
const panel_name = config.panel_name;


const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');


// const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.metadata',
  // 'https://www.googleapis.com/auth/drive.photos.readonly',
];
const TOKEN_PATH = 'token.json';

function getDateTime() {
  let date = new Date(Date.now());
  return `${date.getDay()}/${date.getMonth()}/${date.getYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

}

function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function getParentID(auth) {
  let drive = google.drive({version: 'v3', auth});
  let q = `name = '${panel_name}'`;
  drive.files.list({
    q: "name = 'sfe001'",
    // q: q,
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    let files = res.data.files;
    if (files.length) {
      files.map((file) => {
        listFiles(drive,file.id)
      });
    } else {
      console.log('No files found.');
    }
  });
}

function listFiles(drive, parentsID) {
  // console.log(parents_id);
  drive.files.list({
    q:`'${parentsID}' in parents`,
    pageSize: 10,
    fields: 'nextPageToken, files(id, name, modifiedTime)',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    let files = res.data.files;
    if (files.length) {
      console.log(`Sincronizando (${getDateTime()})`);
      files.map((file) => {
        // console.log(`${file.name} (${file.id})`);
        CheckFile(drive, file)
      });
    } else {
      console.log('No files found.');
    }
  });
}

function CheckFile(drive, file) {
  if ( fs.existsSync(`./media/${file.name}`) ) {
    let stats = fs.statSync(`./media/${file.name}`);
    // Paso los 2 tiempos a numero para poder compararlos
    let remoteTime = Date.parse(file.modifiedTime);
    let localTime = Date.parse(stats.mtime);

    // console.log(`${localTime} - ${remoteTime}`);

    if ( remoteTime > localTime) {
      console.log(`La copia local de ${file.name} es antigua, descargando ultima versión`);
      DownloadFile(drive, file)
    }
  } else {
    console.log(`No existe una copia local de ${file.name}`);
    DownloadFile(drive, file)
  }
}

function DownloadFile(drive, file) {

  // Tengo que controlar la fechas de los archivos
  // para no descargar dos veces el mismo archivo

  var dest = fs.createWriteStream(`./media/${file.name}`);

  drive.files.get(
    { fileId: file.id, alt: 'media'},
    { responseType: 'stream'},
    (err, res) => {
      if (err) {
        // console.log(err);
        return console.log('Download file error: ' + err.response.statusText);
      } else {
        let data =res.data;
        data.on('end', function () { console.log(`Archivo: ${file.name} ✓`); });
        data.on('error', function (err) { console.log('Error during download', err); })
        data.pipe(dest);
      }
    }
  );



}

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  authorize( JSON.parse(content), getParentID)
});
