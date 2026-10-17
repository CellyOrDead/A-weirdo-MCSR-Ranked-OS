function getAchievements(profile) {
  return Array.isArray(profile?.achievements?.total) ? profile.achievements.total : [];
}

export function getPlayoffResults(profile) {
  const latestBySeason = new Map();

  getAchievements(profile)
    .filter((achievement) => achievement.id === "playoffsResult" && achievement.data?.[0])
    .forEach((achievement) => {
      const season = Number(achievement.data[0]);
      if (!Number.isInteger(season) || season < 1) return;

      const result = {
        season,
        placement: [1, 2, 3].includes(Number(achievement.level)) ? Number(achievement.level) : null,
        date: Number(achievement.date) || 0
      };
      const previous = latestBySeason.get(season);
      if (!previous || result.date > previous.date) latestBySeason.set(season, result);
    });

  return [...latestBySeason.values()].sort((left, right) => right.season - left.season || right.date - left.date);
}

export function getSeasonResults(profile) {
  const latestBySeason = new Map();

  getAchievements(profile)
    .filter((achievement) => achievement.id === "seasonResult" && achievement.data?.[0])
    .forEach((achievement) => {
      const season = Number(achievement.data[0]);
      const placement = Number(achievement.data[1]);
      if (!Number.isInteger(season) || season < 1 || !Number.isInteger(placement) || placement < 1) return;

      const result = { season, placement, date: Number(achievement.date) || 0 };
      const previous = latestBySeason.get(season);
      if (!previous || result.date > previous.date) latestBySeason.set(season, result);
    });

  return [...latestBySeason.values()].sort((left, right) => right.season - left.season);
}

export function getSeasonHighlights(seasons) {
  return Object.entries(seasons?.seasonResults || {})
    .map(([season, result]) => ({
      season: Number(season),
      highestElo: Number(result?.highest),
      finalRank: Number.isInteger(result?.last?.eloRank) ? result.last.eloRank : null
    }))
    .filter((result) => Number.isInteger(result.season) && Number.isFinite(result.highestElo))
    .sort((left, right) => right.highestElo - left.highestElo);
}

export function getCareerFeats(profile, seasons) {
  const total = profile?.statistics?.total || {};
  const bestStreak = total.highestWinStreak?.ranked;
  const wins = total.wins?.ranked;
  const bestTime = total.bestTime?.ranked;
  const playoffs = getPlayoffResults(profile);
  const rankedSeasons = getSeasonResults(profile);
  const seasonHighlights = getSeasonHighlights(seasons);

  return {
    wins: Number.isFinite(wins) ? wins : null,
    bestStreak: Number.isFinite(bestStreak) ? bestStreak : null,
    bestTime: Number.isFinite(bestTime) ? bestTime : null,
    playoffTitles: playoffs.filter((result) => result.placement === 1),
    playoffPodiums: playoffs.filter((result) => result.placement === 2 || result.placement === 3),
    playoffParticipations: playoffs.filter((result) => result.placement === null),
    seasonPodiums: rankedSeasons.filter((result) => result.placement <= 3),
    seasonHighlights,
    bestSeasonRank: seasonHighlights
      .filter((result) => Number.isInteger(result.finalRank))
      .sort((left, right) => left.finalRank - right.finalRank)[0] || null
  };
}
