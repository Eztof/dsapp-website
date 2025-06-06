// assets/js/umrechner.js
export function initUmrechner(sectionEl) {
  sectionEl.innerHTML = `
    <h2>Umrechner</h2>
    <div>
      <label>Wert eingeben: <input type="number" id="eingabeWert" /></label>
    </div>
    <div>
      <label>Einheit: 
        <select id="selectEinheit">
          <option value="meterNachSchritt">Meter → Schritt</option>
          <option value="schrittNachMeter">Schritt → Meter</option>
          <option value="dukatenNachHeller">Dukaten → Heller</option>
          <option value="hellerNachDukaten">Heller → Dukaten</option>
          <!-- Weitere Umrechnungen … -->
        </select>
      </label>
    </div>
    <button id="btnUmrechnen">Umrechnen</button>
    <p id="ergebnis"></p>
  `;
  sectionEl.querySelector("#btnUmrechnen").addEventListener("click", () => {
    const wert = parseFloat(sectionEl.querySelector("#eingabeWert").value);
    const einheit = sectionEl.querySelector("#selectEinheit").value;
    let ausgabe = "";
    switch (einheit) {
      case "meterNachSchritt":
        ausgabe = (wert * 5).toFixed(2) + " Schritt"; // z. B. 1m = 5 Schritt
        break;
      case "schrittNachMeter":
        ausgabe = (wert / 5).toFixed(2) + " m";
        break;
      case "dukatenNachHeller":
        ausgabe = (wert * 240).toFixed(2) + " Heller"; // z. B. 1 Dukate = 240 Heller
        break;
      case "hellerNachDukaten":
        ausgabe = (wert / 240).toFixed(2) + " Dukaten";
        break;
      // … weitere Umrechnungen
    }
    sectionEl.querySelector("#ergebnis").textContent = ausgabe;
  });
}
