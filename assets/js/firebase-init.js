// assets/js/firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";

// Deine Firebase-Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyBHIftX5AvSJaPAiUIek0TBVjEtxwZo7Ow",
  authDomain: "dsapp-6722f.firebaseapp.com",
  databaseURL: "https://dsapp-6722f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dsapp-6722f",
  storageBucket: "dsapp-6722f.appspot.com",
  messagingSenderId: "693149967345",
  appId: "1:693149967345:web:aa784c1aa1aa105f0c5a50",
  measurementId: "G-LJLLMTX2GT"
};

// Firebase initialisieren
const app = initializeApp(firebaseConfig);
// Analytics initialisieren (falls du das nutzen willst)
const analytics = getAnalytics(app);
// Firestore & Realtime Database Instanzen erstellen
const firestore = getFirestore(app);
const realtimeDB = getDatabase(app);

// Exportiere die Instanzen, damit andere Module sie verwenden können
export { firestore, realtimeDB };
