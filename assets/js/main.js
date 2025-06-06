// assets/js/main.js

// Wir importieren nur die init-Funktionen der einzelnen Module
import { initSpielerbereich } from "./spielerbereich.js";
import { initNSC }           from "./nsc.js";
import { initKalender }      from "./kalender.js";
import { initNotizen }       from "./notizen.js";
import { initWuerfel }       from "./wuerfel.js";
import { initBasar }         from "./basar.js";
import { initUmrechner }     from "./umrechner.js";
import { initNachschlag }    from "./nachschlag.js";
import { initAdmin }         from "./admin.js";

// Mapping von Hash-Fragment zu den jeweiligen Init-Funktionen
const sections = {
  spielerbereich: initSpielerbereich,
  nsc:           initNSC,
  kalender:      initKalender,
  notizen:       initNotizen,
  wuerfel:       initWuerfel,
  basar:         initBasar,
  umrechner:     initUmrechner,
  nachschlag:    initNachschlag,
  admin:         initAdmin
};

// Versteckt alle Sektionen
function hideAllSections() {
  document.querySelectorAll(".content-section").forEach(sec => {
    sec.hidden = true;
  });
}

// Zeigt genau die Sektion zum aktuellen Hash und initialisiert sie
function showSection(hash) {
  const key = hash.replace("#", "");
  if (sections[key]) {
    hideAllSections();
    const sectionEl = document.getElementById(key);
    sectionEl.hidden = false;
    // Initialisiere die Sektion (z. B. initBasar(sectionEl))
    sections[key](sectionEl);
  } else {
    // Wenn kein gültiger Hash, verstecke alle (oder zeige Startbildschirm)
    hideAllSections();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  if (!location.hash) {
    hideAllSections();
  } else {
    showSection(location.hash);
  }
});

window.addEventListener("hashchange", () => {
  showSection(location.hash);
});
