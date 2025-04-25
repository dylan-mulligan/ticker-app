const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    fetchHistoricalData: (ticker, days, currency) =>
        ipcRenderer.invoke('fetch-historical-data', { ticker, days, currency })
});

