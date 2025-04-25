const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            // if you ever need Node in renderer:
            // nodeIntegration: true,
            // contextIsolation: false,
        }
    });

    // in dev, CRA serves at localhost:3000
    win.loadURL(
        process.env.ELECTRON_START_URL ||
        `file://${path.join(__dirname, 'build', 'index.html')}`
    );
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    // on Windows & Linux, quit when all windows are closed
    if (process.platform !== 'darwin') app.quit();
});
