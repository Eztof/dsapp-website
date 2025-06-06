// assets/js/nsc.js

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

export function initNSC(sectionEl) {
  sectionEl.innerHTML = `
    <h2>NSCs</h2>
    <button id="btnNeuerNSC">Neuen NSC anlegen</button>
    <table id="tabelleNSC">
      <thead>
        <tr>
          <th>Name</th>
          <th>Beschreibung</th>
          <th>Ort</th>
          <th>Datum Kennenlernen</th>
          <th>Status</th>
          <th>Aktionen</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `;

  const tBody = sectionEl.querySelector("#tabelleNSC tbody");
  const nscColl = collection(firestore, "NSCs");
  const q = query(nscColl, orderBy("name"));

  // Live-Updates aus Firestore
  onSnapshot(q, (snapshot) => {
    tBody.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const tr = document.createElement("tr");

      // Datum in lesbare Form bringen
      const datumObj = data.datum instanceof Date ? data.datum : data.datum.toDate();
      const datumStr = datumObj.toLocaleDateString("de-DE");

      tr.innerHTML = `
        <td>${data.name}</td>
        <td>${data.beschreibung}</td>
        <td>${data.ort}</td>
        <td>${datumStr}</td>
        <td>${data.status}</td>
        <td></td>
      `;

      // Aktionen
      const actionTd = tr.querySelector("td:last-child");

      const bearbBtn = document.createElement("button");
      bearbBtn.textContent = "Bearbeiten";
      bearbBtn.addEventListener("click", () => {
        bearbeitenNSC(docSnap.id, data);
      });

      const delBtn = document.createElement("button");
      delBtn.textContent = "Löschen";
      delBtn.addEventListener("click", async () => {
        if (confirm(`NSC "${data.name}" wirklich löschen?`)) {
          await deleteDoc(doc(firestore, "NSCs", docSnap.id));
        }
      });

      actionTd.append(bearbBtn, delBtn);
      tBody.appendChild(tr);
    });
  });

  // Neuer NSC anlegen
  sectionEl.querySelector("#btnNeuerNSC").addEventListener("click", async () => {
    const name = prompt("Name des NSC:");
    if (!name) return;

    const beschreibung = prompt("Beschreibung:");
    const ort = prompt("Ort des Kennenlernens:");
    const datumStr = prompt("Datum (YYYY-MM-DD):");
    const status = prompt("Status (z.B. lebendig, tot):", "lebendig");

    if (!datumStr) {
      alert("Datum erforderlich.");
      return;
    }

    const datum = new Date(datumStr);
    if (isNaN(datum.getTime())) {
      alert("Ungültiges Datum.");
      return;
    }

    await addDoc(nscColl, {
      name,
      beschreibung: beschreibung || "",
      ort: ort || "",
      datum,
      status: status || "unbekannt"
    });

    alert("Neuer NSC angelegt.");
  });

  // Funktion: NSC bearbeiten
  function bearbeitenNSC(docId, data) {
    const neuerName = prompt("Neuer Name:", data.name);
    if (neuerName === null) return;

    const neueBeschreibung = prompt("Neue Beschreibung:", data.beschreibung);
    const neuerOrt = prompt("Neuer Ort:", data.ort);
    const neuesDatumStr = prompt(
      "Neues Datum (YYYY-MM-DD):",
      data.datum.toDate().toISOString().split("T")[0]
    );
    const neuerStatus = prompt("Neuer Status:", data.status);

    let neuesDatum = data.datum;
    if (neuesDatumStr) {
      const temp = new Date(neuesDatumStr);
      if (!isNaN(temp.getTime())) {
        neuesDatum = temp;
      }
    }

    updateDoc(doc(firestore, "NSCs", docId), {
      name: neuerName,
      beschreibung: neueBeschreibung || "",
      ort: neuerOrt || "",
      datum: neuesDatum,
      status: neuerStatus || data.status
    });
  }
}
