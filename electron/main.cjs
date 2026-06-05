const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { spawn } = require('child_process');
const fs = require('fs');
const isDev = require('electron-is-dev');
const path = require('path');

let mainWindow;
let terminalProcess = null;

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

const startPersistentTerminal = (cwd) => {
	if (terminalProcess) {
		console.log("Ya existe terminal");
		return terminalProcess;
	}

	console.log(
		'CREANDO TERMINAL EN:',
		cwd
	);

	const shell =
		process.platform === "win32"
			? "cmd.exe"
			: "/bin/bash";

	terminalProcess = spawn(
		shell,
		process.platform === "win32" ? [] : ["-i"],
		{
			cwd,
			env: process.env,
		}
	);

	console.log("PID:", terminalProcess.pid);

	// AQUÍ SÍ EXISTE terminalProcess
	terminalProcess.stdin.write(
		'echo TERMINAL_FUNCIONA\n'
	);

	terminalProcess.stdout.on("data", (data) => {
		console.log("STDOUT:", data.toString());

		if (mainWindow) {
			mainWindow.webContents.send(
				"command-output",
				data.toString()
			);
		}
	});

	terminalProcess.stderr.on("data", (data) => {
		console.log("STDERR:", data.toString());

		if (mainWindow) {
			mainWindow.webContents.send(
				"command-output",
				data.toString()
			);
		}
	});

	terminalProcess.on("close", (code) => {
		console.log("TERMINAL CLOSED:", code);
		terminalProcess = null;
	});

	terminalProcess.on("error", (err) => {
		console.error("TERMINAL ERROR:", err);
	});

	return terminalProcess;
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

// ipcMain.handle('run-command', (event, payload) => {
// 	// Acepta tanto un string (compatibilidad) como un objeto { command, cwd }
// 	const command = typeof payload === 'string' ? payload : payload?.command;
// 	const cwd = typeof payload === 'object' ? payload?.cwd : undefined;

// 	return new Promise((resolve, reject) => {
// 		const finalCommand = adaptCommand(command);

// 		const shell = process.platform === 'win32' ? 'cmd.exe' : '/bin/bash';
// 		const args = process.platform === 'win32' ? ['/c', finalCommand] : ['-c', finalCommand];

// 		const spawnOptions = {};
// 		if (cwd) spawnOptions.cwd = cwd;

// 		const proc = spawn(shell, args, spawnOptions);

// 		let output = '';

// 		proc.stdout.on('data', (data) => {
// 			const chunk = data.toString();
// 			output += chunk;
// 			event.sender.send('command-output', chunk);
// 		});

// 		proc.stderr.on('data', (data) => {
// 			const chunk = data.toString();
// 			output += chunk;
// 			event.sender.send('command-output', chunk);
// 		});

// 		proc.on('close', (code) => {
// 			event.sender.send('command-output', `\n[Proceso finalizado con código: ${code}]\n`);
// 			resolve(output);
// 		});

// 		proc.on('error', (error) => {
// 			event.sender.send('command-output', `Error: ${error.message}\n`);
// 			reject(error);
// 		});
// 	});
// });

// ipcMain.handle('start-terminal', (_event, cwd) => {
// 	startPersistentTerminal(cwd);
// 	return true;
// });

ipcMain.handle('start-terminal', (_event, cwd) => {
	console.log(
		'START-TERMINAL RECIBIDO:',
		cwd
	);

	startPersistentTerminal(cwd);

	return true;
});

const SENTINEL_PREFIX = "__ELECTRON_SENTINEL_";
const SENTINEL_SUFFIX = "__";

const runCommandInTerminal = (event, payload) => {
	return new Promise((resolve) => {
		if (!terminalProcess) {
			resolve({ ok: false, exitCode: -1, error: "Terminal no iniciada" });
			return;
		}

		const command = payload?.command;
		const cwd = payload?.cwd;

		if (!command) {
			resolve({ ok: false, exitCode: -1, error: "Comando vacío" });
			return;
		}

		let finalCommand = adaptCommand(command);

		if (cwd) {
			if (process.platform === "win32") {
				finalCommand = `cd /d "${cwd}" && ${finalCommand}`;
			} else {
				finalCommand = `cd "${cwd}" && ${finalCommand}`;
			}
		}

		const sentinelId = Date.now() + "_" + Math.floor(Math.random() * 1e6);
		const sentinel = `${SENTINEL_PREFIX}${sentinelId}${SENTINEL_SUFFIX}`;
		const sentinelled = `${finalCommand}\necho ${sentinel}$?\n`;

		const onData = (data) => {
			const chunk = data.toString();
			event.sender.send("command-output", chunk);

			const match = chunk.match(
				new RegExp(`${SENTINEL_PREFIX}(\\d+_\\d+)${SENTINEL_SUFFIX}(\\d+)`)
			);
			if (match && match[1] === String(sentinelId)) {
				cleanup();
				const exitCode = parseInt(match[2], 10);
				resolve({ ok: exitCode === 0, exitCode });
			}
		};

		const onError = (data) => {
			event.sender.send("command-output", data.toString());
		};

		const onClose = (code) => {
			cleanup();
			resolve({ ok: code === 0, exitCode: code });
		};

		const cleanup = () => {
			terminalProcess.stdout.removeListener("data", onData);
			terminalProcess.stderr.removeListener("data", onError);
			terminalProcess.removeListener("close", onClose);
			clearTimeout(timeoutHandle);
		};

		terminalProcess.stdout.on("data", onData);
		terminalProcess.stderr.on("data", onError);
		terminalProcess.on("close", onClose);

		// Timeout para comandos de larga duración (ej. runserver):
		// si tras 2s el proceso sigue vivo y no se imprimió el sentinel
		// (porque nunca va a imprimirse), asumimos que arrancó OK.
		const timeoutHandle = setTimeout(() => {
			cleanup();
			resolve({ ok: true, exitCode: 0, assumed: true });
		}, 2000);

		terminalProcess.stdin.write(sentinelled);
	});
};

ipcMain.handle(
	"run-command",
	(event, payload) => runCommandInTerminal(event, payload)
);

ipcMain.handle('stop-terminal', () => {
	if (terminalProcess) {
		terminalProcess.kill();
		terminalProcess = null;
	}

	return true;
});

ipcMain.handle('get-python-version', async (_event, envPath) => {
	try {
		if (!envPath) {
			throw new Error('No se proporcionó la ruta del entorno');
		}

		const pythonPath =
			process.platform === 'win32'
				? path.join(envPath, 'Scripts', 'python.exe')
				: path.join(envPath, 'bin', 'python');

		return await new Promise((resolve, reject) => {
			const proc = spawn(pythonPath, ['--version']);

			let output = '';

			proc.stdout.on('data', (data) => {
				output += data.toString();
			});

			proc.stderr.on('data', (data) => {
				output += data.toString();
			});

			proc.on('close', (code) => {
				if (code !== 0) {
					reject(new Error(output));
					return;
				}

				resolve(output.trim());
			});

			proc.on('error', (err) => {
				reject(err);
			});
		});
	} catch (err) {
		console.error(err);
		return null;
	}
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