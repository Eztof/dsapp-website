// Beispiel: In kalender.js
import { firestore } from "./firebase-init.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

export function initKalender(sectionEl) {
  // Füge FullCalendar CSS & JS per <link> und <script> in index.html ein (via CDN)
  // Dann hier ein <div id="calendar"></div> einfügen:
  sectionEl.innerHTML = `
    <h2>Kalender</h2>
    <div id="calendar"></div>
    <button id="neuerEintrag">Neuen Eintrag erstellen</button>
  `;
  // FullCalendar initialisieren (z.B. in einem Promise, nachdem die Bibliothek geladen ist)
  const calendarEl = sectionEl.querySelector("#calendar");
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: [] // start leer
  });
  calendar.render();

  // Firestore-Daten beobachten:
  const kalenderColl = collection(firestore, "Kalender");
  onSnapshot(kalenderColl, (snapshot) => {
    const events = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      events.push({
        id: doc.id,
        title: data.titel,
        start: data.startDatum.toDate(),
        end: data.endDatum ? data.endDatum.toDate() : null
        // falls Wiederholung: extra-Feld auswerten
      });
    });
    calendar.removeAllEvents();
    calendar.addEventSource(events);
  });

  // Button für neuen Eintrag:
  sectionEl.querySelector("#neuerEintrag").addEventListener("click", () => {
    // Öffne ein Formular per prompt() oder Modal, um Titel, Datum, Uhrzeit, Beschreibung, Wiederholung zu erfassen.
    // Anschließend addDoc() in Firestore.
    const titel = prompt("Titel des Termins:");
    const datum = prompt("Datum (YYYY-MM-DD, z.B. 2025-06-20):");
    const startZeit = prompt("Uhrzeit (HH:MM, z.B. 18:00):");
    if (titel && datum && startZeit) {
      const startTimestamp = new Date(`${datum}T${startZeit}:00`);
      // Neu anlegen:
      import("https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js").then(
        ({ addDoc, collection }) => {
          addDoc(kalenderColl, {
            titel,
            startDatum: startTimestamp,
            beschreibung: "",
            // evtl. weitere Felder
          }).then(() => {
            alert("Termin gespeichert!");
          });
        }
      );
    }
  });
}
