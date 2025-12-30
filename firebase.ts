// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);