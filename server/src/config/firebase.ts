import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

/**
 * Expects GOOGLE_APPLICATION_CREDENTIALS to point at a service-account JSON
 * (see .env.example), or a hosted environment that provides default
 * credentials. applicationDefault() reads that env var itself and resolves
 * relative paths against process.cwd() — never commit the key file itself.
 */
function initFirebaseAdmin() {
  if (getApps().length) return;

  initializeApp({
    credential: applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

initFirebaseAdmin();

export const db = getFirestore();
export const storage = getStorage();
