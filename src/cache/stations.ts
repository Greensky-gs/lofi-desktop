import { Stations } from "../managers/stations";
import { db } from "./databases";

export const stations = new Stations(db);