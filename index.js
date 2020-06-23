const { app, BrowserWindow,  Menu} = require('electron');

const path = require('path');

const config = require(path.join(__dirname, '/package.json'));
const { apiServer } = require( path.join(__dirname, '/backend/server.js') );

app.name = config.productName;
app.allowRendererProcessReuse = false;

var mainWindow = null;

app.on('ready', function () {
  WebView = new BrowserWindow({
    backgroundColor: 'lightgray',
    title: config.productName,
    kiosk: true,
    webSecurity: false,
    extraResources: 'app/myfolder/mysubfolder/',
    // webPreferences: {
    //   // nodeIntegration: true,
    //   // defaultEncoding: 'UTF-8',
    //   // autoplayPolicy: 'no-user-gesture-required'
    // },
    icon: path.join(__dirname, 'assets/icons/icon.png')
  });
  WebView.maximize();
  WebView.setMenuBarVisibility(false);


  //
  let userDataFolther = app.getPath('userData');
  // console.log(userDataFolther);
  // console.log(`${__dirname}`);
  WebView.loadFile(`${__dirname}/frontend/build/index.html`);

  WebView.once('ready-to-show', () => {

  WebView.show();
  });

});

app.on('window-all-closed', () => { app.quit(); } );
