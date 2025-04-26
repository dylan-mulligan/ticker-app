const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
const isMockMode = true; // Check if mock mode is enabled
const boundsFile = path.join(app.getPath('userData'), 'windowBounds.json'); // File to store window bounds

function saveWindowBounds() {
    if (mainWindow) {
        const bounds = mainWindow.getBounds();
        fs.writeFileSync(boundsFile, JSON.stringify(bounds), 'utf-8');
    }
}

function loadWindowBounds() {
    try {
        if (fs.existsSync(boundsFile)) {
            return JSON.parse(fs.readFileSync(boundsFile, 'utf-8'));
        }
    } catch (error) {
        console.error('Error loading window bounds:', error);
    }
    return { width: 800, height: 600 }; // Default size
}

function createWindow() {
    const { width, height, x, y } = loadWindowBounds(); // Load saved bounds
    mainWindow = new BrowserWindow({
        width,
        height,
        x,
        y,
        frame: false, // Disable the window frame
        titleBarStyle: 'hidden', // Hide the default title bar
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Ensure preload script is correctly set
            contextIsolation: true, // Ensure context isolation is enabled
            enableRemoteModule: false, // Disable remote module
            nodeIntegration: false, // Ensure node integration is disabled
        }
    });

    mainWindow.loadURL(
        process.env.ELECTRON_START_URL ||
        `file://${path.join(__dirname, 'build', 'index.html')}`
    );

    mainWindow.on('resized', saveWindowBounds); // Save bounds on window moved
    mainWindow.on('moved', saveWindowBounds); // Save bounds on window moved
    mainWindow.on('close', saveWindowBounds); // Save bounds on close
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    ipcMain.on('set-always-on-top', (event, isAlwaysOnTop) => {
        if (mainWindow) {
            mainWindow.setAlwaysOnTop(isAlwaysOnTop);
        }
    });

    ipcMain.on('set-initial-always-on-top', (event, isAlwaysOnTop) => {
        if (mainWindow) {
            mainWindow.setAlwaysOnTop(isAlwaysOnTop); // Apply initial state
        }
    });

    ipcMain.on('minimize-window', () => {
        if (mainWindow) {
            mainWindow.minimize();
        }
    });

    ipcMain.on('maximize-window', () => {
        if (mainWindow) {
            if (mainWindow.isMaximized()) {
                mainWindow.unmaximize();
            } else {
                mainWindow.maximize();
            }
        }
    });

    ipcMain.on('close-window', () => {
        if (mainWindow) {
            mainWindow.close();
        }
    });
}

function createChartWindow(ticker, currency, chartType) {
    const chartWindow = new BrowserWindow({
        width: 500,
        height: 600,
        frame: false, // Disable default frame
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
        },
    });

    const baseUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, 'build', 'index.html')}`;
    const chartUrl = `${baseUrl}/${ticker}-${currency}?chartType=${chartType}`;

    chartWindow.loadURL(chartUrl);
}

ipcMain.on('open-chart-window', (event, { ticker, currency, chartType }) => {
    createChartWindow(ticker, currency, chartType);
});

app.whenReady().then(createWindow);

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
