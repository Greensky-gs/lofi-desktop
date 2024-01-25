import { hardPlaylist as hardPlaylistType } from '../types/playlists';
import {
	appendList,
	confirmation,
	createPlaylist,
	deleteList,
	getPlaylists,
	getSystemList,
	hardPlaylist,
	importFile,
	popList,
	popup,
	renamePlaylist,
	shuffle,
} from '../types/definitions';
import { hardStation } from '../types/station';
import { createPlaylistOptions, stationsLoadOptions } from '../types/core';

const loadSearch = () => {
	const container = document.getElementById('container');
	Array.from(container.childNodes).map((x) => x.remove());
	clearContainer(container);

	setId('ls');
	resetGetter();

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
const loadMain = () => {
	const container = document.getElementById('container');
	Array.from(container.childNodes).map((x) => x.remove());
	clearContainer(container);

	setId('lm');
	resetGetter();

	if (!window.diffuser.idle) {
		const controlerContainer = document.createElement('div');
		controlerContainer.classList.add('controler_container');

		container.appendChild(controlerContainer);
		loadPlayingControler(controlerContainer);
	}

	const p = document.createElement('p');
	p.innerText = 'Récents';
	p.classList.add('recents');

	container.append(p);

	const stationsContainer = (() => {
		const d = document.createElement('div');
		container.append(d);

		return d;
	})();

	loadStations({
		container: stationsContainer,
		containerClass: 'stations_container',
		stations: getSystemList().stations,
		buttons: [],
		useDefaultButtons: true,
	});
};
const loadPlaylists = () => {
	const defaultImg = window.stations[window.stations.length - 1].img;
	setId('lps');
	resetGetter();

	const container = document.getElementById('container');
	Array.from(container.childNodes).map((x) => x.remove());
	clearContainer(container);

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

		const buttons = document.createElement('div');
		buttons.classList.add('playlist_buttons');

		buttons.append(
			...(
				[
					[
						'play_icon',
						(playlist) => {
							window.diffuser.play(
								playlist.stations[0].downloadURL,
							);
							playlist.stations.slice(1).forEach((st) => {
								window.diffuser.appendQueue(st.downloadURL);
							});
						},
					],
					[
						'shuffle',
						(playlist) => {
							const shuffled = shuffle(
								playlist.stations.map((x) => x.downloadURL),
							);
							window.diffuser.play(shuffled[0]);

							shuffled.slice(1).forEach((x) => {
								window.diffuser.appendQueue(x);
							});
						},
					],
				] as [string, (playlist: hardPlaylistType) => unknown][]
			).map(([icon, onclick]) => {
				const btn = document.createElement('img');
				btn.src = `../assets/${icon}.png`;

				if (!playlist.stations.length) {
					btn.style.opacity = '0.5';
				} else {
					btn.classList.add('clickable');
					btn.onclick = (ev) => {
						ev.stopPropagation();
						onclick(playlist);
						loadMain();
					};
				}

				return btn;
			}),
		);

		div.append(title, buttons);

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

	img.onclick = () =>
		loadCreatePlaylist({
			action: 'create',
		});

	container.appendChild(img);
	container.appendChild(playlistsContainer);
};
const loadStations = ({
	container,
	stations,
	buttons,
	...options
}: stationsLoadOptions) => {
	clearContainer(container);
	if (options?.containerClass)
		container.classList.add(options?.containerClass);
	Array.from(container.childNodes).map((x) => x.remove());

	stations.forEach((station) => {
		const div = document.createElement('div');
		div.classList.add('song');
		div.onclick = () => popup(station);

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
					onclick: () => {
						window.diffuser.play(station.downloadURL);
						loadMain();
					},
				},
				{
					classes: ['add_pl_btn', 'clickable'],
					onclick: () => addToPlaylist(station),
				},
			];
		buttons.forEach((btn) => {
			const el = document.createElement('img');
			el.classList.add(...btn.classes);

			if (!!btn.onclick)
				el.onclick = (event) => {
					event.stopPropagation();
					btn.onclick(station);
				};

			btnContainer.appendChild(el);
		});
		div.appendChild(btnContainer);

		container.appendChild(div);
	});

	return container;
};
const loadCreatePlaylist = ({
	action,
	playlist,
	message,
}: createPlaylistOptions) => {
	setId(`lcp-${action}`);
	setMetaGetter(() => {
		if (!playlist) return null;

		const soft = getPlaylists().find((x) => x.key === playlist.key);
		if (!soft) return 'invalid';

		return hardPlaylist(soft);
	});
	const container = document.getElementById('container');
	Array.from(container.childNodes).map((x) => x.remove());
	clearContainer(container);

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

	btn.appendChild(
		document.createTextNode(action === 'create' ? 'Créer' : 'Renommer'),
	);

	btn.onclick = () => {
		const val = (
			document.getElementsByClassName(
				'create_input',
			)[0] as HTMLInputElement
		)?.value;
		if (!val)
			return loadCreatePlaylist({
				message: 'Veuillez spécifier un nom valide',
				action,
				playlist,
			});

		const res =
			action === 'create'
				? createPlaylist(val)
				: renamePlaylist(playlist, val);

		if (res === 'already exists' || res === 'exists')
			return loadCreatePlaylist({
				message: 'Cette playlist existe déjà',
				action,
				playlist,
			});
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
	clearContainer(container);

	setId('lpl');
	setMetaGetter(() => {
		const soft = getPlaylists().find((x) => x.key === playlist.key);
		if (!soft) return 'invalid';

		return hardPlaylist(soft);
	});

	const title = document.createElement('p');
	title.classList.add('playlist_title');
	title.innerText = playlist.name;

	const buttons = document.createElement('div');
	buttons.classList.add('playlist_title_buttons');
	(
		[
			[
				'pen',
				() => {
					loadCreatePlaylist({
						action: 'rename',
						playlist,
					});
				},
			],
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
			{
				classes: ['play_btn', 'clickable'],
				onclick: (station) => {
					window.diffuser.play(station.downloadURL);
					loadMain();
				},
			},
			{
				classes: ['remove_pl_btn', 'clickable'],
				onclick: async (station) => {
					const valid = await confirmation(
						'Retrait',
						`Êtes-vous sûr de vouloir retirer ${station.title} de votre playlist ?`,
					);
					if (valid) {
						popList(playlist, station.url);
						loadPlaylist(playlist);
					}
				},
			},
		],
	});

	const back = document.createElement('img');
	back.classList.add('clickable', 'back_btn');
	back.onclick = () => loadPlaylists();

	container.append(back, titleDiv, songs);
};
const clearContainer = (c: HTMLElement) =>
	c.classList.forEach((x) => c.classList.remove(x));
