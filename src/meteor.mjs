import { actionDown, keyMatches, normalizeKey } from "./keybinds.mjs";
import { arcadeScoreEntryMarkup, mountArcadeScoreEntry } from "./arcade-scores.mjs";

const translations = {
  pt: {
    eyebrow: "PROTOCOLO DE DEFESA · SETOR 07", title: "STARFALL", subtitle: "Uma órbita. Hordas sem fim. Faça cada escolha contar.",
    choose: "Escolha sua nave", start: "Iniciar missão", controls: "WASD / setas para mover · mire e atire com o mouse · Shift para dash · P para pausar",
    dash: "DASH", fire: "ATIRAR",
    ranger: "Batedora", rangerText: "Equilibrada e confiável", interceptor: "Interceptadora", interceptorText: "Rápida, frágil, dispara mais", dreadnought: "Couraçada", dreadnoughtText: "Lenta, blindada, impacto pesado",
    wave: "ONDA", level: "NÍVEL", kills: "ABATES", hull: "CASCO", xp: "XP", pause: "PAUSADO", resume: "Continuar", upgradeTitle: "Escolha um módulo", upgradeHint: "A combinação é sua. A próxima horda não espera.",
    gameOver: "NAVE DESTRUÍDA", score: "PONTUAÇÃO", best: "RECORDE", restart: "Tentar novamente", menu: "Trocar nave", mobile: "CONTROLES", acquired: "MÓDULOS", survival: "TEMPO", boss: "CHEFE", combo: "COMBO", newRecord: "NOVO RECORDE", sound: "EFEITOS", soundOn: "Efeitos sonoros ligados", soundOff: "Efeitos sonoros desligados", bossNames: ["Ruptor · O Aríete", "Ninhada · A Matriarca", "Vórtice · O Bombardeiro"],
    upgrades: [
      ["Canhão de nêutrons", "Dano dos disparos +30%", "◆"], ["Ciclo acelerado", "Cadência de tiro +22%", "⟳"], ["Mira múltipla", "Dispara um projétil extra", "⋔"],
      ["Núcleo perfurante", "Projéteis atravessam +2 cometas", "↠"], ["Propulsores", "Velocidade de movimento +16%", "⌁"], ["Blindagem ablativa", "Casco máximo +25 e recupera 25", "⬡"],
      ["Campo de força", "Reduz dano recebido em 1", "◉"], ["Nanorreparo", "Recupera 1 de casco a cada 9 s", "✚"], ["Coletor gravitacional", "Atrai fragmentos de XP de mais longe", "◎"],
      ["Núcleo de experiência", "Fragmentos concedem 25% mais XP", "✦"], ["Mira crítica", "20% de chance de dano dobrado", "✧"], ["Carga sísmica", "Explosão ao destruir um cometa", "✹"],
      ["Drone sentinela", "Adiciona um drone que dispara", "⌖"], ["Órbita de plasma", "Adiciona um orbe que atinge inimigos próximos", "⦿"], ["Gelo profundo", "Disparos reduzem a velocidade dos cometas", "❄"],
      ["Ricochete", "Projéteis saltam para outro alvo", "⤴"], ["Carga de emergência", "Recupera 18 de casco imediatamente", "♥"], ["Sobrecarga", "Dano +18% e cadência +10%", "⚡"],
      ["Bateria de íons", "Projéteis + velocidade e + dano", "⬢"], ["Ímã de sucata", "Aumenta o raio de coleta em 65%", "⌑"]
    ]
  },
  en: {
    eyebrow: "DEFENSE PROTOCOL · SECTOR 07", title: "STARFALL", subtitle: "One orbit. Endless hordes. Make every choice count.",
    choose: "Choose your ship", start: "Launch mission", controls: "WASD / arrows to move · aim and fire with mouse · Shift to dash · P to pause",
    dash: "DASH", fire: "FIRE",
    ranger: "Ranger", rangerText: "Balanced and reliable", interceptor: "Interceptor", interceptorText: "Fast, fragile, fires faster", dreadnought: "Dreadnought", dreadnoughtText: "Slow, armored, heavy impact",
    wave: "WAVE", level: "LEVEL", kills: "KILLS", hull: "HULL", xp: "XP", pause: "PAUSED", resume: "Resume", upgradeTitle: "Choose a module", upgradeHint: "Build your combination. The next horde is waiting.",
    gameOver: "SHIP DESTROYED", score: "SCORE", best: "BEST", restart: "Run it back", menu: "Change ship", mobile: "CONTROLS", acquired: "MODULES", survival: "SURVIVED", boss: "BOSS", combo: "COMBO", newRecord: "NEW HIGH SCORE", sound: "SFX", soundOn: "Sound effects on", soundOff: "Sound effects off", bossNames: ["Breach · The Ram", "Brood · The Matriarch", "Vortex · The Bombardier"],
    upgrades: [
      ["Neutron cannon", "Shot damage +30%", "◆"], ["Rapid cycle", "Fire rate +22%", "⟳"], ["Split targeting", "Fire one extra projectile", "⋔"],
      ["Piercing core", "Projectiles pass through 2 more comets", "↠"], ["Thrusters", "Move speed +16%", "⌁"], ["Ablative armor", "Max hull +25 and restore 25", "⬡"],
      ["Force field", "Reduce incoming damage by 1", "◉"], ["Nanorepair", "Restore 1 hull every 9 s", "✚"], ["Gravity collector", "Pull XP shards from farther away", "◎"],
      ["XP core", "Shards grant 25% more XP", "✦"], ["Critical targeting", "20% chance to deal double damage", "✧"], ["Seismic charge", "Explosions on comet kills", "✹"],
      ["Sentinel drone", "Add a drone that fires", "⌖"], ["Plasma orbit", "Add an orb that hits nearby enemies", "⦿"], ["Deep freeze", "Shots slow comets", "❄"],
      ["Ricochet", "Projectiles bounce to another target", "⤴"], ["Emergency charge", "Immediately restore 18 hull", "♥"], ["Overdrive", "Damage +18% and fire rate +10%", "⚡"],
      ["Ion battery", "Projectiles gain speed and damage", "⬢"], ["Scrap magnet", "Increase pickup radius by 65%", "⌑"]
    ]
  },
  es: {
    eyebrow: "PROTOCOLO DE DEFENSA · SECTOR 07", title: "STARFALL", subtitle: "Una órbita. Hordas infinitas. Cada decisión cuenta.",
    choose: "Elige tu nave", start: "Iniciar misión", controls: "WASD / flechas para moverte · apunta y dispara con el ratón · Shift para dash · P para pausar",
    dash: "DASH", fire: "DISPARAR",
    ranger: "Exploradora", rangerText: "Equilibrada y fiable", interceptor: "Interceptora", interceptorText: "Rápida, frágil, dispara más", dreadnought: "Acorazada", dreadnoughtText: "Lenta, blindada, gran impacto",
    wave: "OLEADA", level: "NIVEL", kills: "BAJAS", hull: "CASCO", xp: "XP", pause: "EN PAUSA", resume: "Continuar", upgradeTitle: "Elige un módulo", upgradeHint: "Elige tu combinación. La siguiente oleada espera.",
    gameOver: "NAVE DESTRUIDA", score: "PUNTUACIÓN", best: "RÉCORD", restart: "Intentar de nuevo", menu: "Cambiar nave", mobile: "CONTROLES", acquired: "MÓDULOS", survival: "TIEMPO", boss: "JEFE", combo: "COMBO", newRecord: "NUEVO RÉCORD", sound: "SONIDO", soundOn: "Efectos de sonido activados", soundOff: "Efectos de sonido desactivados", bossNames: ["Brecha · El Ariete", "Enjambre · La Matriarca", "Vórtice · El Bombardero"],
    upgrades: [
      ["Cañón de neutrones", "Daño de disparo +30%", "◆"], ["Ciclo rápido", "Cadencia de disparo +22%", "⟳"], ["Mira múltiple", "Dispara un proyectil extra", "⋔"],
      ["Núcleo perforante", "Los proyectiles atraviesan 2 cometas más", "↠"], ["Propulsores", "Velocidad +16%", "⌁"], ["Blindaje ablativo", "Casco máximo +25 y restaura 25", "⬡"],
      ["Campo de fuerza", "Reduce el daño recibido en 1", "◉"], ["Nanorreparación", "Restaura 1 de casco cada 9 s", "✚"], ["Colector gravitatorio", "Atrae fragmentos de XP desde más lejos", "◎"],
      ["Núcleo de XP", "Los fragmentos otorgan 25% más XP", "✦"], ["Mira crítica", "20% de probabilidad de daño doble", "✧"], ["Carga sísmica", "Explosión al destruir un cometa", "✹"],
      ["Dron centinela", "Añade un dron que dispara", "⌖"], ["Órbita de plasma", "Añade un orbe que golpea enemigos cercanos", "⦿"], ["Congelación profunda", "Los disparos ralentizan cometas", "❄"],
      ["Rebote", "Los proyectiles saltan a otro objetivo", "⤴"], ["Carga de emergencia", "Restaura 18 de casco de inmediato", "♥"], ["Sobrecarga", "Daño +18% y cadencia +10%", "⚡"],
      ["Batería de iones", "Proyectiles más rápidos y potentes", "⬢"], ["Imán de chatarra", "Aumenta el radio de recogida un 65%", "⌑"]
    ]
  }
};

