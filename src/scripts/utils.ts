import { hardStation } from '../types/station';
import { blacker, popup } from '../types/definitions';

const importFile = (filePath: string, fileType: 'css' | 'js') => {
	const dict: Record<
		typeof fileType,
		{
			pathPrefix: string;
			baliseWebview: keyof HTMLElementTagNameMap;
			baliseSrc: string;
			baliseSpecs: [string, string];
			container: string;
		}
	> = {
		css: {
			pathPrefix: '../styles/',
			baliseWebview: 'link',
			baliseSrc: 'href',
			baliseSpecs: ['rel', 'stylesheet'],
			container: 'head',
		},
		js: {
			pathPrefix: '../scripts/',
			baliseWebview: 'script',
			baliseSrc: 'src',
			baliseSpecs: ['type', 'text/javascript'],
			container: 'html',
		},
	};
	const val = dict[fileType];
	const node = document.createElement(val.baliseWebview);
	const path = val.pathPrefix + filePath;
	node[val.baliseSrc as 'ariaHidden'] = path;
	node[val.baliseSpecs[0] as 'ariaHidden'] = val.baliseSpecs[1];

	const container = document.getElementsByTagName(val.container)[0];
	if (!container) return;

	const included = Array.from(container.childNodes).some(
		(x) => x[val.baliseSrc as keyof typeof x] === path,
	);
	if (included) return;

	container.append(node);
};
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
const confirmation = (title: string, message: string): Promise<boolean> => {
	const start = Date.now()

	return new Promise((resolve) => {
		blacker('enable')
		const element = document.createElement('div')
		element.classList.add('confirm_popup')

		const t = document.createElement('p')
		t.innerText = title
		t.classList.add('confirm_title')

		const m = document.createElement('p')
		m.innerText = message
		m.classList.add('confirm_message')

		const choices = document.createElement('div')
		choices.classList.add('confirm_choices');

		choices.append(...([['Oui', () => end(true), ['confirm_yes', 'clickable', 'confirm_btn']], ['Non', () => end(false), ['confirm_no', 'clickable', 'confirm_btn']]] as [string, () => void, string[]][]).map(([ msg, action, classes ]) => {
			const btn = document.createElement('button')
			btn.classList.add(...classes)
			btn.append(document.createTextNode(msg))

			btn.onclick = () => action()
			return btn
		}))

		element.append(t, m, choices)

		document.getElementById('container').appendChild(element)

		const listenerCallback = (event: MouseEvent) => {
			if (Date.now() - start < 1000) return

			if (!element.contains(event.target as Node)) {
				end(false)
			}
		}
		document.addEventListener('click', listenerCallback)

		const end = (res: boolean) => {
			document.removeEventListener('click', listenerCallback)
			element.remove()
			blacker('disable');
			resolve(res)
		}
	})
}