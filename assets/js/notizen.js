// assets/js/notizen.js
import { firestore } from "./firebase-init.js";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

export function initNotizen(sectionEl) {
  sectionEl.innerHTML = `
    <h2>Notizen</h2>
    <button id="btnNeueNotiz">Neue Notiz</button>
    <ul id="listeNotizen"></ul>
  `;
  const listeEl = sectionEl.querySelector("#listeNotizen");
  const notizenColl = collection(firestore, "Notizen");

  // Live-Update der Notizen
  onSnapshot(notizenColl, (snapshot) => {
    listeEl.innerHTML = "";
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const li = document.createElement("li");
      li.textContent = data.titel;
      // Klick zum Bearbeiten/Anzeigen:
      li.addEventListener("click", () => {
        const neuerTitel = prompt("Bearbeite Titel:", data.titel);
        const neuerText = prompt("Bearbeite Text:", data.text);
        if (neuerTitel !== null && neuerText !== null) {
          updateDoc(doc(firestore, "Notizen", docSnap.id), {
            titel: neuerTitel,
            text: neuerText
          });
        }
      });
      // Löschen-Button
      const delBtn = document.createElement("button");
      delBtn.textContent = "Löschen";
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (confirm("Wirklich löschen?")) {
          deleteDoc(doc(firestore, "Notizen", docSnap.id));
        }
      });
      li.appendChild(delBtn);
      listeEl.appendChild(li);
    });
  });

  // Neue Notiz anlegen
  sectionEl.querySelector("#btnNeueNotiz").addEventListener("click", () => {
    const titel = prompt("Titel der Notiz:");
    const text = prompt("Text der Notiz:");
    if (titel && text) {
      addDoc(notizenColl, {
        titel,
        text,
        erstelltVon: "spielerX", // hier müsstest du die aktuelle SpielerID setzen
        erstelltAm: new Date()
      });
    }
  });
}
