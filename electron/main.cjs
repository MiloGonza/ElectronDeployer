const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { spawn } = require('child_process');
const isDev = require('electron-is-dev');
const path = require('path');

let mainWindow;

// Adaptar comandos según el SO
const adaptCommand = (command) => {
  if (process.platform !== 'win32') {
    // Linux/Mac: convertir rutas Windows a rutas Unix
    return command
      .replace(/\\/g, '/')  // \ a /
      .replace(/env\/Scripts\//g, 'env/bin/')
      .replace(/env\\Scripts\\/g, 'env/bin/')
      .replace(/\.bat$/gi, '')
      .replace(/\.exe$/gi, '')
      .replace(/cmd\.exe/gi, '/bin/bash');
  }
  return command;
};

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../../dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// IPC Handler para ejecutar comandos
ipcMain.handle('run-command', (event, command) => {
  return new Promise((resolve, reject) => {
    // Adaptar comando según el SO
    command = adaptCommand(command);
    const shell = process.platform === 'win32' ? 'cmd.exe' : '/bin/bash';
    const proc = spawn(shell, process.platform === 'win32' ? ['/c', command] : ['-c', command]);

    let output = '';

    proc.stdout.on('data', (data) => {
      const chunk = data.toString();
      output += chunk;
      event.sender.send('command-output', chunk);
    });

    proc.stderr.on('data', (data) => {
      const chunk = data.toString();
      output += chunk;
      event.sender.send('command-output', chunk);
    });

    proc.on('close', (code) => {
      event.sender.send('command-output', `\n[Proceso finalizado con código: ${code}]\n`);
      resolve(output);
    });

    proc.on('error', (error) => {
      event.sender.send('command-output', `Error: ${error.message}\n`);
      reject(error);
    });
  });
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle('run-command', (event, command) => {
  const shell = process.platform === 'win32' ? 'cmd.exe' : '/bin/bash';
  const proc = spawn(shell, [], { shell: true });

  proc.stdout.on('data', data => {
    event.sender.send('command-output', data.toString());
  });

  proc.stderr.on('data', data => {
    event.sender.send('command-output', data.toString());
  });

  proc.stdin.write(`${command}\n`);
  return true;
});
