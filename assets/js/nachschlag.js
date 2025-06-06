// assets/js/nachschlag.js
import { firestore } from "./firebase-init.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

export function initNachschlag(sectionEl) {
  sectionEl.innerHTML = `
    <h2>Nachschlagwerkzeug</h2>
    <input type="text" id="inputBegriff" placeholder="Suchbegriff eingeben" />
    <button id="btnSuchen">Suchen</button>
    <ul id="ergebnisListe"></ul>
  `;
  const input = sectionEl.querySelector("#inputBegriff");
  const btn = sectionEl.querySelector("#btnSuchen");
  const ergebnisListe = sectionEl.querySelector("#ergebnisListe");
  const nachschlagColl = collection(firestore, "Nachschlag");

  btn.addEventListener("click", async () => {
    ergebnisListe.innerHTML = "";
    const begriff = input.value.trim().toLowerCase();
    if (!begriff) return;
    // Einfache Query: nach exaktem Begriff suchen
    const q = query(nachschlagColl, where("begriff_lower", "==", begriff));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      ergebnisListe.innerHTML = "<li>Keine Ergebnisse gefunden.</li>";
      return;
    }
    querySnapshot.forEach(docSnap => {
      const data = docSnap.data();
      const li = document.createElement("li");
      li.textContent = `${data.begriff} → ${data.buch}, Seite ${data.seite}`;
      ergebnisListe.appendChild(li);
    });
  });
}
