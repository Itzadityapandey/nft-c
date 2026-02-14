import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

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

// 1. Initialize Firebase App
// We check getApps() to ensure we don't initialize it twice (common Next.js issue)
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// 2. Initialize & Export Database (THIS FIXES YOUR BUILD ERROR)
export const database = getDatabase(app);

// 3. Initialize Analytics Safely
// We only run this if 'window' exists (meaning we are in the browser, not the server)
if (typeof window !== "undefined") {
  try {
    getAnalytics(app);
  } catch (e) {
    console.log("Analytics skipped (happens during build)");
  }
}
