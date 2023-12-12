import { stations as hardStations } from '../assets/configs.json';

export const stationsCache = (): typeof hardStations => hardStations;
export const wait = (time: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, time);
	});
