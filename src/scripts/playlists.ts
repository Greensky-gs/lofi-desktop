import { hardStation } from '../types/station';
import { hardPlaylist as hardPlaylistType, playlist } from '../types/playlists';

const getPlaylists = () => {
	const keys = JSON.parse(
		localStorage.getItem('playlist_keys') ?? '{}',
	) as Record<string, string>;
	const playlists = Object.entries(keys).map(([n, k]) => ({
		name: n,
		stations: JSON.parse(localStorage.getItem(k) ?? '[]') as string[],
		key: k,
	})) as playlist[];

	return playlists;
};
const hardPlaylist = (playlist: playlist): hardPlaylistType => {
	return {
		...playlist,
		stations: playlist.stations.map((x) =>
			window.stations.find(
				(y) => y.url === `https://www.youtube.com/watch?v=${x}`,
			),
		),
	};
};
const savePlaylist = (playlist: hardPlaylistType): playlist => {
	const saved = {
		name: playlist.name,
		stations: playlist.stations.map((x) => x.url.split('v=')[1]),
		key: playlist.key,
	};

	checkKey(playlist.name, playlist.key);
	localStorage.setItem(playlist.key, JSON.stringify(saved.stations));

	return saved;
};
const checkKey = (name: string, key: string) => {
	const keys = JSON.parse(
		localStorage.getItem('playlist_keys') ?? '{}',
	) as Record<string, string>;
	if (!keys[name] || keys[name] !== key) {
		keys[name] = key;
		localStorage.setItem('playlist_keys', JSON.stringify(keys));
	}
};
const createPlaylist = (name: string) => {
	const keys = JSON.parse(
		localStorage.getItem('playlist_keys') ?? '{}',
	) as Record<string, string>;
	if (keys[name]) return 'already exists';

	const key = crypto.randomUUID();
	checkKey(name, key);

	localStorage.setItem(key, '[]');

	return 'ok';
};
const deleteList = (name: string) => {
	const keys = JSON.parse(
		localStorage.getItem('playlist_keys') ?? '{}',
	) as Record<string, string>;
	if (!keys[name]) return 'dont exists';

	const ref = keys[name];

	delete keys[name];
	localStorage.removeItem(ref);

	localStorage.setItem('playlist_keys', JSON.stringify(keys));

	return 'ok';
};
const appendList = (list: hardPlaylistType, station: hardStation) => {
	list.stations.push(station);
	savePlaylist(list);
};
const popList = (list: hardPlaylistType, station: hardStation | string) => {
	const st = typeof station === 'string' ? window.stations.find(x => x.url === station || x.downloadURL === station) : station
	if (!st) return

	if (!list.stations.find(x => x.url === st.url)) return 'dont exists'
	list.stations = list.stations.filter(x => x.url !== st.url)

	savePlaylist(list)
	return 'ok'
}
const getSystemList = (): hardPlaylistType => {
	const datas = JSON.parse(localStorage.getItem('system_pl') ?? '[]')

	return {
		name: 'system',
		key: 'system_pl',
		stations: datas.map((x: string) =>
			window.stations.find(
				(y) => y.url === `https://www.youtube.com/watch?v=${x}`,
			),
		),
	};
}
const appendSystemList = (cached: hardPlaylistType, station: hardStation) => {
	const url = station.url

	const test = cached.stations.find(x => x.url === url);
	if (!!test) {
		cached.stations = [station, ...cached.stations.filter(x => x.url !== url)]
	} else {
		cached.stations = [station, ...cached.stations]
	}

	const saved = cached.stations.map((x) => x.url.split('v=')[1]);
	localStorage.setItem('system_pl', JSON.stringify(saved))
}