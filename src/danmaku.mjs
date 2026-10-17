import { actionDown, keyMatches, normalizeKey } from "./keybinds.mjs";
import { arcadeScoreEntryMarkup, mountArcadeScoreEntry } from "./arcade-scores.mjs";

const text = {
  pt: { name: "STARDUST / DANMAKU", tagline: "Atravesse as hordas, monte sua build e sobreviva aos padrões dos chefes.", start: "Iniciar partida", controls: "WASD/setas: mover · Espaço: disparar · Shift: foco · X: bomba · 1–3: perks", lives: "VIDAS", score: "PONTOS", best: "RECORDE", boss: "CHEFE", pause: "PAUSADO", resume: "Continuar", retry: "Jogar novamente", menu: "VOLTAR AO MENU", over: "FIM DE JOGO", names: ["Astra · Dama das Rosas", "Kuro · Cometa Carmesim", "Mira · Tecelã Lunar"], clear: "CHEFE DERROTADO", focus: "FOCO", attacks: ["Espirais de pétalas · leque que se abre", "Chuva carmesim · rajadas que perseguem", "Órbita lunar · anéis e espirais"], stage: "FASE", stageclear: "SETOR LIMPO", xp: "XP", bomb: "BOMBA", choose: "ESCOLHA UMA MELHORIA", chooseHint: "Sua build muda a cada run. Escolha com cuidado.", midboss: "ELITE DA FASE", wave: "ONDA DE INIMIGOS", perks: ["Rajada prismática", "Perfuração astral", "Canhão concentrado", "Propulsores leves", "Núcleo de foco", "Coração extra", "Bomba reserva", "Coletor de essências", "Carga devastadora"] },
  en: { name: "STARDUST / DANMAKU", tagline: "Fight through the waves, build your run, and survive the boss patterns.", start: "Start run", controls: "WASD/arrows: move · Space: fire · Shift: focus · X: bomb · 1–3: perks", lives: "LIVES", score: "SCORE", best: "BEST", boss: "BOSS", pause: "PAUSED", resume: "Resume", retry: "Play again", menu: "BACK TO MENU", over: "GAME OVER", names: ["Astra · Rose Lady", "Kuro · Crimson Comet", "Mira · Lunar Weaver"], clear: "BOSS DEFEATED", focus: "FOCUS", attacks: ["Petal spirals · opening fans", "Crimson rain · aimed volleys", "Lunar orbit · rings and spirals"], stage: "STAGE", stageclear: "SECTOR CLEAR", xp: "XP", bomb: "BOMB", choose: "CHOOSE AN UPGRADE", chooseHint: "Your build changes every run. Choose carefully.", midboss: "STAGE ELITE", wave: "ENEMY WAVE", perks: ["Prism volley", "Astral piercer", "Focused cannon", "Light thrusters", "Focus core", "Extra heart", "Reserve bomb", "Essence collector", "Devastator charge"] },
  es: { name: "STARDUST / DANMAKU", tagline: "Supera las oleadas, crea tu build y sobrevive a los patrones de los jefes.", start: "Iniciar partida", controls: "WASD/flechas: mover · Espacio: disparar · Shift: foco · X: bomba · 1–3: mejoras", lives: "VIDAS", score: "PUNTOS", best: "RÉCORD", boss: "JEFE", pause: "EN PAUSA", resume: "Continuar", retry: "Jugar de nuevo", menu: "VOLVER AL MENÚ", over: "FIN DE PARTIDA", names: ["Astra · Dama de las Rosas", "Kuro · Cometa Carmesí", "Mira · Tejedora Lunar"], clear: "JEFE DERROTADO", focus: "FOCO", attacks: ["Espirales de pétalos · abanicos abiertos", "Lluvia carmesí · ráfagas dirigidas", "Órbita lunar · anillos y espirales"], stage: "FASE", stageclear: "SECTOR LIMPIO", xp: "XP", bomb: "BOMBA", choose: "ELIGE UNA MEJORA", chooseHint: "Tu build cambia en cada partida. Elige bien.", midboss: "ÉLITE DE FASE", wave: "OLEADA ENEMIGA", perks: ["Ráfaga prismática", "Perforación astral", "Cañón concentrado", "Propulsores ligeros", "Núcleo de enfoque", "Corazón extra", "Bomba de reserva", "Recolector de esencias", "Carga devastadora"] }
};

const bossPalettes = [
  { wash: "#63294d", accent: "#ff9dce", glow: "#ff6fb8", star: "#ffd6ee", secondary: "#bd83ff", grid: "#f6a8d8" },
  { wash: "#682a31", accent: "#ff9a76", glow: "#ff5a58", star: "#ffe0bf", secondary: "#ffd06c", grid: "#ffad8b" },
  { wash: "#282a68", accent: "#a7a4ff", glow: "#786bff", star: "#d9e7ff", secondary: "#71d8ff", grid: "#a3aaff" },
  { wash: "#174a45", accent: "#73f0bc", glow: "#27d99b", star: "#d9fff0", secondary: "#80f3e0", grid: "#79eac5" },
  { wash: "#42245e", accent: "#d29aff", glow: "#a14dff", star: "#f4dcff", secondary: "#ff9be8", grid: "#d29aff" },
  { wash: "#55451b", accent: "#ffe17a", glow: "#ffb52e", star: "#fff7c2", secondary: "#ff8b5c", grid: "#f5d86f" }
];

const difficultySettings = {
  normal: { label: ["Normal", "Normal", "Normal"], bullet: 1, cadence: 1, health: 1, waves: 1 },
  hard: { label: ["Difícil", "Hard", "Difícil"], bullet: 1.2, cadence: .84, health: 1.22, waves: .86 },
  impossible: { label: ["Impossível", "Impossible", "Imposible"], bullet: 1.42, cadence: .68, health: 1.5, waves: .72 }
};
const bossCatalog = {
  pt: { names: ["Astra · Dama das Rosas", "Kuro · Cometa Carmesim", "Mira · Tecelã Lunar", "Nami · Guardiã das Marés", "Nyx · Oráculo do Vazio", "Helios · Coração Solar"], attacks: ["Espirais de pétalas · leques", "Chuva carmesim · rajadas perseguidoras", "Órbita lunar · anéis e espirais", "Correntes de bolhas · ondas cruzadas", "Fendas e minas · zonas de perigo", "Explosões solares · leques ardentes"] },
  en: { names: ["Astra · Rose Lady", "Kuro · Crimson Comet", "Mira · Lunar Weaver", "Nami · Tidekeeper", "Nyx · Void Oracle", "Helios · Solar Heart"], attacks: ["Petal spirals · opening fans", "Crimson rain · seeking volleys", "Lunar orbit · rings and spirals", "Bubble currents · crossing waves", "Rifts and mines · danger zones", "Solar bursts · burning fans"] },
  es: { names: ["Astra · Dama de las Rosas", "Kuro · Cometa Carmesí", "Mira · Tejedora Lunar", "Nami · Guardiana de Mareas", "Nyx · Oráculo del Vacío", "Helios · Corazón Solar"], attacks: ["Espirales de pétalos · abanicos", "Lluvia carmesí · ráfagas perseguidoras", "Órbita lunar · anillos y espirales", "Corrientes de burbujas · ondas cruzadas", "Grietas y minas · zonas peligrosas", "Explosiones solares · abanicos ardientes"] }
};

const perkDetails = {
  pt: ["Dispare três projéteis em leque.", "Seus tiros atravessam mais inimigos.", "Dano dos tiros +32% por escolha.", "Velocidade de movimento +12% por escolha.", "Foco amplia a rajada em até 3 projéteis extras.", "Recupere uma vida, até o limite de cinco.", "Ganhe uma bomba e aumente o limite de cargas.", "Atraia essências de XP de mais longe.", "Bombas causam dano dobrado aos chefes."],
  en: ["Fire three projectiles in a spread.", "Shots pierce more enemies.", "Shot damage +32% per pick.", "Move speed +12% per pick.", "Focus adds up to 3 extra shots.", "Restore one life, up to a five-life cap.", "Gain a bomb and raise your charge cap.", "Collect XP essences from farther away.", "Bombs deal double damage to bosses."],
  es: ["Dispara tres proyectiles en abanico.", "Tus disparos atraviesan más enemigos.", "Daño de disparo +32% por elección.", "Velocidad de movimiento +12% por elección.", "El foco añade hasta 3 disparos.", "Recupera una vida, hasta un máximo de cinco.", "Obtén una bomba y aumenta el límite de cargas.", "Atrae esencias de XP desde más lejos.", "Las bombas duplican el daño a los jefes."]
};

const rareCards = [
  { id: "starburst", icon: "✦", name: ["Estouro Prismático", "Prismatic Burst", "Estallido prismático"], description: ["Dispare dois tiros extras em cada rajada.", "Fire two extra shots in every volley.", "Dispara dos tiros extra en cada ráfaga."] },
  { id: "echo", icon: "⟲", name: ["Eco Astral", "Astral Echo", "Eco astral"], description: ["Cada tiro repete com 55% do dano.", "Every shot repeats at 55% damage.", "Cada disparo se repite con 55% de daño."] },
  { id: "overdrive", icon: "⚡", name: ["Sobrecarga", "Overdrive", "Sobrecarga"], description: ["Dispare 25% mais rápido.", "Fire 25% faster.", "Dispara un 25% más rápido."] },
  { id: "nova", icon: "☼", name: ["Nova", "Nova", "Nova"], description: ["Seus tiros explodem e ferem inimigos próximos.", "Your shots burst and damage nearby enemies.", "Tus disparos estallan y dañan enemigos cercanos."] },
  { id: "bombardier", icon: "✹", name: ["Bombardeio", "Bombardment", "Bombardeo"], description: ["Bombas causam 70% mais dano.", "Bombs deal 70% more damage.", "Las bombas infligen un 70% más de daño."] },
  { id: "aegis", icon: "⬡", name: ["Égide Estelar", "Star Aegis", "Égida estelar"], description: ["A cada 14s, bloqueia um impacto sem perder vida.", "Every 14s, block one hit without losing a life.", "Cada 14s, bloquea un impacto sin perder vida."] },  { id: "rift-core", icon: "◈", name: ["Núcleo de Fenda", "Rift Core", "Núcleo de Grieta"], description: ["Tiros atravessam +2 inimigos.", "Shots pierce 2 additional enemies.", "Los disparos atraviesan 2 enemigos más."] },
  { id: "scavenger", icon: "✧", name: ["Ímã de Almas", "Soul Magnet", "Imán de Almas"], description: ["Essências dão 50% mais XP e são atraídas de mais longe.", "Essences give 50% more XP and are pulled from farther away.", "Las esencias dan 50% más XP y se atraen desde más lejos."] },
  { id: "afterburn", icon: "➤", name: ["Pós-combustão", "Afterburn", "Postcombustión"], description: ["Mover aumenta a velocidade de tiro em 15%.", "Moving increases fire rate by 15%.", "Moverse aumenta la cadencia de disparo un 15%."] },
  { id: "phoenix", icon: "♨", name: ["Pacto Fênix", "Phoenix Pact", "Pacto Fénix"], description: ["Recupere uma vida ao derrotar cada chefe.", "Restore one life after defeating each boss.", "Recupera una vida al derrotar cada jefe."] }
];

const buildText = {
  pt: { title: "BUILD DA RUN", empty: "Escolha perks para montar sua build.", combo: "SINERGIA", chest: "BAÚ DE ELITE", chestHint: "Uma habilidade rara. Escolha com cuidado.", take: "Adicionar à build", replace: "Trocar por esta carta", discard: "Descartar por 4 XP", full: "Build rara cheia · escolha uma carta para substituir", rareCount: "RARAS" },
  en: { title: "RUN BUILD", empty: "Choose perks to shape your build.", combo: "SYNERGY", chest: "ELITE CHEST", chestHint: "One rare ability. Choose carefully.", take: "Add to build", replace: "Replace with this card", discard: "Discard for 4 XP", full: "Rare build full · choose a card to replace", rareCount: "RARE" },
  es: { title: "BUILD DE RUN", empty: "Elige mejoras para crear tu build.", combo: "SINERGIA", chest: "COFRE DE ÉLITE", chestHint: "Una habilidad rara. Elige con cuidado.", take: "Añadir a la build", replace: "Cambiar por esta carta", discard: "Descartar por 4 XP", full: "Build rara completa · elige una carta para cambiar", rareCount: "RARAS" }
};
const rouletteText = { pt: "Sorteando habilidade...", en: "Rolling for a rare ability...", es: "Sorteando habilidad..." };
const qolText = {
  pt: { perkHint: "WASD / setas: navegar · Espaço: escolher · 1–3: atalho", pauseHint: "WASD ou setas movem a nave · Espaço dispara · Shift foca · X usa bomba.", chestHint: "O baú desaparece em 20 segundos." },
  en: { perkHint: "WASD / arrows: move · Space: choose · 1–3: shortcut", pauseHint: "WASD or arrows move · Space fires · Shift focuses · X uses a bomb.", chestHint: "Chest expires in 20 seconds." },
  es: { perkHint: "WASD / flechas: mover · Espacio: elegir · 1–3: acceso rápido", pauseHint: "WASD o flechas mueven · Espacio dispara · Shift enfoca · X usa una bomba.", chestHint: "El cofre desaparece en 20 segundos." }
};

const readBest = () => { try { return Number(localStorage.getItem("danmaku-best") || 0); } catch { return 0; } };
const writeBest = (n) => { try { localStorage.setItem("danmaku-best", String(n)); } catch { /* Keep playing if storage is unavailable. */ } };

