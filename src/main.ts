// Modules to control application life and create native browser window
import { app, BrowserWindow } from 'electron';
import { config } from 'dotenv'
import { stations } from './cache/stations';
const path = require('path')

config()

function createWindow() {
	// Loading stations
	stations.ready

	const mainWindow = new BrowserWindow({
		show: false,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
		icon: path.join(__dirname, 'assets/lofi_girl_logo.ico'),
	});
	mainWindow.maximize()
	mainWindow.show()
	if (mainWindow.isFullScreenable()) mainWindow.setFullScreen(true)

	mainWindow.loadFile(path.join(__dirname, 'pages/main.html'));

	if (process.argv.includes('--dev')) {
		mainWindow.webContents.openDevTools();
	}
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
