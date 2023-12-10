import { Database, ref, get, onValue } from 'firebase/database';
import { Station } from '../classes/Station';
import { station } from '../types/station';

export class Stations {
	private ref: Database;
	private cache: Map<string, Station> = new Map();

	constructor(reference: Database) {
		this.ref = reference;

		this.start();
	}

	public get stations(): Station[] {
		return Array.from(this.cache.values());
	}

	public get ready() {
		return this.cache.size > 50;
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
		});
	}
	private start() {
		this.fillCache();
	}
}
