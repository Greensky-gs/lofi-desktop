import { station } from '../types/station';

export class Station {
	private input: station<true>;
	private datas: station<false>;

	constructor(input: station<true>) {
		this.input = input;

		this.datas = {
			...this.input,
			authors: JSON.parse(this.input.authors),
			tracks: JSON.parse(this.input.tracks),
		};
	}

	public get fullTitle() {
		return `${this.authors.join(' x ')} - ${this.title} (${
			this.beats
		})`.replace(/ +/g, ' ');
	}
	/**
	 * Returns title without emoji
	 */
	public get softTitle() {
		return this.fullTitle.replace(/\p{Emoji}/u, '').replace(/ +/g, ' ');
	}
	public get title() {
		return this.datas.title;
	}
	public get authors() {
		return this.datas.authors;
	}
	public get tracks() {
		return this.datas.tracks;
	}
	public get url() {
		return this.datas.url;
	}
	public get img() {
		return this.datas.img;
	}
	public get id() {
		return this.datas.id;
	}
	public get beats() {
		return this.datas.beats;
	}
	public get downloadURL() {
		return this.datas.downloadURL
	}

	public set downloadURL(value: string) {
		this.datas.downloadURL = value
	}

	public toJSON() {
		return this.input;
	}
}
