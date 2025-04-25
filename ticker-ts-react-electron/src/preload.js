const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Removed fetchHistoricalData as it is no longer needed
});
