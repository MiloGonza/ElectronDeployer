const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    runCommand: (command) => ipcRenderer.invoke('run-command', command),
    onCommandOutput: (callback) => {
        ipcRenderer.on('command-output', (event, data) => callback(data));
    },
    removeCommandOutputListener: () => {
        ipcRenderer.removeAllListeners('command-output');
    }
});
