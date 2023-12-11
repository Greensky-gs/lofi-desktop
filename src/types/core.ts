export type If<C extends boolean, A extends any, B = any> = C extends true
	? A
	: C extends false
		? B
		: never;
export enum ColorTheme {
	Dark = "color_dark_theme",
	Light = "color_light_theme"
}
export enum StorageKeys {
	Theme = "lofi_theme"
}