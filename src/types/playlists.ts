import { hardStation } from "./station";

export type playlist = {
    name: string;
    stations: string[];
    key: string;
}
export type hardPlaylist = {
    stations: hardStation[];
} & Omit<playlist, 'stations'>

