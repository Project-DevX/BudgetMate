import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config - You'll need to get these from Firebase Console
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "your-api-key",
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "your-project.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "your-project.appspot.com",
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId:
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
};

// Initialize Firebase - check if already initialized to avoid errors
let app;
if (getApps().length === 0) {
  console.log("Firebase: Initializing Firebase app...");
  app = initializeApp(firebaseConfig);
  console.log("Firebase: App initialized successfully");
} else {
  console.log("Firebase: Using existing Firebase app");
  app = getApps()[0];
}

// Initialize Auth - Firebase web SDK works with Expo Go
console.log("Firebase: Initializing Auth...");
const auth = getAuth(app);
console.log("Firebase: Auth initialized successfully");

// Initialize Firestore
console.log("Firebase: Initializing Firestore...");
const db = getFirestore(app);
console.log("Firebase: Firestore initialized successfully");

export { auth, db };
export default app;
