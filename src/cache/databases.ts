import { config } from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { join } from 'path'
config({ path: join(__dirname, '../../.env') });

export const app = initializeApp({
	databaseURL: process.env.dbUrl,
	storageBucket: process.env.bucketUrl,
});

export const storage = getStorage(app);
export const db = getDatabase(app);
