export function formatDuration(milliseconds) {
  if (milliseconds === null || milliseconds === undefined || milliseconds === "" || !Number.isFinite(Number(milliseconds))) return "—";
  const totalSeconds = Math.max(0, Math.floor(Number(milliseconds) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function formatDate(timestamp, locale = "pt-BR") {
  if (timestamp === null || timestamp === undefined || timestamp === "" || !Number.isFinite(Number(timestamp))) return "—";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(Number(timestamp) * 1000));
}

export function calculateWinRate(wins, losses) {
  const total = Number(wins) + Number(losses);
  return total > 0 ? (Number(wins) / total) * 100 : 0;
}

function createRound(playerIds) {
  const round = [];
  for (let index = 0; index < playerIds.length; index += 2) {
    const players = [playerIds[index] || null, playerIds[index + 1] || null];
    round.push({
      players,
      winnerId: players[0] && !players[1] ? players[0] : null,
      score: [0, 0]
    });
  }
  return round;
}

function seededPositions(size) {
  if (size === 2) return [1, 2];

  let positions = [1, 2];
  for (let currentSize = 4; currentSize <= size; currentSize *= 2) {
    positions = positions.flatMap((seed) => [seed, currentSize + 1 - seed]);
  }
  return positions;
}

export function createTournament(name, playerNames, options = {}) {
  const cleanName = String(name).trim();
  const players = playerNames.map((value) => {
    if (typeof value === "string") return { name: value.trim() };
    return {
      ...value,
      name: String(value.name || value.nickname || "").trim()
    };
  }).filter((player) => player.name);
  const uniqueNames = new Set(players.map((player) => player.name.toLocaleLowerCase()));
  const bestOf = Number(options.bestOf ?? 1);
  const seeding = options.seeding || "rating";

  if (!cleanName) throw new Error("Informe o nome do torneio.");
  if (players.length < 2 || players.length > 64) throw new Error("O torneio precisa ter entre 2 e 64 jogadores.");
  if (uniqueNames.size !== players.length) throw new Error("Remova nomes de jogadores duplicados.");
  if (![1, 3, 5].includes(bestOf)) throw new Error("Escolha uma série melhor de 1, 3 ou 5.");
  if (!["rating", "random", "manual"].includes(seeding)) throw new Error("Formato de classificação da chave inválido.");

  const roster = players.map((player, index) => ({
    ...player,
    id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
    seed: index + 1
  }));
  if (seeding === "rating") {
    roster.sort((left, right) => (Number(right.eloRate) || 0) - (Number(left.eloRate) || 0));
  } else if (seeding === "random") {
    for (let index = roster.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [roster[index], roster[swapIndex]] = [roster[swapIndex], roster[index]];
    }
  }
  roster.forEach((player, index) => {
    player.seed = index + 1;
  });

  let bracketSize = 1;
  while (bracketSize < roster.length) bracketSize *= 2;
  const seeds = seededPositions(bracketSize);
  const playerSlots = Array(bracketSize).fill(null);
  roster.forEach((player, index) => {
    playerSlots[seeds.indexOf(index + 1)] = player.id;
  });

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: cleanName,
    createdAt: Date.now(),
    players: roster,
    bestOf,
    seeding,
    rounds: [createRound(playerSlots)]
  };
}

export function updateTournamentScore(tournament, roundIndex, matchIndex, slot, delta) {
  if (![0, 1].includes(slot) || ![-1, 1].includes(delta)) {
    throw new Error("Ajuste de placar inválido.");
  }

  const updated = structuredClone(tournament);
  const round = updated.rounds[roundIndex];
  const match = round?.[matchIndex];
  if (!match || !match.players[slot] || !match.players[1 - slot]) {
    throw new Error("A partida não está disponível para atualizar o placar.");
  }
  if (match.winnerId) throw new Error("Desfaça este resultado antes de alterar o placar.");

  match.score ||= [0, 0];
  const score = match.score[slot] + delta;
  if (score < 0) throw new Error("O placar não pode ser negativo.");
  match.score[slot] = score;

  const winsNeeded = Math.ceil(Number(updated.bestOf || 1) / 2);
  if (score >= winsNeeded) {
    match.winnerId = match.players[slot];
    if (round.every((roundMatch) => roundMatch.winnerId)) {
      const winners = round.map((roundMatch) => roundMatch.winnerId);
      if (winners.length > 1) updated.rounds.push(createRound(winners));
    }
  }

  return updated;
}

export function undoLastTournamentResult(tournament) {
  const updated = structuredClone(tournament);

  for (let roundIndex = updated.rounds.length - 1; roundIndex >= 0; roundIndex -= 1) {
    const round = updated.rounds[roundIndex];
    for (let matchIndex = round.length - 1; matchIndex >= 0; matchIndex -= 1) {
      const match = round[matchIndex];
      if (!match.winnerId || !match.players[0] || !match.players[1]) continue;

      match.winnerId = null;
      match.score = [0, 0];
      updated.rounds = updated.rounds.slice(0, roundIndex + 1);
      return updated;
    }
  }

  throw new Error("Ainda não há resultado registrado para desfazer.");
}

export function reportWinner(tournament, roundIndex, matchIndex, winnerId) {
  const updated = structuredClone(tournament);
  const currentRound = updated.rounds[roundIndex];
  const match = currentRound?.[matchIndex];

  if (!match || !match.players.includes(winnerId)) throw new Error("O vencedor precisa ser um dos jogadores da partida.");
  if (match.winnerId) throw new Error("O resultado desta partida já foi registrado.");
  match.winnerId = winnerId;
  match.score ||= [0, 0];

  if (currentRound.every((roundMatch) => roundMatch.winnerId)) {
    const winners = currentRound.map((roundMatch) => roundMatch.winnerId);
    if (winners.length > 1) updated.rounds.push(createRound(winners));
  }

  return updated;
}

export function getChampion(tournament) {
  const finalRound = tournament.rounds.at(-1) || [];
  return finalRound.length === 1
    ? tournament.players.find((player) => player.id === finalRound[0].winnerId) || null
    : null;
}
