export type stationsManagerLaunchCall = () => void | unknown;
export type PomodoroTimesType = { session: number; short: number; long: number }
export type pomodoroState = 'playing' | 'paused' | 'idle'