import { hardStation } from '../types/station';
import { appendMode, diffuserState } from '../types/diffuser';
import {
	appendSystemList,
	getSystemList,
	loadPlayingControler,
	reloadCurrent,
	shuffle,
} from '../types/definitions';

class Diffuser {
	private _url: string;
	private state: diffuserState = 'idle';
	private audio: HTMLAudioElement;
	private queue: string[] = [];

	constructor() {}

	public get playing() {
		return this.state === 'playing';
	}
	public get idle() {
		return this.state === 'idle';
	}
	public get duration() {
		return this.audio?.duration;
	}
	public get current() {
		return this.audio?.currentTime;
	}
	public get url() {
		return this._url;
	}
	public get station() {
		const val = window.stations.find((x) => x.downloadURL === this._url);
		if (!val) return;

		return val;
	}

	private handleAppend(url: string, mode: appendMode) {
		if (mode === 'force') {
			this.queue.push(url);
		} else if (mode === 'idleonly' && this.state === 'idle') {
			this.queue.push(url);
		} else if (mode === 'notidle' && this.state !== 'idle') {
			this.queue.push(url);
		} else if (mode === 'pauseonly' && this.state === 'paused') {
			this.queue.push(url);
		} else if (mode === 'playingonly' && this.state === 'playing') {
			this.queue.push(url);
		}
	}
	public appendQueue(url: string) {
		this.queue.push(url);
	}
	public shuffleQueue() {
		this.queue = shuffle(this.queue);
	}
	public skip() {
		if (!!this.station) appendSystemList(getSystemList(), this.station);

		const next =
			this.queue[0] ??
			window.stations[Math.floor(Math.random() * window.stations.length)]
				?.downloadURL;
		if (!next) return;

		this._url = next;
		this.play(next);
		this.render();

		if (this.queue.length > 0) {
			this.queue = this.queue.splice(1);
		}
	}
	public play(url: string, appendMode: appendMode = 'never') {
		if (this.audio) {
			if (!!this.station) appendSystemList(getSystemList(), this.station);
			this.audio.pause();
		}
		this.handleAppend(url, appendMode);

		const audio = document.createElement('audio');
		audio.controls = true;

		audio.src = url;
		this._url = url;

		audio.style.zIndex = '6';
		audio.style.position = 'absolute';

		audio.play();

		this.audio = audio;

		this.audio.onended = () => {
			this.state = 'idle';
			this.skip();
		};
		this.state = 'playing';
	}
	public pause() {
		if (this.state !== 'playing') return false;
		this.state = 'paused';
		this.audio.pause();
	}
	public setVolume(value: number) {
		this.audio.volume = value;
	}
	public resume() {
		if (this.state !== 'paused') return false;

		this.audio.play();
		this.state = 'playing';
	}

	public render() {
		reloadCurrent();
	}
}

window.diffuser = new Diffuser();
