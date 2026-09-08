import { initializeApp, getApps, getApp } from "firebase/app";

// Firebase base configuration from Vite environment variables (Phone Auth removed)
const env = (import.meta as any).env || {};
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: env.VITE_FIREBASE_APP_ID || ""
};

/**
 * Check if valid Firebase configuration has been provided in environment
 */
export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== "your_api_key" &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== "your_project_id"
  );
};

// Initialize Firebase App safely if configured
let appInstance: any = null;

if (isFirebaseConfigured()) {
  try {
    appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  } catch (err) {
    console.warn("Firebase initialization failed:", err);
  }
}

export const app = appInstance;
