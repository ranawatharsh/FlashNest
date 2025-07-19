import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// A function to get the Firebase config, which throws an error if keys are missing.
const getFirebaseConfig = () => {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };

  // Check if any of the required keys are missing
  for (const [key, value] of Object.entries(firebaseConfig)) {
    if (!value) {
      throw new Error(`Firebase config error: The environment variable for "${key}" is missing. Please check your .env.local file or your hosting provider's environment variable settings.`);
    }
  }
  return firebaseConfig;
};

// Initialize Firebase
const app = initializeApp(getFirebaseConfig());

// Export the services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
