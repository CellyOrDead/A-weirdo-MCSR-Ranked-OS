import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateWinRate,
  createTournament,
  formatDuration,
  getChampion,
  reportWinner,
  undoLastTournamentResult,
  updateTournamentScore
} from "../src/core.mjs";

test("formats Minecraft run durations from milliseconds", () => {
  assert.equal(formatDuration(92345), "1:32");
  assert.equal(formatDuration(3661000), "1:01:01");
  assert.equal(formatDuration(null), "—");
});

test("calculates a win rate without dividing by zero", () => {
  assert.equal(calculateWinRate(3, 1), 75);
  assert.equal(calculateWinRate(0, 0), 0);
});

test("creates a tournament bracket and advances winners", () => {
  let tournament = createTournament("Duelo", ["Alex", "Bia", "Caio"], { seeding: "manual" });
  assert.equal(tournament.rounds[0].length, 2);
  assert.equal(tournament.rounds[0][0].winnerId, tournament.players[0].id);

  tournament = reportWinner(tournament, 0, 1, tournament.players[1].id);
  assert.equal(tournament.rounds.length, 2);
  tournament = reportWinner(tournament, 1, 0, tournament.players[0].id);
  assert.equal(getChampion(tournament).name, "Alex");
});

test("rejects invalid tournament rosters and match results", () => {
  assert.throws(() => createTournament("", ["Alex", "Bia"]));
  assert.throws(() => createTournament("Duelo", ["Alex", "alex"]));
  assert.throws(() => createTournament("Duelo", ["Alex"]));

  const tournament = createTournament("Duelo", ["Alex", "Bia"]);
  assert.throws(() => reportWinner(tournament, 0, 0, "not-a-player"));
});

test("seeds by ELO and grants bracket byes to the highest-rated players", () => {
  const tournament = createTournament("Seeded", [
    { name: "Gold", eloRate: 2000 },
    { name: "Silver", eloRate: 1500 },
    { name: "Bronze", eloRate: 1000 },
    { name: "Iron", eloRate: 500 },
    { name: "Unranked", eloRate: null }
  ]);

  assert.equal(tournament.players[0].name, "Gold");
  assert.equal(tournament.players[0].seed, 1);
  assert.equal(tournament.rounds[0][0].winnerId, tournament.players[0].id);
  assert.equal(tournament.rounds[0][3].winnerId, tournament.players[2].id);
});

test("records best-of series scores, advances winners, and undoes the latest result", () => {
  let tournament = createTournament("BO3", ["Alex", "Bia"], { bestOf: 3, seeding: "manual" });
  tournament = updateTournamentScore(tournament, 0, 0, 0, 1);
  assert.equal(tournament.rounds[0][0].winnerId, null);
  tournament = updateTournamentScore(tournament, 0, 0, 1, 1);
  tournament = updateTournamentScore(tournament, 0, 0, 0, 1);

  assert.equal(tournament.rounds[0][0].winnerId, tournament.players[0].id);
  assert.equal(getChampion(tournament).name, "Alex");

  tournament = undoLastTournamentResult(tournament);
  assert.equal(tournament.rounds.length, 1);
  assert.deepEqual(tournament.rounds[0][0].score, [0, 0]);
  assert.equal(tournament.rounds[0][0].winnerId, null);
});

test("rejects invalid match score changes", () => {
  const tournament = createTournament("BO3", ["Alex", "Bia"], { bestOf: 3 });
  assert.throws(() => updateTournamentScore(tournament, 0, 0, 0, -1));
  assert.throws(() => updateTournamentScore(tournament, 0, 0, 2, 1));
  assert.throws(() => createTournament("Invalid", ["Alex", "Bia"], { bestOf: 2 }));
});

test("advances a scored bracket and removes dependent rounds when a result is undone", () => {
  let tournament = createTournament("Bracket", ["Alex", "Bia", "Caio", "Dani"], {
    bestOf: 1,
    seeding: "manual"
  });
  tournament = updateTournamentScore(tournament, 0, 0, 0, 1);
  tournament = updateTournamentScore(tournament, 0, 1, 1, 1);
  assert.equal(tournament.rounds.length, 2);
  tournament = updateTournamentScore(tournament, 1, 0, 1, 1);
  assert.equal(getChampion(tournament).name, "Caio");

  tournament = undoLastTournamentResult(tournament);
  assert.equal(tournament.rounds.length, 2);
  assert.equal(getChampion(tournament), null);
  tournament = undoLastTournamentResult(tournament);
  assert.equal(tournament.rounds.length, 1);
  assert.equal(tournament.rounds[0][0].winnerId, tournament.players[0].id);
  assert.equal(tournament.rounds[0][1].winnerId, null);
});
