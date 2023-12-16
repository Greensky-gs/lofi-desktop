import { popup } from "../types/definitions"
import { hardStation } from "../types/station"

const loadSearch = () => {
    const container = document.getElementById('container')
    Array.from(container.childNodes).map(x => x.remove())
    container.classList.remove('stations_container')

    const stationsContainer = document.createElement('div')
    stationsContainer.classList.add('stations_container')

    const searchInput = document.createElement('input')
    searchInput.type = 'text'
    searchInput.classList.add('search_input')

    container.appendChild(searchInput)
    container.appendChild(stationsContainer)
}
const loadMain = (stations: hardStation[]) => {
    const container = document.getElementById('container')
    Array.from(container.childNodes).map(x => x.remove())
    
    loadStations(stations, container)
}
const loadStations = (stations: hardStation[], container: HTMLElement) => {
    container.classList.add('stations_container')
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

    return container
};