const ships = {
  ranger: { speed: 220, hull: 100, damage: 18, fireRate: .72, color: "#a4d980", spread: 1 },
  interceptor: { speed: 285, hull: 72, damage: 13, fireRate: .47, color: "#78baff", spread: 1 },
  dreadnought: { speed: 175, hull: 150, damage: 27, fireRate: .92, color: "#ff9b68", spread: 1 }
};

const upgradeEffects = [
  (p) => { p.damage *= 1.3; }, (p) => { p.fireRate *= .78; }, (p) => { p.spread = Math.min(5, p.spread + 1); },
  (p) => { p.pierce += 2; }, (p) => { p.speed *= 1.16; }, (p) => { p.maxHp += 25; p.hp = Math.min(p.maxHp, p.hp + 25); },
  (p) => { p.armor += 1; }, (p) => { p.regen += 1; }, (p) => { p.magnet *= 1.65; }, (p) => { p.xpBonus *= 1.25; },
  (p) => { p.crit += .2; }, (p) => { p.blast += 28; }, (p) => { p.drones = Math.min(3, p.drones + 1); },
  (p) => { p.orbs = Math.min(4, p.orbs + 1); }, (p) => { p.slow = Math.min(.65, p.slow + .15); },
  (p) => { p.bounce += 1; }, (p) => { p.hp = Math.min(p.maxHp, p.hp + 18); },
  (p) => { p.damage *= 1.18; p.fireRate *= .9; }, (p) => { p.damage *= 1.12; p.bulletSpeed *= 1.2; }, (p) => { p.magnet *= 1.65; }
];

const rand = (min, max) => min + Math.random() * (max - min);
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

function readBest() {
  try { return Number(localStorage.getItem("cometfall-best") || 0); } catch { return 0; }
}

function writeBest(value) {
  try { localStorage.setItem("cometfall-best", String(value)); } catch { /* High score remains available for this session. */ }
}

