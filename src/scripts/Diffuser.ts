import { diffuserState } from "../types/diffuser";

class Diffuser {
    private _url: string;
    private state: diffuserState = 'idle'
    private audio: HTMLAudioElement

    constructor() {}

    public get playing() {
        return this.state === 'playing'
    }
    public get idle() {
        return this.state === 'idle'
    }
    public get duration() {
        return this.audio?.duration
    }
    public get current() {
        return this.audio?.currentTime
    }
    public get url() {
        return this._url;
    }

    public play(url: string) {
        if (!this.idle) this.audio.pause()
        const audio = document.createElement('audio')
        audio.controls = true

        audio.src = url
        this._url = url

        audio.style.zIndex = '6'
        audio.style.position = 'absolute'

        audio.play()

        this.audio = audio
        this.state = 'playing'
    }
    public pause() {
        this.state = 'paused'
        this.audio.pause()
    }
    public setVolume(value: number) {
        this.audio.volume = value
    }

    public render() {
        const container = document.getElementById('playing_container')
        container.appendChild(this.audio)
    }
}

window.diffuser = new Diffuser()