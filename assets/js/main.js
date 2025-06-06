// assets/js/main.js
import { initFirebase } from "./firebase-init.js"; // optional, falls du etwas initialisieren willst

// Importiere Funktionen, die jede Sektion initialisieren:
import { initSpielerbereich } from "./spielerbereich.js";
import { initNSC } from "./nsc.js";
import { initKalender } from "./kalender.js";
import { initNotizen } from "./notizen.js";
import { initWuerfel } from "./wuerfel.js";
import { initBasar } from "./basar.js";
import { initUmrechner } from "./umrechner.js";
import { initNachschlag } from "./nachschlag.js";
import { initAdmin } from "./admin.js";

const sections = {
  spielerbereich: initSpielerbereich,
  nsc: initNSC,
  kalender: initKalender,
  notizen: initNotizen,
  wuerfel: initWuerfel,
  basar: initBasar,
  umrechner: initUmrechner,
  nachschlag: initNachschlag,
  admin: initAdmin
};

function hideAllSections() {
  document.querySelectorAll(".content-section").forEach(sec => {
    sec.hidden = true;
  });
}

function showSection(hash) {
  const key = hash.replace("#", "");
  if (sections[key]) {
    hideAllSections();
    const sectionEl = document.getElementById(key);
    sectionEl.hidden = false;
    // Initialisiere die Sektion (wird nur beim ersten Mal notwendig sein
    // oder du stellst sicher, dass init nur einmal pro Session ausgeführt wird)
    sections[key](sectionEl);
  } else {
    // Wenn kein Fragment oder unbekanntes Fragment: evtl. zur Startseite zurücksetzen
    hideAllSections();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  // Standard: Wenn kein Hash, dann verstecke alles oder zeige ein Dashboard
  if (!location.hash) {
    hideAllSections();
  } else {
    showSection(location.hash);
  }
});

window.addEventListener("hashchange", () => {
  showSection(location.hash);
});
