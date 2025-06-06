// assets/js/spielerbereich.js

import { firestore } from "./firebase-init.js";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  addDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// SHA-256-Hashfunktion für Passwort-Vergleich
async function sha256(text) {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function initSpielerbereich(sectionEl) {
  sectionEl.innerHTML = `
    <h2>Spielerbereich</h2>
    <div>
      <label>Spielername: <input type="text" id="inputSpielerName"/></label>
    </div>
    <div>
      <label>Passwort: <input type="password" id="inputPasswort"/></label>
    </div>
    <button id="btnLoginSpieler">Login</button>
    <div id="heldenContainer"></div>
  `;

  const btnLogin = sectionEl.querySelector("#btnLoginSpieler");
  const nameInput = sectionEl.querySelector("#inputSpielerName");
  const pwInput = sectionEl.querySelector("#inputPasswort");
  const heldenContainer = sectionEl.querySelector("#heldenContainer");

  btnLogin.addEventListener("click", async () => {
    const spielerName = nameInput.value.trim();
    const passwort = pwInput.value;
    if (!spielerName || !passwort) {
      alert("Bitte Name und Passwort eingeben.");
      return;
    }

    // Suche in Firestore nach Dokument, dessen Feld "name" genau spielerName ist
    const spielerColl = collection(firestore, "Spieler");
    const querySnap = await firestore
      .collection("Spieler")
      .where("name", "==", spielerName)
      .get();

    if (querySnap.empty) {
      alert("Spieler nicht gefunden.");
      return;
    }

    // Wir nehmen das erste gefundene Dokument
    const docSnap = querySnap.docs[0];
    const data = docSnap.data();
    const gespeicherterHash = data.passwortHash;
    const eingabeHash = await sha256(passwort);

    if (eingabeHash !== gespeicherterHash) {
      alert("Falsches Passwort.");
      return;
    }

    // Login erfolgreich → Zeige Helden-Liste
    showHeldenListe(docSnap.id, heldenContainer);
  });
}

function showHeldenListe(spielerId, container) {
  container.innerHTML = `
    <h3>Deine Helden</h3>
    <button id="btnNeuerHeld">Neuen Helden anlegen</button>
    <ul id="listeHelden"></ul>
  `;

  const liste = container.querySelector("#listeHelden");
  const heldenColl = collection(firestore, "Spieler", spielerId, "Helden");

  // Live-Updates der Subcollection "Helden"
  onSnapshot(heldenColl, (snapshot) => {
    liste.innerHTML = "";
    snapshot.forEach((heldSnap) => {
      const daten = heldSnap.data();
      const li = document.createElement("li");
      li.textContent = daten.name;
      li.addEventListener("click", () => {
        showCharakterbogen(spielerId, heldSnap.id, daten, container);
      });
      liste.appendChild(li);
    });
  });

  // Neuen Helden anlegen
  container.querySelector("#btnNeuerHeld").addEventListener("click", async () => {
    const heldName = prompt("Name des neuen Helden:");
    if (!heldName) return;

    await addDoc(heldenColl, {
      name: heldName,
      rasse: "",
      beruf: "",
      attribute: {
        MU: 10,
        KL: 10,
        IN: 10,
        CH: 10,
        FF: 10,
        GE: 10,
        KO: 10,
        KK: 10
      },
      spezialfertigkeiten: {},
      ausruestung: []
    });
  });
}

function showCharakterbogen(spielerId, heldId, daten, container) {
  container.innerHTML = `
    <button id="btnZurueckHelden">← Zurück zur Heldenliste</button>
    <h3>Charakterbogen: ${daten.name}</h3>
    <div id="charbogenDetails"></div>
  `;
  container.querySelector("#btnZurueckHelden").addEventListener("click", () => {
    showHeldenListe(spielerId, container);
  });

  const detailsDiv = container.querySelector("#charbogenDetails");

  // Charakterdetails anzeigen
  detailsDiv.innerHTML = `
    <p><strong>Name:</strong> ${daten.name}</p>
    <p><strong>Rasse:</strong> ${daten.rasse || "(nicht gesetzt)"}</p>
    <p><strong>Beruf:</strong> ${daten.beruf || "(nicht gesetzt)"}</p>
    <h4>Attribute</h4>
    <ul id="listeAttribute"></ul>
    <button id="btnBearbeiteAttribute">Attribute bearbeiten</button>
    <h4>Spezialfertigkeiten</h4>
    <div id="sfContainer"></div>
    <button id="btnBearbeiteSF">Spezialfertigkeiten bearbeiten</button>
    <h4>Ausrüstung</h4>
    <ul id="listeAusrüstung"></ul>
    <button id="btnBearbeiteAusrüstung">Ausrüstung bearbeiten</button>
  `;

  // Attribute auflisten
  const attrUl = detailsDiv.querySelector("#listeAttribute");
  Object.entries(daten.attribute).forEach(([key, wert]) => {
    const li = document.createElement("li");
    li.textContent = `${key}: ${wert}`;
    attrUl.appendChild(li);
  });

  // Spezialfertigkeiten anzeigen
  const sfDiv = detailsDiv.querySelector("#sfContainer");
  if (daten.spezialfertigkeiten && Object.keys(daten.spezialfertigkeiten).length > 0) {
    const ul = document.createElement("ul");
    Object.entries(daten.spezialfertigkeiten).forEach(([sf, level]) => {
      const li = document.createElement("li");
      li.textContent = `${sf}: ${level}`;
      ul.appendChild(li);
    });
    sfDiv.appendChild(ul);
  } else {
    sfDiv.textContent = "(keine Spezialfertigkeiten gesetzt)";
  }

  // Ausrüstung anzeigen
  const ausrUl = detailsDiv.querySelector("#listeAusrüstung");
  if (Array.isArray(daten.ausruestung) && daten.ausruestung.length) {
    daten.ausruestung.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      ausrUl.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "(keine Ausrüstung)";
    ausrUl.appendChild(li);
  }

  // Buttons zum Bearbeiten
  detailsDiv
    .querySelector("#btnBearbeiteAttribute")
    .addEventListener("click", async () => {
      const neuesAttribute = {};
      for (const key of Object.keys(daten.attribute)) {
        const neuerWertStr = prompt(`Wert für ${key}:`, daten.attribute[key]);
        const neuerWert = parseInt(neuerWertStr);
        if (!isNaN(neuerWert)) {
          neuesAttribute[key] = neuerWert;
        } else {
          neuesAttribute[key] = daten.attribute[key];
        }
      }
      await firestore
        .doc(`Spieler/${spielerId}/Helden/${heldId}`)
        .update({ attribute: neuesAttribute });
      alert("Attribute aktualisiert. Bitte Seite neu laden.");
    });

  detailsDiv.querySelector("#btnBearbeiteSF").addEventListener("click", async () => {
    const neueSF = {};
    let fortfahren = true;
    while (fortfahren) {
      const sfName = prompt("Name der Spezialfertigkeit (leer = Ende):");
      if (!sfName) {
        fortfahren = false;
        break;
      }
      const levelStr = prompt(
        `Level für "${sfName}":`,
        daten.spezialfertigkeiten[sfName] || "0"
      );
      const level = parseInt(levelStr);
      if (!isNaN(level)) {
        neueSF[sfName] = level;
      }
    }
    await firestore
      .doc(`Spieler/${spielerId}/Helden/${heldId}`)
      .update({ spezialfertigkeiten: neueSF });
    alert("Spezialfertigkeiten aktualisiert. Bitte Seite neu laden.");
  });

  detailsDiv
    .querySelector("#btnBearbeiteAusrüstung")
    .addEventListener("click", async () => {
      const neueAusrüstung = [];
      let fortfahren = true;
      while (fortfahren) {
        const item = prompt("Gegenstand hinzufügen (leer = Ende):");
        if (!item) {
          fortfahren = false;
          break;
        }
        neueAusrüstung.push(item);
      }
      await firestore
        .doc(`Spieler/${spielerId}/Helden/${heldId}`)
        .update({ ausruestung: neueAusrüstung });
      alert("Ausrüstung aktualisiert. Bitte Seite neu laden.");
    });
}
