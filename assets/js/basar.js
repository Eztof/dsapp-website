// assets/js/basar.js

import { firestore } from "./firebase-init.js";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

export function initBasar(sectionEl) {
  sectionEl.innerHTML = `
    <h2>Basar</h2>
    <button id="btnNeuerArtikel">Neuen Artikel anlegen</button>
    <table id="tabelleBasar">
      <thead>
        <tr>
          <th>Name</th>
          <th>Beschreibung</th>
          <th>Preis (Dukaten)</th>
          <th>Gewicht (kg)</th>
          <th>Aktionen</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `;

  const tBody = sectionEl.querySelector("#tabelleBasar tbody");
  const basarColl = collection(firestore, "Basar");
  const q = query(basarColl, orderBy("name"));

  // Firestore-Live-Update
  onSnapshot(q, (snapshot) => {
    tBody.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const tr = document.createElement("tr");

      const datumHTML = `
        <td>${data.name}</td>
        <td>${data.beschreibung}</td>
        <td>${data.preis}</td>
        <td>${data.gewicht}</td>
        <td></td>
      `;
      tr.innerHTML = datumHTML;

      const actionTd = tr.querySelector("td:last-child");

      // Bearbeiten-Button
      const bearbBtn = document.createElement("button");
      bearbBtn.textContent = "Bearbeiten";
      bearbBtn.addEventListener("click", () => {
        bearbeitenArtikel(docSnap.id, data);
      });

      // Löschen-Button
      const delBtn = document.createElement("button");
      delBtn.textContent = "Löschen";
      delBtn.addEventListener("click", async () => {
        if (confirm(`Artikel "${data.name}" wirklich löschen?`)) {
          await deleteDoc(doc(firestore, "Basar", docSnap.id));
        }
      });

      actionTd.append(bearbBtn, delBtn);
      tBody.appendChild(tr);
    });
  });

  // Neuen Artikel anlegen
  sectionEl.querySelector("#btnNeuerArtikel").addEventListener("click", async () => {
    const name = prompt("Name des Artikels:");
    if (!name) return;

    const beschreibung = prompt("Beschreibung:");
    const preisStr = prompt("Preis (Anzahl Dukaten):");
    const gewichtStr = prompt("Gewicht (in kg, z.B. 1.5):");

    const preis = parseFloat(preisStr);
    const gewicht = parseFloat(gewichtStr);

    if (isNaN(preis) || isNaN(gewicht)) {
      alert("Preis und Gewicht müssen Zahlen sein.");
      return;
    }

    await addDoc(basarColl, {
      name,
      beschreibung: beschreibung || "",
      preis,
      gewicht
    });

    alert("Neuer Artikel angelegt.");
  });

  // Hilfsfunktion: Artikel bearbeiten
  function bearbeitenArtikel(docId, data) {
    const neuerName = prompt("Neuer Name:", data.name);
    if (neuerName === null) return;

    const neueBeschreibung = prompt("Neue Beschreibung:", data.beschreibung);
    const neuerPreisStr = prompt("Neuer Preis (Dukaten):", data.preis);
    const neuesGewichtStr = prompt("Neues Gewicht (kg):", data.gewicht);

    const neuerPreis = parseFloat(neuerPreisStr);
    const neuesGewicht = parseFloat(neuesGewichtStr);

    if (isNaN(neuerPreis) || isNaN(neuesGewicht)) {
      alert("Preis und Gewicht müssen Zahlen sein.");
      return;
    }

    updateDoc(doc(firestore, "Basar", docId), {
      name: neuerName,
      beschreibung: neueBeschreibung || "",
      preis: neuerPreis,
      gewicht: neuesGewicht
    });
  }
}
