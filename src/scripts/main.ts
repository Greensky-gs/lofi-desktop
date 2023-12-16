import { importFile, loadStations, unpopup } from '../types/definitions';
import { hardStation } from '../types/station';

importFile('popup.js', 'js')
importFile('navs.js', 'js')

const shuffle = <T = any>(array: T[]): T[] => {
	return array
		.map((x) => [x, Math.random()])
		.sort((a, b) => (b[1] as number) - (a[1] as number))
		.map((x) => x[0] as T);
};
const parseAuthors = (station: hardStation) =>
	station.title.split(' - ')[0].split(/ x /);


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
