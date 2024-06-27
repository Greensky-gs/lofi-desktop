export type diffuserState = 'playing' | 'idle' | 'paused';
export type appendMode =
	| 'force'
	| 'never'
	| 'playingonly'
	| 'pauseonly'
	| 'idleonly'
	| 'notidle';
export type stationsCallback = (songName: string) => unknown | void