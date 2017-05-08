const electron = require('electron');
const {ipcMain} = require('electron')
const {app} = electron;
const {BrowserWindow} = electron;

let mainWindow;
function createMainWindow() {
    mainWindow = new BrowserWindow({width: 834, height: 420, frame: false, resizable: false, show: false});
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    });
    mainWindow.setResizable(false);
    mainWindow.loadURL(`file://${__dirname}/app/index.html`);

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}


function createMovieWindow() {
    let movieWindow;
    movieWindow = new BrowserWindow({width: 834, height: 480, frame: false, resizable: true, show: false});
    movieWindow.setResizable(true);
    movieWindow.loadURL(`file://${__dirname}/app/moviePlayer/moviePlayer.html`);

    // Open the DevTools.
    //movieWindow.webContents.openDevTools();
    movieWindow.on('closed', () => {
        movieWindow = null;
    });

    return movieWindow;
}

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (mainWindow === null) {
        createMainWindow();
    }
});

ipcMain.on('play-movie-msg', function(event, arg) {
    let movieWindow = createMovieWindow();
    movieWindow.once('ready-to-show', () => {
        movieWindow.show();
        movieWindow.send('play-movie-msg', arg);
    });
});