const shipSkins = [
  { id: "moonlight", score: 0, names: ["Moonlight", "Moonlight", "Luz lunar"], body: "#f4efff", accent: "#bba8ff", glow: "#8278ff", engine: "#69dfff", core: "#ffffff" },
  { id: "sakura", score: 2500, names: ["Sakura", "Sakura", "Sakura"], body: "#fff0f6", accent: "#ff8bb8", glow: "#ff4f98", engine: "#ffc1dc", core: "#fff9e8" },
  { id: "aurora", score: 5500, names: ["Aurora", "Aurora", "Aurora"], body: "#e8fff9", accent: "#72e7cf", glow: "#30c7d3", engine: "#a5fff0", core: "#f5ffff" },
  { id: "solar", score: 9000, names: ["Solar Flare", "Solar Flare", "Llamarada solar"], body: "#fff3d2", accent: "#ffbb50", glow: "#ff873d", engine: "#fff08e", core: "#fffbe0" },
  { id: "void", score: 15000, names: ["Void Prism", "Void Prism", "Prisma del vacio"], body: "#f1e3ff", accent: "#c27bff", glow: "#803df1", engine: "#58edff", core: "#fff2ff" },
  { id: "tideglass", score: 23000, names: ["Tideglass", "Tideglass", "Marea de cristal"], body: "#e6f8ff", accent: "#65c9ed", glow: "#398aff", engine: "#9bfff3", core: "#ffffff" },
  { id: "emberline", score: 32000, names: ["Emberline", "Emberline", "Linea de brasas"], body: "#fff0df", accent: "#f58c58", glow: "#ed493d", engine: "#ffd36b", core: "#fff8d9" },
  { id: "rose-vanguard", score: null, challenge: "astra-flawless", model: "winged", names: ["Rose Vanguard", "Rose Vanguard", "Vanguardia rosa"], body: "#ffe8f2", accent: "#ff75ad", glow: "#ff367f", engine: "#ffc5da", core: "#fff5fa" },
  { id: "crimson-requiem", score: null, challenge: "kuro-flawless", model: "orbital", names: ["Crimson Requiem", "Crimson Requiem", "Requiem carmesi"], body: "#ffe9e7", accent: "#ff5c61", glow: "#d91f50", engine: "#ffad76", core: "#fff1d6" },
  { id: "lunar-oracle", score: null, challenge: "mira-flawless", model: "crown", names: ["Lunar Oracle", "Lunar Oracle", "Oraculo lunar"], body: "#e9eaff", accent: "#9da8ff", glow: "#6564e8", engine: "#9fe8ff", core: "#ffffff" },
  { id: "last-ember", score: null, challenge: "one-life-boss", model: "heavy", names: ["Last Ember", "Last Ember", "Ultima brasa"], body: "#fff1d6", accent: "#f2b85d", glow: "#e47836", engine: "#fff5a1", core: "#ffffff" },
  { id: "echo-ace", score: null, challenge: "three-bosses", model: "wisp", names: ["Echo Ace", "Echo Ace", "As del eco"], body: "#e6fff7", accent: "#76e6c7", glow: "#32bdad", engine: "#c7fff2", core: "#ffffff" },
  { id: "ghost-circuit", score: null, challenge: "hitless-score", model: "mech", names: ["Ghost Circuit", "Ghost Circuit", "Circuito fantasma"], body: "#e8f4ff", accent: "#79c4ff", glow: "#427dff", engine: "#b9fbff", core: "#ffffff" },
  { id: "star-eater", score: null, challenge: "elite-breaker", model: "phoenix", names: ["Star Eater", "Star Eater", "Devoradora de estrellas"], body: "#f5eaff", accent: "#cb80ff", glow: "#823dd5", engine: "#ffb7ec", core: "#fffbe8" },
  { id: "danmaku-legend", score: null, challenge: "five-bosses", model: "void", names: ["Danmaku Legend", "Danmaku Legend", "Leyenda Danmaku"], body: "#f3f1ff", accent: "#f8d878", glow: "#d77aff", engine: "#72edff", core: "#ffffff" }
];
const skinUiText = {
  pt: { title: "SKINS DA NAVE", count: "LIBERADAS", base: "INICIAL", locked: "SCORE", challenge: "DESAFIO", equipped: "EQUIPADA", unlocked: "LIBERADA", toast: "SKIN DESBLOQUEADA", challenges: { "astra-flawless": "Derrote Astra sem perder vida", "kuro-flawless": "Derrote Kuro sem perder vida", "mira-flawless": "Derrote Mira sem perder vida", "one-life-boss": "Derrote um chefe com 1 vida", "three-bosses": "Derrote 3 chefes na mesma run", "hitless-score": "Alcance 20.000 pontos sem dano", "elite-breaker": "Derrote 12 elites", "five-bosses": "Derrote 5 chefes na mesma run" } },
  en: { title: "SHIP SKINS", count: "UNLOCKED", base: "DEFAULT", locked: "SCORE", challenge: "CHALLENGE", equipped: "EQUIPPED", unlocked: "UNLOCKED", toast: "SKIN UNLOCKED", challenges: { "astra-flawless": "Defeat Astra without losing a life", "kuro-flawless": "Defeat Kuro without losing a life", "mira-flawless": "Defeat Mira without losing a life", "one-life-boss": "Defeat a boss with 1 life left", "three-bosses": "Defeat 3 bosses in one run", "hitless-score": "Score 20,000 without losing a life", "elite-breaker": "Defeat 12 elite enemies", "five-bosses": "Defeat 5 bosses in one run" } },
  es: { title: "ASPECTOS DE NAVE", count: "DESBLOQUEADAS", base: "INICIAL", locked: "PUNTOS", challenge: "RETO", equipped: "EQUIPADA", unlocked: "DESBLOQUEADA", toast: "ASPECTO DESBLOQUEADO", challenges: { "astra-flawless": "Derrota a Astra sin perder vidas", "kuro-flawless": "Derrota a Kuro sin perder vidas", "mira-flawless": "Derrota a Mira sin perder vidas", "one-life-boss": "Derrota un jefe con 1 vida", "three-bosses": "Derrota 3 jefes en una run", "hitless-score": "Haz 20.000 puntos sin perder vidas", "elite-breaker": "Derrota 12 enemigos de elite", "five-bosses": "Derrota 5 jefes en una run" } }
};

function loadUnlockedSkins(score = readBest()) {
  let unlocked = [shipSkins[0].id];
  try {
    const saved = JSON.parse(localStorage.getItem("danmaku-unlocked-skins") || "[]");
    if (Array.isArray(saved)) unlocked = [...new Set([...unlocked, ...saved.filter((id) => shipSkins.some((skin) => skin.id === id))])];
    shipSkins.filter((skin) => skin.score !== null && skin.score <= score).forEach((skin) => { if (!unlocked.includes(skin.id)) unlocked.push(skin.id); });
    localStorage.setItem("danmaku-unlocked-skins", JSON.stringify(unlocked));
  } catch { /* Cosmetics stay available for this session if storage is unavailable. */ }
  return new Set(unlocked);
}

function saveUnlockedSkins(unlocked) {
  try { localStorage.setItem("danmaku-unlocked-skins", JSON.stringify([...unlocked])); } catch { /* Keep the current run usable without storage. */ }
}

export function danmakuMarkup(language = "pt") {
  const t = text[language] || text.pt;
  return `<section class="danmaku-game" aria-label="${t.name}">
    <header class="danmaku-heading"><div><span class="danmaku-kicker">ARCADE · 01 / 02</span><h2>${t.name}</h2><p>${t.tagline}</p></div><div class="danmaku-highscore"><small>${t.best}</small><strong data-dm-best>${readBest().toLocaleString()}</strong></div></header>
    <div class="danmaku-layout"><div class="danmaku-playfield"><canvas data-dm-canvas aria-label="Vertical danmaku game"></canvas>
      <div class="danmaku-hud" data-dm-hud hidden><div class="danmaku-run-stats"><small>${t.stage} / <b data-dm-stage>1</b> · <span data-dm-phase>${t.wave}</span> · ${language === "pt" ? "AMEAÇA" : language === "es" ? "PELIGRO" : "DANGER"} <b data-dm-threat>1.0×</b></small><b>${t.score} <span data-dm-score>0</span></b></div><div class="danmaku-life-stat"><small>${t.lives}</small><b class="danmaku-lives" data-dm-lives>4</b></div><div class="danmaku-xp"><small>${t.xp} <span data-dm-xp>0/6</span></small><i><b data-dm-xpbar></b></i></div><span class="danmaku-bomb-count" data-dm-bombs aria-label="${t.bomb}: X">X ×1</span><button type="button" data-dm-pause aria-label="${t.pause}">Ⅱ</button><div class="danmaku-boss-hud"><small data-dm-boss-name>${t.boss}</small><i><b data-dm-boss-hp></b></i></div></div>
      <div class="danmaku-overlay" data-dm-start><div class="danmaku-card"><span class="danmaku-kicker">DANMAKU PROTOCOL</span><h3>${t.name}</h3><p>${t.tagline}</p><div class="danmaku-difficulty" role="group" aria-label="Difficulty">${Object.entries(difficultySettings).map(([id, setting]) => `<button type="button" data-dm-difficulty="${id}" aria-pressed="${id === "normal"}" class="${id === "normal" ? "is-selected" : ""}">${setting.label[language === "en" ? 1 : language === "es" ? 2 : 0]}</button>`).join("")}</div><div class="danmaku-boss-roster">${(bossCatalog[language] || bossCatalog.pt).names.map((name, i) => `<span><i>0${i + 1}</i>${name}</span>`).join("")}</div><section class="danmaku-skin-section"><header><strong>${(skinUiText[language] || skinUiText.pt).title}</strong><small data-dm-skin-count></small></header><div class="danmaku-skin-grid" data-dm-skin-list></div></section><button type="button" data-dm-start-button>${t.start} <span>↗</span></button><small>${t.controls}</small></div></div>
      <div class="danmaku-overlay" data-dm-pause-screen hidden><div class="danmaku-card"><span class="danmaku-kicker">${t.pause}</span><h3>${t.pause}</h3><p>${(qolText[language] || qolText.pt).pauseHint}</p><button type="button" data-dm-resume>${t.resume}</button></div></div>
      <div class="danmaku-overlay" data-dm-perks hidden><div class="danmaku-card danmaku-perk-card"><span class="danmaku-kicker">ROGUE BUILD</span><h3>${t.choose}</h3><p>${t.chooseHint}</p><div class="danmaku-perk-list" data-dm-perk-list></div><small>${(qolText[language] || qolText.pt).perkHint}</small></div></div>
      <div class="danmaku-overlay" data-dm-chest hidden><div class="danmaku-card danmaku-chest-card"><span class="danmaku-kicker">${(buildText[language] || buildText.pt).chest}</span><h3 data-dm-chest-title></h3><p>${(buildText[language] || buildText.pt).chestHint}</p><div class="danmaku-chest-offer" data-dm-chest-offer></div><div class="danmaku-chest-actions" data-dm-chest-actions></div></div></div>
      <div class="danmaku-overlay" data-dm-over hidden><div class="danmaku-card"><span class="danmaku-kicker">${t.over}</span><h3>${t.over}</h3><div class="danmaku-result"><span>${t.score}<b data-dm-final>0</b></span><span>${t.best}<b data-dm-final-best>0</b></span></div>${arcadeScoreEntryMarkup("danmaku", "danmaku-best", language)}<button type="button" data-dm-retry>${t.retry} <span>↗</span></button><button type="button" class="danmaku-menu" data-dm-menu>${t.menu}</button></div></div>
      <div class="danmaku-toast" data-dm-toast hidden>${t.clear}</div><div class="danmaku-skin-toast" data-dm-skin-toast role="status" hidden></div><div class="danmaku-debug-panel" data-dm-debug hidden><header><strong>DEBUG MODE</strong><button type="button" data-debug-close aria-label="Close debug menu">×</button></header><pre data-dm-debug-data></pre><div class="danmaku-debug-controls"><label>Skin<select data-debug-skin>${shipSkins.map((skin) => `<option value="${skin.id}">${skin.names[Math.max(0, ["pt", "en", "es"].indexOf(language))]}</option>`).join("")}</select></label><button type="button" data-debug-action="unlock-skin">Unlock + equip skin</button><label>Score / leaderboard<input type="number" min="1" step="1" value="100000" data-debug-score></label><label>Initials<input type="text" maxlength="4" value="DBG" data-debug-initials></label><button type="button" data-debug-action="save-score">Insert leaderboard score</button><label>Perk<select data-debug-perk>${t.perks.map((perk, index) => `<option value="${index}">${perk}</option>`).join("")}</select></label><button type="button" data-debug-action="add-perk">Apply perk</button><label>Chest ability<select data-debug-rare>${rareCards.map((card) => `<option value="${card.id}">${card.name[Math.max(0, ["pt", "en", "es"].indexOf(language))]}</option>`).join("")}</select></label><button type="button" data-debug-action="add-rare">Add ability (replace oldest if full)</button><label>Enemy / boss<select data-debug-enemy><option value="regular-0">Basic enemy</option><option value="regular-1">Fan shooter</option><option value="regular-2">Elite (chest carrier)</option><option value="regular-3">Swift enemy</option><option value="regular-4">Turret</option><option value="midboss">Stage elite</option>${(bossCatalog[language] || bossCatalog.pt).names.map((name, index) => `<option value="boss-${index}">${name}</option>`).join("")}</select></label><button type="button" data-debug-action="spawn">Spawn selection</button><label>Difficulty<select data-debug-difficulty>${Object.entries(difficultySettings).map(([id, value]) => `<option value="${id}">${value.label[language === "en" ? 1 : language === "es" ? 2 : 0]}</option>`).join("")}</select></label><button type="button" data-debug-action="set-difficulty">Apply difficulty</button><div class="danmaku-debug-utilities"><button type="button" data-debug-action="heal">Restore lives</button><button type="button" data-debug-action="bombs">Max bombs</button><button type="button" data-debug-action="clear">Clear enemy bullets</button><button type="button" data-debug-action="invulnerable">Toggle invulnerability</button></div><small data-debug-status>Debug changes are local to this run. Enter the arrow code again to close.</small></div></div>
    </div><aside class="danmaku-aside"><span class="danmaku-kicker">BOSS INDEX</span>${(bossCatalog[language] || bossCatalog.pt).names.map((name, i) => `<article><i>0${i + 1}</i><div><strong>${name}</strong><small>${(bossCatalog[language] || bossCatalog.pt).attacks[i]}</small></div></article>`).join("")}<section class="danmaku-build-panel"><header><strong>${(buildText[language] || buildText.pt).title}</strong><small data-dm-build-count>0/3 ${(buildText[language] || buildText.pt).rareCount}</small></header><div data-dm-build-cards></div><div data-dm-build-combos></div></section><div class="danmaku-aside-note"><b>4 × 1</b><span>${language === "pt" ? "Um impacto consome uma vida. Segure Shift para focar e mover com precisão." : language === "es" ? "Un impacto consume una vida. Mantén Shift para enfocar y moverte con precisión." : "Each hit costs one life. Hold Shift to focus and move precisely."}</span></div></aside></div>
    <div class="arcade-control-monitor" data-arcade-monitor aria-hidden="true"><div class="arcade-monitor-title"><i></i><span>${language === "pt" ? "CONTROLE AO VIVO" : language === "es" ? "CONTROL EN VIVO" : "LIVE CONTROLLER"}</span><b>${language === "pt" ? "ENTRADA" : language === "es" ? "ENTRADA" : "INPUT"} <em data-monitor-state>${language === "pt" ? "PARADO" : language === "es" ? "EN ESPERA" : "IDLE"}</em></b></div><div class="arcade-controller"><div class="arcade-stick-deck"><span>MOVE</span><div class="arcade-stick"><i data-monitor-stick></i></div><small>W A S D</small></div><div class="arcade-action-bank"><span>DANMAKU</span><div><i data-monitor-fire>FIRE</i><i data-monitor-dash>FOCUS</i><i data-monitor-bomb>BOMB</i></div><small>SPACE · SHIFT · X</small></div></div></div>
  </section>`;
}

