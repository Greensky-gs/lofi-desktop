import { IpcRenderer } from 'electron';
import { hardStation } from './station';

export const importFile = (filePath: string, fileType: 'css' | 'js') => {};
export const parseAuthors = (station: hardStation) => [''];
export const popup = (station: hardStation) => {};
export const unpopup = () => {};
export const loadStations = (
	stations: hardStation[],
	container: HTMLElement,
) => {};
export const loadSearch = () => {};
export const loadMain = (stations: hardStation[]) => {};
