import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import Constants from 'expo-constants';

/**
 * Values come from app.config.ts `extra.firebase`, sourced from env vars at
 * build time (see .env.example) — never hardcode project keys here.
 */
const firebaseConfig = Constants.expoConfig?.extra?.firebase ?? {};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