export function meteorGameMarkup(language = "pt") {
  const t = translations[language] || translations.pt;
  return `<section class="meteor-game" aria-label="Starfall">
    <div class="meteor-screen-head"><div><span class="meteor-eyebrow">${t.eyebrow}</span><h2>${t.title}</h2><p>${t.subtitle}</p></div><div class="meteor-head-actions"><button class="meteor-sound" data-sound aria-pressed="true" aria-label="${t.soundOn}">♫ <span>${t.sound}</span></button><div class="meteor-best"><span>${t.best}</span><strong>${readBest().toLocaleString()}</strong></div></div></div>
    <div class="meteor-stage-wrap"><canvas class="meteor-canvas" aria-label="Starfall game arena"></canvas><div class="meteor-overlay meteor-start"><div class="meteor-start-panel"><span class="meteor-eyebrow">${t.choose}</span><div class="ship-grid">
      ${["ranger", "interceptor", "dreadnought"].map((key, i) => `<button class="ship-card${i === 0 ? " selected" : ""}" data-ship="${key}" aria-pressed="${i === 0}"><span class="ship-art ship-art-${key}">▲</span><strong>${t[key]}</strong><small>${t[`${key}Text`]}</small><span class="ship-stats">${[ships[key].speed, ships[key].hull, ships[key].damage].map((value) => `<i style="--stat:${Math.min(100, value / 3)}%"></i>`).join("")}</span></button>`).join("")}
    </div><button class="meteor-primary" data-start>${t.start}<span>↗</span></button><p class="meteor-controls-hint">${t.controls}</p></div></div>
      <div class="meteor-hud" hidden><span><small>${t.wave}</small><strong data-hud-wave>1</strong></span><span><small>${t.level}</small><strong data-hud-level>1</strong></span><span><small>${t.kills}</small><strong data-hud-kills>0</strong></span><span class="meteor-score"><small>${t.score}</small><strong data-hud-score>0</strong><b data-new-record hidden>${t.newRecord}</b></span><span class="meteor-best-run"><small>${t.best}</small><strong data-hud-best>${readBest().toLocaleString()}</strong></span><span class="meteor-combo" data-hud-combo hidden><small>${t.combo}</small><strong data-hud-combo-value>×2</strong></span><span class="meteor-hull"><small>${t.hull}</small><strong data-hud-hull>100</strong><i><b data-hud-hullbar></b></i></span><span class="meteor-xp"><small>${t.xp}</small><i><b data-hud-xpbar></b></i></span><button class="meteor-dash-button" data-dash aria-label="${t.dash} · Shift"><span>SHIFT · ${t.dash}</span><i><b data-dash-bar></b></i></button><button class="meteor-sound" data-sound aria-pressed="true" aria-label="${t.soundOn}">♫</button><button data-pause aria-label="${t.pause}">Ⅱ</button></div>
      <div class="meteor-bossbar" data-bossbar hidden><span data-boss-name></span><i><b data-boss-hp></b></i></div>
      <div class="meteor-overlay meteor-pause" hidden><div class="meteor-modal"><span class="meteor-eyebrow">${t.eyebrow}</span><h3>${t.pause}</h3><button class="meteor-primary" data-resume>${t.resume}</button></div></div>
      <div class="meteor-overlay meteor-upgrade" hidden><div class="meteor-modal meteor-upgrade-modal"><span class="meteor-eyebrow">${t.level}</span><h3>${t.upgradeTitle}</h3><p>${t.upgradeHint}</p><div class="upgrade-grid" data-upgrade-list></div></div></div>
      <div class="meteor-overlay meteor-over" hidden><div class="meteor-modal"><span class="meteor-eyebrow">${t.gameOver}</span><h3>${t.title}</h3><div class="meteor-results"><span>${t.score}<strong data-final-score>0</strong></span><span>${t.best}<strong data-final-best>0</strong></span><span>${t.kills}<strong data-final-kills>0</strong></span><span>${t.survival}<strong data-final-time>0:00</strong></span></div>${arcadeScoreEntryMarkup("starfall", "cometfall-best", language)}<button class="meteor-primary" data-restart>${t.restart}<span>↗</span></button><button class="meteor-secondary" data-menu>${t.menu}</button></div></div>
      <div class="meteor-touch" aria-label="${t.mobile}"><button data-control="ArrowUp">↑</button><button data-control="ArrowLeft">←</button><button data-control="ArrowDown">↓</button><button data-control="ArrowRight">→</button></div><div class="meteor-touch-actions"><button class="touch-fire" data-fire>${t.fire}</button><button class="touch-dash" data-dash>${t.dash}<i><b data-touch-dash-bar></b></i></button></div>
    </div><div class="arcade-control-monitor" data-arcade-monitor aria-hidden="true"><div class="arcade-monitor-title"><i></i><span>${language === "pt" ? "CONTROLE AO VIVO" : language === "es" ? "CONTROL EN VIVO" : "LIVE CONTROLLER"}</span><b>${language === "pt" ? "ENTRADA" : language === "es" ? "ENTRADA" : "INPUT"} <em data-monitor-state>${language === "pt" ? "PARADO" : language === "es" ? "EN ESPERA" : "IDLE"}</em></b></div><div class="arcade-controller"><div class="arcade-stick-deck"><span>MOVE</span><div class="arcade-stick"><i data-monitor-stick></i></div><small>W A S D</small></div><div class="arcade-action-bank"><span>STARFALL</span><div><i data-monitor-fire>FIRE</i><i data-monitor-dash>DASH</i></div><small>${language === "pt" ? "BOTÕES DE AÇÃO" : language === "es" ? "BOTONES DE ACCIÓN" : "ACTION BUTTONS"}</small></div></div></div><footer class="meteor-footer"><span>${t.controls}</span><span><i class="meteor-live-dot"></i> RUN LOCAL · NO DATA UPLOAD</span></footer></section>`;
}

