// src/firebaseConfig.js

// Import the functions you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Function to sign in with Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      id: user.uid,
      email: user.email,
      name: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL || null,
      isGoogleUser: true
    };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Function to sign in with email/password
const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return {
      id: user.uid,
      email: user.email,
      name: user.displayName || user.email.split('@')[0]
    };
  } catch (error) {
    console.error("Error signing in with email/password:", error);
    throw error;
  }
};

// Function to sign up with email/password
const signUpWithEmail = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // You can update the user profile here if needed
    // await updateProfile(user, { displayName: name });
    
    return {
      id: user.uid,
      email: user.email,
      name: name || user.email.split('@')[0]
    };
  } catch (error) {
    console.error("Error signing up with email/password:", error);
    throw error;
  }
};

// Function to sign out
const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Auth state change observer
const onAuthStateChangedListener = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        id: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL || null,
        isGoogleUser: user.providerData.some(provider => provider.providerId === 'google.com')
      });
    } else {
      callback(null);
    }
  });
};

// Export the necessary functions
export { 
  auth,
  db,
  storage,
  signInWithGoogle, 
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  onAuthStateChangedListener
};
