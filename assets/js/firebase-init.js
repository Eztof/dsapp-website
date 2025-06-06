// assets/js/firebase-init.js

// 1) Firebase-App (Core) per ES-Modul importieren
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
// 2) Firestore modulweise importieren
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
// 3) Realtime Database per Modul
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
// 4) Analytics (optional)
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
// Analytics initialisieren (kannst du weglassen, falls du es nicht brauchst)
const analytics = getAnalytics(app);

// Firestore- und Realtime Database-Instanzen erstellen
const firestore = getFirestore(app);
const realtimeDB = getDatabase(app);

// Exportiere die beiden Instanzen, damit andere Module (z. B. main.js, basar.js, usw.) sie importieren können:
export { firestore, realtimeDB };
