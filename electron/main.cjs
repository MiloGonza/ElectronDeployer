const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { spawn } = require('child_process');
const fs = require('fs');
const isDev = require('electron-is-dev');
const path = require('path');

let mainWindow;

const STATE_FILE = () => path.join(app.getPath('userData'), 'last-project.json');

const readState = () => {
  try {
    const raw = fs.readFileSync(STATE_FILE(), 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed.rutaProyecto === 'string' ? parsed : null;
  } catch {
    return null;
  }
};

const writeState = (state) => {
  try {
    fs.mkdirSync(path.dirname(STATE_FILE()), { recursive: true });
    fs.writeFileSync(STATE_FILE(), JSON.stringify(state, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('No se pudo guardar el estado:', err);
    return false;
  }
};

const adaptCommand = (command) => {
  if (process.platform !== 'win32') {
    return command
      .replace(/\\/g, '/')
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
      preload: path.join(__dirname, 'preload.cjs'),
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

ipcMain.handle('get-platform', () => {
  return process.platform;
});

ipcMain.handle('get-system-info', () => {
  return {
    platform: process.platform,
    arch: process.arch,
    isWindows: process.platform === 'win32',
    isLinux: process.platform === 'linux',
    isMac: process.platform === 'darwin',
  };
});

ipcMain.handle('select-folder', async (_event, options = {}) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: options.title || 'Seleccionar carpeta',
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

ipcMain.handle('get-last-project', () => {
  return readState();
});

ipcMain.handle('clear-last-project', () => {
  try {
    fs.unlinkSync(STATE_FILE());
    return true;
  } catch {
    return false;
  }
});

ipcMain.handle('save-last-project', (_event, rutaProyecto) => {
  if (typeof rutaProyecto !== 'string' || !rutaProyecto) return false;
  return writeState({ rutaProyecto });
});

ipcMain.handle('run-command', (event, payload) => {
  // Acepta tanto un string (compatibilidad) como un objeto { command, cwd }
  const command = typeof payload === 'string' ? payload : payload?.command;
  const cwd = typeof payload === 'object' ? payload?.cwd : undefined;

  return new Promise((resolve, reject) => {
    const finalCommand = adaptCommand(command);

    const shell = process.platform === 'win32' ? 'cmd.exe' : '/bin/bash';
    const args = process.platform === 'win32' ? ['/c', finalCommand] : ['-c', finalCommand];

    const spawnOptions = {};
    if (cwd) spawnOptions.cwd = cwd;

    const proc = spawn(shell, args, spawnOptions);

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