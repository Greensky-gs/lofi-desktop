import { parseAuthors } from "../types/definitions";
import { hardStation } from "../types/station";

const blacker = (action: 'enable' | 'disable') => {
	if (action === 'enable') {
		const exists = !!document.getElementsByClassName('popup_blacker')[0];

		if (exists) return;
		const blacker = document.createElement('div');
		blacker.id = 'popup_blacker';
		blacker.classList.add('popup_blacker');

		document.getElementsByTagName('body')[0].appendChild(blacker);
	} else {
		const blacker = document.getElementById('popup_blacker');
		if (!blacker) return;

		document.getElementsByTagName('body')[0].removeChild(blacker);
	}
};
const popup = (station: hardStation) => {
    const div = document.createElement('div');

	const popupContainer =
		document.getElementsByClassName('popup_container')[0];
	if (!popupContainer) return;
	blacker('enable');

	div.classList.add('popup');

	const imgContainer = document.createElement('div');
	imgContainer.classList.add('popup_img_container');

	imgContainer.style.backgroundImage = `url("${station.img}")`;
	div.appendChild(imgContainer);

	const title = `${station.title.replace(' (', ` ${station.emoji} (`)}`;
	const titleP = document.createElement('p');
	titleP.innerText = title;
	titleP.classList.add('popup_title');

	div.appendChild(titleP);

	const authorsContainer = document.createElement('div');
	authorsContainer.classList.add('popup_authors');
	const authors = parseAuthors(station);

	for (const author of authors.length > 0 ? authors : ['Lofi Girl']) {
		const node = document.createElement('p');
		node.innerText = author as string;
		node.classList.add('popup_author');
		authorsContainer.appendChild(node);
	}
	div.appendChild(authorsContainer);

    const iconsContainer = document.createElement('div')
    iconsContainer.classList.add('popup_icons')

    const play = document.createElement('img');
	play.classList.add('play_btn', 'clickable');
	const addToPlaylist = document.createElement('img');
	addToPlaylist.classList.add('add_pl_btn', 'clickable');

	iconsContainer.appendChild(play);
	iconsContainer.appendChild(addToPlaylist);

	div.appendChild(iconsContainer);

	div.setAttribute('creation', Date.now().toString());

	popupContainer.appendChild(div);
}
const unpopup = () => {
	const popupContainer =
		document.getElementsByClassName('popup_container')[0];
	if (!popupContainer) return;
	blacker('disable');

	popupContainer.firstChild?.remove();
};