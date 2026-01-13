import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { environment } from '../environments/environment';

export const firebaseApp = initializeApp(environment.firebase);

export const db = getDatabase(firebaseApp);

