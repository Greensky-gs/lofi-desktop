import { Database, ref, get, onValue } from 'firebase/database';
import { Station } from '../classes/Station';
import { hardStation, station } from '../types/station';
import { writeFileSync } from 'node:fs';
import { stationsManagerLaunchCall } from '../types/managers';
import {
	FirebaseStorage,
	getDownloadURL,
	ref as storeRef,
} from 'firebase/storage';
import { join } from 'path'

export class Stations {
	private ref: Database;
	private cache: Map<string, Station> = new Map();
	private _launchCall: stationsManagerLaunchCall;
	private _ready = false;
	private readyCount = 0;
	private refs: Record<string, string>;

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
	public get hardStations(): (hardStation & { feedbacks: [] })[] {
		return Array.from(this.cache.values()).map((x) => ({
			title: x.softTitle,
			// @ts-ignore
			emoji: x.title.split(' ').find((x) => /\p{Emoji}/u.test(x)) ?? '',
			feedbacks: [],
			type: 'playlist',
			url: x.url,
			img: x.img,
			downloadURL: x.downloadURL,
			tracks: x.tracks
		}));
	}

	private pushStation(input: station<true>) {
		const station = new Station(input);
		this.cache.set(station.id, station);
	}
	private async fillCache() {
		onValue(ref(this.ref, 'stations'), async (snap) => {
			const values = snap.val() as Record<string, station<true>>;
			Object.values(values).forEach((val, i) => {
				this.pushStation(val);
			});

			setTimeout(() => {
				this.readyCount++;
				this.checkReady();
			}, 500);
		});
		onValue(ref(this.ref, 'refs'), (snap) => {
			this.refs = snap.val() as Record<string, string>;

			this.readyCount++;
			this.checkReady();
		});
	}
	private checkReady() {
		if (this.readyCount === 2) {
			Object.entries(this.refs).forEach(([id, r]) => {
				const st = this.cache.get(id);
				if (!!st) st.downloadURL = r;
			});
			this.sync();
		}
	}
	private sync() {
		const allowed = this.hardStations;

		const configs = require('../assets/configs.json');
		const updated = (
			configs.stations as (hardStation & { feedbacks: [] })[]
		)
			.filter((x) => x.type === 'radio')
			.concat(allowed);

		writeFileSync(
			join(__dirname, '../assets/configs.json'),
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
