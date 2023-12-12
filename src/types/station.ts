import { If } from './core';

export type double = `${number}` | `${number}${number}`;
export type timestamp = `${double}:${double}` | `${double}:${double}:${double}`;

export type tracksType = Record<timestamp, string>;
export type station<Raw extends boolean = false> = {
	authors: If<Raw, string, string[]>;
	beats: string;
	id: string;
	img: string;
	title: string;
	tracks: If<Raw, string, tracksType>;
	url: string;
};
export type stationType = 'radio' | 'playlist'
export type hardStation = {
	url: string;
	emoji: string;
	type: stationType;
	title: string;
}