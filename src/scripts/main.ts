import { hardStation } from '../types/station';

const shuffle = <T = any>(array: T[]): T[] => {
	return array
		.map((x) => [x, Math.random()])
		.sort((a, b) => (b[1] as number) - (a[1] as number))
		.map((x) => x[0] as T);
};
const callback = (stations: hardStation[]) => {
	const container = document.getElementById('container');

	shuffle(stations.filter((x) => x.type === 'playlist')).forEach(
		(station) => {
			const div = document.createElement('div');
			div.classList.add('song');

			div.style.backgroundImage = `url('${station.img}')`;

			const title = `${station.title.replace(
				' (',
				` ${station.emoji} (`,
			)}`;
			const titleP = document.createElement('p');
			titleP.innerText = title;

			div.appendChild(titleP);

			const shadower = document.createElement('div');
			shadower.classList.add('shadower');

			const maxLine = 75;
			shadower.style.width = `${
				Math.min(maxLine, title.length) * 7 + 40
			}px`;
			const lines = Math.ceil(title.length / maxLine);
			shadower.style.height = `${
				lines * 35
			}px`;
			shadower.style.marginTop = `${(lines - 1) * -2 - 8}%`

			div.appendChild(shadower);
			container.appendChild(div);
		},
	);
};

eval(`import('../assets/configs.json', {
    assert: {
        type: "json"
    }
}).then((res) => {
    callback(res.default.stations);
})`);
