// assets/js/wuerfel.js
export function initWuerfel(sectionEl) {
  sectionEl.innerHTML = `
    <h2>Würfel</h2>
    <label>Anzahl Würfel: <input type="number" id="anzahlWuerfel" value="1" min="1" /></label>
    <label>Augen pro Würfel: 
      <select id="selectAugen">
        <option value="4">W4</option>
        <option value="6" selected>W6</option>
        <option value="8">W8</option>
        <option value="10">W10</option>
        <option value="20">W20</option>
      </select>
    </label>
    <button id="btnWuerfeln">Würfeln</button>
    <p id="wuerfelErgebnis"></p>
  `;
  const btn = sectionEl.querySelector("#btnWuerfeln");
  btn.addEventListener("click", () => {
    const anzahl = parseInt(sectionEl.querySelector("#anzahlWuerfel").value) || 1;
    const augen = parseInt(sectionEl.querySelector("#selectAugen").value);
    let gesamt = 0;
    let details = [];
    for (let i = 0; i < anzahl; i++) {
      const wurf = Math.floor(Math.random() * augen) + 1;
      details.push(wurf);
      gesamt += wurf;
    }
    sectionEl.querySelector("#wuerfelErgebnis").textContent = 
      `Ergebnis: ${gesamt} (${details.join(" + ")})`;
  });
}
