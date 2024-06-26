import { PomodoroTimesType, pomodoroState } from "../types/managers";

class Pomodoro {
    private _times: PomodoroTimesType;
    private _audio: HTMLAudioElement;
    private _url = 'https://cdn.discordapp.com/attachments/1146818137879224432/1200885330652450876/611821__syntheffects__timer-alarm-detector-bleeping-beeping.wav?ex=65c7ce9e&is=65b5599e&hm=02e752e8d6302abca8ce4ecd61b86507765632740c9caa5532e0704c80ca6299&'
    private _step: number = 0;
    private _running: boolean = false;
    private _state: pomodoroState = 'idle'

    constructor() {
    }

    public get state() {
        return this._state
    }
    public get step() {
        return this._step
    }
    public get running() {
        return this._running;
    }

    private sound() {
        if (!!this._audio) this._audio.play();
    }
    private startTimers() {
        this.timeout(() => {
            this._step++;
            this.sound()

            this.timeout(() => {
                this._step++
                this.sound()

                this.timeout(() => {
                    this._step++
                    this.sound()

                    this.timeout(() => {
                        this._step++;
                        this.sound();

                        this.timeout(() => {
                            this._step++;
                            this.sound()

                            this.timeout(() => {
                                this._step++;
                                this.sound()

                                this.timeout(() => {
                                    this._step++;
                                    this.sound()

                                    this._running = false;
                                }, this._times.session)
                            }, this._times.long)
                        }, this._times.session)
                    }, this._times.short)
                }, this._times.session)
            }, this._times.short)
        }, this._times.session)
    }
    private timeout(callback: () => unknown, time: number) {
        return setTimeout(() => {
            if (!this._running) return

            callback()
        }, time)
    }

    public start(times: PomodoroTimesType) {
        this._times = times;

        const audio = document.createElement('audio')
        audio.src = this._url
        
        this._audio = audio;
        this._running = true;
        this._audio.volume = 0.75;

        this._state = 'playing'
        this._step = 0
        this.startTimers()
    }
    public stop() {
        this._running = false;
        this._state = 'paused'
    }
    public resume() {
        this._running = true
        this._state = 'playing'
    }
}

window.pomodoro = new Pomodoro()