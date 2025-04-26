const { contextBridge, ipcRenderer, remote } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    setAlwaysOnTop: (isAlwaysOnTop) => ipcRenderer.send('set-always-on-top', isAlwaysOnTop),
    setInitialAlwaysOnTop: (isAlwaysOnTop) => ipcRenderer.send('set-initial-always-on-top', isAlwaysOnTop),
    minimizeWindow: () => ipcRenderer.send('minimize-window'),
    maximizeWindow: () => ipcRenderer.send('maximize-window'),
    closeWindow: () => ipcRenderer.send('close-window'),
    openChartWindow: (ticker, currency, chartType) =>
        ipcRenderer.send('open-chart-window', { ticker, currency, chartType }),
    setChartAlwaysOnTop: (ticker, currency, isAlwaysOnTop) =>
        ipcRenderer.send('set-chart-always-on-top', { ticker, currency, isAlwaysOnTop }),
    setChartInitialAlwaysOnTop: (ticker, currency, isAlwaysOnTop) =>
        ipcRenderer.send('set-chart-initial-always-on-top', { ticker, currency, isAlwaysOnTop }),
    closeChartWindow: (ticker, currency) =>
        ipcRenderer.send('close-chart-window', { ticker, currency }),
    isElectron: true,
});
