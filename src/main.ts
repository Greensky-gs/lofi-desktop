// Modules to control application life and create native browser window
import { app, BrowserWindow } from 'electron';
import { config } from 'dotenv';
import { stations } from './cache/stations';
import { wait } from './utils/toolbox';
const path = require('path');

config();

function createWindow() {
	// Loading stations
	stations.ready;

	const mainWindow = new BrowserWindow({
		show: false,
		autoHideMenuBar: true,
		enableLargerThanScreen: true,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
		icon: path.join(__dirname, 'assets/lofi_girl_logo.ico'),
	});
	if (process.argv.includes('--dev')) {
		mainWindow.webContents.openDevTools();
	}

	mainWindow.maximize();
	mainWindow.show();
	if (mainWindow.isFullScreenable()) mainWindow.setFullScreen(true);
	
	const animationMinTime = 2000;
	const animationStart = Date.now()
	mainWindow.loadFile(path.join(__dirname, 'pages/loading.html'));

	stations.onLaunch(async() => {
		const animationEnd = Date.now()
		const diff = animationEnd - animationStart;
		if (diff < animationMinTime) await wait(animationMinTime - diff)

		mainWindow.loadFile(path.join(__dirname, 'pages/main.html'));
	})
}

app.whenReady().then(() => {
	createWindow();

	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit();
});
