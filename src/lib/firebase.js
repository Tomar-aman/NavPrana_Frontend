"use client";

import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

/**
 * Firebase is used for exactly one thing here: proving a customer controls a
 * phone number. The SMS round trip runs in the browser, and the ID token it
 * produces is handed to our own API, which mints the JWT the app actually
 * runs on. No Firebase session is kept afterwards.
 *
 * These values are the public web config — they identify the project, they are
 * not secrets. Access is controlled by the authorised-domains list in the
 * Firebase console, so keep that list tight.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId,
);

/** Initialised lazily so a page that never asks for OTP never loads any of it. */
export const getFirebaseApp = () => {
  if (!isFirebaseConfigured) {
    throw new Error("Firebase is not configured — check NEXT_PUBLIC_FIREBASE_* env vars.");
  }
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
};

export const getFirebaseAuth = () => {
  const auth = getAuth(getFirebaseApp());
  // Send the SMS in whatever language the browser is set to.
  auth.useDeviceLanguage();
  return auth;
};
