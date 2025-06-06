// assets/js/admin.js
import { realtimeDB } from "./firebase-init.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Du brauchst womöglich eine kleine SHA-256-Hashfunktion,
// z.B.:
async function sha256(text) {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuff = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuff));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export function initAdmin(sectionEl) {
  sectionEl.innerHTML = `<h2>Adminbereich</h2><p>Lade Daten…</p>`;

  // 1) Hol Admin-Hash aus Realtime DB
  get(ref(realtimeDB, "Info/Admin-Passwort")).then(async (snapshot) => {
    if (!snapshot.exists()) {
      sectionEl.innerHTML = `<p>Kein Admin-Passwort hinterlegt!</p>`;
      return;
    }
    const adminHash = snapshot.val();
    const eingabe = prompt("Admin-Passwort eingeben:");
    if (!eingabe) {
      sectionEl.innerHTML = `<p>Zugriff verweigert.</p>`;
      return;
    }
    const eingabeHash = await sha256(eingabe);
    if (eingabeHash !== adminHash) {
      sectionEl.innerHTML = `<p>Zugriff verweigert: Falsches Passwort.</p>`;
      return;
    }
    // Passwort korrekt: Admin-Oberfläche aufbauen
    renderAdminUI(sectionEl);
  }).catch(err => {
    console.error(err);
    sectionEl.innerHTML = `<p>Fehler beim Laden der Admin-Daten.</p>`;
  });
}

function renderAdminUI(sectionEl) {
  sectionEl.innerHTML = `
    <h2>Adminbereich</h2>
    <button id="btnSpielerVerwalten">Spieler & Passwörter verwalten</button>
    <button id="btnNSCsVerwalten">NSCs verwalten</button>
    <!-- Weitere Admin-Funktionen … -->
    <div id="adminContent"></div>
  `;
  // Beispiel: Spieler verwalten
  sectionEl.querySelector("#btnSpielerVerwalten").addEventListener("click", () => {
    const adminContent = sectionEl.querySelector("#adminContent");
    // Hier kannst du ein Formular anzeigen, um Benutzer (Spieler) anzulegen,
    // Passwörter zu setzen, evtl. bestehende Spieler auflisten.
    loadSpielerVerwaltung(adminContent);
  });
  // Ähnlich: NSCs verwalten …
  sectionEl.querySelector("#btnNSCsVerwalten").addEventListener("click", () => {
    const adminContent = sectionEl.querySelector("#adminContent");
    loadNSCVerwaltung(adminContent);
  });
}

// Beispiel-Funktion: Spieler-Verwaltung
import { firestore } from "./firebase-init.js";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

async function loadSpielerVerwaltung(container) {
  container.innerHTML = `
    <h3>Spieler verwalten</h3>
    <button id="btnNeuerSpieler">Neuen Spieler anlegen</button>
    <ul id="listeSpieler"></ul>
  `;
  const liste = container.querySelector("#listeSpieler");
  const spielerColl = collection(firestore, "Spieler");
  onSnapshot(spielerColl, snapshot => {
    liste.innerHTML = "";
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const li = document.createElement("li");
      li.textContent = data.name;
      // Bearbeiten (z. B. Passwort ändern)
      const bearbBtn = document.createElement("button");
      bearbBtn.textContent = "Passwort ändern";
      bearbBtn.addEventListener("click", async () => {
        const neuesPW = prompt(`Neues Passwort für ${data.name}:`);
        if (neuesPW) {
          const hash = await sha256(neuesPW);
          await updateDoc(doc(firestore, "Spieler", docSnap.id), {
            passwortHash: hash
          });
          alert("Passwort geändert.");
        }
      });
      // Löschen
      const delBtn = document.createElement("button");
      delBtn.textContent = "Löschen";
      delBtn.addEventListener("click", async () => {
        if (confirm(`Spieler ${data.name} wirklich löschen?`)) {
          await deleteDoc(doc(firestore, "Spieler", docSnap.id));
        }
      });
      li.append(bearbBtn, delBtn);
      liste.appendChild(li);
    });
  });
  container.querySelector("#btnNeuerSpieler").addEventListener("click", async () => {
    const name = prompt("Name des neuen Spielers:");
    const pw = prompt("Passwort des neuen Spielers:");
    if (name && pw) {
      const hash = await sha256(pw);
      await addDoc(spielerColl, {
        name,
        passwortHash: hash
      });
      alert("Spieler angelegt.");
    }
  });
}

// Ähnlich: loadNSCVerwaltung(container) kann NSCs anlegen/bearbeiten/löschen
import { query, orderBy } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
async function loadNSCVerwaltung(container) {
  container.innerHTML = `
    <h3>NSCs verwalten</h3>
    <button id="btnNeuerNSC">Neuen NSC anlegen</button>
    <ul id="listeNSCs"></ul>
  `;
  const liste = container.querySelector("#listeNSCs");
  const nscColl = collection(firestore, "NSCs");
  // z. B. sortiert nach Name
  const q = query(nscColl, orderBy("name"));
  onSnapshot(q, snapshot => {
    liste.innerHTML = "";
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const li = document.createElement("li");
      li.textContent = `${data.name} (Ort: ${data.ort}, Datum: ${data.datum.toDate().toLocaleDateString()})`;
      // Bearbeiten, Löschen analog zu oben
      // …
      liste.appendChild(li);
    });
  });
  container.querySelector("#btnNeuerNSC").addEventListener("click", async () => {
    const name = prompt("Name des NSC:");
    const beschreibung = prompt("Beschreibung:");
    const ort = prompt("Ort des Kennenlernens:");
    const datumStr = prompt("Datum (YYYY-MM-DD):");
    if (name && beschreibung && ort && datumStr) {
      const datum = new Date(datumStr);
      await addDoc(nscColl, {
        name,
        beschreibung,
        ort,
        datum
      });
      alert("NSC angelegt.");
    }
  });
}
