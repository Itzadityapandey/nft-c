// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0TGT1ddMFBp8sfkPnNFrSMbxjqahI6kI",
  authDomain: "artoffice-af07c.firebaseapp.com",
  databaseURL: "https://artoffice-af07c-default-rtdb.firebaseio.com",
  projectId: "artoffice-af07c",
  storageBucket: "artoffice-af07c.firebasestorage.app",
  messagingSenderId: "177521622680",
  appId: "1:177521622680:web:d23894cdf07c334d675aed",
  measurementId: "G-PR0GQ5HMBC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
