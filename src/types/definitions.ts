import { IpcRenderer } from 'electron';
import { hardStation } from './station';
import { hardPlaylist as hardPlaylistType, playlist } from './playlists';
import { stationsLoadOptions } from './core';

export const importFile = (filePath: string, fileType: 'css' | 'js') => {};
export const parseAuthors = (station: hardStation) => [''];
export const popup = (station: hardStation) => {};
export const unpopup = () => {};
export const loadStations = (
	options: stationsLoadOptions
) => {};
export const loadSearch = () => {};
export const loadMain = (stations: hardStation[]) => {};
export const getPlaylists = () => ([] as playlist[])
export const hardPlaylist = (playlist: playlist) => ({} as hardPlaylistType)
export const savePlaylist = (playlist: hardPlaylistType) => ({} as playlist)
export const loadPlaylists = () => {}
export const checkKey = (name: string, key: string) => {}
export const createPlaylist = (name: string) => '' as 'already exists' | 'ok'
export const blacker = (action: 'enable' | 'disable') => {}
export const confirmation = (title: string, message: string): Promise<boolean> => new Promise(() => {})
export const deleteList = (name: string): 'dont exists' | 'ok' => 'ok';