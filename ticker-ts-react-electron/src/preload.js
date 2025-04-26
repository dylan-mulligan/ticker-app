const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    setAlwaysOnTop: (isAlwaysOnTop) => ipcRenderer.send('set-always-on-top', isAlwaysOnTop),
    setInitialAlwaysOnTop: (isAlwaysOnTop) => ipcRenderer.send('set-initial-always-on-top', isAlwaysOnTop), // New method
    isElectron: true, // Expose a flag to detect Electron environment
});

