import test from "node:test";
import assert from "node:assert/strict";
import {
  getCareerFeats,
  getPlayoffResults,
  getSeasonHighlights,
  getSeasonResults
} from "../src/profile.mjs";

test("extracts official playoffs wins, podiums, and participation", () => {
  const results = getPlayoffResults({
    achievements: {
      total: [
        { id: "playoffsResult", data: ["12"], level: 16, date: 300 },
        { id: "playoffsResult", data: ["12"], level: 1, date: 250 },
        { id: "playoffsResult", data: ["11"], level: 1, date: 200 },
        { id: "playoffsResult", data: ["10"], level: 2, date: 100 }
      ]
    }
  });
  assert.deepEqual(results, [
    { season: 12, placement: null, date: 300 },
    { season: 11, placement: 1, date: 200 },
    { season: 10, placement: 2, date: 100 }
  ]);
});

test("keeps the latest season-placement achievement per season", () => {
  const results = getSeasonResults({
    achievements: {
      total: [
        { id: "seasonResult", data: ["9", "2"], date: 100 },
        { id: "seasonResult", data: ["9", "1"], date: 200 },
        { id: "seasonResult", data: ["11", "3"], date: 300 },
        { id: "seasonResult", data: ["x", "1"], date: 400 }
      ]
    }
  });
  assert.deepEqual(results, [
    { season: 11, placement: 3, date: 300 },
    { season: 9, placement: 1, date: 200 }
  ]);
});

test("summarizes the player's verified competitive career achievements", () => {
  const feats = getCareerFeats({
    achievements: {
      total: [
        { id: "playoffsResult", data: ["11"], level: 1, date: 500 },
        { id: "playoffsResult", data: ["10"], level: 3, date: 400 },
        { id: "seasonResult", data: ["9", "2"], date: 300 }
      ]
    },
    statistics: {
      total: {
        wins: { ranked: 250 },
        highestWinStreak: { ranked: 18 },
        bestTime: { ranked: 321000 }
      }
    }
  }, {
    seasonResults: {
      9: { highest: 2300, last: { eloRank: 2 } },
      10: { highest: 2500, last: { eloRank: 1 } }
    }
  });

  assert.equal(feats.wins, 250);
  assert.equal(feats.bestStreak, 18);
  assert.equal(feats.bestTime, 321000);
  assert.deepEqual(feats.playoffTitles.map(({ season }) => season), [11]);
  assert.deepEqual(feats.playoffPodiums.map(({ season }) => season), [10]);
  assert.deepEqual(feats.playoffParticipations.map(({ season }) => season), []);
  assert.deepEqual(feats.seasonPodiums.map(({ season }) => season), [9]);
  assert.equal(feats.bestSeasonRank.season, 10);
});

test("returns highest season ELO achievements in descending order", () => {
  assert.deepEqual(getSeasonHighlights({
    seasonResults: {
      8: { highest: 2300, last: { eloRank: 4 } },
      9: { highest: 2500, last: { eloRank: 2 } }
    }
  }), [
    { season: 9, highestElo: 2500, finalRank: 2 },
    { season: 8, highestElo: 2300, finalRank: 4 }
  ]);
});
