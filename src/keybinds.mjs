const defaults = {
  cometfall: { up: "w", down: "s", left: "a", right: "d", fire: " ", dash: "Shift", pause: "p" },
  danmaku: { up: "w", down: "s", left: "a", right: "d", fire: " ", focus: "Shift", bomb: "x", pause: "p", confirm: " " }
};

const labels = {
  pt: { title: "Configurar controles", subtitle: "Clique em um atalho e pressione a nova tecla.", close: "Fechar", reset: "Restaurar padrões", cometfall: "COMETFALL", danmaku: "BULLET HELL", up: "Mover para cima", down: "Mover para baixo", left: "Mover para esquerda", right: "Mover para direita", fire: "Atirar", dash: "Dash", focus: "Foco", bomb: "Bomba", pause: "Pausar", confirm: "Confirmar escolha", listening: "PRESSIONE UMA TECLA…", saved: "SALVO", cancel: "ESC para cancelar" },
  en: { title: "Configure controls", subtitle: "Choose a binding and press the new key.", close: "Close", reset: "Restore defaults", cometfall: "COMETFALL", danmaku: "BULLET HELL", up: "Move up", down: "Move down", left: "Move left", right: "Move right", fire: "Fire", dash: "Dash", focus: "Focus", bomb: "Bomb", pause: "Pause", confirm: "Confirm choice", listening: "PRESS A KEY…", saved: "SAVED", cancel: "ESC to cancel" },
  es: { title: "Configurar controles", subtitle: "Elige una tecla y presiona la nueva.", close: "Cerrar", reset: "Restaurar valores", cometfall: "COMETFALL", danmaku: "BULLET HELL", up: "Mover arriba", down: "Mover abajo", left: "Mover izquierda", right: "Mover derecha", fire: "Disparar", dash: "Dash", focus: "Enfoque", bomb: "Bomba", pause: "Pausar", confirm: "Confirmar elección", listening: "PRESIONA UNA TECLA…", saved: "GUARDADO", cancel: "ESC para cancelar" }
};

export function normalizeKey(key) {
  if (key === " ") return " ";
  if (/^Arrow/i.test(key)) return `Arrow${key.slice(5, 6).toUpperCase()}${key.slice(6).toLowerCase()}`;
  return String(key).toLowerCase();
}

function load() {
  try {
    const stored = JSON.parse(localStorage.getItem("arcade-keybinds") || "null");
    return Object.fromEntries(Object.keys(defaults).map((game) => [game, Object.fromEntries(Object.entries(defaults[game]).map(([action, value]) => [action, normalizeKey(stored?.[game]?.[action] || value)]))]));
  } catch { return structuredClone(defaults); }
}

let bindings = load();

export function getKeybind(game, action) { return bindings[game]?.[action] || defaults[game]?.[action]; }
export function keyMatches(game, action, key) { return normalizeKey(key) === getKeybind(game, action); }
export function actionDown(game, action, keys) {
  if (keys.has(getKeybind(game, action))) return true;
  const arrows = { up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight" };
  return arrows[action] ? keys.has(arrows[action]) : false;
}

function keyLabel(key) {
  const special = { " ": "SPACE", arrowup: "↑", arrowdown: "↓", arrowleft: "←", arrowright: "→", shift: "SHIFT", control: "CTRL", alt: "ALT", enter: "ENTER", escape: "ESC", tab: "TAB", backspace: "BACKSPACE", delete: "DEL" };
  return special[String(key).toLowerCase()] || key.toUpperCase();
}

function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[char]); }

export function keybindMenuMarkup(language = "pt") {
  const t = labels[language] || labels.pt;
  const groups = Object.entries(defaults).map(([game, actions]) => `<section class="keybind-group"><h3>${t[game]}</h3>${Object.keys(actions).map((action) => { const value = escapeHtml(keyLabel(getKeybind(game, action))); return `<div class="keybind-row"><span>${t[action]}</span><button type="button" data-keybind="${game}:${action}" aria-label="${t[action]}: ${value}"><kbd>${value}</kbd></button></div>`; }).join("")}</section>`).join("");
  return `<div class="keybind-overlay" data-keybind-overlay hidden><section class="keybind-dialog" role="dialog" aria-modal="true" aria-labelledby="keybind-title"><header><div><span class="keybind-kicker">ARCADE INPUT SYSTEM</span><h2 id="keybind-title">${t.title}</h2><p>${t.subtitle}</p></div><button type="button" class="keybind-close" data-keybind-close aria-label="${t.close}">×</button></header><div class="keybind-groups">${groups}</div><footer><small data-keybind-status>${t.cancel}</small><button type="button" data-keybind-reset>${t.reset}</button></footer></section></div>`;
}

export function mountKeybindMenu(root, language = "pt") {
  const t = labels[language] || labels.pt;
  const overlay = root.querySelector("[data-keybind-overlay]");
  const status = root.querySelector("[data-keybind-status]");
  let listening = null;
  const refresh = () => root.querySelectorAll("[data-keybind]").forEach((button) => {
    const [game, action] = button.dataset.keybind.split(":");
    const value = keyLabel(getKeybind(game, action));
    const key = document.createElement("kbd"); key.textContent = value; button.replaceChildren(key);
    button.setAttribute("aria-label", `${t[action]}: ${value}`);
  });
  const close = () => { listening = null; overlay.hidden = true; status.textContent = t.cancel; window.dispatchEvent(new Event("arcade-keybind-close")); };
  root.querySelector("[data-keybinds-open]").addEventListener("click", () => { overlay.hidden = false; status.textContent = t.cancel; window.dispatchEvent(new Event("arcade-keybind-open")); root.querySelector("[data-keybind-close]").focus(); });
  root.querySelector("[data-keybind-close]").addEventListener("click", close);
  overlay.addEventListener("click", (event) => { if (event.target === overlay) close(); });
  root.querySelectorAll("[data-keybind]").forEach((button) => button.addEventListener("click", () => {
    listening = button.dataset.keybind;
    status.textContent = t.listening;
    button.focus();
  }));
  root.querySelector("[data-keybind-reset]").addEventListener("click", () => {
    bindings = structuredClone(defaults);
    try { localStorage.setItem("arcade-keybinds", JSON.stringify(bindings)); } catch { /* Use defaults for this session. */ }
    listening = null; refresh(); status.textContent = t.saved;
  });
  const capture = (event) => {
    if (overlay.hidden) return;
    if (event.key === "Escape" && !listening) { event.preventDefault(); event.stopImmediatePropagation(); close(); return; }
    if (!listening) { event.stopImmediatePropagation(); return; }
    event.preventDefault(); event.stopImmediatePropagation();
    if (event.key === "Escape") { listening = null; status.textContent = t.cancel; refresh(); return; }
    const [game, action] = listening.split(":");
    bindings[game][action] = normalizeKey(event.key);
    try { localStorage.setItem("arcade-keybinds", JSON.stringify(bindings)); } catch { /* Keep the new binding for this session. */ }
    listening = null; refresh(); status.textContent = t.saved;
  };
  window.addEventListener("keydown", capture, true);
  return () => window.removeEventListener("keydown", capture, true);
}