const addToPlaylist = (station: hardStation) => {
	const container = document.getElementById('container');
	Array.from(container.childNodes).map((x) => x.remove());
	clearContainer(container);
	container.classList.add('add_pl_container');

	setId('atp');
	setMetaGetter(() => window.stations.find((x) => x.url === station.url));

	const title = document.createElement('p');
	title.innerText = 'Ajouter à une playlist';
	title.classList.add('add_to_pl_title');

	const playlists = getPlaylists().map(hardPlaylist);

	const choice = document.createElement('select');
	playlists
		.filter((x) => !x.stations.some((y) => y.url === station.url))
		.map((x) => {
			const opt = document.createElement('option');
			opt.text = x.name;
			opt.value = x.name;

			choice.options.add(opt);
		});
	choice.classList.add('add_to_pl_selector');

	const button = document.createElement('button');
	button.classList.add('add_pl_button');
	button.append(document.createTextNode('Ajouter'));

	button.onclick = () => {
		const plName = choice.value;
		const playlist = playlists.find((x) => x.name === plName);

		appendList(playlist, station);
		loadPlaylist(playlist);
	};

	container.append(title, choice, button);
};
const loadPlayingControler = (container: HTMLElement) => {
	if (window.diffuser.idle) return;
	clearContainer(container);
	const station = window.diffuser.station;

	const controler = document.createElement('div');
	controler.classList.add('controler');
	const title = document.createElement('p');
	title.innerText = station.title;

	const btns = document.createElement('div');
	btns.classList.add('controler_buttons');

	const p = document.createElement('img');
	p.src = `../assets/${
		window.diffuser.playing ? 'pause_icon' : 'play_icon'
	}.png`;
	const n = document.createElement('img');
	n.src = '../assets/next_icon.png';

	p.onclick = (ev) => {
		if (window.diffuser.playing) window.diffuser.pause();
		else window.diffuser.resume();
		
		ev.stopPropagation()
		reloadCurrent();
	};
	n.onclick = (ev) => {
		ev.stopPropagation()
		window.diffuser.skip();
	};
	[p, n].forEach((x) => x.classList.add('clickable'));

	btns.append(p, n);

	const left = document.createElement('div');
	const right = document.createElement('div');

	left.classList.add('ctrl_left');
	right.classList.add('ctrl_right');

	left.style.backgroundImage = `url('${station.img}')`;
	right.append(title, btns);

	controler.append(left, right);
	controler.onclick = () => popup(window.diffuser.station)
	container.append(controler);
};

const setId = (id: string) => {
	document.getElementsByTagName('body')[0].setAttribute('current_page', id);
};
const setMetaGetter = (getter: () => unknown) => (window.metaGetter = getter);
const resetGetter = (): void => (window.metaGetter = null);
const reloadCurrent = () => {
	const id = document
		.getElementsByTagName('body')[0]
		.getAttribute('current_page');

	const meta = !!window.metaGetter ? window.metaGetter() : null;
	const table = {
		ls: (meta?: unknown) => loadSearch(),
		lm: (meta?: unknown) => loadMain(),
		lps: (meta?: unknown) => loadPlaylists(),
		'lcp-create': (meta?: unknown) =>
			loadCreatePlaylist({ action: 'create' }),
		'lcp-rename': (meta?: unknown) =>
			loadCreatePlaylist({
				action: 'rename',
				playlist: meta as hardPlaylistType,
			}),
		atp: (meta?: unknown) => addToPlaylist(meta as any as hardStation),
		lpl: (meta?: unknown) => loadPlaylist(meta as any as hardPlaylistType),
	};

	if (meta === 'invalid') return table.lm();

	const call = table[id as keyof typeof table];
	if (!!call && !!meta) call(meta);
	if (!!call && !meta) call();
};
