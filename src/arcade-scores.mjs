const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const copy = {
  pt: { title: "INICIAIS DO ARCADE", hint: "↑/↓ muda a letra · botão direito volta · ←/→ escolhe a posição · Enter avança", save: "REGISTRAR PONTUAÇÃO", saved: "PONTUAÇÃO REGISTRADA", board: "MELHORES PILOTOS", empty: "Ainda sem pontuações registradas." },
  en: { title: "ARCADE INITIALS", hint: "↑/↓ change letter · right-click goes back · ←/→ select slot · Enter advances", save: "SAVE SCORE", saved: "SCORE SAVED", board: "TOP PILOTS", empty: "No scores recorded yet." },
  es: { title: "INICIALES ARCADE", hint: "↑/↓ cambia letra · clic derecho retrocede · ←/→ elige posición · Enter avanza", save: "GUARDAR PUNTUACIÓN", saved: "PUNTUACIÓN GUARDADA", board: "MEJORES PILOTOS", empty: "Aún no hay puntuaciones." }
};

function cleanRecords(value) {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => ({
    initials: String(entry?.initials || "AAAA").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4).padEnd(4, "A"),
    score: Math.max(0, Math.floor(Number(entry?.score) || 0)),
    at: Number(entry?.at) || 0
  })).filter((entry) => entry.score > 0).sort((a, b) => b.score - a.score || b.at - a.at).slice(0, 10);
}

export function arcadeRecords(gameId, legacyBestKey) {
  try {
    const parsed = JSON.parse(localStorage.getItem(`${gameId}-arcade-records`) || "null");
    const records = cleanRecords(parsed);
    if (records.length) return records;
    const legacy = Math.floor(Number(localStorage.getItem(legacyBestKey)) || 0);
    return legacy > 0 ? [{ initials: "AAAA", score: legacy, at: 0 }] : [];
  } catch { return []; }
}

export function arcadeRecordMarkup(gameId, legacyBestKey, language = "pt") {
  const t = copy[language] || copy.pt;
  const records = arcadeRecords(gameId, legacyBestKey).slice(0, 5);
  return `<section class="arcade-scoreboard" data-scoreboard><h4>${t.board}</h4>${records.length
    ? `<ol>${records.map((entry) => `<li><span>${entry.initials}</span><b>${entry.score.toLocaleString()}</b></li>`).join("")}</ol>`
    : `<p>${t.empty}</p>`}</section>`;
}

export function mountArcadeScoreEntry(root, { gameId, legacyBestKey, language = "pt" }) {
  const entry = root.querySelector("[data-arcade-score-entry]");
  if (!entry) return { show() {}, reset() {}, debugSave() { return false; } };
  const t = copy[language] || copy.pt;
  const slots = [...entry.querySelectorAll("[data-score-letter]")];
  const submit = entry.querySelector("[data-score-submit]");
  let letters = ["A", "A", "A", "A"];
  let selected = 0;
  let currentScore = 0;
  let saved = false;

  const paint = () => slots.forEach((button, index) => {
    button.textContent = letters[index];
    button.classList.toggle("selected", selected === index);
    button.setAttribute("aria-pressed", String(selected === index));
  });
  const recordsView = () => {
    const scoreboard = root.querySelector("[data-scoreboard]");
    if (scoreboard) scoreboard.outerHTML = arcadeRecordMarkup(gameId, legacyBestKey, language);
  };
  const show = (score) => {
    currentScore = Math.max(0, Math.floor(Number(score) || 0));
    letters = ["A", "A", "A", "A"];
    selected = 0;
    saved = false;
    entry.hidden = false;
    submit.disabled = false;
    submit.textContent = t.save;
    paint();
    slots[0]?.focus({ preventScroll: true });
  };
  const reset = () => { entry.hidden = true; saved = false; };
  const debugSave = (score, initials = "DBG") => {
    const value = Math.max(0, Math.floor(Number(score) || 0));
    if (!value) return false;
    const name = String(initials || "DBG").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4).padEnd(4, "A");
    const records = arcadeRecords(gameId, legacyBestKey);
    records.push({ initials: name, score: value, at: Date.now() });
    try { localStorage.setItem(`${gameId}-arcade-records`, JSON.stringify(cleanRecords(records))); } catch { return false; }
    recordsView();
    return true;
  };
  slots.forEach((button, index) => button.addEventListener("click", () => {
    selected = index;
    letters[index] = alphabet[(alphabet.indexOf(letters[index]) + 1) % alphabet.length];
    paint();
  }));
  root.addEventListener("contextmenu", (event) => {
    const button = event.target.closest("[data-score-letter]");
    if (!button || entry.hidden) return;
    event.preventDefault();
    selected = Number(button.dataset.slot) || 0;
    letters[selected] = alphabet[(alphabet.indexOf(letters[selected]) - 1 + alphabet.length) % alphabet.length];
    paint();
    button.focus({ preventScroll: true });
  });
  root.addEventListener("keydown", (event) => {
    if (entry.hidden || !event.target.closest("[data-score-letter]")) return;
    selected = Number(event.target.dataset.slot) || 0;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      const delta = event.key === "ArrowUp" ? 1 : -1;
      letters[selected] = alphabet[(alphabet.indexOf(letters[selected]) + delta + alphabet.length) % alphabet.length];
      paint();
    } else if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "Enter") {
      if (event.key === "Enter" && selected === 3) {
        submit?.focus({ preventScroll: true });
        return;
      }
      selected = (selected + (event.key === "ArrowLeft" ? 3 : 1)) % 4;
      paint();
      slots[selected]?.focus({ preventScroll: true });
    }
  });
  submit?.addEventListener("click", () => {
    if (saved || currentScore <= 0) return;
    const records = arcadeRecords(gameId, legacyBestKey);
    records.push({ initials: letters.join(""), score: currentScore, at: Date.now() });
    try { localStorage.setItem(`${gameId}-arcade-records`, JSON.stringify(cleanRecords(records))); } catch { /* Keep this run usable if storage is full. */ }
    saved = true;
    submit.disabled = true;
    submit.textContent = t.saved;
    recordsView();
  });
  paint();
  return { show, reset, debugSave };
}

export function arcadeScoreEntryMarkup(gameId, legacyBestKey, language = "pt") {
  const t = copy[language] || copy.pt;
  return `<section class="arcade-score-entry" data-arcade-score-entry hidden><h4>${t.title}</h4><div class="arcade-initial-slots" role="group" aria-label="${t.title}">${[0, 1, 2, 3].map((index) => `<button type="button" data-score-letter data-slot="${index}" aria-label="Letra ${index + 1}" aria-pressed="${index === 0}">A</button>`).join("")}</div><small>${t.hint}</small><button type="button" class="arcade-score-submit" data-score-submit>${t.save}</button></section>${arcadeRecordMarkup(gameId, legacyBestKey, language)}`;
}
