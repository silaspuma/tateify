import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';

let _database: ReturnType<typeof getDatabase> | null = null;

export function getFirebaseDatabase() {
  if (_database) return _database;

  const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!databaseURL || !projectId) {
    throw new Error(
      'Firebase configuration is missing. Please set NEXT_PUBLIC_FIREBASE_DATABASE_URL and NEXT_PUBLIC_FIREBASE_PROJECT_ID in your environment variables.'
    );
  }

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL,
    projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  _database = getDatabase(app);
  return _database;
}
