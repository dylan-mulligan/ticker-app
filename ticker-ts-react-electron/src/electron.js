const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
const chartWindows = {}; // Stores references to chart windows
const boundsFile = path.join(app.getPath('userData'), 'windowBounds.json'); // Path to store window bounds

// Saves the current bounds (size and position) of the main window to a file
function saveWindowBounds() {
    if (mainWindow) {
        const bounds = mainWindow.getBounds();
        fs.writeFileSync(boundsFile, JSON.stringify(bounds), 'utf-8');
    }
}

// Loads the saved bounds (size and position) of the main window from a file
function loadWindowBounds() {
    try {
        if (fs.existsSync(boundsFile)) {
            return JSON.parse(fs.readFileSync(boundsFile, 'utf-8'));
        }
    } catch (error) {
        console.error('Error loading window bounds:', error);
    }
    return { width: 800, height: 600 }; // Default window size
}

// Creates the main application window
function createWindow() {
    const { width, height, x, y } = loadWindowBounds();
    mainWindow = new BrowserWindow({
        width,
        height,
        x,
        y,
        frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
        }
    });

    mainWindow.loadURL(
        process.env.ELECTRON_START_URL ||
        `file://${path.join('build', 'index.html')}`
    );

    mainWindow.on('resized', saveWindowBounds);
    mainWindow.on('moved', saveWindowBounds);
    mainWindow.on('close', saveWindowBounds);
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    ipcMain.on('set-always-on-top', (event, isAlwaysOnTop) => {
        if (mainWindow) mainWindow.setAlwaysOnTop(isAlwaysOnTop);
    });

    ipcMain.on('set-initial-always-on-top', (event, isAlwaysOnTop) => {
        if (mainWindow) mainWindow.setAlwaysOnTop(isAlwaysOnTop);
    });

    ipcMain.on('minimize-window', () => {
        if (mainWindow) mainWindow.minimize();
    });

    ipcMain.on('maximize-window', () => {
        if (mainWindow) {
            mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
        }
    });

    ipcMain.on('close-window', () => {
        if (mainWindow) mainWindow.close();
    });
}

// Creates a new chart window for a specific ticker, currency, and chart type
function createChartWindow(ticker, currency, chartType) {
    const chartWindow = new BrowserWindow({
        height: 250,
        minWidth: 375,
        frame: false,
        transparent: true,
        hasShadow: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
        },
    });

    const baseUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, 'build', 'index.html')}`;
    const chartUrl = `${baseUrl}/chart/${ticker}?currency=${currency}&chartType=${chartType}`;

    chartWindow.setAspectRatio(16 / 9);
    chartWindow.loadURL(chartUrl);

    const windowKey = `${ticker}-${currency}`;
    chartWindows[windowKey] = chartWindow;

    chartWindow.on('closed', () => {
        delete chartWindows[windowKey];
    });
}

// Handles IPC events for opening a chart window
ipcMain.on('open-chart-window', (event, { ticker, currency, chartType }) => {
    createChartWindow(ticker, currency, chartType);
});

// Handles IPC events for setting a chart window to always be on top
ipcMain.on('set-chart-always-on-top', (event, { ticker, currency, isAlwaysOnTop }) => {
    const windowKey = `${ticker}-${currency}`;
    const chartWindow = chartWindows[windowKey];
    if (chartWindow) chartWindow.setAlwaysOnTop(isAlwaysOnTop);
});

// Handles IPC events for setting the initial always-on-top state of a chart window
ipcMain.on('set-chart-initial-always-on-top', (event, { ticker, currency, isAlwaysOnTop }) => {
    const windowKey = `${ticker}-${currency}`;
    const chartWindow = chartWindows[windowKey];
    if (chartWindow) chartWindow.setAlwaysOnTop(isAlwaysOnTop);
});

// Handles IPC events for closing a specific chart window
ipcMain.on('close-chart-window', (event, { ticker, currency }) => {
    const windowKey = `${ticker}-${currency}`;
    const chartWindow = chartWindows[windowKey];
    if (chartWindow) chartWindow.close();
});

// Initializes the application when Electron is ready
app.whenReady().then(createWindow);

// Quits the application when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Recreates the main window if the app is activated and no windows are open
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
