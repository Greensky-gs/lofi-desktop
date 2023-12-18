import { hardPlaylist as hardPlaylistType } from '../types/playlists';
import {
	confirmation,
	createPlaylist,
	deleteList,
	getPlaylists,
	hardPlaylist,
	importFile,
	popup,
} from '../types/definitions';
import { hardStation } from '../types/station';
import { stationsLoadOptions } from '../types/core';

const loadSearch = () => {
	const container = document.getElementById('container');
	Array.from(container.childNodes).map((x) => x.remove());
	container.classList.remove('stations_container');

	const sp = document.createElement('div');
	sp.style.height = '8vh';

	const img = document.createElement('img');
	img.classList.add('search_img');

	const stationsContainer = document.createElement('div');
	stationsContainer.classList.add('stations_container');

	const searchInput = document.createElement('input');
	searchInput.type = 'text';
	searchInput.classList.add('search_input');
	searchInput.placeholder = 'Entrez un nom';

	container.append(img, searchInput, sp, stationsContainer);

	const loadEvent = () => {
		searchInput.addEventListener('input', () => {
			const search = searchInput.value?.toLowerCase();
			const t = (x: hardStation) => x.title.split('(')[0];
			const b = (x: hardStation) =>
				(
					x.title.split('(')[1].split('/')[1] ?? x.title.split('(')[1]
				).replace(')', '');
			const validated = window.stations.filter(
				(x) =>
					t(x).toLowerCase().includes(search) ||
					search?.includes(t(x).toLowerCase()) ||
					b(x).includes(search),
			);

			loadStations({
				stations: validated,
				container: stationsContainer,
				containerClass: 'stations_container',
				useDefaultButtons: true,
				buttons: [],
			});
		});
	};

	loadStations({
		stations: window.stations,
		container: stationsContainer,
		containerClass: 'stations_container',
		useDefaultButtons: true,
		buttons: [],
	});
	loadEvent();
};
const loadMain = (stations: hardStation[]) => {
	const container = document.getElementById('container');
	Array.from(container.childNodes).map((x) => x.remove());

	loadStations({
		container: container,
		containerClass: 'stations_container',
		stations: stations,
		buttons: [],
		useDefaultButtons: true,
	});
};
const loadPlaylists = () => {
	const defaultImg = window.stations[window.stations.length - 1].img;

	const container = document.getElementById('container');
	Array.from(container.childNodes).map((x) => x.remove());
	container.classList.remove('stations_container');

	const playlists = getPlaylists();
	const playlistsContainer = document.createElement('div');
	playlistsContainer.classList.add('playlists_container');

	playlists.map(hardPlaylist).forEach((playlist) => {
		const div = document.createElement('div');
		div.classList.add('playlist');
		div.style.backgroundImage = `url('${
			playlist.stations[0]?.img ?? defaultImg
		}')`;

		const title = document.createElement('p');
		title.classList.add('playlist_name');
		title.innerText = playlist.name;

		div.appendChild(title);

		div.onclick = () => loadPlaylist(playlist);
		playlistsContainer.appendChild(div);
	});
	if (playlists.length % 2 === 1) {
		const pseudo = document.createElement('div');
		pseudo.classList.add('playlist');
		pseudo.style.opacity = '0';

		playlistsContainer.appendChild(pseudo);
	}

	const img = document.createElement('img');
	img.classList.add('playlist_create', 'clickable');

	img.onclick = () => loadCreatePlaylist();

	container.appendChild(img);
	container.appendChild(playlistsContainer);
};
const loadStations = ({
	container,
	stations,
	buttons,
	...options
}: stationsLoadOptions) => {
	if (options?.containerClass)
		container.classList.add(options?.containerClass);
	Array.from(container.childNodes).map((x) => x.remove());

	stations.forEach((station) => {
		const div = document.createElement('div');
		div.classList.add('song');

		div.style.backgroundImage = `url('${station.img}')`;

		const title = `${station.title.replace(' (', ` ${station.emoji} (`)}`;
		const titleP = document.createElement('p');
		titleP.innerText = title;

		div.appendChild(titleP);

		const shadower = document.createElement('div');
		shadower.classList.add('shadower');

		const maxLine = 75;
		shadower.style.width = `${Math.min(maxLine, title.length) * 7 + 40}px`;
		const lines = Math.ceil(title.length / maxLine);
		shadower.style.height = `${lines * 35}px`;
		shadower.style.marginTop = `${(lines - 1) * -2 - 8}%`;

		div.appendChild(shadower);

		const btnContainer = document.createElement('div');
		btnContainer.classList.add('song_btn_container');

		if (options?.useDefaultButtons === true)
			buttons = [
				{
					classes: ['play_btn', 'clickable'],
				},
				{
					classes: ['add_pl_btn', 'clickable'],
				},
			];
		buttons.forEach((btn) => {
			const el = document.createElement('img');
			el.classList.add(...btn.classes);

			if (!!btn.onclick) el.onclick = () => btn.onclick(station);

			btnContainer.appendChild(el);
		});
		div.appendChild(btnContainer);

		div.onclick = () => popup(station);
		container.appendChild(div);
	});

	return container;
};
const loadCreatePlaylist = (message?: string) => {
	const container = document.getElementById('container');
	Array.from(container.childNodes).map((x) => x.remove());

	container.classList.remove('stations_container');

	const back = document.createElement('img');
	back.classList.add('clickable', 'back_btn');
	back.onclick = () => loadPlaylists();

	container.appendChild(back);

	const creation = document.createElement('div');
	creation.classList.add('create_playlist');

	const input = document.createElement('input');
	input.classList.add('create_input');

	const btn = document.createElement('button');
	btn.classList.add('create_button', 'clickable');

	btn.appendChild(document.createTextNode('Créer'));

	btn.onclick = () => {
		const val = (
			document.getElementsByClassName(
				'create_input',
			)[0] as HTMLInputElement
		)?.value;
		if (!val) return loadCreatePlaylist('Veuillez spécifier un nom valide');

		const res = createPlaylist(val);

		if (res === 'already exists')
			return loadCreatePlaylist('Cette playlist existe déjà');
		loadPlaylists();
	};

	if (!!message) {
		const p = document.createElement('p');
		p.classList.add('create_message');
		p.innerText = message;

		creation.appendChild(p);
	}

	creation.append(input, btn);
	container.appendChild(creation);
};
const loadPlaylist = (playlist: hardPlaylistType) => {
	const container = document.getElementById('container');
	Array.from(container.childNodes).map((x) => x.remove());

	const title = document.createElement('p');
	title.classList.add('playlist_title');
	title.innerText = playlist.name;

	const buttons = document.createElement('div');
	buttons.classList.add('playlist_title_buttons');
	(
		[
			['pen', () => {}],
			[
				'bin',
				async () => {
					const rep = await confirmation(
						'Suppression',
						`Êtes-vous sûr de vouloir supprimer ${playlist.name} ?`,
					);
					if (rep) {
						deleteList(playlist.name);
						loadPlaylists();
					}
				},
			],
		] as [string, Function][]
	).forEach(([path, onclick]) => {
		const el = document.createElement('img');
		el.classList.add('clickable');
		el.src = `../assets/${path}.png`;
		el.onclick = () => onclick();

		buttons.appendChild(el);
	});

	const titleDiv = document.createElement('div');
	titleDiv.classList.add('playlist_title_section');
	titleDiv.append(title, buttons);

	const songs = document.createElement('div');
	loadStations({
		container: songs,
		stations: playlist.stations,
		containerClass: 'playlist_songs_container',
		buttons: [
			{ classes: ['play_btn', 'clickable'] },
			{ classes: ['remove_pl_btn', 'clickable'] },
		],
	});

	const back = document.createElement('img');
	back.classList.add('clickable', 'back_btn');
	back.onclick = () => loadPlaylists();

	container.append(back, titleDiv, songs);
};
