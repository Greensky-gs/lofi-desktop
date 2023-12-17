import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
	ipcRenderer: {
		on: (channel: any, func: any) => ipcRenderer.on(channel, func),
	},
});
