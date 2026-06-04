const { contextBridge, ipcRenderer } = require('electron');

console.log('preload cargado');

contextBridge.exposeInMainWorld('electronAPI', {
    selectFolder: (options) => ipcRenderer.invoke('select-folder', options),
    runCommand: (payload) => ipcRenderer.invoke('run-command', payload),
    getPlatform: () => ipcRenderer.invoke('get-platform'),
    getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
    getLastProject: () => ipcRenderer.invoke('get-last-project'),
    saveLastProject: (rutaProyecto) => ipcRenderer.invoke('save-last-project', rutaProyecto),
    clearLastProject: () => ipcRenderer.invoke('clear-last-project'),
    onCommandOutput: (callback) => {
        ipcRenderer.on('command-output', (event, data) => callback(data));
    },
    removeCommandOutputListener: () => {
        ipcRenderer.removeAllListeners('command-output');
    },
});