export function mountDanmaku(root, language = "pt") {
  const t = text[language] || text.pt;
  const skinLabels = skinUiText[language] || skinUiText.pt;
  const skinById = new Map(shipSkins.map((skin) => [skin.id, skin]));
  const unlockedSkinIds = loadUnlockedSkins();
  let selectedSkinId = shipSkins[0].id;
  try {
    const savedSkin = localStorage.getItem("danmaku-selected-skin");
    if (unlockedSkinIds.has(savedSkin)) selectedSkinId = savedSkin;
  } catch { /* Use the default skin when storage is unavailable. */ }
  const canvas = root.querySelector("[data-dm-canvas]");
  const ctx = canvas.getContext("2d");
  const field = root.querySelector(".danmaku-playfield");
  const monitor = { root: root.querySelector("[data-arcade-monitor]"), stick: root.querySelector("[data-monitor-stick]"), fire: root.querySelector("[data-monitor-fire]"), focus: root.querySelector("[data-monitor-dash]"), bomb: root.querySelector("[data-monitor-bomb]"), state: root.querySelector("[data-monitor-state]") };
  const ui = {
    start: root.querySelector("[data-dm-start]"), pause: root.querySelector("[data-dm-pause-screen]"),
    over: root.querySelector("[data-dm-over]"), perks: root.querySelector("[data-dm-perks]"), chest: root.querySelector("[data-dm-chest]"), hud: root.querySelector("[data-dm-hud]"), toast: root.querySelector("[data-dm-toast]"), debug: root.querySelector("[data-dm-debug]"), debugData: root.querySelector("[data-dm-debug-data]")
  };
  const scoreEntry = mountArcadeScoreEntry(root, { gameId: "danmaku", legacyBestKey: "danmaku-best", language });
  const hud = {
    score: root.querySelector("[data-dm-score]"), bossName: root.querySelector("[data-dm-boss-name]"), bossHp: root.querySelector("[data-dm-boss-hp]"),
    stage: root.querySelector("[data-dm-stage]"), phase: root.querySelector("[data-dm-phase]"), xp: root.querySelector("[data-dm-xp]"), xpBar: root.querySelector("[data-dm-xpbar]"), threat: root.querySelector("[data-dm-threat]"),
    best: root.querySelector("[data-dm-best]")
  };
  let W = 360, H = 680, dpr = 1, frame = 0, last = 0, mode = "menu", elapsed = 0, stage = 1, stageTime = 0, phase = "wave", score = 0, lives = 4, invuln = 0, shotClock = 0, enemyClock = 0, bossClear = 0, boss = null, bossIndex = -1, midboss = null, midbossSpawned = false, best = readBest(), focus = false, difficulty = "normal";
  let xp = 0, nextXp = 12, level = 1, bombs = 1, maxBombs = 2, shotDamage = 1, shotSpread = 0, shotPierce = 0, moveBonus = 1, focusBonus = 0, magnet = 36, bombPower = 1, aegisCooldown = 0, volleyCount = 0, pendingChestCard = null, chestSpinInterval = null, selectedPerkIndex = 0, chestActionIndex = 0, lastHudUpdate = 0, backgroundGradient = null, bombFlash = 0, resumeAfterKeybind = false, bossTint = 0;
  let perkCounts = Array(9).fill(0), selectedPerks = [], rareBuild = [];
  let runLifeLosses = 0, runBossesDefeated = 0, bossLifeLosses = 0, heavyKills = 0;
  const debugCode = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowright", "arrowleft", "arrowright", "arrowleft"];
  let debugInput = [], debugEnabled = false, debugFrameCount = 0, debugLastSample = 0, debugFps = 0, debugWasPlaying = false, debugInvulnerable = false;
  function setDebugOpen(open) {
    if (open === debugEnabled) return;
    if (open) {
      debugWasPlaying = mode === "playing";
      if (debugWasPlaying) mode = "pause";
    } else if (debugWasPlaying && mode === "pause") mode = "playing";
    debugEnabled = open; ui.debug.hidden = !open; debugInput = [];
    debugFrameCount = 0; debugLastSample = performance.now();
  }
  function debugStatus(message) { root.querySelector("[data-debug-status]").textContent = message; }
  function ensureDebugRun() {
    if (mode === "menu" || mode === "over") { start(); mode = "pause"; debugWasPlaying = true; }
    else if (mode === "playing") { mode = "pause"; debugWasPlaying = true; }
  }
  function spawnDebugEnemy(kind) {
    const scale = threatScale();
    const stats = [
      { r: 10, hp: 2, speed: 62 }, { r: 10, hp: 3, speed: 68 }, { r: 12, hp: 5, speed: 48 },
      { r: 8, hp: 2, speed: 112 }, { r: 11, hp: 4, speed: 42 }
    ][kind];
    const hp = stats.hp + Math.floor((stage - 1) / 2) + Math.floor((scale - 1) * 2);
    const x = W * (.2 + Math.random() * .6);
    enemies.push({ x, y: 45, baseX: x, r: stats.r, hp, maxHp: hp, speed: stats.speed * (1 + (scale - 1) * .16), phase: Math.random() * 6, shotClock: .4, kind, seed: Math.random() * Math.PI * 2, fireCount: 0 });
  }
  function runDebugAction(action) {
    if (action === "unlock-skin") {
      const id = root.querySelector("[data-debug-skin]").value;
      if (!skinById.has(id)) return;
      unlockedSkinIds.add(id); saveUnlockedSkins(unlockedSkinIds); equipSkin(id); player.skin = id;
      debugStatus(`Unlocked and equipped ${skinById.get(id).names[Math.max(0, ["pt", "en", "es"].indexOf(language))]}.`); return;
    }
    if (action === "save-score") {
      const value = Math.max(0, Math.floor(Number(root.querySelector("[data-debug-score]").value) || 0));
      const initials = root.querySelector("[data-debug-initials]").value;
      if (!scoreEntry.debugSave(value, initials)) { debugStatus("Enter a score above zero; storage may be unavailable."); return; }
      best = Math.max(best, value); writeBest(best); updateHud();
      debugStatus(`Saved ${Math.floor(value).toLocaleString()} to the local arcade leaderboard.`); return;
    }
    if (action === "set-difficulty") {
      difficulty = root.querySelector("[data-debug-difficulty]").value;
      root.querySelectorAll("[data-dm-difficulty]").forEach((button) => { const selected = button.dataset.dmDifficulty === difficulty; button.setAttribute("aria-pressed", String(selected)); button.classList.toggle("is-selected", selected); });
      updateHud(); debugStatus(`Difficulty set to ${difficulty}.`); return;
    }
    if (["add-perk", "add-rare", "spawn", "heal", "bombs", "clear", "invulnerable"].includes(action)) ensureDebugRun();
    if (action === "add-perk") {
      applyPerk(Number(root.querySelector("[data-debug-perk]").value), true);
      debugStatus(`Applied: ${t.perks[Number(root.querySelector("[data-debug-perk]").value)]}.`);
    } else if (action === "add-rare") {
      const id = root.querySelector("[data-debug-rare]").value;
      if (rareBuild.includes(id)) { debugStatus("That ability is already in the build."); return; }
      if (rareBuild.length >= 3) rareBuild.shift();
      rareBuild.push(id); renderBuild(); updateHud();
      const locale = Math.max(0, ["pt", "en", "es"].indexOf(language));
      debugStatus(`Added: ${rareCards.find((card) => card.id === id).name[locale]}.`);
    } else if (action === "spawn") {
      const selected = root.querySelector("[data-debug-enemy]").value;
      if (selected.startsWith("regular-")) spawnDebugEnemy(Number(selected.slice(8)));
      else if (selected === "midboss") { boss = null; enemies = []; bullets = []; stageTime = 20; spawnMidboss(); midbossSpawned = true; }
      else if (selected.startsWith("boss-")) { boss = null; midboss = null; enemies = []; bullets = []; spawnBoss(Number(selected.slice(5))); }
      updateHud(); debugStatus(`Spawned ${root.querySelector("[data-debug-enemy] option:checked").textContent}.`);
    } else if (action === "heal") { lives = 5; updateHud(); debugStatus("Lives restored to 5."); }
    else if (action === "bombs") { maxBombs = 5; bombs = maxBombs; updateHud(); debugStatus("Bomb charges filled."); }
    else if (action === "clear") { bullets = []; debugStatus("Enemy bullets cleared."); }
    else if (action === "invulnerable") { debugInvulnerable = !debugInvulnerable; debugStatus(`Invulnerability ${debugInvulnerable ? "enabled" : "disabled"}.`); }
  }
  function threatScale() {
    const progressionScore = Math.max(0, score, best);
    return 1 + Math.log1p(progressionScore / 5000) * .13 + Math.log1p(Math.max(0, stage - 1)) * .1;
  }
  function scoreMultiplier() {
    const selectedMultiplier = difficulty === "hard" ? 1.35 : difficulty === "impossible" ? 1.8 : 1;
    return selectedMultiplier * (1 + (threatScale() - 1) * .12);
  }
  const keys = new Set();
  const monitorKeys = new Set();
  let player = { x: 180, y: 570, r: 3.4, vx: 0, vy: 0, skin: selectedSkinId };
  let bullets = [], shots = [], enemies = [], essences = [], chests = [], particles = [], stars = [], crackEvents = [], audio = null;
  const skinList = root.querySelector("[data-dm-skin-list]");
  const skinToast = root.querySelector("[data-dm-skin-toast]");
  let skinToastTimer = null;
  function renderSkins() {
    if (!skinList) return;
    root.querySelector("[data-dm-skin-count]").textContent = `${unlockedSkinIds.size}/${shipSkins.length} ${skinLabels.count}`;
    const locale = Math.max(0, ["pt", "en", "es"].indexOf(language));
    skinList.innerHTML = shipSkins.map((skin) => {
      const unlocked = unlockedSkinIds.has(skin.id), selected = selectedSkinId === skin.id;
      const requirement = skin.challenge ? skinLabels.challenges[skin.challenge] : `${skinLabels.locked} ${skin.score.toLocaleString()}`;
      const status = selected ? skinLabels.equipped : unlocked ? (skin.challenge || skin.score ? skinLabels.unlocked : skinLabels.base) : requirement;
      return `<button type="button" class="danmaku-skin-option${selected ? " selected" : ""}${unlocked ? "" : " locked"}${skin.model ? ` model-${skin.model}` : ""}" data-dm-skin="${skin.id}" title="${unlocked ? skin.names[locale] : requirement}" style="--skin-body:${skin.body};--skin-accent:${skin.accent};--skin-glow:${skin.glow}" ${unlocked ? "" : "disabled"} aria-pressed="${selected}"><i class="danmaku-skin-preview"></i><strong>${skin.names[locale]}</strong><small>${status}</small></button>`;
    }).join("");
  }
  function equipSkin(id) {
    if (!unlockedSkinIds.has(id) || !skinById.has(id)) return;
    selectedSkinId = id;
    try { localStorage.setItem("danmaku-selected-skin", id); } catch { /* Equip for this session. */ }
    renderSkins();
  }
  function checkSkinUnlocks(currentScore) {
    if (runLifeLosses === 0 && currentScore >= 20000) unlockChallengeSkin("hitless-score");
    const locale = Math.max(0, ["pt", "en", "es"].indexOf(language));
    const newlyUnlocked = shipSkins.filter((skin) => skin.score > 0 && currentScore >= skin.score && !unlockedSkinIds.has(skin.id));
    if (!newlyUnlocked.length) return;
    for (const skin of newlyUnlocked) unlockedSkinIds.add(skin.id);
    saveUnlockedSkins(unlockedSkinIds); renderSkins();
    skinToast.textContent = `${skinLabels.toast} · ${newlyUnlocked.map((skin) => skin.names[locale]).join(" / ")}`;
    skinToast.hidden = false;
    if (skinToastTimer) clearTimeout(skinToastTimer);
    skinToastTimer = setTimeout(() => { skinToast.hidden = true; skinToastTimer = null; }, 3600);
  }
  function unlockChallengeSkin(challengeId) {
    const skin = shipSkins.find((item) => item.challenge === challengeId);
    if (!skin || unlockedSkinIds.has(skin.id)) return;
    unlockedSkinIds.add(skin.id); saveUnlockedSkins(unlockedSkinIds); renderSkins();
    const locale = Math.max(0, ["pt", "en", "es"].indexOf(language));
    skinToast.textContent = `${skinLabels.toast} - ${skin.names[locale]}`;
    skinToast.hidden = false;
    if (skinToastTimer) clearTimeout(skinToastTimer);
    skinToastTimer = setTimeout(() => { skinToast.hidden = true; skinToastTimer = null; }, 4200);
  }

  function sound(name = "shot", variation = 0) {
    try {
      const A = window.AudioContext || window.webkitAudioContext; if (!A) return;
      audio ||= new A(); if (audio.state === "suspended") audio.resume();
      const now = audio.currentTime;
      const tone = (from, to, duration, type = "sine", volume = .035, delay = 0) => {
        const osc = audio.createOscillator(), gain = audio.createGain();
        osc.type = type; osc.frequency.setValueAtTime(from, now + delay); osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), now + delay + duration);
        gain.gain.setValueAtTime(.0001, now + delay); gain.gain.exponentialRampToValueAtTime(volume, now + delay + .008); gain.gain.exponentialRampToValueAtTime(.0001, now + delay + duration);
        osc.connect(gain); gain.connect(audio.destination); osc.start(now + delay); osc.stop(now + delay + duration + .01);
      };
      const profiles = {
        shot: [850, 350, .055, "square", .012], perk: [520, 1040, .24, "sine", .035], chest: [380, 920, .28, "triangle", .04],
        discard: [430, 260, .12, "sine", .025], chestOpen: [580, 1180, .2, "triangle", .04], boss: [180, 62, .52, "sawtooth", .045],
        midboss: [300, 120, .32, "triangle", .04], victory: [430, 980, .42, "triangle", .045], bomb: [150, 38, .5, "sawtooth", .05],
        aegis: [620, 1250, .2, "sine", .04], hit: [170, 45, .22, "sawtooth", .045], gameover: [190, 55, .5, "triangle", .04],
        kill: [380, 620, .085, "triangle", .022], killHeavy: [210, 390, .15, "triangle", .03], killSwift: [560, 840, .075, "sine", .022], killTurret: [260, 500, .13, "square", .024]
      };
      const [from, to, duration, type, volume] = profiles[name] || profiles.shot;
      const shift = variation * (name.startsWith("kill") ? 13 : 0);
      tone(from + shift, to + shift, duration, type, volume);
      if (["perk", "chestOpen", "victory", "aegis"].includes(name)) tone((from + shift) * 1.5, (to + shift) * 1.25, duration * .72, "sine", volume * .48, .035);
      if (name === "shot" && variation > 0) tone(1280, 720, .045, "sine", .008, .012);
    } catch { /* Optional sound. */ }
  }
  function hasRare(id) { return rareBuild.includes(id); }
  function synergyActive(id) {
    if (id === "prism") return perkCounts[0] > 0 && perkCounts[1] > 0;
    if (id === "ghost") return perkCounts[3] > 0 && perkCounts[4] > 0;
    if (id === "singularity") return perkCounts[6] > 0 && perkCounts[8] > 0;
    return false;
  }
  function renderBuild() {
    const cards = root.querySelector("[data-dm-build-cards]");
    const combos = root.querySelector("[data-dm-build-combos]");
    const count = root.querySelector("[data-dm-build-count]");
    const labels = buildText[language] || buildText.pt;
    count.textContent = `${rareBuild.length}/3 ${labels.rareCount}`;
    const locale = Math.max(0, ["pt", "en", "es"].indexOf(language));
    const perkGroups = [...new Set(selectedPerks)].map((index) => {
      const stacks = perkCounts[index];
      return `<div class="danmaku-build-card"><span>${["✧", "↟", "✦", "»", "◎", "♥", "X", "◌", "✹"][index]}</span><strong>${t.perks[index]}</strong>${stacks > 1 ? `<b>×${stacks}</b>` : ""}</div>`;
    }).join("");
    const rareItems = rareBuild.map((id) => {
      const card = rareCards.find((item) => item.id === id);
      return `<div class="danmaku-build-card rare"><span>${card.icon}</span><strong>${card.name[locale]}</strong><b>★</b></div>`;
    }).join("");
    cards.innerHTML = perkGroups + rareItems || `<small class="danmaku-build-empty">${labels.empty}</small>`;
    const active = [];
    if (synergyActive("prism")) active.push(["Prisma Perfurante", "Piercing Prism", "Prisma perforante"][locale]);
    if (synergyActive("ghost")) active.push(["Foco Fantasma", "Ghost Focus", "Foco fantasma"][locale]);
    if (synergyActive("singularity")) active.push(["Singularidade", "Singularity", "Singularidad"][locale]);
    combos.innerHTML = active.map((name) => `<span>${labels.combo} · ${name}</span>`).join("");
  }
  function closeChest() {
    if (chestSpinInterval) { clearInterval(chestSpinInterval); chestSpinInterval = null; }
    ui.chest.hidden = true; pendingChestCard = null; mode = "playing";
    updateHud();
    if (xp >= nextXp) showPerks();
  }
  function claimChest(replaceIndex = -1) {
    if (!pendingChestCard) return;
    if (replaceIndex >= 0) rareBuild[replaceIndex] = pendingChestCard.id;
    else rareBuild.push(pendingChestCard.id);
    renderBuild(); sound("chestOpen"); closeChest();
  }
  function revealChestCard(locale, actions) {
    if (chestSpinInterval) { clearInterval(chestSpinInterval); chestSpinInterval = null; }
    root.querySelector("[data-dm-chest-title]").textContent = pendingChestCard.name[locale];
    const offer = root.querySelector("[data-dm-chest-offer]");
    offer.classList.remove("spinning"); offer.classList.add("revealed");
    offer.innerHTML = `<span>${pendingChestCard.icon}</span><strong>${pendingChestCard.name[locale]}</strong><small>${pendingChestCard.description[locale]}</small>`;
    const labels = buildText[language] || buildText.pt;
    if (rareBuild.length < 3) {
      actions.innerHTML = `<button type="button" data-chest-take>${labels.take}</button>`;
      actions.querySelector("[data-chest-take]").addEventListener("click", () => claimChest(), { once: true });
    } else {
      actions.innerHTML = `<small>${labels.full}</small>${rareBuild.map((id, index) => { const card = rareCards.find((item) => item.id === id); return `<button type="button" data-chest-replace="${index}">${labels.replace}: ${card.name[locale]}</button>`; }).join("")}`;
      actions.querySelectorAll("[data-chest-replace]").forEach((button) => button.addEventListener("click", () => claimChest(Number(button.dataset.chestReplace)), { once: true }));
    }
    actions.insertAdjacentHTML("beforeend", `<button type="button" class="danmaku-chest-discard" data-chest-discard>${labels.discard}</button>`);
    actions.querySelector("[data-chest-discard]").addEventListener("click", () => { xp += 4; score += 100; closeChest(); sound("discard"); }, { once: true });
    chestActionIndex = 0; actions.querySelector("button")?.focus({ preventScroll: true });
    sound("chestOpen");
  }
  function openChest(chest) {
    const pool = rareCards.filter((card) => !rareBuild.includes(card.id));
    if (!pool.length) { xp += 4; updateHud(); return; }
    pendingChestCard = pool[Math.floor(Math.random() * pool.length)];
    const locale = Math.max(0, ["pt", "en", "es"].indexOf(language));
    const title = root.querySelector("[data-dm-chest-title]");
    const offer = root.querySelector("[data-dm-chest-offer]");
    const actions = root.querySelector("[data-dm-chest-actions]");
    title.textContent = rouletteText[language] || rouletteText.pt;
    actions.innerHTML = ""; offer.classList.remove("revealed"); offer.classList.add("spinning");
    mode = "chest"; ui.chest.hidden = false; sound("chest");
    let ticks = 0;
    chestSpinInterval = setInterval(() => {
      ticks += 1;
      const shown = ticks >= 18 ? pendingChestCard : pool[Math.floor(Math.random() * pool.length)];
      offer.innerHTML = `<span>${shown.icon}</span><strong>${shown.name[locale]}</strong><small>${shown.description[locale]}</small>`;
      if (ticks >= 18) revealChestCard(locale, actions);
    }, 90);
  }
  function resize() {
    const rect = field.getBoundingClientRect();
    const cssWidth = Math.max(270, rect.width);
    const cssHeight = Math.max(320, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(cssWidth * dpr); canvas.height = Math.round(cssHeight * dpr);
    canvas.style.width = `${cssWidth}px`; canvas.style.height = `${cssHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    W = cssWidth; H = cssHeight;
    backgroundGradient = ctx.createLinearGradient(0, 0, 0, H);
    backgroundGradient.addColorStop(0, "#17122b"); backgroundGradient.addColorStop(.56, "#101627"); backgroundGradient.addColorStop(1, "#09151d");
    stars = Array.from({ length: 85 }, () => ({ x: Math.random() * W, y: Math.random() * H, s: Math.random() * 1.7 + .3, a: Math.random() * .6 + .2 }));
    player.x = Math.max(14, Math.min(W - 14, player.x)); player.y = Math.max(90, Math.min(H - 24, player.y));
  }
  function start() {
    scoreEntry.reset();
    root.classList.remove("is-game-over");
    elapsed = 0; stage = 1; stageTime = 0; phase = "wave"; score = 0; lives = 4; invuln = 1.6; shotClock = 0; enemyClock = .6; bossClear = 0; boss = null; bossIndex = -1; midboss = null; midbossSpawned = false;
    runLifeLosses = 0; runBossesDefeated = 0; bossLifeLosses = 0; heavyKills = 0;
    xp = 0; nextXp = 12; level = 1; bombs = 1; maxBombs = 2; shotDamage = 1; shotSpread = 0; shotPierce = 0; moveBonus = 1; focusBonus = 0; magnet = 36; bombPower = 1; aegisCooldown = 0; volleyCount = 0; pendingChestCard = null;
    if (chestSpinInterval) { clearInterval(chestSpinInterval); chestSpinInterval = null; }
    perkCounts = Array(9).fill(0); selectedPerks = []; rareBuild = [];
    if (skinToastTimer) { clearTimeout(skinToastTimer); skinToastTimer = null; }
    skinToast.hidden = true;
    bullets = []; shots = []; enemies = []; essences = []; chests = []; particles = []; crackEvents = []; keys.clear(); focus = false; bossTint = 0; delete root.dataset.bossTheme; player = { x: W / 2, y: H * .82, r: 3.4, vx: 0, vy: 0, skin: selectedSkinId }; mode = "playing";
    ui.start.hidden = true; ui.pause.hidden = true; ui.perks.hidden = true; ui.chest.hidden = true; ui.over.hidden = true; ui.hud.hidden = false; ui.toast.hidden = true; renderBuild();
    updateHud();
  }
  function updateHud(force = true) {
    const now = performance.now();
    if (!force && now - lastHudUpdate < 100) return;
    lastHudUpdate = now;
    checkSkinUnlocks(Math.floor(score));
    const shownScore = Math.floor(score * scoreMultiplier());
    hud.threat.textContent = `${threatScale().toFixed(1)}×`;
    hud.score.textContent = shownScore.toLocaleString();
    const lifeStatus = root.querySelector("[data-dm-lives]");
    lifeStatus.textContent = String(Math.max(0, lives));
    lifeStatus.setAttribute("aria-label", `${t.lives}: ${Math.max(0, lives)}`);
    root.querySelector("[data-dm-lives]").textContent = `${"♥ ".repeat(Math.max(0, lives))}${"♡ ".repeat(Math.max(0, 5 - Math.max(0, lives)))}`.trim();
    const target = boss || midboss;
    hud.bossName.textContent = boss ? (bossCatalog[language] || bossCatalog.pt).names[bossIndex] : midboss ? t.midboss : phase === "wave" ? t.wave : t.stageclear;
    hud.bossHp.style.width = target ? `${Math.max(0, target.hp / target.maxHp * 100)}%` : "0%";
    hud.stage.textContent = String(stage);
    hud.phase.textContent = boss ? t.boss : midboss ? t.midboss : t.wave;
    hud.xp.textContent = `${Math.floor(xp)}/${nextXp}`;
    hud.xpBar.style.width = `${Math.min(100, xp / nextXp * 100)}%`;
    root.querySelector("[data-dm-bombs]").textContent = `X ×${bombs}`;
    hud.best.textContent = Math.max(best, shownScore).toLocaleString();
  }
  function spawnBoss(forcedIndex = -1) {
    const options = bossPalettes.map((_, i) => i).filter((i) => i !== bossIndex);
    bossIndex = forcedIndex >= 0 && forcedIndex < bossPalettes.length ? forcedIndex : options[Math.floor(Math.random() * options.length)];
    const palette = bossPalettes[bossIndex];
    root.dataset.bossTheme = String(bossIndex);
    root.style.setProperty("--dm-boss-accent", palette.accent);
    root.style.setProperty("--dm-boss-glow", palette.glow);
    root.style.setProperty("--dm-boss-secondary", palette.secondary);
    bossLifeLosses = 0;
    const scale = threatScale();
    const hp = (235 + stage * 44) * difficultySettings[difficulty].health * (1 + (scale - 1) * .34);
    boss = { x: W / 2, y: 90, r: 23, hp, maxHp: hp, angle: Math.random() * Math.PI * 2, attackIndex: -1, attackTime: 0, attackClock: 0, shotClock: 0, rest: 1.25, attacking: false, location: Math.floor(Math.random() * 5), attackDeck: Array.from({ length: 5 }, (_, i) => i).sort(() => Math.random() - .5) };
    phase = "boss";
    sound("boss");
  }
  function spawnEnemyWave() {
    const count = Math.min(9, 3 + Math.floor(stage / 2) + Math.floor((threatScale() - 1) * 2.4));
    const center = W / 2 + (Math.random() - .5) * W * .45;
    for (let i = 0; i < count; i += 1) {
      const offset = (i - (count - 1) / 2) * Math.min(46, W / (count + 1));
      const roll = Math.random();
      const kind = roll < .07 ? 2 : roll < .22 ? 3 : roll < .38 ? 4 : Math.floor(Math.random() * 2);
      const scale = threatScale();
      const hp = 2 + Math.floor((stage - 1) / 2) + Math.floor((scale - 1) * 2) + (kind === 2 ? 3 : kind === 4 ? 2 : 0);
      const baseX = Math.max(18, Math.min(W - 18, center + offset));
      enemies.push({ x: baseX, y: -20 - Math.abs(i - (count - 1) / 2) * 18, baseX, r: kind === 2 ? 12 : kind === 3 ? 8 : kind === 4 ? 11 : 10 + (i % 3), hp, maxHp: hp, speed: ((kind === 3 ? 112 : kind === 4 ? 42 : kind === 2 ? 48 : 62) + stage * (kind === 3 ? 3 : 5) + (i % 2) * 14) * (1 + (scale - 1) * .16), phase: Math.random() * 6, shotClock: kind === 2 ? .8 + Math.random() * .7 : kind === 4 ? 1 + Math.random() * .5 : 1.2 + Math.random() * 1.8, kind, seed: Math.random() * Math.PI * 2, fireCount: 0 });
    }
  }
  function spawnMidboss() {
    const hp = (48 + stage * 12) * (1 + (threatScale() - 1) * .28);
    midboss = { x: W / 2, y: 105, r: 19, hp, maxHp: hp, timer: 0, phase: 0 };
    phase = "midboss"; sound("midboss");
  }
  function applyPerk(perk, debug = false) {
    if (!Number.isInteger(perk) || perk < 0 || perk >= t.perks.length) return;
    perkCounts[perk] += 1; selectedPerks.push(perk);
    if (perk === 0) shotSpread = Math.min(3, shotSpread + 1);
    if (perk === 1) shotPierce += 2;
    if (perk === 2) shotDamage *= 1.32;
    if (perk === 3) moveBonus *= 1.12;
    if (perk === 4) focusBonus = Math.min(3, focusBonus + 1);
    if (perk === 5) lives = Math.min(5, lives + 1);
    if (perk === 6) { maxBombs = Math.min(5, maxBombs + 1); bombs = Math.min(maxBombs, bombs + 1); }
    if (perk === 7) magnet *= 1.55;
    if (perk === 8) bombPower *= 2;
    if (!debug) { xp -= nextXp; nextXp = Math.ceil(nextXp * 1.35 + 2); level += 1; ui.perks.hidden = true; mode = "playing"; }
    renderBuild(); sound("perk"); updateHud();
  }
  function showPerks() {
    mode = "perk"; ui.perks.hidden = false;
    const indexes = [];
    const eligible = t.perks.map((_, i) => i).filter((i) => i !== 5 || lives < 5);
    while (indexes.length < 3) { const i = eligible[Math.floor(Math.random() * eligible.length)]; if (!indexes.includes(i)) indexes.push(i); }
    const list = root.querySelector("[data-dm-perk-list]");
    selectedPerkIndex = 0; list.innerHTML = indexes.map((i, slot) => `<button type="button" class="danmaku-perk${slot === 0 ? " keyboard-selected" : ""}" data-choice="${slot}" data-perk="${i}"><kbd>${slot + 1}</kbd><span class="danmaku-perk-icon">${["✧", "↟", "✦", "»", "◎", "♥", "X", "◌", "✹"][i]}</span><span><strong>${t.perks[i]}</strong><small>${(perkDetails[language] || perkDetails.pt)[i]}</small></span><b>+</b></button>`).join("");
    list.querySelectorAll("[data-perk]").forEach((button) => button.addEventListener("click", () => {
      applyPerk(Number(button.dataset.perk));
    }, { once: true }));
    list.querySelector('[data-choice="0"]')?.focus({ preventScroll: true });
  }
  function movePerkSelection(direction) {
    const buttons = [...root.querySelectorAll("[data-dm-perk-list] [data-choice]")];
    if (!buttons.length) return;
    selectedPerkIndex = (selectedPerkIndex + direction + buttons.length) % buttons.length;
    buttons.forEach((button, index) => button.classList.toggle("keyboard-selected", index === selectedPerkIndex));
    buttons[selectedPerkIndex].focus();
  }
  function moveChestSelection(direction) {
    const buttons = [...root.querySelectorAll("[data-dm-chest-actions] button")];
    if (!buttons.length) return;
    chestActionIndex = (chestActionIndex + direction + buttons.length) % buttons.length;
    buttons[chestActionIndex].focus();
  }
  function killEnemy(enemy, array, index, quiet = false) {
    score += 90 + stage * 12; essences.push({ x: enemy.x, y: enemy.y, value: enemy.kind === 2 ? 2 : 1, life: 10, color: "#54f0ad" });
    if (enemy.kind === 2 || enemy.kind === 4) { heavyKills += 1; if (heavyKills >= 12) unlockChallengeSkin("elite-breaker"); }
    for (let n = 0; n < 5; n += 1) particles.push({ x: enemy.x, y: enemy.y, vx: (Math.random() - .5) * 100, vy: (Math.random() - .5) * 100, life: .35, color: "#54f0ad" });
    if (enemy.kind === 2 && Math.random() < .32) chests.push({ x: enemy.x, y: enemy.y, life: 20, phase: Math.random() * Math.PI * 2 });
    array.splice(index, 1); if (!quiet) sound(enemy.kind === 2 ? "killHeavy" : enemy.kind === 3 ? "killSwift" : enemy.kind === 4 ? "killTurret" : "kill", enemy.seed | 0);
  }
  function bullet(x, y, angle, speed, _patternColor, r = 5) {
    speed *= threatScale() * difficultySettings[difficulty].bullet;
    const color = r <= 3.5 ? "#ff7180" : r > 4.5 ? "#ff304c" : "#ff4b60";
    bullets.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, color, r, life: 7 });
  }
  function pattern(dt) {
    if (!boss) return;
    const lane = boss.location;
    const laneX = [W * .5, W * .22, W * .78, W * .34, W * .66][lane];
    const laneY = [82, 112, 112, 68, 68][lane];
    boss.x += (laneX + Math.sin(elapsed * (.38 + lane * .035)) * W * (lane === 0 ? .24 : .1) - boss.x) * (1 - Math.exp(-dt * 1.6));
    boss.y += (laneY + Math.sin(elapsed * .8 + lane) * 10 - boss.y) * (1 - Math.exp(-dt * 1.4));
    if (!boss.attacking) {
      boss.rest -= dt;
      if (boss.rest > 0) return;
      boss.attackIndex = (boss.attackIndex + 1) % boss.attackDeck.length;
      boss.attackTime = 0; boss.attackClock = 0; boss.shotClock = .25; boss.attacking = true;
    }
    const scale = threatScale();
    boss.attackTime += dt * scale; boss.attackClock += dt * scale; boss.shotClock -= dt * scale;
    const aimed = Math.atan2(player.y - boss.y, player.x - boss.x);
    const fire = (angle, speed, size = 4) => bullet(boss.x, boss.y + 12, angle, speed, "#ff304c", size);
    if (boss.shotClock <= 0) {
      const deck = boss.attackDeck[boss.attackIndex];
      if (bossIndex === 0) {
        if (deck === 0) { boss.angle += .2; for (let i = 0; i < 5; i++) fire(boss.angle + i * Math.PI * 2 / 5, 108, 4.5); boss.shotClock = .18; }
        if (deck === 1) { for (let i = -4; i <= 4; i++) fire(aimed + i * .15, 145, 4); boss.shotClock = .72; }
        if (deck === 2) { for (let i = -1; i <= 1; i++) fire(aimed + i * .12, 210, 3.5); boss.shotClock = .48; }
        if (deck === 3) { for (let i = 0; i < 7; i++) fire(Math.PI / 2 + Math.sin(elapsed * 1.4) * .4 + i * .23, 135, 3.5); boss.shotClock = .52; }
        if (deck === 4) { for (let i = 0; i < 3; i++) fire(aimed + (i - 1) * .34, 175 + i * 14, 5); boss.shotClock = .82; }
      } else if (bossIndex === 1) {
        if (deck === 0) { for (let i = -2; i <= 2; i++) fire(aimed + i * .11, 230, 4.5); boss.shotClock = .58; }
        if (deck === 1) { for (let i = -3; i <= 3; i++) fire(Math.PI / 2 + i * .17 + Math.sin(elapsed * 2) * .08, 160, 3.5); boss.shotClock = .42; }
        if (deck === 2) { boss.angle += .16; for (let i = 0; i < 12; i++) fire(boss.angle + i * Math.PI / 6, 125, 4); boss.shotClock = .92; }
        if (deck === 3) { for (let i = -4; i <= 4; i++) fire(aimed + i * .09, 265, 3.2); boss.shotClock = .95; }
        if (deck === 4) { for (let i = 0; i < 5; i++) fire(Math.PI / 2 + (i - 2) * .3, 95 + i * 16, 4.5); boss.shotClock = .64; }
      } else if (bossIndex === 2) {
        if (deck === 0) { boss.angle += .12; for (let ring = 0; ring < 2; ring++) for (let i = 0; i < 10; i++) fire(boss.angle + i * Math.PI / 5 + ring * .15, 105 + ring * 42, 4); boss.shotClock = .82; }
        if (deck === 1) { const sweep = Math.sin(elapsed * 1.6) * .38; for (let i = -3; i <= 3; i++) fire(Math.PI / 2 + sweep + i * .18, 150, 3.5); boss.shotClock = .34; }
        if (deck === 2) { boss.angle -= .22; for (let i = 0; i < 4; i++) fire(boss.angle + i * Math.PI / 2, 195, 4); boss.shotClock = .24; }
        if (deck === 3) { for (let i = 0; i < 8; i++) fire(aimed + (i - 3.5) * .13, 175, 3.4); boss.shotClock = .62; }
        if (deck === 4) { for (let i = 0; i < 14; i++) fire(boss.angle + i * Math.PI * 2 / 14, 118, 3.5); boss.angle += .17; boss.shotClock = .7; }
      } else if (bossIndex === 3) {
        if (deck === 0 || deck === 3) { for (let i = -4; i <= 4; i++) fire(Math.PI / 2 + i * .16 + Math.sin(elapsed * 1.2) * .2, 120 + Math.abs(i) * 8, 4); boss.shotClock = .58; }
        if (deck === 1 || deck === 4) { for (let i = 0; i < 9; i++) fire(boss.angle + i * Math.PI * 2 / 9, 112, 4); boss.angle += .24; boss.shotClock = .44; }
        if (deck === 2) { for (let i = -2; i <= 2; i++) fire(aimed + i * .2, 190, 4); boss.shotClock = .7; }
      } else if (bossIndex === 4) {
        if (deck === 0 || deck === 4) { for (let i = 0; i < 6; i++) fire(boss.angle + i * Math.PI / 3, 110, 5); boss.angle -= .2; boss.shotClock = .6; }
        if (deck === 1 || deck === 3) { for (let i = -3; i <= 3; i++) fire(aimed + i * .19, 135, 3); boss.shotClock = .5; }
        if (deck === 2) { for (let side of [-1, 1]) for (let i = 0; i < 4; i++) fire(Math.PI / 2 + side * (i * .19 + .22), 155, 4); boss.shotClock = .72; }
      } else {
        if (deck === 0 || deck === 3) { for (let i = -5; i <= 5; i++) fire(Math.PI / 2 + i * .12, 155, 3.5); boss.shotClock = .55; }
        if (deck === 1 || deck === 4) { for (let i = 0; i < 10; i++) fire(boss.angle + i * Math.PI / 5, 145, 4); boss.angle += .12; boss.shotClock = .65; }
        if (deck === 2) { for (let i = -1; i <= 1; i++) fire(aimed + i * .3, 250, 5); boss.shotClock = .9; }
      }
    }
    const attackDuration = 3.5 * difficultySettings[difficulty].cadence;
    if (boss.attackTime >= attackDuration) {
      boss.attacking = false;
      boss.rest = (boss.hp < boss.maxHp * .3 ? .8 : 1.3) * difficultySettings[difficulty].cadence / scale;
    }
  }
  function fireShot() {
    volleyCount += 1;
    const count = 1 + shotSpread + (focus ? focusBonus : 0) + (hasRare("starburst") ? 2 : 0);
    const prismCombo = synergyActive("prism");
    for (let i = 0; i < count; i += 1) {
      const angle = -Math.PI / 2 + (i - (count - 1) / 2) * .11;
      const shot = { x: player.x, y: player.y - 9, vx: Math.cos(angle) * 560, vy: Math.sin(angle) * 560, r: focus ? 3.5 : 3, damage: shotDamage * (prismCombo ? 1.25 : 1), pierce: shotPierce + (prismCombo ? 1 : 0) + (hasRare("rift-core") ? 2 : 0) };
      shots.push(shot);
      if (hasRare("echo")) shots.push({ ...shot, delay: .14, damage: shot.damage * .55, pierce: 0 });
    }
    sound("shot", focus || hasRare("starburst") ? 1 : 0);
  }
  function defeatMidboss() {
    score += 650 + stage * 100; midboss = null; bossClear = 1.7; phase = "approach"; sound("victory");
    essences.push({ x: W / 2, y: H * .35, value: 4, life: 12, color: "#54f0ad" });
  }
  function defeatBoss() {
    const defeatedBoss = bossIndex;
    runBossesDefeated += 1;
    if (bossLifeLosses === 0 && defeatedBoss < 3) unlockChallengeSkin(["astra-flawless", "kuro-flawless", "mira-flawless"][defeatedBoss]);
    if (lives === 1) unlockChallengeSkin("one-life-boss");
    if (runBossesDefeated >= 3) unlockChallengeSkin("three-bosses");
    if (runBossesDefeated >= 5) unlockChallengeSkin("five-bosses");
    score += 2200 + stage * 350; if (hasRare("phoenix")) lives = Math.min(5, lives + 1); boss = null; stage += 1; stageTime = 0; enemyClock = 1; midboss = null; midbossSpawned = false; phase = "wave";
    delete root.dataset.bossTheme;
    bombs = Math.min(maxBombs, bombs + 1); bossClear = 2.4; bullets = []; sound("victory");
    for (let n = 0; n < 4; n += 1) essences.push({ x: W * (.25 + n * .16), y: H * .3, value: 2, life: 12, color: "#54f0ad" });
  }
  function useBomb() {
    if (mode !== "playing" || bombs <= 0) return;
    bombs -= 1; bullets = []; score += 80; bombFlash = .35;
    for (let i = enemies.length - 1; i >= 0; i -= 1) killEnemy(enemies[i], enemies, i, true);
    if (midboss) { midboss.hp -= 55 * (synergyActive("singularity") ? 1.5 : 1) * (hasRare("bombardier") ? 1.7 : 1); if (midboss.hp <= 0) defeatMidboss(); }
    if (boss) { boss.hp -= 55 * bombPower * (synergyActive("singularity") ? 1.5 : 1) * (hasRare("bombardier") ? 1.7 : 1); if (boss.hp <= 0) defeatBoss(); }
    for (let n = 0; n < 36; n += 1) particles.push({ x: player.x, y: player.y, vx: (Math.random() - .5) * 430, vy: (Math.random() - .5) * 430, life: .65, color: n % 2 ? "#f2aaff" : "#fff1a2" });
    sound("bomb"); updateHud();
  }
  function end() {
    if (mode === "over") return;
    mode = "over";
    const finalScore = Math.floor(score * scoreMultiplier());
    best = Math.max(best, finalScore); writeBest(best);
    root.classList.add("is-game-over");
    ui.hud.hidden = true; ui.start.hidden = true; ui.pause.hidden = true; ui.perks.hidden = true; ui.chest.hidden = true; ui.over.hidden = false;
    root.querySelector("[data-dm-final]").textContent = finalScore.toLocaleString();
    root.querySelector("[data-dm-final-best]").textContent = best.toLocaleString();
    root.querySelector("[data-dm-best]").textContent = best.toLocaleString();
    try { checkSkinUnlocks(finalScore); } catch { /* The end screen must remain available if cosmetic storage fails. */ }
    try { scoreEntry.show(finalScore); } catch { /* Score entry is optional; the result and restart controls remain usable. */ }
    sound("gameover");
  }
  function hitPlayer() {
    if (debugInvulnerable || invuln > 0) return;
    if (hasRare("aegis") && aegisCooldown <= 0) {
      aegisCooldown = 14; invuln = .45; sound("aegis");
      for (let n = 0; n < 12; n += 1) particles.push({ x: player.x, y: player.y, vx: (Math.random() - .5) * 150, vy: (Math.random() - .5) * 150, life: .4, color: "#75dcff" });
      return;
    }
    lives -= 1; runLifeLosses += 1; if (boss) bossLifeLosses += 1; invuln = 1.45; sound("hit");
    if (lives <= 0) { lives = 0; end(); return; }
    const fracture = Math.max(1, Math.min(4, 4 - lives));
    const edges = [
      { x: 1, y: H * .18, angle: 0 }, { x: W - 1, y: H * .29, angle: Math.PI },
      { x: W * .24, y: 1, angle: Math.PI / 2 }, { x: W * .37, y: H - 1, angle: -Math.PI / 2 },
      { x: 1, y: H * .76, angle: 0 }, { x: W - 1, y: H * .81, angle: Math.PI },
      { x: W * .73, y: 1, angle: Math.PI / 2 }, { x: W * .82, y: H - 1, angle: -Math.PI / 2 }
    ];
    const firstEdge = (fracture - 1) * 2;
    const makePath = (x, y, angle, length, seed) => {
      let state = seed >>> 0;
      const random = () => { state = (state * 1664525 + 1013904223) >>> 0; return state / 4294967296; };
      let heading = angle, px = x, py = y;
      const points = [[px, py]], headings = [heading], steps = 12;
      for (let step = 1; step <= steps; step += 1) {
        heading += (random() - .5) * .22;
        px += Math.cos(heading) * length / steps; py += Math.sin(heading) * length / steps;
        points.push([px, py]); headings.push(heading);
      }
      return { points, headings, seed };
    };
    for (let index = 0; index < fracture + 1; index += 1) {
      const edge = edges[(firstEdge + index * 3) % edges.length];
      const tangent = edge.angle === 0 || edge.angle === Math.PI ? H : W;
      const along = (Math.random() - .5) * tangent * .09;
      const x = Math.max(1, Math.min(W - 1, edge.x + (tangent === H ? 0 : along)));
      const y = Math.max(1, Math.min(H - 1, edge.y + (tangent === H ? along : 0)));
      const seed = Math.random() * 100000 | 0;
      let state = seed >>> 0;
      const random = () => { state = (state * 1664525 + 1013904223) >>> 0; return state / 4294967296; };
      const scale = Math.min(W, H), heading = edge.angle + (random() - .5) * .2;
      const main = makePath(x, y, heading, scale * (.2 + fracture * .055 + random() * .045), seed);
      const paths = [main];
      for (let branch = 0; branch < Math.min(3, Math.floor((fracture + 1) / 2)); branch += 1) {
        const at = 3 + Math.floor(random() * 6), side = random() < .5 ? -1 : 1;
        paths.push(makePath(main.points[at][0], main.points[at][1], main.headings[at] + side * (.72 + random() * .32), scale * (.055 + fracture * .018 + random() * .025), seed + branch * 1973 + 1));
      }
      crackEvents.push({ x, y, damage: fracture, age: 0, paths });
    }
    for (let n = 0; n < 14; n += 1) particles.push({ x: player.x, y: player.y, vx: (Math.random() - .5) * 180, vy: (Math.random() - .5) * 180, life: .45, color: "#ff5a68" });
  }
  function update(dt) {
    if (lives <= 0) { end(); return; }
    for (const crack of crackEvents) crack.age = Math.min(10, crack.age + dt);
    bossTint += ((boss ? 1 : 0) - bossTint) * (1 - Math.exp(-dt * 2.2));
    elapsed += dt; stageTime += dt; invuln = Math.max(0, invuln - dt); bossClear = Math.max(0, bossClear - dt); aegisCooldown = Math.max(0, aegisCooldown - dt);
    bombFlash = Math.max(0, bombFlash - dt);
    const speed = (focus ? (synergyActive("ghost") ? 104 : 86) : 222) * moveBonus;
    let dx = (actionDown("danmaku", "right", keys) ? 1 : 0) - (actionDown("danmaku", "left", keys) ? 1 : 0);
    let dy = (actionDown("danmaku", "down", keys) ? 1 : 0) - (actionDown("danmaku", "up", keys) ? 1 : 0);
    const mag = Math.hypot(dx, dy) || 1;
    const targetVx = dx / mag * speed, targetVy = dy / mag * speed;
    const response = 1 - Math.exp(-dt * (dx || dy ? 15 : 19));
    player.vx += (targetVx - player.vx) * response; player.vy += (targetVy - player.vy) * response;
    player.x += player.vx * dt; player.y += player.vy * dt;
    player.x = Math.max(12, Math.min(W - 12, player.x)); player.y = Math.max(62, Math.min(H - 16, player.y));
    shotClock -= dt; if (actionDown("danmaku", "fire", keys) && shotClock <= 0) { fireShot(); shotClock = Math.max(.045, (.115 - (shotDamage - 1) * .025) * (hasRare("overdrive") ? .75 : 1) * (hasRare("afterburn") && Math.hypot(player.vx, player.vy) > 35 ? .85 : 1)); }
    if (!boss) {
      enemyClock -= dt;
      if (stageTime < 27 && enemyClock <= 0) { spawnEnemyWave(); enemyClock = Math.max(.45, 1.55 - stage * .08) * difficultySettings[difficulty].waves / threatScale(); }
      if (!midbossSpawned && stageTime >= 15) { spawnMidboss(); midbossSpawned = true; }
      if (midboss && stageTime > 19) {
        midboss.timer += dt; midboss.phase += dt; midboss.x = W / 2 + Math.sin(elapsed * .9) * W * .3;
        if (midboss.timer >= Math.max(.55, 2.1 - stage * .08) * difficultySettings[difficulty].cadence / threatScale()) {
          midboss.timer = 0; const aim = Math.atan2(player.y - midboss.y, player.x - midboss.x);
          for (let n = -2; n <= 2; n += 1) bullet(midboss.x, midboss.y + 8, aim + n * .17, 120 + stage * 5, "#ffb366", 4);
        }
      }
      if (stageTime >= 27 && (midbossSpawned && !midboss || stageTime >= 34)) spawnBoss();
    } else pattern(dt);
    for (let i = enemies.length - 1; i >= 0; i -= 1) {
      const enemy = enemies[i]; enemy.phase += dt;
      const wave = Math.sin(enemy.phase * (enemy.kind === 3 ? 3.2 : enemy.kind === 4 ? .8 : 1.7) + enemy.seed);
      enemy.y += enemy.speed * dt;
      enemy.x = enemy.baseX + wave * (enemy.kind === 3 ? W * .2 : enemy.kind === 4 ? 12 : enemy.kind === 2 ? 16 : 24);
      if (enemy.kind === 3) enemy.y += Math.max(0, Math.sin(enemy.phase * 2.8)) * 12 * dt;
      enemy.shotClock -= dt;
      if (enemy.shotClock <= 0 && enemy.y > 20 && enemy.y < H * .62) {
        const aim = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        const shotSpeed = 105 + stage * 7 + (enemy.kind === 3 ? 20 : 0);
        if (enemy.kind === 1) {
          for (let fan = -1; fan <= 1; fan += 1) bullet(enemy.x, enemy.y + enemy.r, aim + fan * .22, shotSpeed, "#ffb866", 3.6);
        } else if (enemy.kind === 4) {
          enemy.fireCount += 1;
          const count = enemy.fireCount % 3 === 0 ? 8 : 3;
          for (let n = 0; n < count; n += 1) bullet(enemy.x, enemy.y, enemy.fireCount % 3 === 0 ? n * Math.PI * 2 / count + enemy.phase * .2 : aim + (n - 1) * .19, shotSpeed * .8, "#ffb866", 3.8);
        } else bullet(enemy.x, enemy.y + enemy.r, aim, shotSpeed, "#67dff0", enemy.kind === 2 ? 4 : 3.2);
        enemy.shotClock = Math.max(.42, Math.max(enemy.kind === 4 ? 1.4 : .9, (enemy.kind === 1 ? 2.3 : 2.7) - stage * .1) * difficultySettings[difficulty].cadence / threatScale()) + Math.random() * .65 * difficultySettings[difficulty].cadence / threatScale();
      }
      if (Math.hypot(enemy.x - player.x, enemy.y - player.y) < enemy.r + player.r && invuln <= 0) { hitPlayer(); enemy.y = H + 30; }
      if (enemy.y > H + 25) enemies.splice(i, 1);
    }
    const novaImpacts = [];
    for (let i = shots.length - 1; i >= 0; i -= 1) {
      const shot = shots[i];
      if (shot.delay > 0) { shot.delay -= dt; continue; }
      shot.x += shot.vx * dt; shot.y += shot.vy * dt; let hit = false;
      if (boss && Math.hypot(shot.x - boss.x, shot.y - boss.y) < boss.r + 5) { boss.hp -= shot.damage; hit = true; if (boss.hp <= 0) defeatBoss(); }
      else if (midboss && Math.hypot(shot.x - midboss.x, shot.y - midboss.y) < midboss.r + 5) { midboss.hp -= shot.damage; hit = true; if (midboss.hp <= 0) defeatMidboss(); }
      else {
        for (let j = enemies.length - 1; j >= 0; j -= 1) {
          const enemy = enemies[j];
          if (Math.hypot(shot.x - enemy.x, shot.y - enemy.y) < enemy.r + 4) { enemy.hp -= shot.damage; if (hasRare("nova")) novaImpacts.push({ x: shot.x, y: shot.y, damage: shot.damage * .55 }); if (enemy.hp <= 0) killEnemy(enemy, enemies, j); if (shot.pierce > 0) shot.pierce -= 1; else { hit = true; break; } }
        }
      }
      if (hit || shot.y < -12 || shot.x < -16 || shot.x > W + 16) shots.splice(i, 1);
    }
    if (novaImpacts.length) {
      for (const impact of novaImpacts) for (const enemy of enemies) if (Math.hypot(enemy.x - impact.x, enemy.y - impact.y) < 58) enemy.hp -= impact.damage;
      for (let i = enemies.length - 1; i >= 0; i -= 1) if (enemies[i].hp <= 0) killEnemy(enemies[i], enemies, i);
    }
    for (let i = essences.length - 1; i >= 0; i -= 1) {
      const essence = essences[i]; essence.life -= dt;
  const dx = player.x - essence.x, dy = player.y - essence.y;
  const distance = Math.hypot(dx, dy);
  const pullRange = Math.min(Math.hypot(W, H), (420 + magnet * 5) * (hasRare("scavenger") ? 1.8 : 1));
  if (distance < pullRange && distance > 0) {
    const pullSpeed = (250 + magnet * 1.5) * (hasRare("scavenger") ? 1.25 : 1);
    const step = Math.min(Math.max(0, distance - 14), pullSpeed * dt);
    essence.x += (dx / distance) * step;
    essence.y += (dy / distance) * step;
  }
  if (Math.hypot(essence.x - player.x, essence.y - player.y) < 16) { xp += essence.value * (hasRare("scavenger") ? 1.5 : 1); score += 25 * essence.value; essences.splice(i, 1); if (xp >= nextXp) { showPerks(); break; } }
      else if (essence.life <= 0 || essence.y > H + 10) essences.splice(i, 1);
    }
    if (mode !== "playing") { updateHud(); return; }
    for (let i = chests.length - 1; i >= 0; i -= 1) {
      const chest = chests[i]; chest.life -= dt;
      if (Math.hypot(chest.x - player.x, chest.y - player.y) < 24) {
        chests.splice(i, 1); openChest(chest); updateHud(); return;
      }
      if (chest.life <= 0) chests.splice(i, 1);
    }
    if (boss && invuln <= 0 && Math.hypot(boss.x - player.x, boss.y - player.y) < boss.r + player.r) { hitPlayer(); if (mode === "over") return; }
    if (midboss && invuln <= 0 && Math.hypot(midboss.x - player.x, midboss.y - player.y) < midboss.r + player.r) { hitPlayer(); if (mode === "over") return; }
    for (let i = bullets.length - 1; i >= 0; i -= 1) { const b = bullets[i]; b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt; if (invuln <= 0 && Math.hypot(b.x - player.x, b.y - player.y) < b.r + player.r) { bullets.splice(i, 1); hitPlayer(); if (mode === "over") return; } else if (b.life <= 0 || b.y > H + 20 || b.x < -20 || b.x > W + 20) bullets.splice(i, 1); }
    for (const p of particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; }
    let aliveParticles = 0;
    for (const particle of particles) if (particle.life > 0) particles[aliveParticles++] = particle;
    particles.length = aliveParticles;
    score += dt * (2 + stage * .25); updateHud(false);
  }
  function drawDamageCracks() {
    if (!crackEvents.length || mode === "menu") return;
    ctx.save(); ctx.globalCompositeOperation = "source-over";
    for (const crack of crackEvents) {
      const growth = Math.min(1, crack.age / (.58 + crack.damage * .12));
      const eased = 1 - (1 - growth) ** 2;
      for (let pathIndex = 0; pathIndex < crack.paths.length; pathIndex += 1) {
        const path = crack.paths[pathIndex];
        const pathGrowth = pathIndex ? Math.max(0, Math.min(1, (eased - .16) / .84)) : eased;
        const segments = (path.points.length - 1) * pathGrowth;
        if (segments <= 0) continue;
        const points = path.points.slice(0, Math.floor(segments) + 1);
        const fraction = segments % 1;
        if (fraction && Math.floor(segments) < path.points.length - 1) {
          const from = path.points[Math.floor(segments)], to = path.points[Math.floor(segments) + 1];
          points.push([from[0] + (to[0] - from[0]) * fraction, from[1] + (to[1] - from[1]) * fraction]);
        }
        if (points.length < 2) continue;
        ctx.beginPath(); ctx.moveTo(points[0][0], points[0][1]);
        for (let index = 1; index < points.length; index += 1) ctx.lineTo(points[index][0], points[index][1]);
        ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.globalAlpha = .24 + crack.damage * .045; ctx.strokeStyle = "#070d18"; ctx.lineWidth = pathIndex ? 1.25 : 1.8; ctx.stroke();
        ctx.globalAlpha = .34 + crack.damage * .055; ctx.strokeStyle = lives <= 1 ? "#ffb5bf" : "#e4f5ff"; ctx.lineWidth = pathIndex ? .55 : .72; ctx.stroke();
      }
    }
    if (lives <= 1) {
      const pulse = .055 + (Math.sin(elapsed * 2.2) + 1) * .018;
      const vignette = ctx.createRadialGradient(W / 2, H / 2, scale * .22, W / 2, H / 2, scale * .82);
      vignette.addColorStop(0, "#ff263000"); vignette.addColorStop(1, `rgba(255,45,74,${pulse})`);
      ctx.globalAlpha = 1; ctx.fillStyle = vignette; ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();
  }
  function draw() {
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = backgroundGradient; ctx.fillRect(0, 0, W, H);
    if (bossTint > .005 && bossIndex >= 0) { ctx.globalAlpha = bossTint * .43; ctx.fillStyle = bossPalettes[bossIndex].wash; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
    for (const s of stars) { ctx.globalAlpha = s.a * (.65 + Math.sin(elapsed * 1.8 + s.x) * .35); ctx.fillStyle = "#e5e1ff"; ctx.fillRect(s.x, (s.y + elapsed * 19) % H, s.s, s.s); } ctx.globalAlpha = 1;
    if (bossTint > .005 && bossIndex >= 0) { const palette = bossPalettes[bossIndex]; ctx.globalAlpha = bossTint * .78; ctx.fillStyle = palette.star; for (const s of stars) { ctx.globalAlpha = bossTint * s.a * .72; ctx.fillRect(s.x, (s.y + elapsed * 19) % H, s.s + .3, s.s + .3); } ctx.globalAlpha = 1; }
    ctx.strokeStyle = "#dbcaff12"; ctx.lineWidth = 1; for (let x = 20; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    if (bossTint > .005 && bossIndex >= 0) { ctx.globalAlpha = bossTint * .13; ctx.strokeStyle = bossPalettes[bossIndex].grid; for (let x = 20; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } ctx.globalAlpha = 1; }
    for (const essence of essences) {
      const pulse = 1 + Math.sin(elapsed * 7 + essence.x) * .12;
      const size = 5.5 + Math.min(essence.value, 4) * .55;
      ctx.save(); ctx.translate(essence.x, essence.y); ctx.rotate(elapsed * 1.4);
      ctx.scale(pulse, pulse); ctx.shadowColor = essence.color; ctx.shadowBlur = 16;
      ctx.fillStyle = essence.color; ctx.strokeStyle = "#fff8df"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(0, -size); ctx.lineTo(size * .72, 0); ctx.lineTo(0, size); ctx.lineTo(-size * .72, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.shadowBlur = 0; ctx.fillStyle = "#fffdf2";
      ctx.beginPath(); ctx.moveTo(0, -size * .5); ctx.lineTo(size * .24, 0); ctx.lineTo(0, size * .5); ctx.lineTo(-size * .24, 0); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    for (const chest of chests) {
      const bob = Math.sin(elapsed * 3 + chest.phase) * 2;
      ctx.save(); ctx.translate(chest.x, chest.y + bob); ctx.shadowColor = "#ffc95e"; ctx.shadowBlur = 15;
      ctx.fillStyle = "#e9a83f"; ctx.strokeStyle = "#fff0b3"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.roundRect(-9, -6, 18, 13, 3); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#fff0b3"; ctx.fillRect(-1, -2, 2, 5); ctx.shadowBlur = 0;
      ctx.strokeStyle = chest.life < 5 ? "#ff596b" : "#ffd479"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(0, 0, 14, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * chest.life / 20); ctx.stroke();
      ctx.font = "700 8px monospace"; ctx.textAlign = "center"; ctx.fillStyle = chest.life < 5 ? "#ff8290" : "#ffe5a8";
      ctx.fillText(`${Math.ceil(chest.life)}s`, 0, -15); ctx.restore();
    }
    for (const enemy of enemies) {
      const colors = ["#65d9ef", "#ff9a70", "#e9a65c", "#d48aff", "#ff6687"];
      const color = colors[enemy.kind] || colors[0];
      ctx.save(); ctx.translate(enemy.x, enemy.y); ctx.rotate(enemy.kind === 3 ? Math.sin(enemy.phase * 2) * .35 : Math.sin(enemy.phase) * .12);
      ctx.shadowColor = color; ctx.shadowBlur = enemy.kind === 2 || enemy.kind === 4 ? 17 : 11; ctx.fillStyle = color; ctx.strokeStyle = "#fff8e8"; ctx.lineWidth = 1;
      ctx.beginPath();
      if (enemy.kind === 1) {
        ctx.moveTo(0, -enemy.r); ctx.lineTo(enemy.r * .38, -enemy.r * .12); ctx.lineTo(enemy.r, 0); ctx.lineTo(enemy.r * .38, enemy.r * .35); ctx.lineTo(0, enemy.r); ctx.lineTo(-enemy.r * .38, enemy.r * .35); ctx.lineTo(-enemy.r, 0); ctx.lineTo(-enemy.r * .38, -enemy.r * .12);
      } else if (enemy.kind === 2) {
        for (let n = 0; n < 8; n += 1) { const a = -Math.PI / 2 + n * Math.PI / 4, r = n % 2 ? enemy.r * .78 : enemy.r; if (!n) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r); else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
      } else if (enemy.kind === 3) {
        ctx.moveTo(-enemy.r, -enemy.r * .45); ctx.lineTo(0, -enemy.r * .8); ctx.lineTo(enemy.r, -enemy.r * .45); ctx.lineTo(enemy.r * .42, enemy.r * .18); ctx.lineTo(0, enemy.r); ctx.lineTo(-enemy.r * .42, enemy.r * .18);
      } else if (enemy.kind === 4) {
        ctx.moveTo(0, -enemy.r); ctx.lineTo(enemy.r * .82, 0); ctx.lineTo(0, enemy.r); ctx.lineTo(-enemy.r * .82, 0);
      } else {
        ctx.moveTo(0, enemy.r); ctx.lineTo(enemy.r, -enemy.r * .45); ctx.lineTo(0, -enemy.r * .75); ctx.lineTo(-enemy.r, -enemy.r * .45);
      }
      ctx.closePath(); ctx.fill(); if (enemy.kind === 2 || enemy.kind === 4) ctx.stroke();
      ctx.shadowBlur = 0; ctx.fillStyle = "#fff7e8"; ctx.beginPath(); ctx.arc(0, 0, enemy.kind === 4 ? 2.2 : 1.5, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      if (enemy.hp < enemy.maxHp) { ctx.fillStyle = "#271c35"; ctx.fillRect(enemy.x - enemy.r, enemy.y - enemy.r - 5, enemy.r * 2, 2); ctx.fillStyle = color; ctx.fillRect(enemy.x - enemy.r, enemy.y - enemy.r - 5, enemy.r * 2 * enemy.hp / enemy.maxHp, 2); }
    }
    for (const b of shots) { ctx.fillStyle = "#fff1a8"; ctx.shadowColor = "#ffe49a"; ctx.shadowBlur = 12; ctx.beginPath(); ctx.ellipse(b.x, b.y, b.r, 8, 0, 0, Math.PI * 2); ctx.fill(); } ctx.shadowBlur = 0;
    for (const b of bullets) {
      ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(Math.atan2(b.vy, b.vx) + Math.PI / 2);
      ctx.shadowColor = b.color; ctx.shadowBlur = 10; ctx.fillStyle = b.color;
      ctx.strokeStyle = "#241b35"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, -b.r * 1.8); ctx.quadraticCurveTo(b.r * 1.2, -b.r * .5, b.r * .72, b.r * .8);
      ctx.quadraticCurveTo(0, b.r * 1.35, -b.r * .72, b.r * .8); ctx.quadraticCurveTo(-b.r * 1.2, -b.r * .5, 0, -b.r * 1.8);
      ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff4e8"; ctx.beginPath(); ctx.ellipse(0, -b.r * .35, b.r * .22, b.r * .42, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    if (boss) { const palette = bossPalettes[bossIndex]; ctx.save(); ctx.translate(boss.x, boss.y); ctx.rotate(Math.sin(elapsed) * .12); ctx.shadowColor = palette.glow; ctx.shadowBlur = 25; ctx.fillStyle = palette.accent; ctx.beginPath(); for (let i = 0; i < 10; i += 1) { const a = -Math.PI / 2 + i * Math.PI / 5; const r = i % 2 ? 12 : 26; if (!i) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r); else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0; ctx.strokeStyle = boss.attacking ? palette.accent : palette.secondary; ctx.globalAlpha = boss.attacking ? .7 : .85; ctx.lineWidth = boss.attacking ? 1.7 : 1; ctx.beginPath(); ctx.arc(0, 0, boss.attacking ? 30 : 30 + Math.sin(elapsed * 5) * 2, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
    if (midboss) { ctx.save(); ctx.translate(midboss.x, midboss.y); ctx.rotate(elapsed * .3); ctx.fillStyle = "#f5a65f"; ctx.shadowColor = "#ff9a57"; ctx.shadowBlur = 20; ctx.beginPath(); for (let i = 0; i < 8; i += 1) { const a = i * Math.PI / 4; const r = i % 2 ? 10 : 20; if (!i) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r); else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fill(); ctx.restore(); }
    for (const p of particles) { ctx.globalAlpha = Math.max(0, p.life / .45); ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, 3, 3); } ctx.globalAlpha = 1;
    if (mode === "playing" && (invuln <= 0 || Math.floor(elapsed * 16) % 2)) {
      const skin = skinById.get(player.skin) || shipSkins[0];
      const bob = Math.sin(elapsed * 8) * 1.1, bank = Math.max(-.24, Math.min(.24, player.vx / 950));
      const wingColor = skin.accent;
      ctx.save(); ctx.translate(player.x, player.y + bob); ctx.rotate(bank);
      const flame = 5 + (Math.sin(elapsed * 25) + 1) * 3 + Math.min(4, Math.hypot(player.vx, player.vy) / 90);
      if (skin.model) {
        ctx.save(); ctx.shadowColor = skin.glow; ctx.shadowBlur = 10; ctx.fillStyle = skin.accent; ctx.strokeStyle = skin.core; ctx.lineWidth = .8;
        if (skin.model === "winged" || skin.model === "phoenix") {
          const spread = skin.model === "phoenix" ? 18 : 15;
          for (const side of [-1, 1]) { ctx.beginPath(); ctx.moveTo(side * 4, -4); ctx.lineTo(side * spread, 2); ctx.lineTo(side * (spread - 3), 8); ctx.lineTo(side * 5, 5); ctx.closePath(); ctx.fill(); ctx.stroke(); }
          if (skin.model === "phoenix") for (const side of [-1, 1]) { ctx.globalAlpha = .78; ctx.beginPath(); ctx.moveTo(side * 7, 2); ctx.lineTo(side * 15, 8); ctx.lineTo(side * 9, 7); ctx.closePath(); ctx.fill(); }
        } else if (skin.model === "orbital" || skin.model === "void") {
          ctx.save(); ctx.rotate(elapsed * (skin.model === "void" ? -.8 : .55)); ctx.globalAlpha = .8; ctx.lineWidth = skin.model === "void" ? 1.3 : .9;
          ctx.beginPath(); ctx.ellipse(0, 1, skin.model === "void" ? 17 : 14, skin.model === "void" ? 7 : 5, 0, 0, Math.PI * 2); ctx.stroke();
          for (const side of [-1, 1]) { ctx.beginPath(); ctx.arc(side * (skin.model === "void" ? 15 : 12), 0, skin.model === "void" ? 2.3 : 1.8, 0, Math.PI * 2); ctx.fill(); }
          ctx.restore();
        } else if (skin.model === "crown") {
          ctx.beginPath(); ctx.moveTo(-7, -9); ctx.lineTo(-5, -17); ctx.lineTo(-1, -12); ctx.lineTo(0, -20); ctx.lineTo(3, -12); ctx.lineTo(7, -17); ctx.lineTo(8, -8); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.globalAlpha = .7; ctx.beginPath(); ctx.ellipse(0, -13, 12, 3.5, 0, 0, Math.PI * 2); ctx.stroke();
        } else if (skin.model === "heavy") {
          for (const side of [-1, 1]) { ctx.beginPath(); ctx.moveTo(side * 5, -5); ctx.lineTo(side * 12, -3); ctx.lineTo(side * 13, 7); ctx.lineTo(side * 7, 9); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillRect(side * 10 - 1, -8, 2, 6); }
          ctx.fillRect(-3, -10, 6, 6);
        } else if (skin.model === "wisp") {
          ctx.globalAlpha = .7; ctx.lineWidth = 1.6;
          for (const side of [-1, 1]) { ctx.beginPath(); ctx.moveTo(side * 4, 7); ctx.bezierCurveTo(side * 10, 14 + Math.sin(elapsed * 7) * 2, side * 2, 19, side * 6, 24); ctx.stroke(); }
          ctx.beginPath(); ctx.arc(0, -11, 7 + Math.sin(elapsed * 4) * .8, Math.PI * 1.12, Math.PI * 1.88); ctx.stroke();
        } else if (skin.model === "mech") {
          for (const side of [-1, 1]) { ctx.fillRect(side * 8 - 1.5, -1, 3, 12); ctx.fillRect(side * 11 - 1, 4, 2, 5); }
          ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(3, -12); ctx.lineTo(0, -8); ctx.lineTo(-3, -12); ctx.closePath(); ctx.fill(); ctx.stroke();
        }
        ctx.restore();
      }
      ctx.shadowColor = skin.glow; ctx.shadowBlur = 13;
      ctx.fillStyle = skin.engine; ctx.beginPath(); ctx.moveTo(-3, 7); ctx.lineTo(0, 7 + flame); ctx.lineTo(3, 7); ctx.closePath(); ctx.fill();
      if (moveBonus > 1 || hasRare("overdrive")) { ctx.fillStyle = skin.core; ctx.beginPath(); ctx.moveTo(-7, 4); ctx.lineTo(-8, 4 + flame * .65); ctx.lineTo(-4, 6); ctx.moveTo(7, 4); ctx.lineTo(8, 4 + flame * .65); ctx.lineTo(4, 6); ctx.fill(); }
      if (shotSpread > 0 || hasRare("starburst")) { ctx.fillStyle = wingColor; ctx.shadowBlur = 11; for (const side of [-1, 1]) { ctx.beginPath(); ctx.moveTo(side * 4, 1); ctx.lineTo(side * 12, 7); ctx.lineTo(side * 7, 8); ctx.closePath(); ctx.fill(); } }
      ctx.fillStyle = skin.body; ctx.shadowColor = skin.glow; ctx.shadowBlur = 17;
      ctx.beginPath(); ctx.moveTo(0, -13); ctx.lineTo(8, 9); ctx.lineTo(0, 5); ctx.lineTo(-8, 9); ctx.closePath(); ctx.fill();
      if (shotPierce > 0 || synergyActive("prism")) { ctx.fillStyle = "#b5f7ff"; ctx.beginPath(); ctx.moveTo(0, -17); ctx.lineTo(2, -8); ctx.lineTo(0, -5); ctx.lineTo(-2, -8); ctx.closePath(); ctx.fill(); }
      ctx.shadowBlur = 0; ctx.fillStyle = skin.core; ctx.beginPath(); ctx.arc(0, 0, focus ? 3.1 : 2, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      if (focus || focusBonus > 0) { ctx.strokeStyle = focus ? "#fff2c9aa" : "#a9dfff66"; ctx.lineWidth = focus ? 1.2 : .8; ctx.beginPath(); ctx.arc(player.x, player.y + bob, 8 + Math.sin(elapsed * 6) * .7, 0, Math.PI * 2); ctx.stroke(); }
      if (hasRare("aegis")) { ctx.strokeStyle = aegisCooldown <= 0 ? "#8cecffcc" : "#8cecff44"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(player.x, player.y + bob, 17 + Math.sin(elapsed * 4) * 1.5, elapsed * .7, elapsed * .7 + Math.PI * 1.55); ctx.stroke(); }
      if (hasRare("starburst")) { ctx.fillStyle = "#ffe9a1"; for (let n = 0; n < 2; n += 1) { const a = elapsed * 2.6 + n * Math.PI, x = player.x + Math.cos(a) * 16, y = player.y + bob + Math.sin(a) * 9; ctx.beginPath(); ctx.arc(x, y, 1.7, 0, Math.PI * 2); ctx.fill(); } }
    }
    if (bossClear > 0) { ctx.fillStyle = `rgba(255,239,197,${Math.min(1, bossClear)})`; ctx.textAlign = "center"; ctx.font = "700 12px monospace"; ctx.fillText(t.clear, W / 2, H * .37); }
    drawDamageCracks();
  }
  function updateControlMonitor() {
    monitor.root.classList.add("is-running");
    let x = (actionDown("danmaku", "right", monitorKeys) ? 1 : 0) - (actionDown("danmaku", "left", monitorKeys) ? 1 : 0);
    let y = (actionDown("danmaku", "down", monitorKeys) ? 1 : 0) - (actionDown("danmaku", "up", monitorKeys) ? 1 : 0);
    const length = Math.hypot(x, y) || 1; x /= length; y /= length;
    monitor.stick.style.transform = `translate(calc(-50% + ${x * 15}px), calc(-50% + ${y * 15}px))`;
    const firingInput = actionDown("danmaku", "fire", monitorKeys);
    const focusInput = actionDown("danmaku", "focus", monitorKeys);
    monitor.fire.classList.toggle("is-active", firingInput);
    monitor.focus.classList.toggle("is-active", focusInput);
    monitor.bomb.classList.toggle("is-active", actionDown("danmaku", "bomb", monitorKeys) || bombFlash > 0);
    monitor.state.textContent = firingInput ? (language === "pt" ? "ATIRANDO" : language === "es" ? "DISPARANDO" : "FIRING") : x || y ? (language === "pt" ? "MOVENDO" : language === "es" ? "MOVIENDO" : "MOVING") : focusInput ? (language === "pt" ? "FOCO" : language === "es" ? "FOCO" : "FOCUS") : (language === "pt" ? "PRONTO" : language === "es" ? "LISTO" : "READY");
  }
  function loop(now) {
    const dt = Math.min(.035, Math.max(0, (now - (last || now)) / 1000)); last = now;
    try {
      if (mode === "playing") update(dt);
      updateControlMonitor(); draw();
      if (debugEnabled && now - debugLastSample >= 250) {
        debugFps = Math.round(debugFrameCount * 1000 / Math.max(1, now - debugLastSample)); debugFrameCount = 0; debugLastSample = now;
        ui.debugData.textContent = `MODE ${mode.toUpperCase()}  ·  FPS ${debugFps}\nSTAGE ${stage}  ·  PHASE ${phase}\nSCORE ${Math.floor(score)}  ·  THREAT ${threatScale().toFixed(2)}x\nBOSS ${boss ? bossIndex + 1 : "—"}  ·  ENEMIES ${enemies.length}\nBULLETS ${bullets.length}  ·  SHOTS ${shots.length}\nLIVES ${lives}  ·  XP ${Math.floor(xp)}/${nextXp}`;
      }
      if (debugEnabled) debugFrameCount += 1;
    } catch (error) {
      console.error("DANMAKU frame error:", error);
      if (lives <= 0) { try { end(); } catch (endError) { console.error("DANMAKU game-over error:", endError); } }
    } finally { frame = requestAnimationFrame(loop); }
  }
  function keydown(e) {
    const key = e.key.toLowerCase();
    if ([" ", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) e.preventDefault();
    if (!e.repeat) {
      debugInput.push(key); debugInput = debugInput.slice(-debugCode.length);
      if (debugInput.length === debugCode.length && debugInput.every((value, index) => value === debugCode[index])) setDebugOpen(!debugEnabled);
    }
    if (mode === "perk") {
      if (["arrowleft", "arrowup", "w", "a"].includes(key)) movePerkSelection(-1);
      else if (["arrowright", "arrowdown", "s", "d"].includes(key)) movePerkSelection(1);
      else if (keyMatches("danmaku", "confirm", e.key)) root.querySelector(`[data-dm-perk-list] [data-choice="${selectedPerkIndex}"]`)?.click();
      else if (["1", "2", "3"].includes(key)) root.querySelector(`[data-dm-perk-list] [data-choice="${Number(key) - 1}"]`)?.click();
      return;
    }
    if (mode === "chest") {
      if (["arrowleft", "arrowup", "w", "a"].includes(key)) moveChestSelection(-1);
      else if (["arrowright", "arrowdown", "s", "d"].includes(key)) moveChestSelection(1);
      else if (keyMatches("danmaku", "confirm", e.key)) root.querySelectorAll("[data-dm-chest-actions] button")[chestActionIndex]?.click();
      return;
    }
    if ((keyMatches("danmaku", "pause", e.key) || key === "escape") && !e.repeat && mode === "playing") { mode = "pause"; keys.clear(); ui.pause.hidden = false; }
    else if ((keyMatches("danmaku", "pause", e.key) || key === "escape") && !e.repeat && mode === "pause") { mode = "playing"; ui.pause.hidden = true; }
    if (keyMatches("danmaku", "focus", e.key)) focus = true;
    if (keyMatches("danmaku", "bomb", e.key) && !e.repeat) useBomb();
    if (mode === "playing" || mode === "pause") keys.add(normalizeKey(e.key));
  }
  function keyup(e) { keys.delete(normalizeKey(e.key)); if (keyMatches("danmaku", "focus", e.key)) focus = false; }
  function monitorKeyDown(e) { monitorKeys.add(normalizeKey(e.key)); }
  function monitorKeyUp(e) { monitorKeys.delete(normalizeKey(e.key)); }
  function pauseForKeybinds() { resumeAfterKeybind = mode === "playing"; if (resumeAfterKeybind) { mode = "pause"; keys.clear(); focus = false; ui.pause.hidden = true; } }
  function resumeAfterKeybinds() { if (resumeAfterKeybind && mode === "pause") mode = "playing"; resumeAfterKeybind = false; }
  renderSkins();
  root.querySelector("[data-debug-skin]").value = selectedSkinId;
  root.querySelector("[data-debug-difficulty]").value = difficulty;
  skinList.addEventListener("click", (event) => { const button = event.target.closest("[data-dm-skin]"); if (button && !button.disabled) equipSkin(button.dataset.dmSkin); });
  root.querySelectorAll("[data-dm-difficulty]").forEach((button) => button.addEventListener("click", () => { difficulty = button.dataset.dmDifficulty; root.querySelectorAll("[data-dm-difficulty]").forEach((item) => { const selected = item === button; item.setAttribute("aria-pressed", String(selected)); item.classList.toggle("is-selected", selected); }); }));
  root.querySelector("[data-dm-start-button]").addEventListener("click", start);
  root.querySelector("[data-dm-retry]").addEventListener("click", start);
  root.querySelector("[data-dm-resume]").addEventListener("click", () => { mode = "playing"; ui.pause.hidden = true; });
  root.querySelector("[data-dm-pause]").addEventListener("click", () => { if (mode === "playing") { mode = "pause"; ui.pause.hidden = false; } });
  root.querySelector("[data-dm-menu]").addEventListener("click", () => { mode = "menu"; root.classList.remove("is-game-over"); ui.over.hidden = true; ui.hud.hidden = true; ui.start.hidden = false; bullets = []; shots = []; });
  root.querySelector("[data-debug-close]").addEventListener("click", () => setDebugOpen(false));
  root.querySelectorAll("[data-debug-action]").forEach((button) => button.addEventListener("click", () => runDebugAction(button.dataset.debugAction)));
  window.addEventListener("keydown", monitorKeyDown); window.addEventListener("keyup", monitorKeyUp); window.addEventListener("keydown", keydown); window.addEventListener("keyup", keyup); window.addEventListener("arcade-keybind-open", pauseForKeybinds); window.addEventListener("arcade-keybind-close", resumeAfterKeybinds); window.addEventListener("blur", () => { keys.clear(); monitorKeys.clear(); focus = false; });
  const observer = new ResizeObserver(resize); observer.observe(field); resize(); frame = requestAnimationFrame(loop);
  return () => { cancelAnimationFrame(frame); if (chestSpinInterval) clearInterval(chestSpinInterval); if (skinToastTimer) clearTimeout(skinToastTimer); observer.disconnect(); window.removeEventListener("keydown", monitorKeyDown); window.removeEventListener("keyup", monitorKeyUp); window.removeEventListener("keydown", keydown); window.removeEventListener("keyup", keyup); window.removeEventListener("arcade-keybind-open", pauseForKeybinds); window.removeEventListener("arcade-keybind-close", resumeAfterKeybinds); };
}
