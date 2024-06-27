import { hardStation } from '../types/station';
import { appendMode, diffuserState, stationsCallback } from '../types/diffuser';
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
	private _callback: stationsCallback

	constructor() {}

	public setCallback(callback: stationsCallback) {
		this._callback = callback;

		setInterval(this.check.bind(this), 2000)

	}
	private check() {
		if (this.state === 'playing') {
			const now = this.audio.currentTime;
			const tracks = this.station.tracks

			if (!tracks) return this._callback("Musique inconnue")
			const tracksList = Object.keys(tracks).map((x) => {
				const numbers = x.split(/\:/g).map(x => parseInt(x))
				if (numbers.length === 3) {
					const [hours, minutes, seconds] = numbers
					return hours * 3600 + minutes * 60 + seconds
				} else {
					const [minutes, seconds] = numbers
					return minutes * 60 + seconds
				}
			})

			const index = tracksList.findIndex((x, i) => {
				const next = tracksList[i + 1]
				if (!next) return false;

				return x <= now && now <= next
			})
			return this._callback(Object.values(tracks)[index])
		}
	}
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
		const system = getSystemList();
		if (this.audio && system.stations[0].downloadURL !== this.station.downloadURL) {
			if (!!this.station) appendSystemList(system, this.station);
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
