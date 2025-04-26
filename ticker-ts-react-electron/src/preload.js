const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    setAlwaysOnTop: (isAlwaysOnTop) => ipcRenderer.send('set-always-on-top', isAlwaysOnTop),
    setInitialAlwaysOnTop: (isAlwaysOnTop) => ipcRenderer.send('set-initial-always-on-top', isAlwaysOnTop),
    minimizeWindow: () => ipcRenderer.send('minimize-window'),
    maximizeWindow: () => ipcRenderer.send('maximize-window'),
    closeWindow: () => ipcRenderer.send('close-window'),
    openChartWindow: (ticker, currency, chartType) =>
        ipcRenderer.send('open-chart-window', { ticker, currency, chartType }),
    isElectron: true,
});
