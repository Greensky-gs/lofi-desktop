import { hardStation } from './station';

export type If<C extends boolean, A extends any, B = any> = C extends true
	? A
	: C extends false
		? B
		: never;
export enum ColorTheme {
	Dark = 'color_dark_theme',
	Light = 'color_light_theme',
}
export enum StorageKeys {
	Theme = 'lofi_theme',
}
export type stationLoadButton = {
	classes: string[];
	onclick?: Function;
};
export type stationsLoadOptions = {
	container: HTMLElement;
	stations: hardStation[];
	containerClass?: string;
	buttons: stationLoadButton[];
	useDefaultButtons?: boolean;
};
