import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import axios from 'axios';
import fs from 'fs'; // Import fs for reading the mock file

let mainWindow;
const isMockMode = false; // Check if mock mode is enabled

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
ipcMain.handle('fetch-historical-data', async (event, { ticker, days, currency = 'usd' }) => {
    if (isMockMode) {
        try {
            const mockFileName = `mockResponse_${currency}.json`; // Use currency-specific mock file
            const mockData = JSON.parse(fs.readFileSync(mockFileName, 'utf-8')); // Read mock response
            console.dir(currency);
            return mockData;
        } catch (error) {
            console.error(`Error reading mock response for currency ${currency}:`, error);
            throw error;
        }
    } else {
        try {
            const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${ticker}/market_chart`, {
                params: { vs_currency: currency, days }
            });
            console.dir(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
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

