import { IpcRenderer } from 'electron';
import { hardStation } from './station';
import { hardPlaylist as hardPlaylistType, playlist } from './playlists';
import { stationsLoadOptions } from './core';
import { appendMode } from './diffuser';

export const importFile = (filePath: string, fileType: 'css' | 'js') => {};
export const parseAuthors = (station: hardStation) => [''];
export const popup = (station: hardStation) => {};
export const unpopup = () => {};
export const loadStations = (options: stationsLoadOptions) => {};
export const loadSearch = () => {};
export const loadMain = (stations: hardStation[]) => {};
export const getPlaylists = () => [] as playlist[];
export const hardPlaylist = (playlist: playlist) => ({}) as hardPlaylistType;
export const savePlaylist = (playlist: hardPlaylistType) => ({}) as playlist;
export const loadPlaylists = () => {};
export const checkKey = (name: string, key: string) => {};
export const createPlaylist = (name: string) => '' as 'already exists' | 'ok';
export const blacker = (action: 'enable' | 'disable') => {};
export const confirmation = (
	title: string,
	message: string,
): Promise<boolean> => new Promise(() => {});
export const deleteList = (name: string): 'dont exists' | 'ok' => 'ok';
export const addToPlaylist = (station: hardStation) => {};
export const appendList = (
	playlist: hardPlaylistType,
	station: hardStation,
) => {};
export class Diffuser {
	constructor() {}

	public render() {}
	public play(url: string, appendMode?: appendMode) {}
	public pause() {
		return true as boolean | void
	}
	public resume() {
		return false as boolean | void
	}
	public skip() {}

	public get playing() {
		return true as boolean
	}
	public get idle() {
		return true as boolean
	}
	public setVolume(value: number) {}
	public get current(){
		return 0
	}
	public get duration() {return 0}
	public get url() {
		return ''
	}
	public get station() {
		return null as hardStation
	}
	public appendQueue(url: string) {}
	public shuffleQueue() {}
}
export const loadPlayingControler = (container: HTMLElement) => {}
export const reloadCurrent = () => {}
export const shuffle = <T>(a: T[]): T[] => [] as T[]
export const popList = (list: hardPlaylistType, station: hardStation | string): 'dont exists' | 'ok' => 'ok';