export function mountMeteorGame(root, language = "pt") {
  const t = translations[language] || translations.pt;
  const canvas = root.querySelector(".meteor-canvas");
  const ctx = canvas.getContext("2d");
  const stage = root.querySelector(".meteor-stage-wrap");
  const monitor = { root: root.querySelector("[data-arcade-monitor]"), stick: root.querySelector("[data-monitor-stick]"), fire: root.querySelector("[data-monitor-fire]"), dash: root.querySelector("[data-monitor-dash]"), state: root.querySelector("[data-monitor-state]") };
  const ui = {
    start: root.querySelector(".meteor-start"), pause: root.querySelector(".meteor-pause"),
    upgrade: root.querySelector(".meteor-upgrade"), over: root.querySelector(".meteor-over"), hud: root.querySelector(".meteor-hud")
  };
  const scoreEntry = mountArcadeScoreEntry(root, { gameId: "starfall", legacyBestKey: "cometfall-best", language });
  const hud = {
    wave: root.querySelector("[data-hud-wave]"), level: root.querySelector("[data-hud-level]"), kills: root.querySelector("[data-hud-kills]"), score: root.querySelector("[data-hud-score]"),
    best: root.querySelector("[data-hud-best]"), newRecord: root.querySelector("[data-new-record]"), combo: root.querySelector("[data-hud-combo]"), comboValue: root.querySelector("[data-hud-combo-value]"),
    hull: root.querySelector("[data-hud-hull]"), hullBar: root.querySelector("[data-hud-hullbar]"), xpBar: root.querySelector("[data-hud-xpbar]"), dashBar: root.querySelector("[data-dash-bar]"),
    touchDashBar: root.querySelector("[data-touch-dash-bar]"), dashButton: root.querySelector(".meteor-dash-button"), bossbar: root.querySelector("[data-bossbar]"), bossName: root.querySelector("[data-boss-name]"), bossHp: root.querySelector("[data-boss-hp]")
  };
  let frame = 0;
  let animation = 0;
  let lastTime = 0;
  let selectedShip = "ranger";
  let mode = "menu";
  let width = 0;
  let height = 0;
  let spawnClock = 0;
  let bossWave = 0;
  let miniBossWave = 0;
  let shotClock = 0;
  let regenClock = 0;
  let score = 0;
  let combo = 0;
  let comboTimer = 0;
  let kills = 0;
  let timeAlive = 0;
  let level = 1;
  let xp = 0;
  let nextXp = 7;
  let player = null;
  let enemies = [];
  let bullets = [];
  let enemyBullets = [];
  let drops = [];
  let particles = [];
  let keys = new Set();
  const monitorKeys = new Set();
  let firing = false;
  let dashCooldown = 0;
  let aim = { x: 0, y: 0 };
  let stars = [];
  let previousBest = readBest();
  let touchPointers = new Map();
  let soundOn = true;
  let audioContext = null;
  let bossBanner = 0;
  let lastHudUpdate = 0;
  let resumeAfterKeybind = false;

  function playSound(type) {
    if (!soundOn) return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      audioContext ||= new Audio();
      if (audioContext.state === "suspended") audioContext.resume();
      const now = audioContext.currentTime;
      const presets = { shot: [520, .045, "square", .025], kill: [180, .11, "triangle", .045], dash: [260, .18, "sawtooth", .045], hit: [95, .2, "sawtooth", .06], upgrade: [660, .22, "sine", .05], boss: [110, .5, "triangle", .07], over: [180, .55, "sawtooth", .06] };
      const [frequency, duration, wave, volume] = presets[type] || presets.kill;
      const oscillator = audioContext.createOscillator(); const gain = audioContext.createGain();
      oscillator.type = wave; oscillator.frequency.setValueAtTime(frequency, now);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(35, frequency * (type === "upgrade" ? 1.8 : .55)), now + duration);
      gain.gain.setValueAtTime(volume, now); gain.gain.exponentialRampToValueAtTime(.001, now + duration);
      oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.start(now); oscillator.stop(now + duration);
    } catch { /* Audio is optional; gameplay continues without it. */ }
  }

  function setSoundButtons() {
    root.querySelectorAll("[data-sound]").forEach((button) => {
      button.setAttribute("aria-pressed", String(soundOn));
      button.setAttribute("aria-label", soundOn ? t.soundOn : t.soundOff);
      button.classList.toggle("is-muted", !soundOn);
      const label = button.querySelector("span");
      if (label) label.textContent = soundOn ? t.sound : t.soundOff;
    });
  }

  function runScore() { return Math.floor(score + timeAlive * 12 + level * 250); }

  function resize() {
    const bounds = stage.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(360, bounds.width);
    height = Math.max(300, bounds.height);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    stars = Array.from({ length: Math.floor(width * height / 6200) }, () => ({ x: rand(0, width), y: rand(0, height), s: rand(.5, 1.8), a: rand(.15, .8) }));
    if (player) { player.x = Math.min(width - 24, Math.max(24, player.x)); player.y = Math.min(height - 24, Math.max(24, player.y)); }
  }

  function resetRun(ship = selectedShip) {
    selectedShip = ship;
    const spec = ships[ship];
    player = { x: width / 2, y: height * .6, vx: 0, vy: 0, angle: -Math.PI / 2, speed: spec.speed, hp: spec.hull, maxHp: spec.hull, damage: spec.damage, fireRate: spec.fireRate, bulletSpeed: 480, spread: spec.spread, pierce: 0, armor: 0, regen: 0, magnet: 80, xpBonus: 1, crit: 0, blast: 0, drones: 0, orbs: 0, slow: 0, bounce: 0, color: spec.color, invuln: 0, dashTime: 0 };
    enemies = []; bullets = []; enemyBullets = []; drops = []; particles = []; keys.clear(); touchPointers.clear(); firing = false; dashCooldown = 0; aim = { x: player.x, y: player.y - 100 };
    score = 0; kills = 0; timeAlive = 0; level = 1; xp = 0; nextXp = 7;
    combo = 0; comboTimer = 0; bossBanner = 0;
    spawnClock = .5; shotClock = 0; regenClock = 0; bossWave = 0; miniBossWave = 0;
    previousBest = readBest();
    scoreEntry.reset();
    mode = "playing";
    ui.start.hidden = true; ui.pause.hidden = true; ui.upgrade.hidden = true; ui.over.hidden = true; ui.hud.hidden = false;
    updateHud();
  }

  function updateHud(force = true) {
    const now = performance.now();
    if (!force && now - lastHudUpdate < 100) return;
    lastHudUpdate = now;
    hud.wave.textContent = String(Math.floor(timeAlive / 25) + 1);
    hud.level.textContent = String(level);
    hud.kills.textContent = String(kills);
    const currentScore = runScore();
    hud.score.textContent = currentScore.toLocaleString();
    hud.best.textContent = Math.max(previousBest, currentScore).toLocaleString();
    hud.newRecord.hidden = currentScore <= previousBest;
    hud.combo.hidden = combo < 2;
    root.querySelector("[data-hud-combo-value]").textContent = `×${Math.min(5, 1 + Math.floor(combo / 4) * .25).toFixed(2).replace(/0+$/, "").replace(/\.$/, "")}`;
    hud.hull.textContent = `${Math.ceil(player?.hp || 0)} / ${player?.maxHp || 0}`;
    hud.hullBar.style.width = `${Math.max(0, 100 * (player?.hp || 0) / (player?.maxHp || 1))}%`;
    hud.xpBar.style.width = `${100 * xp / nextXp}%`;
    const ready = Math.max(0, 1 - dashCooldown / 2.2);
    if (hud.dashBar) hud.dashBar.style.width = `${ready * 100}%`;
    if (hud.touchDashBar) hud.touchDashBar.style.width = `${ready * 100}%`;
    if (hud.dashButton) hud.dashButton.setAttribute("aria-disabled", String(dashCooldown > 0));
    const boss = enemies.find((enemy) => enemy.isBoss);
    hud.bossbar.hidden = !boss;
    if (boss) {
      hud.bossName.textContent = t.bossNames[boss.bossType];
      hud.bossHp.style.width = `${Math.max(0, 100 * boss.hp / boss.maxHp)}%`;
    }
  }

  function spawnEnemy() {
    const angle = rand(0, Math.PI * 2);
    const radius = Math.max(width, height) * .46;
    const wave = Math.floor(timeAlive / 25) + 1;
    const isBoss = wave % 5 === 0 && bossWave !== wave;
    if (isBoss) bossWave = wave;
    const isMiniBoss = !isBoss && wave % 3 === 0 && miniBossWave !== wave;
    if (isMiniBoss) miniBossWave = wave;
    const roll = Math.random();
    const bossType = isBoss ? Math.floor(Math.random() * 3) : -1;
    const kind = isBoss ? "boss" : isMiniBoss ? "mini" : wave > 2 && roll < .2 ? "heavy" : roll < .46 ? "swift" : "rock";
    const config = {
      rock: { r: rand(13, 20), hp: 1 + wave * .2, speed: rand(52, 70) + wave * 1.5, color: "#b5a08b", value: 1 },
      swift: { r: rand(9, 14), hp: 1 + wave * .12, speed: rand(112, 138) + wave * 1.3, color: "#e6856b", value: 1 },
      heavy: { r: rand(21, 29), hp: 4 + wave * .7, speed: rand(38, 50) + wave * .9, color: "#987a9f", value: 3 },
      mini: { r: 31, hp: 26 + wave * 3, speed: 76 + wave, color: "#efb458", value: 12 },
      boss: [
        { r: 39, hp: 92 + wave * 10, speed: 52 + wave * .45, color: "#ff806c", value: 35 },
        { r: 43, hp: 112 + wave * 12, speed: 38 + wave * .35, color: "#c786eb", value: 42 },
        { r: 37, hp: 100 + wave * 11, speed: 45 + wave * .4, color: "#64cddd", value: 38 }
      ][bossType]
    }[kind];
    const x = player.x + Math.cos(angle) * radius;
    const y = player.y + Math.sin(angle) * radius;
    const enemy = { x: Math.max(-30, Math.min(width + 30, x)), y: Math.max(-30, Math.min(height + 30, y)), ...config, kind, maxHp: config.hp, rot: rand(0, 6), spin: rand(-1.2, 1.2), hit: 0, isBoss, isMiniBoss, bossType, attackClock: 2, phase: "hunt", phaseClock: 0 };
    enemies.push(enemy);
    if (isBoss) { bossBanner = 3; playSound("boss"); }
    else if (isMiniBoss) playSound("boss");
  }

  function spawnBroodling(boss, angle) {
    const x = boss.x + Math.cos(angle) * (boss.r + 10);
    const y = boss.y + Math.sin(angle) * (boss.r + 10);
    const config = { r: rand(9, 13), hp: 2 + Math.floor(timeAlive / 40) * .3, speed: rand(105, 130) + timeAlive * .18, color: "#e6856b", value: 1 };
    enemies.push({ x, y, ...config, kind: "swift", maxHp: config.hp, rot: rand(0, 6), spin: rand(-1.2, 1.2), hit: 0, isBoss: false, bossType: -1 });
  }

  function fireBossVolley(boss, count = 5, spread = .22) {
    const aimAngle = Math.atan2(player.y - boss.y, player.x - boss.x);
    for (let i = 0; i < count; i += 1) {
      const angle = aimAngle + (i - (count - 1) / 2) * spread;
      const speed = 205;
      enemyBullets.push({ x: boss.x, y: boss.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, r: 6, life: 3.2, color: boss.color });
    }
  }

  function targetFor(x, y) {
    let best = null; let bestDistance = Infinity;
    for (const enemy of enemies) { const d = (enemy.x - x) ** 2 + (enemy.y - y) ** 2; if (d < bestDistance) { best = enemy; bestDistance = d; } }
    return best;
  }

  function fireFrom(x, y, damageScale = 1, angleOverride = null) {
    const target = angleOverride === null ? targetFor(x, y) : null;
    if (angleOverride === null && !target) return;
    const base = angleOverride ?? Math.atan2(target.y - y, target.x - x);
    const n = player.spread;
    for (let i = 0; i < n; i += 1) {
      const angle = base + (i - (n - 1) / 2) * .16;
      const crit = Math.random() < player.crit;
      bullets.push({ x, y, vx: Math.cos(angle) * player.bulletSpeed, vy: Math.sin(angle) * player.bulletSpeed,
        damage: player.damage * damageScale * (crit ? 2 : 1), pierce: player.pierce, bounce: player.bounce, slow: player.slow, life: 2.2, crit });
    }
  }

  function explode(x, y, radius, damage, color = "#f6bb74") {
    particles.push({ x, y, radius, life: .35, maxLife: .35, color, ring: true });
    for (const enemy of enemies) if (Math.hypot(enemy.x - x, enemy.y - y) < radius) enemy.hp -= damage;
  }

  function destroyEnemy(enemy) {
    kills += 1; combo = comboTimer > 0 ? combo + 1 : 1; comboTimer = 2.8;
    const multiplier = Math.min(5, 1 + Math.floor(combo / 4) * .25);
    score += Math.round(enemy.value * 100 * multiplier);
    for (let i = 0; i < (enemy.isBoss ? 18 : enemy.isMiniBoss ? 10 : enemy.value + 1); i += 1) particles.push({ x: enemy.x + rand(-8, 8), y: enemy.y + rand(-8, 8), vx: rand(-90, 90), vy: rand(-90, 90), life: rand(.2, .6), maxLife: .6, color: enemy.color, size: rand(2, 5) });
    drops.push({ x: enemy.x, y: enemy.y, value: enemy.isBoss ? 14 : enemy.isMiniBoss ? 6 : enemy.value, r: enemy.isBoss || enemy.isMiniBoss ? 8 : 5, pulse: rand(0, 6) });
    if (player.blast) explode(enemy.x, enemy.y, player.blast, player.damage * .5, "#f6bb74");
    if (enemy.isBoss) score += 3500;
    else if (enemy.isMiniBoss) score += 900;
    playSound(enemy.isBoss ? "boss" : "kill");
  }

  function showUpgrades() {
    mode = "upgrade";
    ui.upgrade.hidden = false;
    const available = translations[language]?.upgrades || translations.pt.upgrades;
    const choices = Array.from({ length: 3 }, () => Math.floor(Math.random() * available.length));
    const list = root.querySelector("[data-upgrade-list]");
    list.innerHTML = choices.map((index) => `<button class="upgrade-card" data-upgrade="${index}"><span class="upgrade-icon">${available[index][2]}</span><span class="upgrade-copy"><strong>${available[index][0]}</strong><small>${available[index][1]}</small></span><span class="upgrade-plus">+</span></button>`).join("");
    list.querySelectorAll("[data-upgrade]").forEach((button) => button.addEventListener("click", () => {
      playSound("upgrade");
      upgradeEffects[Number(button.dataset.upgrade)](player);
      level += 1;
      xp -= nextXp;
      nextXp = Math.ceil(nextXp * 1.35 + 2);
      ui.upgrade.hidden = true;
      mode = "playing";
      updateHud();
    }, { once: true }));
  }

  function endRun() {
    mode = "over";
    const finalScore = runScore();
    const best = Math.max(previousBest, finalScore);
    writeBest(best);
    root.querySelector(".meteor-best strong").textContent = best.toLocaleString();
    root.querySelector("[data-hud-best]").textContent = best.toLocaleString();
    root.querySelector("[data-new-record]").hidden = finalScore <= previousBest;
    root.querySelector("[data-final-score]").textContent = finalScore.toLocaleString();
    root.querySelector("[data-final-best]").textContent = best.toLocaleString();
    root.querySelector("[data-final-kills]").textContent = String(kills);
    root.querySelector("[data-final-time]").textContent = `${Math.floor(timeAlive / 60)}:${String(Math.floor(timeAlive % 60)).padStart(2, "0")}`;
    scoreEntry.show(finalScore);
    ui.over.hidden = false; ui.hud.hidden = true; playSound("over");
  }

  function movementVector() {
    let dx = (actionDown("cometfall", "right", keys) || touchPointers.has("ArrowRight") ? 1 : 0) -
      (actionDown("cometfall", "left", keys) || touchPointers.has("ArrowLeft") ? 1 : 0);
    let dy = (actionDown("cometfall", "down", keys) || touchPointers.has("ArrowDown") ? 1 : 0) -
      (actionDown("cometfall", "up", keys) || touchPointers.has("ArrowUp") ? 1 : 0);
    const magnitude = Math.hypot(dx, dy);
    if (magnitude > 0) { dx /= magnitude; dy /= magnitude; }
    return { dx, dy };
  }

  function updateControlMonitor() {
    monitor.root.classList.add("is-running");
    const speed = player?.speed || 1;
    const input = {
      x: (actionDown("cometfall", "right", monitorKeys) || touchPointers.has("ArrowRight") ? 1 : 0) - (actionDown("cometfall", "left", monitorKeys) || touchPointers.has("ArrowLeft") ? 1 : 0),
      y: (actionDown("cometfall", "down", monitorKeys) || touchPointers.has("ArrowDown") ? 1 : 0) - (actionDown("cometfall", "up", monitorKeys) || touchPointers.has("ArrowUp") ? 1 : 0)
    };
    const magnitude = Math.hypot(input.x, input.y) || 1;
    input.x /= magnitude; input.y /= magnitude;
    const x = Math.max(-1, Math.min(1, mode === "playing" && player && (input.x || input.y) ? (player.vx || 0) / speed : input.x));
    const y = Math.max(-1, Math.min(1, mode === "playing" && player && (input.x || input.y) ? (player.vy || 0) / speed : input.y));
    monitor.stick.style.transform = `translate(calc(-50% + ${x * 15}px), calc(-50% + ${y * 15}px))`;
    const firingInput = firing || actionDown("cometfall", "fire", monitorKeys);
    monitor.fire.classList.toggle("is-active", firingInput);
    monitor.dash.classList.toggle("is-active", actionDown("cometfall", "dash", monitorKeys) || (player?.dashTime || 0) > 0);
    monitor.state.textContent = firingInput ? (language === "pt" ? "ATIRANDO" : language === "es" ? "DISPARANDO" : "FIRING") : x || y ? (language === "pt" ? "MOVENDO" : language === "es" ? "MOVIENDO" : "MOVING") : (language === "pt" ? "PRONTO" : language === "es" ? "LISTO" : "READY");
  }

  function tryDash() {
    if (mode !== "playing" || !player || dashCooldown > 0) return;
    let { dx, dy } = movementVector();
    if (!dx && !dy) { dx = Math.cos(player.angle); dy = Math.sin(player.angle); }
    const length = Math.hypot(dx, dy) || 1;
    dx /= length; dy /= length;
    player.vx = dx * 820;
    player.vy = dy * 820;
    player.angle = Math.atan2(dy, dx);
    player.dashTime = .19;
    player.invuln = Math.max(player.invuln, .32);
    dashCooldown = 2.2;
    playSound("dash");
    for (let i = 0; i < 9; i += 1) particles.push({ x: player.x, y: player.y, vx: -dx * rand(80, 260) + rand(-35, 35), vy: -dy * rand(80, 260) + rand(-35, 35), life: rand(.18, .38), maxLife: .38, color: player.color, size: rand(2, 5) });
  }

  function update(dt) {
    if (mode !== "playing" || !player) return;
    timeAlive += dt;
    bossBanner = Math.max(0, bossBanner - dt);
    comboTimer = Math.max(0, comboTimer - dt);
    if (comboTimer === 0) combo = 0;
    dashCooldown = Math.max(0, dashCooldown - dt);
    player.dashTime = Math.max(0, player.dashTime - dt);
    player.invuln = Math.max(0, player.invuln - dt);
    const { dx, dy } = movementVector();
    if (player.dashTime > 0) {
      player.x += player.vx * dt; player.y += player.vy * dt;
    } else {
      const response = dx || dy ? 1 - Math.exp(-dt * 10) : 1 - Math.exp(-dt * 5.5);
      player.vx += (dx * player.speed - player.vx) * response;
      player.vy += (dy * player.speed - player.vy) * response;
      player.x += player.vx * dt; player.y += player.vy * dt;
    }
    player.x = Math.max(20, Math.min(width - 20, player.x));
    player.y = Math.max(20, Math.min(height - 20, player.y));
    spawnClock -= dt;
    const wave = Math.floor(timeAlive / 25) + 1;
    if (spawnClock <= 0) { spawnEnemy(); spawnClock = Math.max(.4, .9 - wave * .035); }
    shotClock -= dt;
    if (shotClock <= 0 && firing) { fireFrom(player.x, player.y, 1, player.angle); playSound("shot"); shotClock = player.fireRate; }
    if (shotClock <= 0 && player.drones) { for (let i = 0; i < player.drones; i += 1) { const a = timeAlive * 2 + i * Math.PI * 2 / player.drones; fireFrom(player.x + Math.cos(a) * 34, player.y + Math.sin(a) * 34, .45); } shotClock = player.fireRate; }
    regenClock += dt;
    if (player.regen && regenClock >= 9) { player.hp = Math.min(player.maxHp, player.hp + player.regen); regenClock = 0; }
    for (let i = enemies.length - 1; i >= 0; i -= 1) {
      const e = enemies[i]; const angle = Math.atan2(player.y - e.y, player.x - e.x);
      e.slowed = Math.max(0, (e.slowed || 0) - dt); e.hit = Math.max(0, e.hit - dt); e.rot += e.spin * dt;
      if (!e.isBoss) {
        e.x += Math.cos(angle) * e.speed * (e.slowed ? .55 : 1) * dt;
        e.y += Math.sin(angle) * e.speed * (e.slowed ? .55 : 1) * dt;
      } else if (e.bossType === 0) {
        e.phaseClock += dt;
        if (e.phase === "hunt") {
          e.x += Math.cos(angle) * e.speed * dt; e.y += Math.sin(angle) * e.speed * dt;
          if (e.phaseClock > 2.35) { e.phase = "windup"; e.phaseClock = 0; e.lockAngle = angle; }
        } else if (e.phase === "windup") {
          if (e.phaseClock > .72) { e.phase = "charge"; e.phaseClock = 0; }
        } else if (e.phase === "charge") {
          e.x += Math.cos(e.lockAngle) * 490 * dt; e.y += Math.sin(e.lockAngle) * 490 * dt;
          if (e.phaseClock > .6) { e.phase = "recover"; e.phaseClock = 0; }
        } else if (e.phase === "recover" && e.phaseClock > 1.05) { e.phase = "hunt"; e.phaseClock = 0; }
      } else {
        e.x += Math.cos(angle + Math.sin(timeAlive * .8) * .7) * e.speed * .72 * dt;
        e.y += Math.sin(angle + Math.sin(timeAlive * .8) * .7) * e.speed * .72 * dt;
        e.attackClock -= dt;
        if (e.attackClock <= 0) {
          if (e.bossType === 1) {
            const direction = Math.atan2(player.y - e.y, player.x - e.x);
            for (let m = -1; m <= 1; m += 1) spawnBroodling(e, direction + m * .7);
            e.attackClock = 3.7;
          } else { fireBossVolley(e, 7, .17); e.attackClock = 2.5; }
        }
      }
      e.x = Math.max(-e.r, Math.min(width + e.r, e.x)); e.y = Math.max(-e.r, Math.min(height + e.r, e.y));
      if (distance(e, player) < e.r + 14 && player.invuln <= 0) { player.hp -= Math.max(1, e.isBoss ? 18 : 10 - player.armor); player.invuln = .7; explode(e.x, e.y, 35, 0, "#ff7184"); playSound("hit"); if (!e.isBoss) enemies.splice(i, 1); }
    }
    for (let i = enemyBullets.length - 1; i >= 0; i -= 1) {
      const b = enemyBullets[i]; b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
      if (Math.hypot(b.x - player.x, b.y - player.y) < b.r + 11 && player.invuln <= 0) {
        player.hp -= Math.max(1, 9 - player.armor); player.invuln = .7; playSound("hit"); enemyBullets.splice(i, 1); continue;
      }
      if (b.life <= 0 || b.x < -30 || b.x > width + 30 || b.y < -30 || b.y > height + 30) enemyBullets.splice(i, 1);
    }
    for (let i = bullets.length - 1; i >= 0; i -= 1) {
      const b = bullets[i]; b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
      let hit = false;
      for (let j = enemies.length - 1; j >= 0; j -= 1) { const e = enemies[j]; if (Math.hypot(e.x - b.x, e.y - b.y) < e.r + 4) { e.hp -= b.damage; e.hit = .1; if (b.slow) e.slowed = .7; if (e.hp <= 0) { destroyEnemy(e); enemies.splice(j, 1); } if (b.pierce > 0) b.pierce -= 1; else { hit = true; break; } } }
      if (hit || b.life <= 0 || b.x < -20 || b.x > width + 20 || b.y < -20 || b.y > height + 20) bullets.splice(i, 1);
    }
    for (let i = drops.length - 1; i >= 0; i -= 1) { const d = drops[i]; d.pulse += dt * 4; const dist = distance(d, player); if (dist < player.magnet) { d.x += (player.x - d.x) * Math.min(1, dt * 3.5); d.y += (player.y - d.y) * Math.min(1, dt * 3.5); } if (dist < 19) { xp += d.value * player.xpBonus; drops.splice(i, 1); if (xp >= nextXp) showUpgrades(); } }
    for (const p of particles) { p.life -= dt; if (p.vx) { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .98; p.vy *= .98; } }
    let aliveParticles = 0;
    for (const particle of particles) if (particle.life > 0) particles[aliveParticles++] = particle;
    particles.length = aliveParticles;
    if (player.orbs) for (let i = 0; i < player.orbs; i += 1) { const angle = timeAlive * 2.3 + i * Math.PI * 2 / player.orbs; const orb = { x: player.x + Math.cos(angle) * 43, y: player.y + Math.sin(angle) * 43 }; for (const e of enemies) if (distance(orb, e) < e.r + 6) e.hp -= 12 * dt; }
    if (player.hp <= 0) endRun();
    updateHud(false);
  }

  function drawShip(x, y, angle, color, size = 15) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle + Math.PI / 2); ctx.beginPath(); ctx.moveTo(0, -size); ctx.lineTo(size * .72, size); ctx.lineTo(0, size * .55); ctx.lineTo(-size * .72, size); ctx.closePath(); ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 18; ctx.fill(); ctx.shadowBlur = 0; ctx.strokeStyle = "#ffffffaa"; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#0b1016"; ctx.fillRect(0, 0, width, height);
    for (const s of stars) { ctx.globalAlpha = s.a * (.6 + Math.sin(timeAlive * 1.4 + s.x) * .4); ctx.fillStyle = "#c5d5e8"; ctx.fillRect(s.x, s.y, s.s, s.s); } ctx.globalAlpha = 1;
    ctx.strokeStyle = "#91a7bd09"; ctx.lineWidth = 1; const grid = 64; const offset = (timeAlive * 8) % grid; for (let x = -grid + offset; x < width; x += grid) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); } for (let y = -grid + offset; y < height; y += grid) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
    for (const d of drops) { const pulse = 1 + Math.sin(d.pulse) * .2; ctx.beginPath(); ctx.arc(d.x, d.y, d.r * pulse, 0, Math.PI * 2); ctx.fillStyle = "#8ee8e5"; ctx.shadowColor = "#59e8dc"; ctx.shadowBlur = 14; ctx.fill(); ctx.shadowBlur = 0; }
    for (const b of enemyBullets) { ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fillStyle = b.color; ctx.shadowColor = b.color; ctx.shadowBlur = 15; ctx.fill(); ctx.shadowBlur = 0; }
    for (const b of bullets) { ctx.beginPath(); ctx.arc(b.x, b.y, b.crit ? 4 : 2.8, 0, Math.PI * 2); ctx.fillStyle = b.crit ? "#fff2ac" : "#a9e8db"; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0; }
    for (const e of enemies) {
      if (e.isBoss && e.bossType === 0 && e.phase === "windup") { ctx.save(); ctx.setLineDash([7, 8]); ctx.strokeStyle = `rgba(255,105,111,${.45 + Math.sin(timeAlive * 18) * .25})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.lineTo(e.x + Math.cos(e.lockAngle) * Math.max(width, height), e.y + Math.sin(e.lockAngle) * Math.max(width, height)); ctx.stroke(); ctx.restore(); }
      ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.rot); ctx.beginPath(); const sides = e.isBoss ? (e.bossType === 1 ? 10 : 9) : e.isMiniBoss ? 8 : 7; for (let i = 0; i < sides; i += 1) { const a = i * Math.PI * 2 / sides; const r = e.r * (i % 2 ? .83 : 1); if (!i) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r); else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fillStyle = e.hit ? "#fff" : e.color; ctx.shadowColor = e.color; ctx.shadowBlur = e.isBoss || e.isMiniBoss ? 26 : 12; ctx.fill(); ctx.shadowBlur = 0; ctx.strokeStyle = "#ffffff55"; ctx.stroke(); ctx.restore(); if (e.isBoss || e.isMiniBoss || e.hp < e.maxHp) { const w = e.r * 2; ctx.fillStyle = "#1a2028"; ctx.fillRect(e.x - w / 2, e.y - e.r - 10, w, 3); ctx.fillStyle = e.color; ctx.fillRect(e.x - w / 2, e.y - e.r - 10, w * Math.max(0, e.hp / e.maxHp), 3); }
    }
    for (const p of particles) { ctx.globalAlpha = Math.max(0, p.life / p.maxLife); if (p.ring) { ctx.beginPath(); ctx.arc(p.x, p.y, p.radius * (1 - p.life / p.maxLife), 0, Math.PI * 2); ctx.strokeStyle = p.color; ctx.lineWidth = 3; ctx.stroke(); } else { ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, p.size, p.size); } } ctx.globalAlpha = 1;
    if (player) { drawShip(player.x, player.y, player.angle, player.invuln > 0 && Math.floor(timeAlive * 18) % 2 ? "#ffffff" : player.color); if (player.orbs) for (let i = 0; i < player.orbs; i += 1) { const a = timeAlive * 2.3 + i * Math.PI * 2 / player.orbs; ctx.beginPath(); ctx.arc(player.x + Math.cos(a) * 43, player.y + Math.sin(a) * 43, 5, 0, Math.PI * 2); ctx.fillStyle = "#b8a6ff"; ctx.fill(); } if (player.drones) for (let i = 0; i < player.drones; i += 1) { const a = timeAlive * 1.4 + i * Math.PI * 2 / player.drones; drawShip(player.x + Math.cos(a) * 34, player.y + Math.sin(a) * 34, a, "#8ce3dd", 7); } }
    if (bossBanner > 0) { const boss = enemies.find((enemy) => enemy.isBoss); if (boss) { ctx.save(); ctx.globalAlpha = Math.min(1, bossBanner); ctx.textAlign = "center"; ctx.fillStyle = boss.color; ctx.font = "700 12px ui-monospace, monospace"; ctx.fillText(t.bossNames[boss.bossType].toUpperCase(), width / 2, 38); ctx.restore(); } }
    if (mode === "playing" && aim.x >= 0 && aim.y >= 0 && aim.x <= width && aim.y <= height) { ctx.save(); ctx.translate(aim.x, aim.y); ctx.strokeStyle = "#d6f1e9c9"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.moveTo(-13, 0); ctx.lineTo(-5, 0); ctx.moveTo(5, 0); ctx.lineTo(13, 0); ctx.moveTo(0, -13); ctx.lineTo(0, -5); ctx.moveTo(0, 5); ctx.lineTo(0, 13); ctx.stroke(); ctx.restore(); }
  }

  function loop(now) { const dt = Math.min(.04, Math.max(0, (now - (lastTime || now)) / 1000)); lastTime = now; if (mode === "playing") update(dt); updateControlMonitor(); draw(); animation = requestAnimationFrame(loop); }
  function onKeyDown(event) {
    if (stateInputTarget(event.target)) return;
    const key = normalizeKey(event.key);
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(key)) event.preventDefault();
    if (keyMatches("cometfall", "pause", event.key) || key === "escape") {
      if (mode === "playing") { mode = "pause"; ui.pause.hidden = false; }
      else if (mode === "pause") { mode = "playing"; ui.pause.hidden = true; }
    }
    if (keyMatches("cometfall", "dash", event.key) && !event.repeat) tryDash();
    if (keyMatches("cometfall", "fire", event.key)) firing = true;
    keys.add(key);
  }
  function onKeyUp(event) { keys.delete(normalizeKey(event.key)); if (keyMatches("cometfall", "fire", event.key)) firing = false; }
  function monitorKeyDown(event) { monitorKeys.add(normalizeKey(event.key)); }
  function monitorKeyUp(event) { monitorKeys.delete(normalizeKey(event.key)); }
  function pauseForKeybinds() { resumeAfterKeybind = mode === "playing"; if (resumeAfterKeybind) { mode = "pause"; ui.pause.hidden = true; } }
  function resumeAfterKeybinds() { if (resumeAfterKeybind && mode === "pause") mode = "playing"; resumeAfterKeybind = false; }
  function stateInputTarget(target) { return ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName) || target?.isContentEditable; }
  function aimFromPointer(event) { const rect = canvas.getBoundingClientRect(); aim = { x: event.clientX - rect.left, y: event.clientY - rect.top }; if (player) player.angle = Math.atan2(aim.y - player.y, aim.x - player.x); }
  function stopFiring() { firing = false; }

  root.querySelectorAll("[data-ship]").forEach((button) => button.addEventListener("click", () => { selectedShip = button.dataset.ship; root.querySelectorAll("[data-ship]").forEach((card) => { const active = card === button; card.classList.toggle("selected", active); card.setAttribute("aria-pressed", String(active)); }); }));
  root.querySelectorAll("[data-sound]").forEach((button) => button.addEventListener("click", () => { soundOn = !soundOn; setSoundButtons(); if (soundOn) playSound("upgrade"); }));
  setSoundButtons();
  root.querySelector("[data-start]").addEventListener("click", () => { playSound("upgrade"); resetRun(selectedShip); });
  root.querySelector("[data-restart]").addEventListener("click", () => resetRun(selectedShip));
  root.querySelector("[data-menu]").addEventListener("click", () => { mode = "menu"; player = null; ui.over.hidden = true; ui.start.hidden = false; ui.hud.hidden = true; });
  root.querySelector("[data-pause]").addEventListener("click", () => { if (mode === "playing") { mode = "pause"; ui.pause.hidden = false; } });
  root.querySelector("[data-resume]").addEventListener("click", () => { if (mode === "pause") { mode = "playing"; ui.pause.hidden = true; } });
  root.querySelectorAll("[data-dash]").forEach((button) => button.addEventListener("click", tryDash));
  root.querySelectorAll("[data-fire]").forEach((button) => {
    button.addEventListener("pointerdown", (event) => { event.preventDefault(); firing = true; button.setPointerCapture(event.pointerId); });
    button.addEventListener("pointerup", stopFiring); button.addEventListener("pointercancel", stopFiring);
  });
  canvas.addEventListener("pointermove", aimFromPointer);
  canvas.addEventListener("pointerdown", (event) => { if (event.button !== 0 || mode !== "playing") return; event.preventDefault(); aimFromPointer(event); firing = true; canvas.setPointerCapture(event.pointerId); });
  canvas.addEventListener("pointerup", stopFiring); canvas.addEventListener("pointercancel", stopFiring);
  root.querySelectorAll("[data-control]").forEach((button) => {
    button.addEventListener("pointerdown", (event) => { event.preventDefault(); button.setPointerCapture(event.pointerId); touchPointers.set(button.dataset.control, true); });
    button.addEventListener("pointerup", () => touchPointers.delete(button.dataset.control));
    button.addEventListener("pointercancel", () => touchPointers.delete(button.dataset.control));
  });
  window.addEventListener("keydown", monitorKeyDown); window.addEventListener("keyup", monitorKeyUp); window.addEventListener("keydown", onKeyDown); window.addEventListener("keyup", onKeyUp); window.addEventListener("arcade-keybind-open", pauseForKeybinds); window.addEventListener("arcade-keybind-close", resumeAfterKeybinds); window.addEventListener("blur", () => { keys.clear(); monitorKeys.clear(); touchPointers.clear(); firing = false; });
  const observer = new ResizeObserver(resize); observer.observe(stage); resize(); animation = requestAnimationFrame(loop);
  return () => { cancelAnimationFrame(animation); observer.disconnect(); window.removeEventListener("keydown", monitorKeyDown); window.removeEventListener("keyup", monitorKeyUp); window.removeEventListener("keydown", onKeyDown); window.removeEventListener("keyup", onKeyUp); window.removeEventListener("arcade-keybind-open", pauseForKeybinds); window.removeEventListener("arcade-keybind-close", resumeAfterKeybinds); };
}
