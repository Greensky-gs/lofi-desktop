import { Database, ref, get, onValue } from 'firebase/database';
import { Station } from '../classes/Station';
import { hardStation, station } from '../types/station';
import { writeFileSync } from 'node:fs';
import { stationsManagerLaunchCall } from '../types/managers';

export class Stations {
	private ref: Database;
	private cache: Map<string, Station> = new Map();
	private _launchCall: stationsManagerLaunchCall;
	private _ready = false;

	constructor(reference: Database) {
		this.ref = reference;

		this.start();
	}

	public onLaunch(callback: stationsManagerLaunchCall) {
		this._launchCall = callback;
		return this;
	}

	public get stations(): Station[] {
		return Array.from(this.cache.values());
	}

	public get ready() {
		return this._ready;
	}

	private pushStation(input: station<true>) {
		const station = new Station(input);
		this.cache.set(station.id, station);
	}
	private async fillCache() {
		onValue(ref(this.ref, 'stations'), (snap) => {
			const values = snap.val() as Record<string, station<true>>;
			Object.values(values).forEach((val) => {
				this.pushStation(val);
			});

			setTimeout(() => {
				this.sync();
			}, 1000);
		});
	}
	private sync() {
		const allowed: (hardStation & { feedbacks: [] })[] = Array.from(
			this.cache.values(),
		).map((x) => ({
			title: x.softTitle,
			emoji: x.title.split(' ').find((x) => /\p{Emoji}/u.test(x)) ?? '',
			feedbacks: [],
			type: 'playlist',
			url: x.url,
			img: x.img,
		}));

		const configs = require('../assets/configs.json');
		const updated = (
			configs.stations as (hardStation & { feedbacks: [] })[]
		)
			.filter((x) => x.type === 'radio')
			.concat(allowed);

		writeFileSync(
			`./dist/assets/configs.json`,
			JSON.stringify(
				{
					...configs,
					stations: updated,
				},
				null,
				4,
			),
		);

		this._ready = true;
		if (!!this._launchCall) this._launchCall();
	}
	private start() {
		this.fillCache();
	}
}
