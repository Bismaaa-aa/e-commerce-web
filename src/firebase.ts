// src/firebase.ts
import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    FacebookAuthProvider,
    onAuthStateChanged,
    type User,
} from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore"; // ✅ import Firestore

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDePHuvQHIOp1vDVQYB95yqxOkCsG5TDBQ",
    authDomain: "shopease-f2b84.firebaseapp.com",
    projectId: "shopease-f2b84",
    storageBucket: "shopease-f2b84.firebasestorage.app",
    messagingSenderId: "1027742440801",
    appId: "1:1027742440801:web:ccb22da3c42782a5afb920",
    measurementId: "G-FKBGBBV513"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Auth setup
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// ✅ Firestore setup (needed for orders)
export const db = getFirestore(app);

export const watchAuthAndEnsureProfile = (callback: (user: User | null) => void) =>
    onAuthStateChanged(auth, async (user) => {
        callback(user);
        if (user?.email) {
            const userRef = doc(db, "users", user.email);
            await setDoc(
                userRef,
                {
                    email: user.email,
                    createdAt: serverTimestamp(),
                    cart: [],
                },
                { merge: true }
            );
        }
    });
