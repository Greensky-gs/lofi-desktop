import { popup, unpopup } from '../types/definitions';
import { hardStation } from '../types/station';

importFile('popup.js', 'js')

const shuffle = <T = any>(array: T[]): T[] => {
	return array
		.map((x) => [x, Math.random()])
		.sort((a, b) => (b[1] as number) - (a[1] as number))
		.map((x) => x[0] as T);
};
const parseAuthors = (station: hardStation) =>
	station.title.split(' - ')[0].split(/ x /);

const loadStations = (stations: hardStation[], container: HTMLElement) => {
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

		const play = document.createElement('img');
		play.classList.add('play_btn', 'clickable');
		const addToPlaylist = document.createElement('img');
		addToPlaylist.classList.add('add_pl_btn', 'clickable');

		btnContainer.appendChild(play);
		btnContainer.appendChild(addToPlaylist);

		div.appendChild(btnContainer);

		div.onclick = () => popup(station);
		container.appendChild(div);
	});
};
const callback = (stations: hardStation[]) => {
	const container = document.getElementById('container');

	document.addEventListener('click', (ev) => {
		const popupContainer = document.getElementsByClassName('popup')[0];
		if (!popupContainer) return;

		const creation = parseInt(popupContainer.getAttribute('creation'));
		const diff = Date.now() - creation;
		if (diff <= 100) return;

		const contains = popupContainer.contains(ev.target as Node);
		if (contains) return;
		unpopup();
	});

	loadStations(
		shuffle(stations.filter((x) => x.type === 'playlist')),
		container,
	);
};

eval(`import('../assets/configs.json', {
    assert: {
        type: "json"
    }
}).then((res) => {
    callback(res.default.stations);
})`);
