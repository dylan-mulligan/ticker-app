import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import axios from 'axios'; // Add axios for API requests

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        titleBarStyle: 'default',
        webPreferences: {
            nodeIntegration: true, // Enable Node.js integration
            contextIsolation: false // Disable context isolation for compatibility
        }
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(createWindow);

// Handle API requests from the renderer process
ipcMain.handle('fetch-historical-data', async (event, { ticker, days }) => {
    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${ticker}/market_chart`, {
            params: { vs_currency: 'usd', days }
        });
        console.dir(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
