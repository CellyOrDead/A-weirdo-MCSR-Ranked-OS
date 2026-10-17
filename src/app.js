import {
  calculateWinRate,
  createTournament,
  formatDate,
  formatDuration,
  getChampion,
  updateTournamentScore,
  undoLastTournamentResult
} from "./core.mjs";
import {
  getCareerFeats,
  getPlayoffResults,
  getSeasonResults
} from "./profile.mjs";
import { meteorGameMarkup, mountMeteorGame } from "./meteor.mjs";
import { danmakuMarkup, mountDanmaku } from "./danmaku.mjs";
import { keybindMenuMarkup, mountKeybindMenu } from "./keybinds.mjs";
const osFrameParams = new URLSearchParams(location.search);
const osFrameApp = osFrameParams.get("oswindow");
const isOsFrame = ["rank", "comet", "hell"].includes(osFrameApp);
const osFrameView = osFrameParams.get("view");
if (isOsFrame) document.body.classList.add("os-app-frame");
if (osFrameApp === "comet" || osFrameApp === "hell") document.body.classList.add("os-game-frame");
if (isOsFrame && !window.mcsr) {
  let apiRequestId = 0;
  const pendingApiRequests = new Map();
  window.addEventListener("message", (event) => {
    if (event.source !== window.parent || !["mcsr-api-response", "speedrun-api-response"].includes(event.data?.type)) return;
    const pending = pendingApiRequests.get(event.data.requestId);
    if (!pending) return;
    pendingApiRequests.delete(event.data.requestId);
    if (event.data.error) pending.reject(new Error(event.data.error));
    else pending.resolve(event.data.value);
  });
  window.mcsr = {
    get(endpoint) {
      return new Promise((resolve, reject) => {
        const requestId = ++apiRequestId;
        pendingApiRequests.set(requestId, { resolve, reject });
        window.parent.postMessage({ type: "mcsr-api-request", requestId, endpoint: String(endpoint) }, "*");
        setTimeout(() => {
          const pending = pendingApiRequests.get(requestId);
          if (!pending) return;
          pendingApiRequests.delete(requestId);
          pending.reject(new Error("A solicitação à API expirou."));
        }, 15000);
      });
    },
    speedrun(endpoint) {
      return new Promise((resolve, reject) => {
        const requestId = ++apiRequestId;
        pendingApiRequests.set(requestId, { resolve, reject });
        window.parent.postMessage({ type: "speedrun-api-request", requestId, endpoint: String(endpoint) }, "*");
        setTimeout(() => {
          const pending = pendingApiRequests.get(requestId);
          if (!pending) return;
          pendingApiRequests.delete(requestId);
          pending.reject(new Error("A solicitaÃ§Ã£o ao Speedrun.com expirou."));
        }, 15000);
      });
    }
  };
}

const copy = {
  pt: {
    menu: "MENU PRINCIPAL",
    home: "Início",
    rankings: "Rankings",
    player: "Jogador",
    compare: "Comparar",
    history: "Histórico",
    watchlist: "Favoritos",
    tournaments: "Torneios",
    game: "Starfall",
    settings: "Configurações",
    officialApi: "API oficial",
    desktopApp: "APP PARA DESKTOP",
    liveData: "DADOS AO VIVO",
    poweredBy: "Dados fornecidos pela",
    localDataNote: "Torneios e favoritos ficam salvos neste dispositivo.",
    title: {
      welcome: "Bem-vindo ao MCSR Rank",
      rankings: "Leaderboards",
      profile: "Perfil do jogador",
      compare: "Confronto direto",
      history: "Histórico de partidas",
      watchlist: "Jogadores favoritos",
      tournaments: "Torneios da comunidade",
      settings: "Configurações",
      game: "Starfall"
    },
    description: {
      welcome: "Escolha o que deseja fazer hoje.",
      rankings: "Acompanhe a corrida pelo topo do MCSR Ranked.",
      profile: "Veja estatísticas, resultados recentes e evolução.",
      compare: "Compare estatísticas e partidas entre dois jogadores.",
      history: "Revise partidas recentes e a variação de ELO.",
      watchlist: "Acesso rápido aos jogadores que você acompanha.",
      tournaments: "Monte chaves eliminatórias, acompanhe séries e registre resultados localmente.",
      settings: "Personalize o tema e a aparência do aplicativo.",
      game: "Pilote uma nave, destrua hordas de cometas e monte sua build."
    },
    elo: "ELO",
    points: "Pontos da fase",
    fastest: "Melhores tempos",
    weekly: "Corrida semanal",
    weeklyRaceId: "ID da corrida semanal",
    season: "Temporada",
    current: "Atual",
    allSeasons: "Todas",
    world: "Mundo",
    search: "Buscar jogador...",
    searchPlayers: "Buscar jogadores",
    country: "País",
    anyCountry: "Todos os países",
    unknownCountry: "País não informado",
    sortBy: "Ordenar por",
    rank: "Posição",
    rating: "ELO",
    phasePoints: "Pontos",
    time: "Tempo",
    role: "Divisão",
    allRoles: "Todas as divisões",
    predicted: "Projeção",
    recordOnly: "Um tempo por jogador",
    playerName: "Jogador",
    matches: "Partidas",
    wins: "Vitórias",
    losses: "Derrotas",
    winRate: "Taxa de vitória",
    bestTime: "Melhor tempo",
    currentStreak: "Sequência atual",
    highStreak: "Maior sequência",
    seasonStats: "Temporada",
    careerStats: "Carreira",
    recentMatches: "Partidas recentes",
    noMatches: "Nenhuma partida encontrada.",
    profileSummary: "Resumo do jogador",
    summarySince: "No MCSR Ranked desde",
    summaryRecord: "{wins} vitórias ranked em {matches} partidas ({rate}% de aproveitamento).",
    officialLinks: "Redes sociais",
    personalBestVideos: "Videos dos PBs",
    rsgPersonalBest: "PB de RSG",
    rankedPersonalBest: "PB de Ranked",
    watchPersonalBest: "Assistir video",
    personalBestLoading: "Buscando videos publicos dos PBs...",
    noSocials: "O jogador não vinculou redes sociais públicas.",
    bestAchievements: "Maiores feitos",
    officialTournaments: "Torneios ganhos",
    playoffTitle: "Campeão dos Playoffs",
    playoffSecond: "2º lugar nos Playoffs",
    playoffThird: "3º lugar nos Playoffs",
    playoffParticipant: "Participante dos Playoffs",
    officialPlayoffs: "Playoffs oficiais do MCSR Ranked",
    noPlayoffs: "Nenhum resultado de Playoffs consta no perfil oficial.",
    seasonHighlights: "Temporadas de destaque",
    seasonPlacement: "Posição final",
    rankedTopThree: "Top 3 na temporada",
    noSeasonHighlights: "Nenhuma colocação de temporada consta no perfil oficial.",
    peakElo: "ELO máximo em temporada",
    careerWins: "Vitórias ranked na carreira",
    careerStreak: "Maior sequência de vitórias",
    officialBestTime: "Melhor tempo oficial",
    noAchievements: "Nenhuma conquista adicional consta no perfil.",
    achievements: "Conquistas oficiais",
    firstPlace: "1º lugar",
    secondPlace: "2º lugar",
    thirdPlace: "3º lugar",
    participant: "Participação",
    seasonWon: "vitória na temporada",
    noPublicBio: "Este resumo é gerado a partir de estatísticas e conquistas públicas; o MCSR Ranked não fornece uma biografia pessoal.",
    playoffTitleCountOne: "1 título oficial",
    playoffTitleCountMany: "{count} títulos oficiais",
    profileSocialSource: "Vinculado ao perfil oficial",
    level: "Nível",
    matchesUnavailable: "Histórico de partidas indisponível",
    seasonsUnavailable: "Histórico de temporadas indisponível",
    summaryAchievementPlayoffOne: "1 título dos Playoffs",
    summaryAchievementPlayoffs: "{count} títulos dos Playoffs",
    summaryAchievementWins: "{count} vitórias ranked",
    summaryAchievementStreak: "sequência de {count} vitórias",
    summaryAchievementBestTime: "recorde pessoal de {time}",
    achievement_bestTime: "Melhor tempo ranked",
    achievement_highestWinStreak: "Maior sequência ranked",
    achievement_playedMatches: "Partidas disputadas",
    achievement_wins: "Vitórias ranked",
    achievement_playtime: "Tempo jogado ranked",
    achievement_oneshot: "Dragão derrotado em um golpe",
    achievement_ironHoe: "Enxada de ferro",
    achievement_foodless: "Run sem comida",
    achievement_armorless: "Run sem armadura",
    achievement_ironPickless: "Run sem picareta de ferro",
    achievement_netherite: "Conquista de netherita",
    achievement_highLevel: "Nível alto",
    achievement_egapHolder: "E-girl All-Purpose Holder",
    achievement_weeklyRace: "Corrida semanal",
    opponent: "Adversário",
    result: "Resultado",
    date: "Data",
    eloChange: "Variação de ELO",
    ranked: "Ranked",
    casual: "Casual",
    privateRoom: "Sala privada",
    eventMode: "Modo de evento",
    otherMode: "Outro modo",
    rankedHistory: "Ranked normal",
    privateHistory: "Salas privadas",
    otherHistory: "Casual e eventos",
    rankedMatchSummary: "{matches} partidas · {wins} vitórias · {losses} derrotas",
    privateMatchSummary: "{matches} partidas · {wins} vitórias · {losses} derrotas",
    historyScope: "Até 100 partidas ranked e 100 privadas; casual e eventos vêm das 100 mais recentes.",
    won: "Vitória",
    lost: "Derrota",
    forfeit: "Desistência",
    openProfile: "Abrir perfil",
    addFavorite: "Adicionar aos favoritos",
    removeFavorite: "Remover dos favoritos",
    followPrompt: "Pesquise um nome de jogador para carregar estatísticas oficiais.",
    username: "Nome do jogador",
    loadPlayer: "Ver jogador",
    playerOne: "Jogador 1",
    playerTwo: "Jogador 2",
    compareNow: "Comparar jogadores",
    directRecord: "Confronto entre os jogadores",
    noVersus: "Não foi encontrado um confronto entre esses jogadores nesta temporada.",
    savedFavorites: "Acompanhando",
    emptyFavorites: "Ainda não há favoritos. Abra um perfil e toque na estrela para salvar.",
    emptyHistory: "Busque um jogador para carregar o histórico oficial de partidas.",
    createTournament: "Criar torneio",
    tournamentName: "Nome do torneio",
    entrants: "Jogadores (um por linha ou separados por vírgula)",
    create: "Montar chave",
    bracket: "Chave eliminatória",
    round: "Rodada",
    final: "Final",
    bestOf: "Formato das séries",
    bestOfOne: "Melhor de 1",
    bestOfThree: "Melhor de 3",
    bestOfFive: "Melhor de 5",
    seeding: "Classificação da chave",
    seedByRating: "Por ELO (mais alto primeiro)",
    seedRandom: "Sorteio aleatório",
    seedManual: "Ordem informada",
    tournamentHelp: "2–64 jogadores · ELO e cabeças carregados quando disponíveis · torneios salvos somente neste dispositivo.",
    resolveWarning: "{count} perfil(is) não encontrado(s); serão adicionados como participante(s) manual(is), sem cabeça.",
    resolvePlayers: "Consultando perfis oficiais…",
    scoreFor: "Placar de {name}",
    increaseScore: "Adicionar uma vitória para {name}",
    decreaseScore: "Remover uma vitória de {name}",
    undoResult: "Desfazer último resultado",
    confirmUndoResults: "Desfazer o último resultado também descarta as rodadas posteriores. Continuar?",
    bestOfShort: "MD",
    champion: "Campeão",
    inProgress: "Em andamento",
    completed: "Concluído",
    noTournaments: "Nenhum torneio local ainda. Crie uma chave para começar.",
    delete: "Excluir",
    confirmDelete: "Excluir este torneio?",
    loading: "Carregando dados oficiais...",
    refresh: "Atualizar dados",
    noResults: "Nenhum resultado para os filtros atuais.",
    lookupName: "Abrir perfil deste jogador",
    count: "jogadores",
    allPlayers: "Jogadores retornados",
    avgElo: "ELO médio",
    countryLeaders: "Países",
    currentPhase: "fase atual",
    weekEnds: "Encerra",
    noUsername: "Digite um nome de jogador.",
    networkError: "Não foi possível acessar a API oficial do MCSR Ranked.",
    matchDetails: "Detalhes da partida",
    close: "Fechar",
    seed: "Seed",
    stream: "Assistir VOD",
    pageLimit: "Os rankings mostram os resultados fornecidos pela API oficial.",
    searchHint: "Filtra os resultados retornados pela API.",
    language: "Idioma",
    chartEmpty: "Sem partidas suficientes para desenhar a evolução de ELO.",
    achievementsAndRecords: "Conquistas e recordes",
    eloPeakSeason: "ELO máximo",
    bestRankedFinish: "Melhor posição final em temporada",
    lastMatches: "partidas mais recentes",
    localOnly: "Local",
    deleteTournament: "Excluir torneio",
    favorite: "Favorito",
    active: "Ativo",
    theme: "Tema de cores",
    themeDescription: "Cada tema atualiza o desktop, as janelas e os arcades.",
    themeForest: "MCSR Studio",
    themePurple: "Roxo",
    themeBlue: "Azul",
    themeCrimson: "Carmesim",
    themeNether: "Nether",
    themeSand: "Areia",
    themeArctic: "Ártico",
    themeMidnight: "Meia-noite",
    themeRose: "Rosa antiga",
    appearance: "Aparência",
    showSkins: "Mostrar cabeças das skins",
    compactRows: "Linhas compactas nas tabelas",
    settingsSaved: "Preferências salvas neste dispositivo."
  },
  en: {
    menu: "MAIN MENU",
    home: "Home",
    rankings: "Rankings",
    player: "Player",
    compare: "Compare",
    history: "Match history",
    watchlist: "Watchlist",
    tournaments: "Tournaments",
    game: "Starfall",
    settings: "Settings",
    officialApi: "Official API",
    desktopApp: "DESKTOP APP",
    liveData: "LIVE DATA",
    poweredBy: "Data provided by",
    localDataNote: "Tournaments and watchlist are saved on this device.",
    title: {
      welcome: "Welcome to MCSR Rank",
      rankings: "Leaderboards",
      profile: "Player profile",
      compare: "Head to head",
      history: "Match history",
      watchlist: "Watchlist",
      tournaments: "Community tournaments",
      settings: "Settings",
      game: "Starfall"
    },
    description: {
      welcome: "Choose what you want to do today.",
      rankings: "Follow the race to the top of MCSR Ranked.",
      profile: "Explore stats, recent results, and player progress.",
      compare: "Compare stats and matches between two players.",
      history: "Review recent matches and ELO changes.",
      watchlist: "Quick access to the players you follow.",
      tournaments: "Create elimination brackets, track match series, and save results locally.",
      settings: "Customize the app theme and appearance.",
      game: "Pilot a ship, clear comet hordes, and build your run."
    },
    elo: "ELO",
    points: "Phase points",
    fastest: "Fastest times",
    weekly: "Weekly race",
    weeklyRaceId: "Weekly Race ID",
    season: "Season",
    current: "Current",
    allSeasons: "All-time",
    world: "World",
    search: "Search players...",
    searchPlayers: "Search players",
    country: "Country",
    anyCountry: "All countries",
    unknownCountry: "Country not listed",
    sortBy: "Sort by",
    rank: "Rank",
    rating: "ELO",
    phasePoints: "Points",
    time: "Time",
    role: "Division",
    allRoles: "All divisions",
    predicted: "Predicted",
    recordOnly: "One time per player",
    playerName: "Player",
    matches: "Matches",
    wins: "Wins",
    losses: "Losses",
    winRate: "Win rate",
    bestTime: "Best time",
    currentStreak: "Current streak",
    highStreak: "Best streak",
    seasonStats: "Season",
    careerStats: "Career",
    recentMatches: "Recent matches",
    noMatches: "No matches found.",
    profileSummary: "Player summary",
    summarySince: "On MCSR Ranked since",
    summaryRecord: "{wins} ranked wins in {matches} matches ({rate}% win rate).",
    officialLinks: "Social links",
    personalBestVideos: "Videos dos PBs",
    rsgPersonalBest: "RSG personal best",
    rankedPersonalBest: "Ranked personal best",
    watchPersonalBest: "Assistir video",
    personalBestLoading: "Buscando videos publicos dos PBs...",
    noSocials: "This player has not linked public social accounts.",
    bestAchievements: "Career highlights",
    officialTournaments: "Tournament titles",
    playoffTitle: "MCSR Ranked Playoffs champion",
    playoffSecond: "2nd place in MCSR Ranked Playoffs",
    playoffThird: "3rd place in MCSR Ranked Playoffs",
    playoffParticipant: "MCSR Ranked Playoffs participant",
    officialPlayoffs: "Official MCSR Ranked Playoffs",
    noPlayoffs: "No Playoffs results are listed on the official profile.",
    seasonHighlights: "Season highlights",
    seasonPlacement: "Final standing",
    rankedTopThree: "Top 3 season finish",
    noSeasonHighlights: "No season placements are listed on the official profile.",
    peakElo: "Peak seasonal ELO",
    careerWins: "Career ranked wins",
    careerStreak: "Longest win streak",
    officialBestTime: "Official best time",
    noAchievements: "No additional achievements are listed on the profile.",
    achievements: "Official achievements",
    firstPlace: "1st place",
    secondPlace: "2nd place",
    thirdPlace: "3rd place",
    participant: "Participation",
    seasonWon: "season win",
    noPublicBio: "This summary is generated from public stats and achievements; MCSR Ranked does not provide a personal biography.",
    playoffTitleCountOne: "1 official title",
    playoffTitleCountMany: "{count} official titles",
    profileSocialSource: "Linked to official profile",
    level: "Level",
    matchesUnavailable: "Match history unavailable",
    seasonsUnavailable: "Season history unavailable",
    summaryAchievementPlayoffOne: "1 Playoffs title",
    summaryAchievementPlayoffs: "{count} Playoffs titles",
    summaryAchievementWins: "{count} ranked wins",
    summaryAchievementStreak: "{count}-win streak",
    summaryAchievementBestTime: "{time} personal best",
    opponent: "Opponent",
    result: "Result",
    date: "Date",
    eloChange: "ELO change",
    ranked: "Ranked",
    casual: "Casual",
    privateRoom: "Private room",
    eventMode: "Event mode",
    otherMode: "Other mode",
    rankedHistory: "Ranked matches",
    privateHistory: "Private rooms",
    otherHistory: "Casual and events",
    rankedMatchSummary: "{matches} matches · {wins} wins · {losses} losses",
    privateMatchSummary: "{matches} matches · {wins} wins · {losses} losses",
    historyScope: "Up to 100 ranked and 100 private matches; casual and events come from the 100 most recent.",
    won: "Win",
    lost: "Loss",
    forfeit: "Forfeit",
    openProfile: "Open profile",
    addFavorite: "Add to watchlist",
    removeFavorite: "Remove from watchlist",
    followPrompt: "Search a player name to load official stats.",
    username: "Player name",
    loadPlayer: "View player",
    playerOne: "Player 1",
    playerTwo: "Player 2",
    compareNow: "Compare players",
    directRecord: "Head-to-head record",
    noVersus: "No head-to-head matches were found for this season.",
    savedFavorites: "Following",
    emptyFavorites: "No watchlist players yet. Open a profile and select the star to save it.",
    emptyHistory: "Search for a player to load their official match history.",
    createTournament: "Create tournament",
    tournamentName: "Tournament name",
    entrants: "Players (one per line or comma-separated)",
    create: "Build bracket",
    bracket: "Elimination bracket",
    round: "Round",
    final: "Final",
    bestOf: "Match format",
    bestOfOne: "Best of 1",
    bestOfThree: "Best of 3",
    bestOfFive: "Best of 5",
    seeding: "Bracket seeding",
    seedByRating: "By ELO (highest first)",
    seedRandom: "Random draw",
    seedManual: "Entered order",
    tournamentHelp: "2–64 players · ELO and heads loaded when available · tournaments are only saved on this device.",
    resolveWarning: "{count} profile(s) not found; added as manual player(s) without a head.",
    resolvePlayers: "Loading official profiles…",
    scoreFor: "{name}'s score",
    increaseScore: "Add a win for {name}",
    decreaseScore: "Remove a win for {name}",
    undoResult: "Undo last result",
    confirmUndoResults: "Undoing the last result also discards later rounds. Continue?",
    bestOfShort: "BO",
    champion: "Champion",
    inProgress: "In progress",
    completed: "Completed",
    noTournaments: "No local tournaments yet. Create a bracket to get started.",
    delete: "Delete",
    confirmDelete: "Delete this tournament?",
    loading: "Loading official data...",
    refresh: "Refresh data",
    noResults: "No results match the current filters.",
    lookupName: "Open this player's profile",
    count: "players",
    allPlayers: "Players returned",
    avgElo: "Average ELO",
    countryLeaders: "Countries",
    currentPhase: "current phase",
    weekEnds: "Ends",
    noUsername: "Enter a player name.",
    networkError: "Unable to reach the official MCSR Ranked API.",
    matchDetails: "Match details",
    close: "Close",
    seed: "Seed",
    stream: "Watch VOD",
    pageLimit: "Rankings display the results returned by the official API.",
    searchHint: "Filters the results returned by the API.",
    language: "Language",
    chartEmpty: "Not enough matches to chart ELO progress.",
    achievement_bestTime: "Best ranked time",
    achievement_highestWinStreak: "Highest ranked win streak",
    achievement_playedMatches: "Matches played",
    achievement_wins: "Ranked wins",
    achievement_playtime: "Ranked playtime",
    achievement_oneshot: "One-shot dragon",
    achievement_ironHoe: "Iron Hoe",
    achievement_foodless: "Foodless run",
    achievement_armorless: "Armorless run",
    achievement_ironPickless: "No iron pickaxe",
    achievement_netherite: "Netherite achievement",
    achievement_highLevel: "High level",
    achievement_egapHolder: "E-girl All-Purpose Holder",
    achievement_weeklyRace: "Weekly Race",
    achievementsAndRecords: "Achievements and records",
    eloPeakSeason: "Peak ELO",
    bestRankedFinish: "Best final season rank",
    lastMatches: "most recent matches",
    localOnly: "Local",
    deleteTournament: "Delete tournament",
    favorite: "Watchlist",
    active: "Active",
    theme: "Color theme",
    themeDescription: "Each theme updates the desktop, windows, and arcades.",
    themeForest: "MCSR Studio",
    themePurple: "Purple",
    themeBlue: "Blue",
    themeCrimson: "Crimson",
    themeNether: "Nether",
    themeSand: "Sandstone",
    themeArctic: "Arctic",
    themeMidnight: "Midnight",
    themeRose: "Dusty Rose",
    appearance: "Appearance",
    showSkins: "Show player skin heads",
    compactRows: "Compact table rows",
    settingsSaved: "Preferences saved on this device.",
    skinSourceNote: "Skins load by UUID first, then by player name when needed."
  }
};

copy.es = {
  ...copy.en,
  home: "Inicio",
  menu: "MENÚ PRINCIPAL", rankings: "Clasificación", player: "Jugador", compare: "Comparar", game: "Starfall",
  history: "Historial", watchlist: "Favoritos", tournaments: "Torneos", settings: "Ajustes",
  officialApi: "API oficial", desktopApp: "APP DE ESCRITORIO", liveData: "DATOS EN VIVO",
  poweredBy: "Datos proporcionados por", localDataNote: "Torneos y favoritos se guardan en este dispositivo.",
  title: { welcome: "Bienvenido a MCSR Rank", rankings: "Clasificaciones", profile: "Perfil del jugador", compare: "Cara a cara", history: "Historial de partidas", watchlist: "Jugadores favoritos", tournaments: "Torneos de la comunidad", settings: "Ajustes", game: "Starfall" },
  description: { welcome: "Elige que quieres hacer hoy.", rankings: "Sigue la carrera por la cima de MCSR Ranked.", profile: "Consulta estadísticas, resultados recientes y progreso.", compare: "Compara estadísticas y partidas de dos jugadores.", history: "Revisa partidas recientes y cambios de ELO.", watchlist: "Acceso rápido a los jugadores que sigues.", tournaments: "Crea cuadros, registra resultados y guarda torneos localmente.", settings: "Personaliza el aspecto de la aplicación.", game: "Pilota una nave, destruye hordas de cometas y crea tu estrategia." },
  elo: "ELO", points: "Puntos de fase", fastest: "Mejores tiempos", weekly: "Carrera semanal", weeklyRaceId: "ID de carrera semanal",
  season: "Temporada", current: "Actual", allSeasons: "Todas", world: "Mundo", search: "Buscar jugador...", searchPlayers: "Buscar jugadores",
  country: "País", anyCountry: "Todos los países", unknownCountry: "País desconocido", sortBy: "Ordenar por", rank: "Posición",
  rating: "ELO", phasePoints: "Puntos", time: "Tiempo", role: "División", allRoles: "Todas las divisiones", predicted: "Proyectado",
  playerName: "Jugador", matches: "Partidas", wins: "Victorias", losses: "Derrotas", winRate: "Porcentaje de victorias",
  bestTime: "Mejor tiempo", currentStreak: "Racha actual", highStreak: "Mejor racha", seasonStats: "Temporada", careerStats: "Carrera",
  recentMatches: "Partidas recientes", noMatches: "No se encontraron partidas.", profileSummary: "Resumen del jugador", summarySince: "En MCSR Ranked desde",
  summaryRecord: "{wins} victorias ranked en {matches} partidas ({rate}% de victorias).", officialLinks: "Redes sociales", noSocials: "Este jugador no ha vinculado redes públicas.",
  personalBestVideos: "Videos dos PBs", rsgPersonalBest: "PB de RSG", rankedPersonalBest: "PB de Ranked", watchPersonalBest: "Assistir video", personalBestLoading: "Buscando videos publicos dos PBs...",
  achievements: "Logros oficiales", opponent: "Rival", result: "Resultado", date: "Fecha", eloChange: "Cambio de ELO", ranked: "Ranked", casual: "Casual", privateRoom: "Sala privada", eventMode: "Modo de evento", otherMode: "Otro modo", rankedHistory: "Partidas ranked", privateHistory: "Salas privadas", otherHistory: "Casual y eventos", rankedMatchSummary: "{matches} partidas · {wins} victorias · {losses} derrotas", privateMatchSummary: "{matches} partidas · {wins} victorias · {losses} derrotas", historyScope: "Hasta 100 partidas ranked y 100 privadas; casual y eventos vienen de las 100 más recientes.", won: "Victoria", lost: "Derrota", forfeit: "Abandono",
  openProfile: "Abrir perfil", addFavorite: "Añadir a favoritos", removeFavorite: "Quitar de favoritos", followPrompt: "Busca un jugador para consultar sus estadísticas oficiales.",
  username: "Nombre del jugador", loadPlayer: "Ver jugador", playerOne: "Jugador 1", playerTwo: "Jugador 2", compareNow: "Comparar jugadores",
  directRecord: "Enfrentamientos directos", noVersus: "No se encontraron partidas entre estos jugadores.", savedFavorites: "Siguiendo", emptyFavorites: "Aún no hay favoritos. Abre un perfil y pulsa la estrella para guardarlo.",
  emptyHistory: "Busca un jugador para consultar su historial oficial.", createTournament: "Crear torneo", tournamentName: "Nombre del torneo", entrants: "Jugadores (uno por línea o separados por comas)", create: "Crear cuadro", bracket: "Cuadro eliminatorio", round: "Ronda", final: "Final",
  bestOf: "Formato de serie", bestOfOne: "Al mejor de 1", bestOfThree: "Al mejor de 3", bestOfFive: "Al mejor de 5", seeding: "Clasificación del cuadro", seedByRating: "Por ELO (mayor primero)", seedRandom: "Sorteo aleatorio", seedManual: "Orden indicado",
  champion: "Campeón", inProgress: "En curso", completed: "Completado", noTournaments: "Aún no hay torneos. Crea un cuadro para empezar.", delete: "Eliminar", confirmDelete: "¿Eliminar este torneo?",
  loading: "Cargando datos oficiales...", refresh: "Actualizar datos", noResults: "No hay resultados para estos filtros.", lookupName: "Abrir perfil del jugador", count: "jugadores", allPlayers: "Jugadores encontrados", avgElo: "ELO promedio", countryLeaders: "Países", currentPhase: "fase actual", weekEnds: "Termina",
  noUsername: "Escribe un nombre de jugador.", networkError: "No se pudo acceder a la API oficial de MCSR Ranked.", matchDetails: "Detalles de la partida", close: "Cerrar", seed: "Seed", stream: "Ver VOD", language: "Idioma", theme: "Tema de color", themeDescription: "Cada tema cambia el escritorio, las ventanas y los arcades.", themeForest: "MCSR Studio", themePurple: "Violeta", themeBlue: "Azul", themeCrimson: "Carmesí", themeNether: "Nether", themeSand: "Arena", themeArctic: "Ártico", themeMidnight: "Medianoche", themeRose: "Rosa antiguo", appearance: "Apariencia", showSkins: "Mostrar cabezas de skins", compactRows: "Filas compactas", settingsSaved: "Preferencias guardadas en este dispositivo.",
  skinSourceNote: "Las imágenes se buscan por UUID y, si falta, por nombre de jugador.",
  recordOnly: "Un tiempo por jugador", pageLimit: "La clasificación muestra los datos de la API oficial.", searchHint: "Filtra los resultados recibidos de la API.",
  role: "División", allRoles: "Todas las divisiones", predicted: "Proyección", currentStreak: "Racha actual", highStreak: "Racha más larga",
  bestAchievements: "Mejores logros", officialTournaments: "Títulos de torneo", officialPlayoffs: "Playoffs oficiales de MCSR Ranked", noPlayoffs: "No hay resultados de Playoffs en el perfil oficial.",
  seasonHighlights: "Temporadas destacadas", seasonPlacement: "Posición final", rankedTopThree: "Top 3 de la temporada", noSeasonHighlights: "No hay posiciones de temporada en el perfil oficial.",
  peakElo: "ELO máximo de temporada", careerWins: "Victorias ranked en carrera", careerStreak: "Racha de victorias más larga", officialBestTime: "Mejor tiempo oficial", noAchievements: "No hay otros logros en el perfil.",
  firstPlace: "1.er puesto", secondPlace: "2.º puesto", thirdPlace: "3.er puesto", participant: "Participación", level: "Nivel", opponent: "Rival",
  playoffTitle: "Campeón de Playoffs", playoffSecond: "2.º en Playoffs", playoffThird: "3.º en Playoffs", playoffParticipant: "Participante de Playoffs",
  resolvePlayers: "Consultando perfiles oficiales...", resolveWarning: "No se encontraron {count} perfil(es); se añadirán como participantes manuales.",
  scoreFor: "Puntuación de {name}", increaseScore: "Añadir una victoria para {name}", decreaseScore: "Quitar una victoria de {name}", undoResult: "Deshacer último resultado", confirmUndoResults: "Deshacer el último resultado también elimina las rondas posteriores. ¿Continuar?",
  bestOfShort: "MD", deleteTournament: "Eliminar torneo", localOnly: "Local", favorite: "Favorito", active: "Activo"
};

const elements = {
  app: document.querySelector("#app"),
  title: document.querySelector("#view-title"),
  description: document.querySelector("#view-description"),
  crumb: document.querySelector("#crumb-current"),
  toast: document.querySelector("#toast"),
  watchCount: document.querySelector("#watch-count"),
  dialog: document.querySelector("#match-dialog")
};

function profileNameFromHash() {
  if (!location.hash.startsWith("#/profile/")) return "";
  try {
    return decodeURIComponent(location.hash.slice("#/profile/".length));
  } catch {
    return "";
  }
}

const savedSettings = readStorage("mcsr-settings", {});
const allowedThemes = ["forest", "purple", "blue", "crimson", "nether", "sand", "arctic", "midnight", "rose"];
const savedFavorites = readStorage("mcsr-favorites", []);
const savedTournaments = readStorage("mcsr-tournaments", []);
const osAppIds = ["rank", "comet", "hell"];
const defaultOsApps = [...osAppIds];
const savedDesktop = readStorage("mcsr-desktop", {});
const savedDesktopProfile = readStorage("mcsr-desktop-profile", null);
function readPreference(key, fallback = "") {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function writePreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    notify(state.language === "pt"
      ? "Não foi possível salvar as preferências neste dispositivo."
      : "Could not save preferences on this device.");
  }
}

const state = {
  language: ["pt", "en", "es"].includes(readPreference("mcsr-language")) ? readPreference("mcsr-language") : "pt",
  view: isOsFrame
    ? (osFrameApp === "rank" && ["settings", "tournaments", "compare", "history", "watchlist", "rankings", "profile"].includes(osFrameView) ? osFrameView : osFrameApp === "rank" ? "rankings" : "game")
    : location.hash.startsWith("#/profile/")
    ? "profile"
    : ["settings", "tournaments", "compare", "history", "watchlist", "game", "rankings", "welcome"].includes(location.hash.slice(2))
      ? location.hash.slice(2)
      : location.hash ? "rankings" : "welcome",
  arcadeMode: isOsFrame ? (osFrameApp === "hell" ? "danmaku" : "cometfall") : "cometfall",
  ranking: "elo",
  season: 0,
  currentSeason: 0,
  latestWeeklyId: null,
  weeklyId: null,
  country: "",
  search: "",
  roleFilter: "",
  sort: "rank",
  predicted: false,
  distinct: true,
  rankingRows: [],
  weeklyData: null,
  profileName: profileNameFromHash() || readPreference("mcsr-profile"),
  desktopProfile: savedDesktopProfile && typeof savedDesktopProfile === "object" ? savedDesktopProfile : null,
  desktopProfileUnlocked: isOsFrame,
  desktopProfilePictureDraft: "",
  desktopShortcuts: Array.isArray(savedDesktop?.shortcuts) ? savedDesktop.shortcuts.filter((id) => osAppIds.includes(id)) : defaultOsApps,
  taskbarShortcuts: Array.isArray(savedDesktop?.taskbar) ? savedDesktop.taskbar.filter((id) => osAppIds.includes(id)) : defaultOsApps,
  desktopPositions: savedDesktop?.positions && typeof savedDesktop.positions === "object" ? savedDesktop.positions : {},
  desktopWallpaper: typeof savedDesktop?.wallpaper === "string" ? savedDesktop.wallpaper : "",
  desktopAccent: /^#[0-9a-f]{6}$/i.test(savedDesktop?.accent || "") ? savedDesktop.accent : "#8bd5e5",
  osWindowMinimized: false,
  osWindowMaximized: false,
  osWindowPosition: null,
  osWindows: [],
  osWindowSequence: 0,
  profile: null,
  profileMatches: [],
  profilePbMedia: null,
  profilePbMediaLoading: false,
  profileMatchFilter: "ranked",
  profileSeasons: null,
  profileError: "",
  favorites: Array.isArray(savedFavorites) ? savedFavorites.filter((name) => typeof name === "string") : [],
  tournaments: Array.isArray(savedTournaments) ? savedTournaments.filter((item) => item && typeof item === "object") : [],
  settings: {
    theme: "forest",
    showSkins: true,
    compactRows: false,
    ...(savedSettings && typeof savedSettings === "object" && !Array.isArray(savedSettings) ? savedSettings : {})
  },
  tournamentCreating: false,
  comparison: null,
  error: "",
  loading: false,
  rankRequestId: 0,
  profileRequestId: 0,
  comparisonRequestId: 0,
  gameCleanup: null
};

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    notify(state.language === "pt"
      ? "Não foi possível salvar os dados neste dispositivo. Verifique o espaço disponível."
      : "Could not save data on this device. Check available storage.");
    return false;
  }
}

function t(key) {
  return copy[state.language][key] ?? key;
}

function localeCode() {
  return state.language === "pt" ? "pt-BR" : state.language;
}

function message(key, values = {}) {
  return Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    t(key)
  );
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function countryName(code) {
  if (!code || code.length !== 2) return t("unknownCountry");
  try {
    return new Intl.DisplayNames([localeCode()], { type: "region" }).of(code.toUpperCase());
  } catch {
    return code.toUpperCase();
  }
}

function countryFlag(code) {
  if (!code || !/^[a-z]{2}$/i.test(code)) return "◈";
  return [...code.toUpperCase()].map((letter) => String.fromCodePoint(127397 + letter.charCodeAt(0))).join("");
}

function notify(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => elements.toast.classList.remove("visible"), 2800);
}

async function apiGet(endpoint) {
  return window.mcsr.get(endpoint);
}

function queryString(values) {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") params.set(key, value);
  });
  const query = params.toString();
  return query ? `?${query}` : "";
}

function seasonOptions(includeAll = false) {
  const current = state.currentSeason || 1;
  const options = [`<option value="0">${esc(t("current"))}</option>`];
  for (let season = current - 1; season >= 1; season -= 1) {
    options.push(`<option value="${season}">S${season}</option>`);
  }
  if (includeAll) options.push(`<option value="all">${esc(t("allSeasons"))}</option>`);
  return options.join("");
}

function seasonParam() {
  return state.season === 0 || state.season === "all" ? undefined : state.season;
}

function headingForView() {
  elements.title.textContent = copy[state.language].title[state.view];
  elements.description.textContent = copy[state.language].description[state.view];
  elements.crumb.textContent = copy[state.language].title[state.view].toUpperCase();
}

function applySettings() {
  const theme = allowedThemes.includes(state.settings.theme) ? state.settings.theme : "forest";
  state.settings.theme = theme;
  document.body.dataset.theme = theme;
  document.body.classList.toggle("compact-rows", Boolean(state.settings.compactRows));
}

function updateLanguage() {
  document.documentElement.lang = localeCode();
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelector("#language-select").value = state.language;
  document.querySelector("#refresh-button").title = t("refresh");
  document.querySelector("#refresh-button").setAttribute("aria-label", t("refresh"));
  document.querySelector("#refresh-button").hidden = state.view === "game" || state.view === "welcome";
  document.querySelector("#language-select").setAttribute("aria-label", t("language"));
  document.querySelector("#refresh-button").disabled = state.loading;
  headingForView();
}

function setLoading(loading) {
  state.loading = loading;
  elements.app.setAttribute("aria-busy", String(loading));
  document.querySelector("#refresh-button").classList.toggle("is-loading", loading);
  document.querySelector("#refresh-button").disabled = loading;
}

function setError(error) {
  state.error = error ? String(error.message || error) : "";
}

function errorPanel(message = state.error) {
  return message
    ? `<div class="error-panel"><span class="error-icon">!</span><div><strong>${esc(t("networkError"))}</strong><p>${esc(message)}</p></div><button class="text-button" data-action="retry">${esc(t("refresh"))}</button></div>`
    : "";
}

function metricForRow(row) {
  if (state.ranking === "elo") return row.eloRate ?? 0;
  if (state.ranking === "points") return state.predicted ? row.predPhasePoint ?? 0 : row.seasonResult?.phasePoint ?? 0;
  return row.time ?? 0;
}

function filteredRows() {
  const search = state.search.trim().toLocaleLowerCase();
  let rows = state.rankingRows.filter((row) => {
    const player = row.user || row.player || row;
    const matchName = (player.nickname || "").toLocaleLowerCase().includes(search);
    const countryMatches = !state.country || player.country === state.country;
    const roleMatches = !state.roleFilter || String(player.roleType) === state.roleFilter;
    return matchName && countryMatches && roleMatches;
  });
  const sort = state.sort;
  rows = [...rows].sort((left, right) => {
    if (sort === "player") return (left.user || left.player || left).nickname.localeCompare((right.user || right.player || right).nickname);
    if (sort === "rank") {
      if (state.ranking === "points") return state.rankingRows.indexOf(left) - state.rankingRows.indexOf(right);
      const leftRank = left.rank ?? left.eloRank ?? 999999;
      const rightRank = right.rank ?? right.eloRank ?? 999999;
      return Number(leftRank) - Number(rightRank);
    }
    const leftValue = metricForRow(left);
    const rightValue = metricForRow(right);
    return state.ranking === "fastest" ? Number(leftValue) - Number(rightValue) : Number(rightValue) - Number(leftValue);
  });
  return rows;
}

function avatarMarkup(player, className = "player-avatar") {
  const name = player?.nickname || player?.name || "—";
  const uuid = String(player?.uuid || "").replaceAll("-", "");
  const validUuid = /^[\da-f]{32}$/i.test(uuid);
  const identifier = validUuid ? uuid : /^[A-Za-z0-9_]{1,16}$/.test(name) ? encodeURIComponent(name) : "";
  const skin = state.settings.showSkins && identifier
    ? `<img class="skin-avatar" src="https://skinrender.dev/render/${identifier}/head?size=64" data-fallback="${validUuid ? `https://crafatar.com/avatars/${uuid}?size=64&overlay` : ""}" alt="" loading="lazy" decoding="async">`
    : "";
  return `<span class="${className}${skin ? " has-skin" : ""}"><span class="avatar-fallback">${esc(name.slice(0, 1).toUpperCase())}</span>${skin}</span>`;
}

function bindSkinErrors() {
  document.querySelectorAll(".skin-avatar:not([data-bound])").forEach((image) => {
    image.dataset.bound = "true";
    image.addEventListener("error", () => {
      const fallback = image.dataset.fallback;
      if (fallback && image.src !== fallback) {
        image.dataset.fallback = "";
        image.src = fallback;
      } else {
        image.closest(".has-skin")?.classList.add("skin-unavailable");
      }
    });
  });
}

function playerCell(player) {
  const nickname = player?.nickname || "—";
  return `<button class="player-link" data-player="${esc(nickname)}">${avatarMarkup(player)}<span class="player-identity"><strong>${esc(nickname)}</strong><small>${esc(countryName(player?.country))}</small></span><span class="country-flag">${countryFlag(player?.country)}</span></button>`;
}

function metricCell(row) {
  if (state.ranking === "fastest") return `<span class="metric-primary">${formatDuration(row.time)}</span>`;
  if (state.ranking === "points") {
    const value = state.predicted ? row.predPhasePoint : row.seasonResult?.phasePoint;
    return `<span class="metric-primary">${Number(value || 0).toLocaleString()}</span><small class="metric-label">${esc(state.predicted ? t("predicted") : t("phasePoints"))}</small>`;
  }
  return `<span class="metric-primary">${Number(row.eloRate || 0).toLocaleString()}</span><small class="metric-label">${esc(row.eloRank ? `#${row.eloRank}` : "")}</small>`;
}

function rankValue(row, index) {
  if (state.ranking === "points") return state.rankingRows.indexOf(row) + 1;
  return row.rank ?? row.eloRank ?? row.user?.eloRank ?? row.player?.eloRank ?? index + 1;
}

function renderRankingRows() {
  const rows = filteredRows();
  if (rows.length === 0) return `<tr><td colspan="4"><div class="empty-row">${esc(t("noResults"))}</div></td></tr>`;

  return rows.map((row, index) => {
    const player = row.user || row.player || row;
    const rank = rankValue(row, index);
    const topClass = rank <= 3 ? ` podium-${rank}` : "";
    return `<tr><td><span class="rank-number${topClass}">${String(rank).padStart(2, "0")}</span></td><td>${playerCell(player)}</td><td>${metricCell(row)}</td><td><span class="division division-${Number(player.roleType) || 0}">${esc(t(`division${player.roleType}`) || `DIV ${player.roleType ?? "—"}`)}</span></td></tr>`;
  }).join("");
}

function rankingTable() {
  if (state.ranking !== "weekly" && !filteredRows().length && state.search.trim()) {
    return `<tr><td colspan="4"><div class="empty-row">${esc(t("noResults"))}<br><button class="text-button" data-lookup-name="${esc(state.search.trim())}">${esc(t("lookupName"))} ↗</button></div></td></tr>`;
  }
  if (state.ranking === "weekly") {
    const weekly = state.weeklyData;
    const rows = (weekly?.leaderboard || []).filter((entry) => entry.player?.nickname.toLocaleLowerCase().includes(state.search.trim().toLocaleLowerCase()));
    if (!rows.length) return `<tr><td colspan="4"><div class="empty-row">${esc(t("noResults"))}</div></td></tr>`;
    return rows.map((entry) => `<tr><td><span class="rank-number${entry.rank <= 3 ? ` podium-${entry.rank}` : ""}">${String(entry.rank).padStart(2, "0")}</span></td><td>${playerCell(entry.player)}</td><td><span class="metric-primary">${formatDuration(entry.time)}</span></td><td>${entry.replayExist ? `<span class="division division-1">REPLAY</span>` : "—"}</td></tr>`).join("");
  }
  return renderRankingRows();
}

function rankControls() {
  const weekly = state.ranking === "weekly";
  const countryOptions = [...new Set(state.rankingRows.map((row) => (row.user || row.player || row).country).filter(Boolean))].sort();
  const roleOptions = [...new Set(state.rankingRows.map((row) => (row.user || row.player || row).roleType).filter((role) => role !== undefined && role !== null))].sort();
  const selectedSeason = String(state.season);
  const seasonControl = weekly
    ? `<label class="filter-field season-filter"><span>${esc(t("weeklyRaceId"))}</span><input id="weekly-id" type="number" min="1" max="${state.latestWeeklyId || ""}" value="${state.weeklyId ?? ""}" placeholder="${state.latestWeeklyId || "—"}"></label>`
    : `<label class="filter-field season-filter"><span>${esc(t("season"))}</span><select id="season-filter">${seasonOptions(state.ranking === "fastest").replace(`value="${selectedSeason}"`, `value="${selectedSeason}" selected`)}</select></label>`;
  const countryControl = weekly
    ? ""
    : `<label class="filter-field country-filter"><span>${esc(t("country"))}</span><select id="country-filter"><option value="">${esc(t("world"))}</option>${countryOptions.map((code) => `<option value="${esc(code)}" ${state.country === code ? "selected" : ""}>${countryFlag(code)} ${esc(countryName(code))}</option>`).join("")}</select></label>`;
  const sortOptions = state.ranking === "fastest"
    ? `<option value="rank">${esc(t("rank"))}</option><option value="metric">${esc(t("time"))}</option><option value="player">${esc(t("playerName"))}</option>`
    : `<option value="rank">${esc(t("rank"))}</option><option value="metric">${esc(state.ranking === "points" ? t("phasePoints") : t("rating"))}</option><option value="player">${esc(t("playerName"))}</option>`;
  const predicted = state.ranking === "points"
    ? `<label class="toggle-field"><input id="predicted-filter" type="checkbox" ${state.predicted ? "checked" : ""} ${state.season !== 0 ? "disabled" : ""}><span class="toggle-track"></span><span>${esc(t("predicted"))}</span></label>`
    : "";
  const roleControl = `<label class="filter-field role-filter"><span>${esc(t("role"))}</span><select id="role-filter"><option value="">${esc(t("allRoles"))}</option>${roleOptions.map((role) => `<option value="${esc(role)}" ${state.roleFilter === String(role) ? "selected" : ""}>DIV ${esc(role)}</option>`).join("")}</select></label>`;
  const distinct = state.ranking === "fastest"
    ? `<label class="toggle-field"><input id="distinct-filter" type="checkbox" ${state.distinct ? "checked" : ""}><span class="toggle-track"></span><span>${esc(t("recordOnly"))}</span></label>`
    : "";
  return `<div class="filter-row">
    ${seasonControl}
    ${countryControl}
    ${roleControl}
    <label class="search-field"><span class="search-glyph">⌕</span><input id="ranking-search" type="search" value="${esc(state.search)}" placeholder="${esc(t("search"))}"><kbd>/</kbd></label>
    <label class="filter-field sort-filter"><span>${esc(t("sortBy"))}</span><select id="sort-filter">${sortOptions.replace(`value="${state.sort}"`, `value="${state.sort}" selected`)}</select></label>
    ${predicted}${distinct}
  </div>`;
}

function rankingSummary() {
  if (state.ranking === "weekly") {
    const weekly = state.weeklyData;
    return `<div class="stat-card"><span class="stat-icon">▤</span><span class="stat-label">${esc(t("weekly"))}</span><strong>${weekly?.leaderboard?.length || 0}</strong><small>${esc(t("count"))}</small></div>
      <div class="stat-card"><span class="stat-icon">◷</span><span class="stat-label">${esc(t("weekEnds"))}</span><strong class="stat-date">${weekly?.endsAt ? esc(formatDate(weekly.endsAt, localeCode())) : "—"}</strong><small>${esc(t("active"))}</small></div>
      <div class="stat-card"><span class="stat-icon">✦</span><span class="stat-label">${esc(t("seed"))}</span><strong class="stat-date">${esc(weekly?.seed?.overworld || "—")}</strong><small>MCSR Ranked</small></div>`;
  }
  const players = state.rankingRows.map((row) => row.user || row.player || row);
  const elo = players.map((player) => player.eloRate).filter(Number.isFinite);
  const average = elo.length ? Math.round(elo.reduce((total, value) => total + value, 0) / elo.length) : 0;
  const countries = new Set(players.map((player) => player.country).filter(Boolean)).size;
  const number = players.length;
  const phase = state.weeklyData?.phase?.number || "";
  return `<div class="stat-card"><span class="stat-icon">♜</span><span class="stat-label">${esc(t("allPlayers"))}</span><strong>${number.toLocaleString()}</strong><small>${esc(t("pageLimit"))}</small></div>
    <div class="stat-card"><span class="stat-icon">↗</span><span class="stat-label">${esc(t("avgElo"))}</span><strong>${average ? average.toLocaleString() : "—"}</strong><small>${esc(phase ? `${t("currentPhase")} ${phase}` : "MCSR Ranked")}</small></div>
    <div class="stat-card"><span class="stat-icon">◎</span><span class="stat-label">${esc(t("countryLeaders"))}</span><strong>${countries}</strong><small>${esc(t("world"))}</small></div>`;
}

function rankPage() {
  const tabs = [
    ["elo", "elo", "♜"],
    ["points", "points", "✧"],
    ["fastest", "fastest", "◷"],
    ["weekly", "weekly", "▧"]
  ];
  const metricHeading = state.ranking === "fastest" || state.ranking === "weekly" ? t("time") : state.ranking === "points" ? t("phasePoints") : t("rating");
  return `<div class="ranking-page"><section class="ranking-hero">
      <div class="ranking-hero-copy"><div class="eyebrow"><span class="eyebrow-mark"></span>MCSR RANKED <span class="eyebrow-divider">/</span> ${esc(t("season"))} ${state.currentSeason || "—"}</div>
        <h2>${esc(state.language === "pt" ? "Cada segundo conta." : state.language === "es" ? "Cada segundo cuenta." : "Every second counts.")}</h2>
        <p>${esc(state.language === "pt" ? "Acompanhe a disputa, confira seus rivais e planeje a próxima run." : state.language === "es" ? "Sigue la competición, consulta a tus rivales y prepara tu próxima partida." : "Track the race, check your rivals, and plan your next run.")}</p></div>
      <div class="ranking-hero-mark" aria-hidden="true"><img class="ranking-composition-art" src="./assets/branding/ranked-composition.png" alt=""></div>
      <div class="ranking-hero-meta"><span class="ranking-live"><i></i>${esc(t("liveData"))}</span><small>${esc(t("season"))}</small><strong>${state.currentSeason || "—"}</strong><span>${esc(t("officialApi"))}</span></div>
    </section>
    <section class="ranking-tabs" aria-label="Leaderboard type">${tabs.map(([id, key, icon]) => `<button class="rank-tab ${state.ranking === id ? "selected" : ""}" data-ranking="${id}" aria-pressed="${state.ranking === id}"><span>${icon}</span>${esc(t(key))}</button>`).join("")}<span class="tab-spacer"></span><span class="rank-api-badge"><span class="live-dot"></span>${esc(t("officialApi"))}</span></section>
    <section class="stats-grid ranking-stats">${rankingSummary()}</section>
    <section class="leaderboard-panel ranking-board">
      <div class="panel-heading"><div><span class="section-kicker">TOP 150 <span>·</span> ${esc(t("season"))} ${state.season === 0 ? state.currentSeason || "—" : state.season === "all" ? t("allSeasons") : state.season}</span><h3>${esc(t(state.ranking))}</h3></div><div class="data-chip"><span class="live-dot"></span>${esc(t("liveData"))}</div></div>
      ${rankControls()}
      <div class="table-scroll"><table class="leaderboard-table"><thead><tr><th>${esc(t("rank"))}</th><th>${esc(t("playerName"))}</th><th>${esc(metricHeading)}</th><th>${esc(t("role"))}</th></tr></thead><tbody>${rankingTable()}</tbody></table></div>
      <div class="table-foot"><span>${filteredRows().length.toLocaleString()} ${esc(t("count"))} <span class="muted">${esc(t("searchHint"))}</span></span><span class="official-label">↗ MCSR RANKED</span></div>
    </section>${errorPanel()}</div>`;
}

function statValue(stats, key, mode = "ranked") {
  return stats?.[key]?.[mode] ?? 0;
}

function profileCards(profile) {
  const seasonStats = profile.statistics?.season || {};
  const totalStats = profile.statistics?.total || {};
  const wins = statValue(seasonStats, "wins");
  const losses = statValue(seasonStats, "loses");
  const rate = calculateWinRate(wins, losses).toFixed(1);
  return `<div class="profile-stat-grid">
    <div class="profile-stat-card featured"><span>${esc(t("rating"))}</span><strong>${Number(profile.eloRate || 0).toLocaleString()}</strong><small>${profile.eloRank ? `#${Number(profile.eloRank).toLocaleString()}` : "—"} ${esc(t("rank"))}</small></div>
    <div class="profile-stat-card"><span>${esc(t("matches"))}</span><strong>${Number(statValue(seasonStats, "playedMatches")).toLocaleString()}</strong><small>${esc(t("seasonStats"))}</small></div>
    <div class="profile-stat-card"><span>${esc(t("winRate"))}</span><strong>${rate}<small>%</small></strong><small>${wins} ${esc(t("wins").toLowerCase())} · ${losses} ${esc(t("losses").toLowerCase())}</small></div>
    <div class="profile-stat-card"><span>${esc(t("bestTime"))}</span><strong>${formatDuration(statValue(totalStats, "bestTime"))}</strong><small>${esc(t("careerStats"))}</small></div>
    <div class="profile-stat-card"><span>${esc(t("currentStreak"))}</span><strong>${Number(statValue(seasonStats, "currentWinStreak"))}</strong><small>${esc(t("seasonStats"))}</small></div>
    <div class="profile-stat-card"><span>${esc(t("highStreak"))}</span><strong>${Number(statValue(totalStats, "highestWinStreak"))}</strong><small>${esc(t("careerStats"))}</small></div>
  </div>`;
}

let speedrunRsgMetadataPromise = null;
const profilePbMediaCache = new Map();

function speedrunItems(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function validVideoUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

async function findRsgPersonalBestVideo(nickname) {
  if (typeof window.mcsr?.speedrun !== "function") return null;
  try {
    const usersResponse = await window.mcsr.speedrun(`/users?lookup=${encodeURIComponent(nickname)}&max=10`);
    const user = speedrunItems(usersResponse).find((entry) => entry.names?.international?.toLocaleLowerCase() === nickname.toLocaleLowerCase());
    if (!user?.id) return null;

    if (!speedrunRsgMetadataPromise) {
      speedrunRsgMetadataPromise = (async () => {
        const response = await window.mcsr.speedrun("/games/mc/categories?miscellaneous=no&max=200");
        const category = speedrunItems(response).find((entry) => /^any%\s*glitchless/i.test(entry.name || ""));
        if (!category) return null;
        const variables = await window.mcsr.speedrun(`/categories/${encodeURIComponent(category.id)}/variables?max=100`);
        const seedVariable = speedrunItems(variables).find((entry) => /seed\s*type/i.test(entry.name || ""));
        const values = seedVariable?.values?.choices || seedVariable?.values?.values || seedVariable?.values || {};
        const randomSeed = Object.entries(values).find(([, value]) => /random\s*seed/i.test(value?.label || value?.name || ""));
        return { category, seedVariable, randomSeedId: randomSeed?.[0] || "" };
      })().catch(() => null);
    }
    const metadata = await speedrunRsgMetadataPromise;
    if (!metadata) return null;

    const personalBests = await window.mcsr.speedrun(`/users/${encodeURIComponent(user.id)}/personal-bests?game=mc&embed=category`);
    const candidates = speedrunItems(personalBests).map((entry) => entry.run).filter((run) => {
      const categoryId = typeof run?.category === "string" ? run.category : run?.category?.id || run?._embedded?.category?.id;
      if (categoryId !== metadata.category.id) return false;
      if (!metadata.seedVariable || !metadata.randomSeedId) return /random\s*seed/i.test(metadata.category.name || "");
      const selected = run.values?.[metadata.seedVariable.id];
      const selectedId = typeof selected === "string" ? selected : selected?.value || selected?.id;
      return String(selectedId || "") === String(metadata.randomSeedId);
    });
    candidates.sort((left, right) => Number(left.times?.primary_t || Infinity) - Number(right.times?.primary_t || Infinity));
    for (const run of candidates) {
      const links = run.videos?.links || [];
      const video = validVideoUrl(run.video || links.find((link) => validVideoUrl(link.uri || link.url))?.uri || links.find((link) => validVideoUrl(link.uri || link.url))?.url);
      if (video) return { url: video, time: Number(run.times?.primary_t) || null, source: "Speedrun.com" };
    }
  } catch {
    // External PB sources are optional; keep the player profile usable if they are offline.
  }
  return null;
}

async function findRankedPersonalBestVideo(profile) {
  const uuid = profile.uuid;
  const bestTime = Number(profile.statistics?.total?.bestTime?.ranked);
  if (!uuid || !Number.isFinite(bestTime) || bestTime <= 0) return null;
  try {
    const matches = await apiGet(`/users/${encodeURIComponent(uuid)}/matches${queryString({ count: 100, type: 2 })}`);
    const personalBest = (matches || []).find((match) => Math.abs(Number(match.result?.time) - bestTime) <= 1);
    if (!personalBest?.id) return null;
    const details = await apiGet(`/matches/${encodeURIComponent(personalBest.id)}`);
    const video = details.vod?.find((entry) => entry.uuid === uuid)?.url;
    const url = validVideoUrl(video);
    return url ? { url, time: Number(details.result?.time) || bestTime, source: "MCSR Ranked" } : null;
  } catch {
    return null;
  }
}

async function loadProfilePbMedia(profile, requestId) {
  if (!profile?.uuid) return;
  state.profilePbMediaLoading = true;
  state.profilePbMedia = null;
  render();
  let result = profilePbMediaCache.get(profile.uuid);
  if (!result) {
    const [ranked, rsg] = await Promise.all([
      findRankedPersonalBestVideo(profile),
      findRsgPersonalBestVideo(profile.nickname)
    ]);
    result = { ranked, rsg };
    profilePbMediaCache.set(profile.uuid, result);
  }
  if (requestId !== state.profileRequestId || state.profile?.uuid !== profile.uuid) return;
  state.profilePbMedia = result;
  state.profilePbMediaLoading = false;
  render();
}

function profilePbVideos() {
  const videos = state.profilePbMedia;
  const unavailable = state.language === "pt" ? "Nenhum vídeo público encontrado" : state.language === "es" ? "No se encontró video público" : "No public video found";
  const entries = [
    ["rsg", t("rsgPersonalBest"), videos?.rsg],
    ["ranked", t("rankedPersonalBest"), videos?.ranked]
  ];
  return `<section class="content-panel pb-videos-panel"><div class="panel-heading"><div><span class="section-kicker">${esc(t("personalBestVideos"))}</span><h3>${esc(state.profile?.nickname || "")}</h3></div><span class="official-label">RSG · RANKED</span></div>${state.profilePbMediaLoading ? `<p class="profile-empty-note">${esc(t("personalBestLoading"))}</p>` : `<div class="pb-video-list">${entries.map(([key, label, video]) => video?.url ? `<a class="pb-video-card pb-video-${key}" href="${esc(video.url)}" target="_blank" rel="noreferrer"><span class="pb-video-play">▶</span><span><strong>${esc(label)}</strong><small>${video.time ? esc(formatDuration(video.time * (key === "rsg" ? 1000 : 1))) : esc(video.source)}</small></span><b>↗</b></a>` : `<div class="pb-video-card pb-video-${key} is-unavailable" aria-disabled="true"><span class="pb-video-play">—</span><span><strong>${esc(label)}</strong><small>${esc(unavailable)}</small></span></div>`).join("")}</div>`}</section>`;
}

function profileSocialLinks(profile) {
  const connections = profile.connections || {};
  const platforms = [
    ["youtube", "YouTube", (connection) => `https://www.youtube.com/channel/${encodeURIComponent(connection.id)}`],
    ["twitch", "Twitch", (connection) => `https://www.twitch.tv/${encodeURIComponent(connection.id)}`],
    ["discord", "Discord", (connection) => `https://discord.com/users/${encodeURIComponent(connection.id)}`]
  ];
  const links = platforms.filter(([key]) => connections[key]?.id && connections[key]?.name);

  if (!links.length) {
    return `<section class="content-panel profile-social-panel"><div class="panel-heading"><div><span class="section-kicker">MCSR RANKED</span><h3>${esc(t("officialLinks"))}</h3></div></div><p class="profile-empty-note">${esc(t("noSocials"))}</p></section>`;
  }

  return `<section class="content-panel profile-social-panel"><div class="panel-heading"><div><span class="section-kicker">MCSR RANKED</span><h3>${esc(t("officialLinks"))}</h3></div><span class="official-label">${esc(t("profileSocialSource"))}</span></div><div class="social-link-list">${links.map(([key, label, makeUrl]) => {
    const connection = connections[key];
    return `<a class="social-account social-account-${key}" href="${esc(makeUrl(connection))}" target="_blank" rel="noreferrer"><span class="social-account-icon">${esc(label.slice(0, 1))}</span><span><strong>${esc(label)}</strong><small>${esc(connection.name)}</small></span><span class="social-external">↗</span></a>`;
  }).join("")}</div></section>`;
}

function profileSummary(profile, feats) {
  const totalStats = profile.statistics?.total || {};
  const wins = Number(totalStats.wins?.ranked || 0);
  const losses = Number(totalStats.loses?.ranked || 0);
  const matches = Number(totalStats.playedMatches?.ranked || 0);
  const rate = calculateWinRate(wins, losses).toFixed(1);
  const firstOnline = profile.timestamp?.firstOnline;
  const since = Number.isFinite(Number(firstOnline))
    ? formatDate(firstOnline, localeCode())
    : "";
  const highlights = [];

  if (feats.playoffTitles.length) {
    const titleKey = feats.playoffTitles.length === 1 ? "summaryAchievementPlayoffOne" : "summaryAchievementPlayoffs";
    highlights.push(t(titleKey).replace("{count}", String(feats.playoffTitles.length)));
  }
  if (feats.wins !== null) {
    highlights.push(t("summaryAchievementWins").replace("{count}", feats.wins.toLocaleString()));
  }
  if (feats.bestStreak !== null && feats.bestStreak > 0) {
    highlights.push(t("summaryAchievementStreak").replace("{count}", String(feats.bestStreak)));
  }
  if (feats.bestTime !== null) {
    highlights.push(t("summaryAchievementBestTime").replace("{time}", formatDuration(feats.bestTime)));
  }

  return `<section class="profile-summary"><div class="summary-icon">✦</div><div class="summary-copy"><div class="section-kicker">${esc(t("profileSummary"))}</div><p>${since ? `${esc(t("summarySince"))} <strong>${esc(since)}</strong>. ` : ""}${esc(t("summaryRecord").replace("{wins}", wins.toLocaleString()).replace("{matches}", matches.toLocaleString()).replace("{rate}", rate))}</p><div class="summary-highlights">${highlights.length ? highlights.map((highlight) => `<span>${esc(highlight)}</span>`).join("") : `<span>${esc(t("noAchievements"))}</span>`}</div><small>${esc(t("noPublicBio"))}</small></div></section>`;
}

function profileAchievementValue(achievement) {
  if (achievement.id === "bestTime" && Number.isFinite(achievement.value)) return formatDuration(achievement.value);
  if (achievement.id === "playtime" && Number.isFinite(achievement.value)) {
    const hours = Math.floor(achievement.value / 3_600_000);
    return state.language === "pt" ? `${hours.toLocaleString()} h` : state.language === "es" ? `${hours.toLocaleString()} h` : `${hours.toLocaleString()} hr`;
  }
  if (Number.isFinite(achievement.value)) return Number(achievement.value).toLocaleString();
  return `${t("level")} ${achievement.level}`;
}

function profileAchievements(profile) {
  const excluded = new Set(["playoffsResult", "seasonResult"]);
  const achievements = (profile.achievements?.total || [])
    .filter((achievement) => achievement?.id && !excluded.has(achievement.id))
    .sort((left, right) => Number(right.date || 0) - Number(left.date || 0))
    .slice(0, 8);

  if (!achievements.length) {
    return `<section class="content-panel achievements-panel"><div class="panel-heading"><div><span class="section-kicker">${esc(t("officialLinks"))}</span><h3>${esc(t("achievementsAndRecords"))}</h3></div></div><p class="profile-empty-note">${esc(t("noAchievements"))}</p></section>`;
  }

  return `<section class="content-panel achievements-panel"><div class="panel-heading"><div><span class="section-kicker">${esc(t("achievements"))}</span><h3>${esc(t("achievementsAndRecords"))}</h3></div><span class="official-label">${esc(t("profileSocialSource"))}</span></div><div class="achievement-grid">${achievements.map((achievement) => {
    const label = t(`achievement_${achievement.id}`);
    const title = label === `achievement_${achievement.id}`
      ? achievement.id.replace(/([A-Z])/g, " $1").replace(/^./, (character) => character.toUpperCase())
      : label;
    return `<article class="achievement-card"><span class="achievement-mark">✦</span><div><strong>${esc(title)}</strong><span>${esc(profileAchievementValue(achievement))}</span><small>${esc(formatDate(achievement.date, localeCode()))}</small></div></article>`;
  }).join("")}</div></section>`;
}

function competitiveResults(profile) {
  const playoffs = getPlayoffResults(profile);
  const titles = playoffs.filter((result) => result.placement === 1);
  const playoffLabel = (placement) => {
    if (placement === 2) return t("playoffSecond");
    if (placement === 3) return t("playoffThird");
    if (placement === 1) return t("playoffTitle");
    return t("playoffParticipant");
  };
  const playoffHistory = playoffs.length
    ? playoffs.map((result) => {
      const title = playoffLabel(result.placement);
      const badge = result.placement === 1
        ? t("firstPlace")
        : result.placement === 2
          ? t("secondPlace")
          : result.placement === 3
            ? t("thirdPlace")
            : t("participant");
      return `<li class="result-item ${result.placement === 1 ? "champion-result" : ""}"><span class="result-medal">${result.placement === 1 ? "✦" : result.placement === 2 ? "Ⅱ" : result.placement === 3 ? "Ⅲ" : "◇"}</span><span class="result-description"><strong>${esc(title)}</strong><small>${esc(t("season"))} ${result.season}</small></span><span class="result-placement">${esc(badge)}</span></li>`;
    }).join("")
    : `<li class="profile-empty-note">${esc(t("noPlayoffs"))}</li>`;
  const seasonResults = getSeasonResults(profile);
  const seasonHistory = seasonResults.length
    ? seasonResults.map((result) => `<li class="result-item ${result.placement === 1 ? "champion-result" : ""}"><span class="result-medal">${result.placement === 1 ? "✦" : result.placement === 2 ? "Ⅱ" : result.placement === 3 ? "Ⅲ" : "▧"}</span><span class="result-description"><strong>${esc(t("seasonPlacement"))} #${result.placement}</strong><small>${esc(t("season"))} ${result.season}</small></span>${result.placement <= 3 ? `<span class="result-placement">${esc(t("rankedTopThree"))}</span>` : ""}</li>`).join("")
    : `<li class="profile-empty-note">${esc(t("noSeasonHighlights"))}</li>`;
  const championCount = titles.length;
  const titleCountKey = championCount === 1 ? "playoffTitleCountOne" : "playoffTitleCountMany";

  return `<section class="results-panel"><div class="results-heading"><div><span class="section-kicker">${esc(t("officialTournaments"))}</span><h3>${esc(t("officialPlayoffs"))}</h3></div><span class="title-counter"><strong>${championCount}</strong><small>${esc(t("officialTournaments"))}</small></span></div>
    ${championCount ? `<div class="titles-callout"><span>✦</span><p><strong>${esc(t(titleCountKey).replace("{count}", String(championCount)))}</strong><small>${titles.map((title) => `${esc(t("season"))} ${title.season}`).join(" · ")}</small></p></div>` : ""}
    <div class="results-columns"><div class="results-column"><h4>${esc(t("officialPlayoffs"))}<span>${playoffs.length}</span></h4><ul>${playoffHistory}</ul></div><div class="results-column"><h4>${esc(t("seasonHighlights"))}<span>${seasonResults.length}</span></h4><ul>${seasonHistory}</ul></div></div>
    ${state.profileSeasons ? profileSeasonRecords(state.profileSeasons) : ""}</section>`;
}

function profileSeasonRecords(seasons) {
  const feats = getCareerFeats(state.profile, seasons);
  const rankedSeasons = getSeasonResults(state.profile);
  const highest = feats.seasonHighlights[0];
  const bestRank = feats.bestSeasonRank;

  return `<div class="career-records"><div class="career-record"><span>${esc(t("peakElo"))}</span><strong>${highest ? highest.highestElo.toLocaleString() : "—"}</strong><small>${highest ? `${esc(t("season"))} ${highest.season}` : esc(t("noSeasonHighlights"))}</small></div><div class="career-record"><span>${esc(t("bestRankedFinish"))}</span><strong>${bestRank ? `#${bestRank.finalRank}` : "—"}</strong><small>${bestRank ? `${esc(t("season"))} ${bestRank.season}` : `${rankedSeasons.length} ${esc(t("season").toLowerCase())}`}</small></div></div>`;
}

function profileTrend(matches, uuid) {
  const samples = [];
  [...matches].reverse().forEach((match) => {
    const change = match.changes?.find((entry) => entry.uuid === uuid);
    if (Number.isFinite(change?.eloRate)) samples.push(change.eloRate);
  });
  if (samples.length < 2) return `<div class="chart-empty">${esc(t("chartEmpty"))}</div>`;
  const width = 820;
  const height = 190;
  const min = Math.min(...samples);
  const max = Math.max(...samples);
  const span = max - min || 1;
  const points = samples.map((value, index) => ({
    x: 14 + (index / (samples.length - 1)) * (width - 28),
    y: height - 22 - ((value - min) / span) * (height - 44)
  }));
  const line = points.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
  const area = `${line} L${points.at(-1).x},${height} L${points[0].x},${height} Z`;
  return `<div class="chart-wrap"><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(t("rating"))} history"><defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#9bd77d" stop-opacity=".27"/><stop offset="1" stop-color="#9bd77d" stop-opacity="0"/></linearGradient></defs><path class="chart-gridline" d="M0 48H${width} M0 100H${width} M0 152H${width}"/><path class="chart-area" d="${area}"/><path class="chart-line" d="${line}"/>${points.length < 80 ? points.map((point) => `<circle class="chart-dot" cx="${point.x}" cy="${point.y}" r="2.2"/>`).join("") : ""}</svg><div class="chart-labels"><span>${min.toLocaleString()} ELO</span><span>${samples.length} ${esc(t("lastMatches"))}</span><span>${max.toLocaleString()} ELO</span></div></div>`;
}

function matchTypeLabel(match) {
  switch (Number(match?.type)) {
    case 1: return t("casual");
    case 2: return t("ranked");
    case 3: return t("privateRoom");
    case 4: return t("eventMode");
    default: return t("otherMode");
  }
}

function matchRows(matches, uuid) {
  if (!matches.length) return `<tr><td colspan="6"><div class="empty-row">${esc(t("noMatches"))}</div></td></tr>`;
  return matches.map((match) => {
    const opponent = match.players?.find((player) => player.uuid !== uuid);
    const ownChange = Number(match.type) === 2 ? match.changes?.find((entry) => entry.uuid === uuid)?.change : null;
    const won = match.result?.uuid === uuid;
    const outcome = match.forfeited ? t("forfeit") : won ? t("won") : t("lost");
    return `<tr><td><span class="match-type">${esc(matchTypeLabel(match))}</span></td><td>${playerCell(opponent || { nickname: "—" })}</td><td><span class="outcome ${won ? "win" : "loss"}">${esc(outcome)}</span></td><td>${formatDuration(match.result?.time)}</td><td class="${Number(ownChange) >= 0 ? "positive" : "negative"}">${Number.isFinite(ownChange) ? `${ownChange > 0 ? "+" : ""}${ownChange}` : "—"}</td><td><button class="detail-button" data-match="${match.id}" aria-label="${esc(t("matchDetails"))}">↗</button></td></tr>`;
  }).join("");
}

function profileSearchForm() {
  return `<form id="profile-search-form" class="search-panel"><span class="search-panel-icon">⌕</span><label class="search-panel-field"><span>${esc(t("username"))}</span><input id="profile-name" name="name" value="${esc(state.profileName)}" placeholder="e.g. Feinberg" autocomplete="off"></label><button class="primary-button" type="submit">${esc(t("loadPlayer"))}<span>↗</span></button></form>`;
}

function profilePage(historyOnly = false) {
  if (!state.profileName) return `<section class="simple-panel"><div class="empty-illustration">◉</div><h2>${esc(historyOnly ? t("emptyHistory") : t("followPrompt"))}</h2>${profileSearchForm()}${errorPanel()}</section>`;
  if (state.loading && !state.profile) return `${profileSearchForm()}<div class="loading-panel"><span class="spinner"></span>${esc(t("loading"))}</div>`;
  if (!state.profile) return `${profileSearchForm()}${errorPanel()}`;

  const profile = state.profile;
  const favorites = state.favorites.some((name) => name.toLocaleLowerCase() === profile.nickname.toLocaleLowerCase());
  const location = `${countryFlag(profile.country)} ${esc(countryName(profile.country))}`;
  const rankedMatches = state.profileMatches.filter((match) => Number(match.type) === 2);
  const privateMatches = state.profileMatches.filter((match) => Number(match.type) === 3);
  const otherMatches = state.profileMatches.filter((match) => ![2, 3].includes(Number(match.type)));
  const historyGroups = { ranked: rankedMatches, private: privateMatches, other: otherMatches };
  const activeHistory = historyGroups[state.profileMatchFilter] || rankedMatches;
  const groupSummary = (matches, key) => {
    const wins = matches.filter((match) => match.result?.uuid === profile.uuid).length;
    return t(key).replace("{matches}", matches.length.toLocaleString()).replace("{wins}", wins.toLocaleString()).replace("{losses}", Math.max(0, matches.length - wins).toLocaleString());
  };
  const historySummaries = `<section class="match-mode-summaries" aria-label="${esc(t("history"))}"><article class="match-mode-summary ranked-summary"><span>${esc(t("rankedHistory"))}</span><strong>${rankedMatches.length.toLocaleString()}</strong><small>${esc(groupSummary(rankedMatches, "rankedMatchSummary"))}</small></article><article class="match-mode-summary private-summary"><span>${esc(t("privateHistory"))}</span><strong>${privateMatches.length.toLocaleString()}</strong><small>${esc(groupSummary(privateMatches, "privateMatchSummary"))}</small></article></section>`;
  const historyFilters = `<nav class="match-history-filters" aria-label="${esc(t("history"))}"><button type="button" data-match-filter="ranked" class="${state.profileMatchFilter === "ranked" ? "selected" : ""}">${esc(t("rankedHistory"))}<b>${rankedMatches.length}</b></button><button type="button" data-match-filter="private" class="${state.profileMatchFilter === "private" ? "selected" : ""}">${esc(t("privateHistory"))}<b>${privateMatches.length}</b></button>${otherMatches.length ? `<button type="button" data-match-filter="other" class="${state.profileMatchFilter === "other" ? "selected" : ""}">${esc(t("otherHistory"))}<b>${otherMatches.length}</b></button>` : ""}</nav>`;
  const curve = profileTrend(rankedMatches, profile.uuid);
  const feats = getCareerFeats(profile, state.profileSeasons);
  const backLabel = state.language === "pt" ? "Voltar" : state.language === "es" ? "Volver" : "Back";
  return `<div class="page-toolbar"><button type="button" class="secondary-button profile-back-button" data-action="go-back" aria-label="${backLabel}">← <span>${backLabel}</span></button>${profileSearchForm()}<button class="secondary-button" data-action="favorite" data-name="${esc(profile.nickname)}">${favorites ? "★" : "☆"} ${esc(t(favorites ? "removeFavorite" : "addFavorite"))}</button></div>
    ${errorPanel(state.profileError)}
    <section class="player-hero"><div class="profile-avatar-wrap">${avatarMarkup(profile, "large-avatar")}<span class="avatar-online"></span></div><div class="player-meta"><div class="eyebrow">${esc(t("player"))} <span class="eyebrow-divider">/</span> ${esc(t("season"))} ${state.season === 0 ? state.currentSeason || "—" : state.season}</div><h2>${esc(profile.nickname)}</h2><p>${location}<span class="meta-divider">·</span>${esc(t("rank"))} ${profile.eloRank ? `#${profile.eloRank}` : "—"}</p><div class="player-title-line">${feats.playoffTitles.length ? `✦ ${esc(t("playoffTitle"))} · ${feats.playoffTitles.map((title) => `${esc(t("season"))} ${title.season}`).join(", ")}` : esc(t("profileSummary"))}</div></div><div class="player-rating"><span>${esc(t("rating"))}</span><strong>${profile.eloRate == null ? "—" : Number(profile.eloRate).toLocaleString()}</strong><small>${esc(t("seasonStats"))}</small></div></section>
    ${profileSummary(profile, feats)}
    ${profileCards(profile)}
    ${profilePbVideos()}
    ${historySummaries}
    <p class="match-history-scope">${esc(t("historyScope"))}</p>
    ${historyFilters}
    <div class="profile-two-column">${profileSocialLinks(profile)}${profileAchievements(profile)}</div>
    ${competitiveResults(profile)}
    <section class="content-panel trend-panel"><div class="panel-heading"><div><span class="section-kicker">${esc(t("rating"))} · ${esc(t("lastMatches"))}</span><h3>${esc(state.language === "pt" ? "Evolução recente" : state.language === "es" ? "Progreso reciente" : "Recent progress")}</h3></div><span class="trend-period">${state.profileMatches.length} ${esc(t("matches").toLowerCase())}</span></div>${curve}</section>
    <section class="content-panel match-panel"><div class="panel-heading"><div><span class="section-kicker">${esc(t("history"))}</span><h3>${esc(t("recentMatches"))}</h3></div><span class="trend-period">${activeHistory.length} / 100</span></div><div class="table-scroll"><table class="match-table"><thead><tr><th>${esc(t("result"))}</th><th>${esc(t("opponent"))}</th><th>${esc(t("result"))}</th><th>${esc(t("time"))}</th><th>${esc(t("eloChange"))}</th><th></th></tr></thead><tbody>${matchRows(activeHistory, profile.uuid)}</tbody></table></div></section>`;
}

function favoritesPage() {
  if (!state.favorites.length) return `<section class="simple-panel"><div class="empty-illustration">☆</div><h2>${esc(t("emptyFavorites"))}</h2><button class="secondary-button" data-view="rankings">${esc(t("rankings"))} ↗</button></section>`;
  return `<div class="section-intro"><div><span class="section-kicker">${esc(t("savedFavorites"))}</span><h2>${state.favorites.length} ${esc(t("count"))}</h2></div><button class="secondary-button" data-view="rankings">${esc(t("searchPlayers"))} ⌕</button></div><section id="favorite-list" class="favorite-grid">${state.favorites.map((name) => `<button class="favorite-card" data-player="${esc(name)}">${avatarMarkup({ nickname: name })}<strong>${esc(name)}</strong><span class="favorite-star">★</span><small>${esc(t("openProfile"))} ↗</small></button>`).join("")}</section>`;
}

function versusStat(label, firstValue, secondValue, suffix = "") {
  const firstNumber = Number(firstValue || 0);
  const secondNumber = Number(secondValue || 0);
  const total = firstNumber + secondNumber;
  const firstWidth = Number.isFinite(total) && total > 0 ? firstNumber / total * 100 : 50;
  return `<div class="versus-stat"><div><span>${esc(label)}</span><strong>${esc(firstValue ?? "—")}${suffix}</strong><strong>${esc(secondValue ?? "—")}${suffix}</strong></div><div class="versus-bar"><i style="width:${firstWidth}%"></i></div></div>`;
}

function comparisonPage() {
  const comparison = state.comparison;
  const result = comparison?.result;
  const players = result?.players || [];
  const [first, second] = players;
  const ranked = result?.results?.ranked;
  const firstWins = first && ranked ? ranked[first.uuid] : 0;
  const secondWins = second && ranked ? ranked[second.uuid] : 0;
  return `<section class="content-panel compare-form-panel"><div class="panel-heading"><div><span class="section-kicker">MCSR RANKED</span><h3>${esc(t("directRecord"))}</h3></div><span class="versus-mark">VS</span></div><form id="compare-form" class="compare-form">
      <label><span>${esc(t("playerOne"))}</span><input name="first" value="${esc(comparison?.names?.[0] || "")}" placeholder="Feinberg" required></label>
      <span class="versus-mid">VS</span>
      <label><span>${esc(t("playerTwo"))}</span><input name="second" value="${esc(comparison?.names?.[1] || "")}" placeholder="doogile" required></label>
      <button class="primary-button" type="submit">${esc(t("compareNow"))}<span>↗</span></button>
    </form>${errorPanel()}</section>
    ${comparison?.loading ? `<div class="loading-panel"><span class="spinner"></span>${esc(t("loading"))}</div>` : ""}
    ${result ? `<section class="versus-header"><div class="versus-player">${avatarMarkup(first, "large-avatar")}<strong>${esc(first.nickname)}</strong><small>#${first.eloRank ?? "—"} · ${Number(first.eloRate || 0).toLocaleString()} ELO</small></div><div class="versus-score"><span>${esc(t("directRecord"))}</span><strong>${firstWins ?? 0}<em>–</em>${secondWins ?? 0}</strong><small>${Number(ranked?.total || 0)} ${esc(t("matches").toLowerCase())}</small></div><div class="versus-player">${avatarMarkup(second, "large-avatar alt-avatar")}<strong>${esc(second.nickname)}</strong><small>#${second.eloRank ?? "—"} · ${Number(second.eloRate || 0).toLocaleString()} ELO</small></div></section>
      <section class="content-panel compare-stats"><div class="panel-heading"><div><span class="section-kicker">${esc(t("seasonStats"))}</span><h3>${esc(t("player"))} vs ${esc(t("player"))}</h3></div></div>
      ${versusStat(t("wins"), firstWins, secondWins)}${versusStat(t("rating"), first.eloRate, second.eloRate)}${versusStat(t("rank"), first.eloRank ? `#${first.eloRank}` : "—", second.eloRank ? `#${second.eloRank}` : "—")}</section>
      <section class="content-panel match-panel"><div class="panel-heading"><div><span class="section-kicker">${esc(t("history"))}</span><h3>${esc(t("recentMatches"))}</h3></div></div><div class="table-scroll"><table class="match-table"><thead><tr><th>${esc(t("date"))}</th><th>${esc(t("result"))}</th><th>${esc(t("time"))}</th><th>${esc(t("eloChange"))}</th></tr></thead><tbody>${matchRows(comparison.matches || [], first.uuid)}</tbody></table></div></section>` : comparison && !comparison.loading && !state.error ? `<div class="empty-row">${esc(t("noVersus"))}</div>` : ""}`;
}

function bracketMarkup(tournament) {
  const champion = getChampion(tournament);
  const bestOf = Number(tournament.bestOf) || 1;
  const matchCount = tournament.rounds.flat().filter((match) => match.winnerId && match.players?.[0] && match.players?.[1]).length;
  return `<article class="tournament-card"><header><div><span class="section-kicker">${esc(formatDate(tournament.createdAt / 1000, localeCode()))} · ${tournament.players.length} ${esc(t("count"))} · ${esc(t("bestOfShort"))}${bestOf}</span><h3>${esc(tournament.name)}</h3></div><div class="tournament-actions">${champion ? `<span class="status-pill complete">✦ ${esc(t("completed"))}</span>` : `<span class="status-pill">${esc(t("inProgress"))}</span>`}<button class="icon-button delete-button" data-delete-tournament="${esc(tournament.id)}" title="${esc(t("deleteTournament"))}">×</button></div></header>
    <div class="tournament-roster">${tournament.players.map((player) => `<span class="roster-player">${avatarMarkup({ ...player, nickname: player.name }, "player-avatar")}<span class="roster-identity"><strong>${esc(player.name)}</strong><small>${player.eloRate == null ? esc(t("localOnly")) : `${Number(player.eloRate).toLocaleString()} ${esc(t("rating"))}`}</small></span><span class="seed-badge">#${player.seed ?? "—"}</span></span>`).join("")}</div>
    <div class="bracket-scroll"><div class="bracket">${tournament.rounds.map((round, roundIndex) => `<section class="bracket-round"><h4>${esc(roundIndex === tournament.rounds.length - 1 && round.length === 1 ? t("final") : `${t("round")} ${roundIndex + 1}`)}</h4>${round.map((match, matchIndex) => `<div class="bracket-match"><div class="match-series-label">${esc(t("bestOfShort"))}${bestOf}</div>${match.players.map((playerId, slot) => {
      const player = tournament.players.find((entry) => entry.id === playerId);
      if (!player) return `<div class="bracket-player bye"><span>BYE</span><span>—</span></div>`;
      const won = match.winnerId === player.id;
      const score = Number(match.score?.[slot] || 0);
      const scoreControls = !match.winnerId && match.players[0] && match.players[1]
        ? `<span class="score-controls"><button data-score="${esc(tournament.id)}" data-round="${roundIndex}" data-match-index="${matchIndex}" data-slot="${slot}" data-delta="-1" aria-label="${esc(message("decreaseScore", { name: player.name }))}" title="${esc(message("decreaseScore", { name: player.name }))}">−</button><strong aria-label="${esc(message("scoreFor", { name: player.name }))}">${score}</strong><button data-score="${esc(tournament.id)}" data-round="${roundIndex}" data-match-index="${matchIndex}" data-slot="${slot}" data-delta="1" aria-label="${esc(message("increaseScore", { name: player.name }))}" title="${esc(message("increaseScore", { name: player.name }))}">+</button></span>`
        : `<span class="bracket-score">${score}</span>`;
      return `<div class="bracket-player ${won ? "winner" : ""}">${avatarMarkup({ ...player, nickname: player.name }, "player-avatar")}<span class="bracket-player-name">${esc(player.name)}</span>${scoreControls}${match.winnerId ? `<span class="winner-mark">${won ? "✓" : "·"}</span>` : ""}</div>`;
    }).join("")}</div>`).join("")}</section>`).join("")}${champion ? `<section class="champion-card"><span>✦</span><small>${esc(t("champion"))}</small><strong>${esc(champion.name)}</strong></section>` : ""}</div></div>
    <footer><span class="local-badge">${esc(t("localOnly"))}</span><span>${matchCount} ${esc(t("matches").toLowerCase())} · ${esc(t("localDataNote"))}</span>${matchCount ? `<button class="text-button tournament-undo" data-undo-tournament="${esc(tournament.id)}">${esc(t("undoResult"))}</button>` : ""}</footer></article>`;
}

function tournamentsPage() {
  const disabled = state.tournamentCreating ? "disabled" : "";
  const submitText = state.tournamentCreating ? t("resolvePlayers") : t("create");
  return `<section class="content-panel tournament-form-panel"><div class="panel-heading"><div><span class="section-kicker">${esc(t("localOnly"))} · MCSR RANK</span><h3>${esc(t("createTournament"))}</h3></div><span class="nav-icon">♜</span></div><form id="tournament-form" class="tournament-form">
    <label class="tournament-name-field"><span>${esc(t("tournamentName"))}</span><input name="name" maxlength="60" placeholder="${esc(t("tournamentName"))}" required></label>
    <label class="tournament-entrants-field"><span>${esc(t("entrants"))}</span><textarea name="players" rows="5" maxlength="1200" placeholder="Feinberg&#10;doogile&#10;edcr&#10;seus amigos" required></textarea></label>
    <label><span>${esc(t("bestOf"))}</span><select name="bestOf"><option value="1">${esc(t("bestOfOne"))}</option><option value="3">${esc(t("bestOfThree"))}</option><option value="5">${esc(t("bestOfFive"))}</option></select></label>
    <label><span>${esc(t("seeding"))}</span><select name="seeding"><option value="rating">${esc(t("seedByRating"))}</option><option value="random">${esc(t("seedRandom"))}</option><option value="manual">${esc(t("seedManual"))}</option></select></label>
    <div class="form-help">${esc(t("tournamentHelp"))}</div><button class="primary-button" type="submit" ${disabled}>${esc(submitText)}<span>↗</span></button></form></section>
    <section class="tournament-list">${state.tournaments.length ? state.tournaments.map(bracketMarkup).join("") : `<div class="simple-panel compact"><div class="empty-illustration">♜</div><h2>${esc(t("noTournaments"))}</h2></div>`}</section>`;
}

function settingsPage() {
  const themes = [
    ["forest", t("themeForest"), "#8eaa8d"],
    ["purple", t("themePurple"), "#c19aff"],
    ["blue", t("themeBlue"), "#78baff"],
    ["crimson", t("themeCrimson"), "#ff8794"],
    ["nether", t("themeNether"), "#d98b61"],
    ["sand", t("themeSand"), "#d2ad78"],
    ["arctic", t("themeArctic"), "#82c8c5"],
    ["midnight", t("themeMidnight"), "#8a9cce"],
    ["rose", t("themeRose"), "#c68f9d"]
  ];
  return `<section class="content-panel settings-panel"><div class="panel-heading"><div><span class="section-kicker">${esc(t("appearance"))} · MCSR RANK</span><h3>${esc(t("theme"))}</h3></div><span class="nav-icon">⚙</span></div>
    <p class="settings-description">${esc(t("themeDescription"))}</p>
    <div class="theme-grid" role="group" aria-label="${esc(t("theme"))}">${themes.map(([key, label, color]) => `<button class="theme-option${state.settings.theme === key ? " selected" : ""}" data-theme-choice="${key}" aria-pressed="${state.settings.theme === key}"><span class="theme-swatch" style="--swatch:${color}"><i></i><i></i><i></i></span><span>${esc(label)}</span><span class="theme-check">${state.settings.theme === key ? "✓" : ""}</span></button>`).join("")}</div>
    <div class="settings-divider"></div><h4 class="settings-subheading">${esc(t("appearance"))}</h4>
    <label class="settings-toggle"><span><strong>${esc(t("showSkins"))}</strong><small>${esc(t("skinSourceNote"))}</small></span><input type="checkbox" data-setting="showSkins" ${state.settings.showSkins ? "checked" : ""}><span class="toggle-track"></span></label>
    <label class="settings-toggle"><span><strong>${esc(t("compactRows"))}</strong><small>${esc(state.language === "pt" ? "Reduz o espaçamento vertical das tabelas de jogadores." : "Reduces vertical spacing in player tables.")}</small></span><input type="checkbox" data-setting="compactRows" ${state.settings.compactRows ? "checked" : ""}><span class="toggle-track"></span></label>
    <div class="settings-note">${esc(t("settingsSaved"))}</div></section>`;
}

function osApps() {
  const messages = {
    pt: { name: "Estacao MCSR", subtitle: "Escolha um app para continuar.", desktop: "Area de trabalho", taskbar: "Aplicativos abertos", online: "TODOS OS SISTEMAS ONLINE", clock: "ESTACAO ARCADE", openHint: "Clique duas vezes para abrir", rank: "MCSR Ranked", comet: "Starfall", hell: "DANMAKU" },
    en: { name: "MCSR Station", subtitle: "Choose an app to continue.", desktop: "Desktop", taskbar: "Open apps", online: "ALL SYSTEMS ONLINE", clock: "ARCADE STATION", openHint: "Double click to open", rank: "MCSR Ranked", comet: "Starfall", hell: "DANMAKU" },
    es: { name: "Estacion MCSR", subtitle: "Elige una app para continuar.", desktop: "Escritorio", taskbar: "Apps abiertas", online: "TODOS LOS SISTEMAS ONLINE", clock: "ESTACION ARCADE", openHint: "Haz doble clic para abrir", rank: "MCSR Ranked", comet: "Starfall", hell: "DANMAKU" }
  }[state.language] || {};
  const icons = {
    rank: `<img src="./assets/branding/mcsr-ranked-logo.png" alt="">`,
    comet: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="m20 7 4.7 10.2L36 20l-11.3 2.8L20 34l-4.7-11.2L4 20l11.3-2.8L20 7Z"/><circle cx="29.5" cy="9.5" r="2"/></svg>`,
    hell: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="m20 3 4.2 12.8L37 20l-12.8 4.2L20 37l-4.2-12.8L3 20l12.8-4.2L20 3Z"/><circle cx="20" cy="20" r="4"/></svg>`
  };
  return [
    { id: "rank", view: "rankings", name: messages.rank, icon: icons.rank },
    { id: "comet", view: "game", mode: "cometfall", name: messages.comet, icon: icons.comet },
    { id: "hell", view: "game", mode: "danmaku", name: messages.hell, icon: icons.hell }
  ];
}

let desktopGridObserver = null;

function desktopGridMetrics(stage) {
  const icon = stage.querySelector(".os-desktop-launcher");
  const width = icon?.offsetWidth || 88;
  const height = icon?.offsetHeight || 91;
  const cellWidth = 100;
  const cellHeight = 98;
  const padX = 10;
  const padY = 10;
  return {
    width, height, cellWidth, cellHeight, padX, padY,
    columns: Math.max(1, Math.floor((stage.clientWidth - padX * 2 - width) / cellWidth) + 1),
    rows: Math.max(1, Math.floor((stage.clientHeight - padY * 2 - height) / cellHeight) + 1)
  };
}

function nearestDesktopCell(col, row, occupied, metrics) {
  const cells = [];
  for (let nextRow = 0; nextRow < metrics.rows; nextRow += 1) {
    for (let nextCol = 0; nextCol < metrics.columns; nextCol += 1) {
      const key = `${nextCol}:${nextRow}`;
      if (!occupied.has(key)) cells.push({ col: nextCol, row: nextRow, distance: Math.hypot(nextCol - col, nextRow - row) });
    }
  }
  cells.sort((a, b) => a.distance - b.distance || a.row - b.row || a.col - b.col);
  return cells[0] || { col: 0, row: 0 };
}

function arrangeDesktopIcons(stage, draggedId = "") {
  const icons = [...stage.querySelectorAll(".os-desktop-icons .os-desktop-launcher")];
  if (!icons.length) return;
  const metrics = desktopGridMetrics(stage);
  const occupied = new Set();
  let changed = false;
  icons.forEach((icon, index) => {
    const id = icon.dataset.osApp;
    const saved = state.desktopPositions[id] || {};
    let col, row;
    if (id === draggedId) {
      col = Math.round((icon.offsetLeft - metrics.padX) / metrics.cellWidth);
      row = Math.round((icon.offsetTop - metrics.padY) / metrics.cellHeight);
    } else if (Number.isFinite(Number(saved.col)) && Number.isFinite(Number(saved.row))) {
      col = Math.round(Number(saved.col)); row = Math.round(Number(saved.row));
    } else if (Number.isFinite(Number(saved.x)) && Number.isFinite(Number(saved.y))) {
      col = Math.round((Number(saved.x) - metrics.padX) / metrics.cellWidth);
      row = Math.round((Number(saved.y) - metrics.padY) / metrics.cellHeight);
    } else {
      row = index % metrics.rows;
      col = Math.floor(index / metrics.rows);
    }
    col = Math.max(0, Math.min(metrics.columns - 1, col));
    row = Math.max(0, Math.min(metrics.rows - 1, row));
    const cell = nearestDesktopCell(col, row, occupied, metrics);
    col = cell.col; row = cell.row;
    occupied.add(`${col}:${row}`);
    icon.style.left = `${metrics.padX + col * metrics.cellWidth}px`;
    icon.style.top = `${metrics.padY + row * metrics.cellHeight}px`;
    const current = state.desktopPositions[id];
    if (!current || Number(current.col) !== col || Number(current.row) !== row || current.x !== undefined || current.y !== undefined) {
      state.desktopPositions[id] = { col, row };
      changed = true;
    }
  });
  if (changed) saveDesktopSettings();
}

function desktopLauncher(app, surface) {
  const isDesktop = surface === "desktop";
  const position = state.desktopPositions[app.id] || {};
  const x = Number.isFinite(Number(position.x)) ? Number(position.x) : 18;
  const y = Number.isFinite(Number(position.y)) ? Number(position.y) : 18 + osAppIds.indexOf(app.id) * 98;
  const safeX = Math.min(Math.max(0, window.innerWidth - 100), Math.max(0, x));
  const safeY = Math.min(Math.max(0, window.innerHeight - 200), Math.max(0, y));
  const style = isDesktop ? ` style="left:${safeX}px;top:${safeY}px"` : "";
  const isRunning = !isDesktop && state.osWindows.some((item) => item.appId === app.id);
  return `<button type="button" class="os-launcher os-launcher-${app.id} ${isDesktop ? "os-desktop-launcher" : "os-taskbar-launcher"}${isRunning ? " is-running" : ""}" data-os-app="${app.id}" data-welcome-action data-welcome-view="${app.view}"${app.mode ? ` data-game-mode="${app.mode}"` : ""}${style}${isDesktop ? ` aria-pressed="false" title="Clique duas vezes para abrir"` : ""} aria-label="${esc(app.name)}"><span class="os-app-icon">${app.icon}</span><strong>${esc(app.name)}</strong></button>`;
}

function welcomePage() {
  const messages = {
    pt: { name: "Estacao MCSR", subtitle: "Escolha um app para continuar.", desktop: "Area de trabalho", taskbar: "Aplicativos abertos", online: "TODOS OS SISTEMAS ONLINE", clock: "ESTACAO ARCADE", openHint: "Clique duas vezes para abrir", rank: "MCSR Ranked", comet: "Starfall", hell: "DANMAKU" },
    en: { name: "MCSR Station", subtitle: "Choose an app to continue.", desktop: "Desktop", taskbar: "Open apps", online: "ALL SYSTEMS ONLINE", clock: "ARCADE STATION", openHint: "Double click to open", rank: "MCSR Ranked", comet: "Starfall", hell: "DANMAKU" },
    es: { name: "Estacion MCSR", subtitle: "Elige una app para continuar.", desktop: "Escritorio", taskbar: "Apps abiertas", online: "TODOS LOS SISTEMAS ONLINE", clock: "ESTACION ARCADE", openHint: "Haz doble clic para abrir", rank: "MCSR Ranked", comet: "Starfall", hell: "DANMAKU" }
  }[state.language] || {};
  const apps = osApps();
  return `<section class="welcome-page os-shell" aria-label="${esc(messages.name)}">
    <div class="os-desktop">
      <div class="os-topbar"><span class="os-brand"><i>◈</i>${esc(messages.name)}</span><span class="os-topbar-status"><i></i>${esc(messages.online)}</span></div>
      <div class="os-desktop-stage"><div class="os-ridge os-ridge-back" aria-hidden="true"></div><div class="os-ridge os-ridge-front" aria-hidden="true"></div>
        <div class="os-desktop-icons" aria-label="${esc(messages.desktop)}">${apps.filter((app) => state.desktopShortcuts.includes(app.id)).map((app) => desktopLauncher(app, "desktop")).join("")}</div>
        <div class="os-desktop-widget"><span class="os-widget-mark">${state.desktopProfile?.picture ? `<img src="${esc(state.desktopProfile.picture)}" alt="">` : "M"}</span><div><small>${esc(messages.clock)}</small><strong>01 <i>/</i> 03</strong></div><b>${esc(state.desktopProfile?.name || "READY")}</b></div>
      </div>
      <div class="os-taskbar"><button type="button" class="os-start-button" aria-label="${esc(messages.name)}"><span>◈</span></button><span class="os-taskbar-divider"></span><div class="os-taskbar-apps" aria-label="${esc(messages.taskbar)}">${apps.filter((app) => state.taskbarShortcuts.includes(app.id)).map((app) => desktopLauncher(app, "taskbar")).join("")}</div><div class="os-taskbar-tray"><i></i><span>ONLINE</span><b>⌁</b></div></div>
    </div>
  </section>`;
}

function osStartMenuMarkup() {
  const destinations = [
    ["welcome", "home", "⌂"], ["rankings", "rankings", "▤"], ["profile", "player", "◉"],
    ["compare", "compare", "⇄"], ["history", "history", "⌁"], ["watchlist", "watchlist", "☆"],
    ["tournaments", "tournaments", "♜"], ["settings", "settings", "⚙"]
  ];
  const system = state.language === "pt" ? ["APLICATIVOS", "Sistema pronto"] : state.language === "es" ? ["APLICACIONES", "Sistema listo"] : ["APPLICATIONS", "System ready"];
  return `<div class="os-start-menu" data-os-start-menu hidden><div class="os-start-menu-head"><span class="os-start-avatar">${state.desktopProfile?.picture ? `<img src="${esc(state.desktopProfile.picture)}" alt="">` : esc((state.desktopProfile?.name || "M").slice(0, 1).toUpperCase())}</span><div><strong>${esc(state.desktopProfile?.name || "MCSR STATION")}</strong><small>${system[0]}</small></div></div><div class="os-start-menu-grid">${destinations.map(([view, key, icon]) => `<button type="button" data-welcome-action data-welcome-view="${view}"><i>${icon}</i><span>${esc(t(key))}</span></button>`).join("")}</div><div class="os-start-menu-divider"></div><button type="button" class="os-start-game" data-welcome-action data-welcome-view="game" data-game-mode="cometfall"><i>✦</i><span>Starfall</span><small>ROGUELIKE</small></button><button type="button" class="os-start-game" data-welcome-action data-welcome-view="game" data-game-mode="danmaku"><i>✧</i><span>DANMAKU</span><small>BULLET HELL</small></button><div class="os-start-menu-foot"><span><i></i>${system[1]}</span><b>v1.0</b></div></div>`;
}

function osTaskbarMarkup() {
  const apps = osApps().map((app) => ({ ...app, label: app.name, icon: app.id === "rank" ? "▤" : app.id === "comet" ? "✦" : "✧" }));
  const runningAppId = state.view === "welcome" ? "" : state.view === "game" ? (state.arcadeMode === "danmaku" ? "hell" : "comet") : "rank";
  const visibleAppIds = new Set(state.taskbarShortcuts);
  if (runningAppId) visibleAppIds.add(runningAppId);
  const taskbarLabel = state.language === "pt" ? "Barra de tarefas" : state.language === "es" ? "Barra de tareas" : "Taskbar";
  return `<nav class="os-runtime-taskbar" aria-label="${taskbarLabel}"><button type="button" class="os-runtime-start" aria-expanded="false" aria-label="MCSR Station">◈</button><span class="os-runtime-separator"></span><div class="os-runtime-pinned">${apps.filter((app) => visibleAppIds.has(app.id)).map((app) => `<button type="button" class="os-runtime-app${app.id === runningAppId ? " active" : ""}${state.taskbarShortcuts.includes(app.id) ? " pinned" : " running-unpinned"}" data-os-app="${app.id}" data-welcome-action data-welcome-view="${app.view}"${app.mode ? ` data-game-mode="${app.mode}"` : ""} aria-label="${app.label}" title="${app.label}${state.taskbarShortcuts.includes(app.id) ? "" : " — running"}"><i>${app.icon}</i><span>${app.label}</span></button>`).join("")}</div><div class="os-runtime-tray"><i></i><span>ONLINE</span><b>⌁</b></div></nav>${osStartMenuMarkup()}`;
}

function osRuntimeMarkup(osWindow) {
  const app = osApps().find((item) => item.id === osWindow.appId);
  const title = osWindow.view === "game" ? app.name : osWindow.view === "rankings" ? app.name : `${app.name} · ${t(osWindow.view === "profile" ? "player" : osWindow.view)}`;
  const labels = state.language === "pt" ? ["Minimizar", "Maximizar ou restaurar", "Fechar"] : state.language === "es" ? ["Minimizar", "Maximizar o restaurar", "Cerrar"] : ["Minimize", "Maximize or restore", "Close"];
  const viewParam = encodeURIComponent(osWindow.view);
  const modeParam = osWindow.mode ? `&mode=${encodeURIComponent(osWindow.mode)}` : "";
  const src = `./index.html?oswindow=${encodeURIComponent(osWindow.appId)}&view=${viewParam}${modeParam}`;
  const windowClass = `os-runtime-window${osWindow.maximized ? " is-maximized" : ""}${osWindow.minimized ? " is-minimized" : ""}`;
  const style = `left:${osWindow.x}px;top:${osWindow.y}px;width:${osWindow.width}px;height:${osWindow.height}px;z-index:${osWindow.zIndex}`;
  return `<section class="${windowClass}" data-os-window-id="${esc(osWindow.id)}" style="${style}"><header class="os-window-titlebar" data-os-window-drag-handle><span class="os-window-brand">MCSR STATION</span><span class="os-window-divider">/</span><strong>${esc(title)}</strong><span class="os-window-status"><i></i> RUNNING</span><div class="os-window-controls" role="group" aria-label="Window controls"><button type="button" data-os-window-action="minimize" title="${labels[0]}" aria-label="${labels[0]}"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 9h8"/></svg></button><button type="button" data-os-window-action="maximize" title="${labels[1]}" aria-label="${labels[1]}" aria-pressed="${osWindow.maximized}"><svg viewBox="0 0 12 12" aria-hidden="true"><rect x="2.2" y="2.2" width="7.6" height="7.6"/></svg></button><button type="button" class="os-window-close" data-os-window-action="close" title="${labels[2]}" aria-label="${labels[2]}"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 3 6 6M9 3 3 9"/></svg></button></div></header><iframe class="os-window-frame" src="${src}" title="${esc(title)}" allow="autoplay; fullscreen"></iframe></section>`;
}

function updateOsTaskbarState() {
  const desktop = elements.app.querySelector(".os-desktop");
  desktop?.querySelectorAll(".os-taskbar-launcher").forEach((button) => button.classList.toggle("is-running", state.osWindows.some((item) => item.appId === button.dataset.osApp)));
}

function openOSWindow(appId, requestedView = "") {
  const app = osApps().find((item) => item.id === appId);
  const desktop = elements.app.querySelector(".os-desktop");
  if (!app || !desktop) return;
  const view = appId === "rank" ? (requestedView || "rankings") : "game";
  const mode = appId === "hell" ? "danmaku" : appId === "comet" ? "cometfall" : "";
  const existing = state.osWindows.find((item) => item.appId === appId && item.view === view && item.mode === mode);
  const focus = (osWindow) => {
    osWindow.minimized = false;
    osWindow.zIndex = ++state.osWindowSequence + 10;
    const element = [...desktop.querySelectorAll("[data-os-window-id]")].find((item) => item.dataset.osWindowId === osWindow.id);
    if (element) {
      element.classList.remove("is-minimized");
      element.style.zIndex = osWindow.zIndex;
    }
    updateOsTaskbarState();
  };
  if (existing) {
    focus(existing);
    return;
  }
  const bounds = desktop.getBoundingClientRect();
  const width = Math.min(1180, Math.max(340, bounds.width * 0.72), Math.max(320, bounds.width - 24));
  const height = Math.min(760, Math.max(300, bounds.height * 0.72), Math.max(260, bounds.height - 126));
  const offset = state.osWindows.length;
  const maxX = Math.max(0, bounds.width - width - 10);
  const maxY = Math.max(42, bounds.height - height - 68);
  const osWindow = {
    id: `os-window-${++state.osWindowSequence}`,
    appId,
    view,
    mode,
    x: Math.min(maxX, 58 + offset * 42),
    y: Math.min(maxY, 54 + offset * 36),
    width,
    height,
    zIndex: state.osWindowSequence + 10,
    maximized: false,
    minimized: false
  };
  state.osWindows.push(osWindow);
  desktop.insertAdjacentHTML("beforeend", osRuntimeMarkup(osWindow));
  bindOsDesktopWindows(desktop);
  updateOsTaskbarState();
}

function bindOsDesktopWindows(desktop) {
  if (!desktop.dataset.apiBridgeBound) {
    desktop.dataset.apiBridgeBound = "true";
    window.addEventListener("message", async (event) => {
      const request = event.data;
      if (!["mcsr-api-request", "speedrun-api-request"].includes(request?.type) || !Number.isInteger(request.requestId)) return;
      const frame = [...desktop.querySelectorAll(".os-window-frame")].find((item) => item.contentWindow === event.source);
      if (!frame || typeof request.endpoint !== "string" || request.endpoint.length > 600 || !request.endpoint.startsWith("/")) return;
      const speedrun = request.type === "speedrun-api-request";
      const responseType = speedrun ? "speedrun-api-response" : "mcsr-api-response";
      try {
        if (typeof window.mcsr?.get !== "function") throw new Error("O bridge da API não está disponível na janela principal.");
        const bridge = speedrun ? window.mcsr?.speedrun : window.mcsr?.get;
        if (typeof bridge !== "function") throw new Error("API bridge unavailable in the main window.");
        const value = await bridge(request.endpoint);
        event.source.postMessage({ type: responseType, requestId: request.requestId, value }, "*");
      } catch (error) {
        event.source.postMessage({ type: responseType, requestId: request.requestId, error: error.message || String(error) }, "*");
      }
    });
  }
  desktop.querySelectorAll("[data-os-window-id]").forEach((element) => {
    if (element.dataset.windowBound) return;
    element.dataset.windowBound = "true";
    const osWindow = state.osWindows.find((item) => item.id === element.dataset.osWindowId);
    if (!osWindow) return;
    const focus = () => {
      osWindow.minimized = false;
      osWindow.zIndex = ++state.osWindowSequence + 10;
      element.classList.remove("is-minimized");
      element.style.zIndex = osWindow.zIndex;
    };
    element.addEventListener("pointerdown", focus);
    element.querySelector("iframe")?.addEventListener("load", () => {
      const frame = element.querySelector("iframe");
      frame?.contentWindow?.addEventListener("focus", focus);
      frame?.contentDocument?.addEventListener("pointerdown", focus);
    });
    element.querySelectorAll("[data-os-window-action]").forEach((button) => button.addEventListener("click", (event) => {
      event.stopPropagation();
      const action = button.dataset.osWindowAction;
      if (action === "close") {
        element._osResizeObserver?.disconnect();
        state.osWindows = state.osWindows.filter((item) => item.id !== osWindow.id);
        element.remove();
        updateOsTaskbarState();
      } else if (action === "minimize") {
        osWindow.minimized = true;
        element.classList.add("is-minimized");
      } else if (action === "maximize") {
        osWindow.maximized = !osWindow.maximized;
        element.classList.toggle("is-maximized", osWindow.maximized);
        button.setAttribute("aria-pressed", String(osWindow.maximized));
        if (!osWindow.maximized) {
          element.style.left = `${osWindow.x}px`;
          element.style.top = `${osWindow.y}px`;
          element.style.width = `${osWindow.width}px`;
          element.style.height = `${osWindow.height}px`;
        }
      }
    }));
    const titlebar = element.querySelector("[data-os-window-drag-handle]");
    titlebar?.addEventListener("dblclick", (event) => {
      if (event.target.closest("button")) return;
      const button = element.querySelector('[data-os-window-action="maximize"]');
      button?.click();
    });
    titlebar?.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || event.target.closest("button") || osWindow.maximized) return;
      focus();
      const startX = event.clientX;
      const startY = event.clientY;
      const originX = element.offsetLeft;
      const originY = element.offsetTop;
      const move = (pointerEvent) => {
        const bounds = desktop.getBoundingClientRect();
        const maxX = Math.max(0, bounds.width - element.offsetWidth);
        const maxY = Math.max(0, bounds.height - Math.min(46, element.offsetHeight));
        osWindow.x = Math.min(maxX, Math.max(0, originX + pointerEvent.clientX - startX));
        osWindow.y = Math.min(maxY, Math.max(0, originY + pointerEvent.clientY - startY));
        element.style.left = `${osWindow.x}px`;
        element.style.top = `${osWindow.y}px`;
      };
      const finish = () => {
        titlebar.removeEventListener("pointermove", move);
        titlebar.removeEventListener("pointerup", finish);
        titlebar.removeEventListener("pointercancel", finish);
        osWindow.width = element.offsetWidth;
        osWindow.height = element.offsetHeight;
      };
      titlebar.setPointerCapture(event.pointerId);
      titlebar.addEventListener("pointermove", move);
      titlebar.addEventListener("pointerup", finish);
      titlebar.addEventListener("pointercancel", finish);
    });
    const resizeObserver = new ResizeObserver(() => {
      if (osWindow.maximized || osWindow.minimized) return;
      osWindow.width = element.offsetWidth;
      osWindow.height = element.offsetHeight;
    });
    element._osResizeObserver = resizeObserver;
    resizeObserver.observe(element);
  });
}

function refreshDesktopShortcuts() {
  const desktop = elements.app.querySelector(".os-desktop");
  if (!desktop) return;
  const apps = osApps();
  const icons = desktop.querySelector(".os-desktop-icons");
  const taskbar = desktop.querySelector(".os-taskbar-apps");
  if (icons) icons.innerHTML = apps.filter((app) => state.desktopShortcuts.includes(app.id)).map((app) => desktopLauncher(app, "desktop")).join("");
  if (taskbar) taskbar.innerHTML = apps.filter((app) => state.taskbarShortcuts.includes(app.id)).map((app) => desktopLauncher(app, "taskbar")).join("");
  const stage = desktop.querySelector(".os-desktop-stage");
  if (stage) arrangeDesktopIcons(stage);
  updateOsTaskbarState();
}

function saveDesktopSettings() {
  return saveStorage("mcsr-desktop", {
    shortcuts: state.desktopShortcuts,
    taskbar: state.taskbarShortcuts,
    positions: state.desktopPositions,
    wallpaper: state.desktopWallpaper,
    accent: state.desktopAccent
  });
}

function applyDesktopAppearance() {
  const desktop = elements.app.querySelector(".os-desktop");
  const stage = elements.app.querySelector(".os-desktop-stage");
  if (desktop) desktop.style.setProperty("--os-accent", state.desktopAccent);
  if (stage && state.desktopWallpaper) {
    stage.style.backgroundImage = `linear-gradient(145deg,#0c1725a8,#10263bb3),url("${state.desktopWallpaper}")`;
    stage.style.backgroundSize = "cover";
    stage.style.backgroundPosition = "center";
  } else if (stage) {
    stage.style.removeProperty("background-image");
    stage.style.removeProperty("background-size");
    stage.style.removeProperty("background-position");
  }
}

function desktopContextMenuMarkup(appId = "", surface = "desktop") {
  const app = osApps().find((item) => item.id === appId);
  const available = osApps();
  const pt = state.language === "pt";
  const menuButton = (action, label, id = "") => `<button type="button" role="menuitem" data-os-context-action="${action}"${id ? ` data-os-app="${id}"` : ""}>${esc(label)}</button>`;
  const presets = [["#8bd5e5", pt ? "Azul gelo" : "Ice blue"], ["#c19aff", pt ? "Violeta" : "Violet"], ["#a4d980", pt ? "Verde" : "Green"], ["#ff8794", pt ? "Rosa" : "Rose"], ["#ff9b68", pt ? "Nether" : "Nether"]];
  let items = "";
  if (app) {
    items += menuButton("open", pt ? "Abrir" : "Open", app.id);
    if (surface === "desktop") {
      items += menuButton(state.taskbarShortcuts.includes(app.id) ? "unpin" : "pin", state.taskbarShortcuts.includes(app.id) ? (pt ? "Desafixar da barra" : "Unpin from taskbar") : (pt ? "Fixar na barra de tarefas" : "Pin to taskbar"), app.id);
      items += menuButton("remove-desktop", pt ? "Remover da area de trabalho" : "Remove from desktop", app.id);
    } else {
      items += menuButton("unpin", pt ? "Desafixar da barra" : "Unpin from taskbar", app.id);
      if (!state.desktopShortcuts.includes(app.id)) items += menuButton("add-desktop", pt ? "Adicionar a area de trabalho" : "Add to desktop", app.id);
    }
  } else {
    const missingDesktop = available.filter((item) => !state.desktopShortcuts.includes(item.id));
    const missingTaskbar = available.filter((item) => !state.taskbarShortcuts.includes(item.id));
    if (missingDesktop.length) {
      items += `<div class="os-context-label">${pt ? "NOVO ATALHO" : "NEW SHORTCUT"}</div>`;
      items += missingDesktop.map((item) => menuButton("add-desktop", item.name, item.id)).join("");
    }
    if (missingTaskbar.length) {
      items += `<div class="os-context-label">${pt ? "FIXAR NA BARRA" : "PIN TO TASKBAR"}</div>`;
      items += missingTaskbar.map((item) => menuButton("pin", item.name, item.id)).join("");
    }
    items += `<div class="os-context-label">${pt ? "PERSONALIZAR" : "PERSONALIZE"}</div>`;
    items += menuButton("wallpaper", pt ? "Escolher wallpaper..." : "Choose wallpaper...");
    items += menuButton("clear-wallpaper", pt ? "Remover wallpaper" : "Remove wallpaper");
    items += `<div class="os-context-colors">${presets.map(([color, label]) => `<button type="button" title="${esc(label)}" aria-label="${esc(label)}" data-os-accent="${color}" style="--swatch:${color}"></button>`).join("")}<label title="${pt ? "Cor personalizada" : "Custom color"}"><input type="color" data-os-accent-picker value="${esc(state.desktopAccent)}" aria-label="${pt ? "Cor personalizada" : "Custom color"}"></label></div>`;
  }
  return `<div class="os-context-menu" data-os-context-menu role="menu" hidden>${items}</div>`;
}

function profileGateMarkup() {
  if (state.desktopProfileUnlocked) return "";
  const existing = Boolean(state.desktopProfile?.salt && state.desktopProfile?.hash);
  const text = state.language === "en"
    ? { title: existing ? "Welcome back" : "Create your station profile", copy: existing ? "Enter your password to unlock this device." : "Set up your local profile to personalize your station.", name: "Display name", password: "Password", picture: "Profile picture (optional)", action: existing ? "Unlock station" : "Create profile", hint: "Your password is stored as a local verification hash." }
    : state.language === "es"
      ? { title: existing ? "Bienvenido de nuevo" : "Crea tu perfil", copy: existing ? "Introduce tu contrasena para desbloquear." : "Configura tu perfil local para personalizar la estacion.", name: "Nombre", password: "Contrasena", picture: "Foto de perfil (opcional)", action: existing ? "Desbloquear" : "Crear perfil", hint: "La contrasena se guarda como hash local." }
      : { title: existing ? "Bem-vindo de volta" : "Crie seu perfil", copy: existing ? "Digite sua senha para desbloquear esta estacao." : "Configure seu perfil local para personalizar sua estacao.", name: "Nome de exibicao", password: "Senha", picture: "Foto de perfil (opcional)", action: existing ? "Desbloquear estacao" : "Criar perfil", hint: "A senha e salva como hash local; ela nunca e armazenada em texto puro." };
  return `<div class="os-profile-gate" role="dialog" aria-modal="true" aria-labelledby="os-profile-title"><section class="os-profile-card"><div class="os-profile-mark">${state.desktopProfile?.picture ? `<img src="${esc(state.desktopProfile.picture)}" alt="">` : "M"}</div><span class="os-context-label">MCSR STATION / PROFILE</span><h1 id="os-profile-title">${esc(text.title)}</h1><p>${esc(text.copy)}</p><form data-os-profile-form>${existing ? "" : `<label>${esc(text.name)}<input name="displayName" maxlength="24" minlength="2" autocomplete="nickname" required></label>`}<label>${esc(text.password)}<input name="password" type="password" minlength="6" autocomplete="${existing ? "current-password" : "new-password"}" required autofocus></label>${existing ? "" : `<label>${esc(text.picture)}<input name="picture" type="file" accept="image/png,image/jpeg,image/webp,image/gif"></label>`}<div class="os-profile-error" data-os-profile-error role="alert"></div><button type="submit">${esc(text.action)} <span>→</span></button></form><small>${esc(text.hint)}</small></section></div>`;
}

function imageFileAsDataUrl(file, maxBytes = 1024 * 1024) {
  if (!file || !/^image\/(png|jpeg|webp|gif)$/.test(file.type) || file.size > maxBytes) {
    return Promise.reject(new Error(state.language === "pt" ? "Use uma imagem PNG, JPG, WEBP ou GIF de ate 1 MB." : "Choose a PNG, JPG, WEBP or GIF image under 1 MB."));
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result)));
    reader.addEventListener("error", () => reject(new Error("Could not read this image.")));
    reader.readAsDataURL(file);
  });
}

async function profilePasswordHash(password, salt) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const saltBytes = new Uint8Array(salt.match(/.{2}/g).map((byte) => Number.parseInt(byte, 16)));
  const digest = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: saltBytes, iterations: 180000, hash: "SHA-256" }, key, 256);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function bindDesktopInteractions() {
  const desktop = elements.app.querySelector(".os-desktop");
  if (!desktop) return;
  applyDesktopAppearance();
  const stage = desktop.querySelector(".os-desktop-stage");
  if (stage) {
    arrangeDesktopIcons(stage);
    desktopGridObserver?.disconnect();
    desktopGridObserver = new ResizeObserver(() => arrangeDesktopIcons(stage));
    desktopGridObserver.observe(stage);
  }
  const hideMenu = () => {
    const menu = desktop.querySelector("[data-os-context-menu]");
    if (menu) menu.hidden = true;
  };
  const showMenu = (event, appId = "", surface = "desktop") => {
    const menu = desktop.querySelector("[data-os-context-menu]");
    if (!menu) return;
    menu.innerHTML = desktopContextMenuMarkup(appId, surface).replace(/^<div[^>]*>|<\/div>$/g, "");
    menu.hidden = false;
    const rect = desktop.getBoundingClientRect();
    const x = Math.min(Math.max(8, event.clientX - rect.left), rect.width - 240);
    const y = Math.min(Math.max(8, event.clientY - rect.top), rect.height - 240);
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
  };
  desktop.addEventListener("contextmenu", (event) => {
    const item = event.target.closest("[data-os-app]");
    const taskbar = event.target.closest(".os-taskbar");
    if (!event.target.closest(".os-desktop-stage,.os-taskbar")) return;
    event.preventDefault();
    showMenu(event, item?.dataset.osApp || "", item ? (taskbar ? "taskbar" : "desktop") : "desktop");
  });
  desktop.addEventListener("click", (event) => {
    if (event.target.closest("[data-os-context-menu]")) {
      const accent = event.target.closest("[data-os-accent]")?.dataset.osAccent;
      if (accent) {
        state.desktopAccent = accent;
        saveDesktopSettings();
        applyDesktopAppearance();
        hideMenu();
        return;
      }
      const actionButton = event.target.closest("[data-os-context-action]");
      if (!actionButton) return;
      const action = actionButton.dataset.osContextAction;
      const id = actionButton.dataset.osApp;
      if (action === "wallpaper") desktop.querySelector("[data-os-wallpaper-input]")?.click();
      if (action === "clear-wallpaper") { state.desktopWallpaper = ""; saveDesktopSettings(); applyDesktopAppearance(); }
      if (action === "add-desktop" && osAppIds.includes(id) && !state.desktopShortcuts.includes(id)) state.desktopShortcuts.push(id);
      if (action === "remove-desktop") state.desktopShortcuts = state.desktopShortcuts.filter((item) => item !== id);
      if (action === "pin" && osAppIds.includes(id) && !state.taskbarShortcuts.includes(id)) state.taskbarShortcuts.push(id);
      if (action === "unpin") state.taskbarShortcuts = state.taskbarShortcuts.filter((item) => item !== id);
      if (action === "open") {
        const app = osApps().find((item) => item.id === id);
        if (app) { openOSWindow(id, app.view); hideMenu(); return; }
      }
      if (["add-desktop", "remove-desktop", "pin", "unpin"].includes(action)) { saveDesktopSettings(); refreshDesktopShortcuts(); hideMenu(); return; }
      hideMenu();
      return;
    }
    if (!event.target.closest("[data-os-context-menu]")) hideMenu();
  });
  desktop.addEventListener("click", (event) => {
    const button = event.target.closest("[data-welcome-action]");
    if (!button || event.target.closest("[data-os-context-menu]")) return;
    if (button.classList.contains("os-desktop-launcher")) {
      if (button.dataset.dragged === "true") { delete button.dataset.dragged; return; }
      desktop.querySelectorAll(".os-desktop-launcher").forEach((icon) => {
        const selected = icon === button && event.detail !== 0;
        icon.classList.toggle("is-selected", selected);
        icon.setAttribute("aria-pressed", String(selected));
      });
      if (event.detail !== 0 && event.detail < 2) return;
    }
    const mode = button.dataset.gameMode;
    if (button.dataset.welcomeView === "welcome") {
      desktop.querySelector("[data-os-start-menu]")?.setAttribute("hidden", "");
      return;
    }
    const appId = mode === "danmaku" ? "hell" : mode === "cometfall" ? "comet" : button.dataset.osApp || "rank";
    if (button.classList.contains("os-taskbar-launcher")) {
      const running = state.osWindows.filter((item) => item.appId === appId).sort((a, b) => b.zIndex - a.zIndex)[0];
      if (running) {
        running.minimized = false;
        running.zIndex = ++state.osWindowSequence + 10;
        const element = [...desktop.querySelectorAll("[data-os-window-id]")].find((item) => item.dataset.osWindowId === running.id);
        element?.classList.remove("is-minimized");
        if (element) element.style.zIndex = running.zIndex;
        desktop.querySelector("[data-os-start-menu]")?.setAttribute("hidden", "");
        return;
      }
    }
    openOSWindow(appId, button.dataset.welcomeView || "");
    desktop.querySelector("[data-os-start-menu]")?.setAttribute("hidden", "");
  });
  desktop.querySelector(".os-start-button")?.addEventListener("click", () => {
    const menu = desktop.querySelector("[data-os-start-menu]");
    if (menu) menu.hidden = !menu.hidden;
  });
  desktop.addEventListener("change", (event) => {
    if (!event.target.matches("[data-os-accent-picker]")) return;
    state.desktopAccent = event.target.value;
    saveDesktopSettings();
    applyDesktopAppearance();
  });
  desktop.querySelector("[data-os-wallpaper-input]")?.addEventListener("change", async (event) => {
    try {
      state.desktopWallpaper = await imageFileAsDataUrl(event.target.files?.[0]);
      if (saveDesktopSettings()) applyDesktopAppearance();
    } catch (error) { notify(error.message); }
    event.target.value = "";
  });
  desktop.addEventListener("pointerdown", (event) => {
    const button = event.target.closest(".os-desktop-icons .os-desktop-launcher");
    if (!button || event.button !== 0 || !stage) return;
    const startX = event.clientX;
    const startY = event.clientY;
    const originX = button.offsetLeft;
    const originY = button.offsetTop;
    let moved = false;
    button.setPointerCapture(event.pointerId);
    const move = (pointerEvent) => {
      const dx = pointerEvent.clientX - startX;
      const dy = pointerEvent.clientY - startY;
      if (!moved && Math.hypot(dx, dy) < 5) return;
      moved = true;
      pointerEvent.preventDefault();
      const metrics = desktopGridMetrics(stage);
      const maxX = Math.max(metrics.padX, stage.clientWidth - metrics.width - metrics.padX);
      const maxY = Math.max(metrics.padY, stage.clientHeight - metrics.height - metrics.padY);
      button.style.left = `${Math.min(maxX, Math.max(metrics.padX, originX + dx))}px`;
      button.style.top = `${Math.min(maxY, Math.max(metrics.padY, originY + dy))}px`;
      button.dataset.dragged = "true";
    };
    const finish = () => {
      button.removeEventListener("pointermove", move);
      button.removeEventListener("pointerup", finish);
      button.removeEventListener("pointercancel", finish);
      if (!moved) return;
      arrangeDesktopIcons(stage, button.dataset.osApp);
      saveDesktopSettings();
    };
    button.addEventListener("pointermove", move);
    button.addEventListener("pointerup", finish);
    button.addEventListener("pointercancel", finish);
  });
}

function bindProfileGate() {
  const form = elements.app.querySelector("[data-os-profile-form]");
  if (!form) return;
  const fileInput = form.querySelector("[name=picture]");
  (form.querySelector("[name=displayName]") || form.querySelector("[name=password]"))?.focus();
  fileInput?.addEventListener("change", async () => {
    try {
      state.desktopProfilePictureDraft = await imageFileAsDataUrl(fileInput.files?.[0]);
      form.closest(".os-profile-card")?.querySelector(".os-profile-mark")?.replaceChildren(Object.assign(new Image(), { src: state.desktopProfilePictureDraft, alt: "" }));
    } catch (error) {
      const errorElement = form.querySelector("[data-os-profile-error]");
      if (errorElement) errorElement.textContent = error.message;
    }
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const errorElement = form.querySelector("[data-os-profile-error]");
    const submit = form.querySelector("[type=submit]");
    if (errorElement) errorElement.textContent = "";
    submit.disabled = true;
    try {
      const data = new FormData(form);
      const password = String(data.get("password") || "");
      if (!crypto?.subtle) throw new Error("Secure password verification is unavailable in this environment.");
      if (state.desktopProfile?.salt && state.desktopProfile?.hash) {
        const hash = await profilePasswordHash(password, state.desktopProfile.salt);
        if (hash !== state.desktopProfile.hash) throw new Error(state.language === "pt" ? "Senha incorreta." : "Incorrect password.");
      } else {
        const name = String(data.get("displayName") || "").trim();
        if (name.length < 2) throw new Error(state.language === "pt" ? "O nome precisa ter pelo menos 2 caracteres." : "Name must have at least 2 characters.");
        const saltBytes = crypto.getRandomValues(new Uint8Array(16));
        const salt = [...saltBytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
        state.desktopProfile = { name, picture: state.desktopProfilePictureDraft, salt, hash: await profilePasswordHash(password, salt) };
        if (!saveStorage("mcsr-desktop-profile", state.desktopProfile)) throw new Error("Could not save the profile on this device.");
      }
      state.desktopProfileUnlocked = true;
      state.desktopProfilePictureDraft = "";
      render();
    } catch (error) {
      if (errorElement) errorElement.textContent = error.message || "Could not unlock this profile.";
      submit.disabled = false;
    }
  });
}

function bindRuntimeWindowControls() {
  const runtime = elements.app.querySelector(".os-runtime");
  const windowElement = runtime?.querySelector(".os-runtime-window");
  if (!runtime || !windowElement) return;
  const maximizeButton = runtime.querySelector('[data-os-window-action="maximize"]');
  runtime.querySelectorAll("[data-os-window-action]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    const action = button.dataset.osWindowAction;
    if (action === "close") {
      state.osWindowMinimized = false;
      state.osWindowMaximized = false;
      state.osWindowPosition = null;
      setView("welcome");
      return;
    }
    if (action === "minimize") {
      state.osWindowMinimized = true;
      windowElement.classList.add("is-minimized");
      return;
    }
    if (action === "maximize") {
      state.osWindowMaximized = !state.osWindowMaximized;
      windowElement.classList.toggle("is-maximized", state.osWindowMaximized);
      maximizeButton?.setAttribute("aria-pressed", String(state.osWindowMaximized));
    }
  }));
  const titlebar = runtime.querySelector("[data-os-window-drag-handle]");
  titlebar?.addEventListener("dblclick", (event) => {
    if (event.target.closest("button") || state.osWindowMinimized) return;
    state.osWindowMaximized = !state.osWindowMaximized;
    windowElement.classList.toggle("is-maximized", state.osWindowMaximized);
    maximizeButton?.setAttribute("aria-pressed", String(state.osWindowMaximized));
  });
  titlebar?.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.target.closest("button") || state.osWindowMaximized || state.osWindowMinimized) return;
    const runtimeBounds = runtime.getBoundingClientRect();
    const windowBounds = windowElement.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const originX = windowBounds.left - runtimeBounds.left;
    const originY = windowBounds.top - runtimeBounds.top;
    let moved = false;
    titlebar.setPointerCapture(event.pointerId);
    const move = (pointerEvent) => {
      const dx = pointerEvent.clientX - startX;
      const dy = pointerEvent.clientY - startY;
      if (!moved && Math.hypot(dx, dy) < 4) return;
      moved = true;
      pointerEvent.preventDefault();
      const maxX = Math.max(0, runtimeBounds.width - Math.min(windowBounds.width, 320));
      const maxY = Math.max(0, runtimeBounds.height - 62 - 42);
      const x = Math.min(maxX, Math.max(0, originX + dx));
      const y = Math.min(maxY, Math.max(0, originY + dy));
      windowElement.style.left = `${x}px`;
      windowElement.style.top = `${y}px`;
      windowElement.style.right = "auto";
      windowElement.style.bottom = "auto";
      windowElement.style.width = `${windowBounds.width}px`;
      windowElement.style.height = `${windowBounds.height}px`;
    };
    const finish = () => {
      titlebar.removeEventListener("pointermove", move);
      titlebar.removeEventListener("pointerup", finish);
      titlebar.removeEventListener("pointercancel", finish);
      if (!moved) return;
      state.osWindowPosition = { x: windowElement.offsetLeft, y: windowElement.offsetTop, width: windowElement.offsetWidth, height: windowElement.offsetHeight };
    };
    titlebar.addEventListener("pointermove", move);
    titlebar.addEventListener("pointerup", finish);
    titlebar.addEventListener("pointercancel", finish);
  });
}

function render() {
  state.gameCleanup?.();
  state.gameCleanup = null;
  if (!isOsFrame) state.view = "welcome";
  else if (state.view === "welcome") state.view = osFrameApp === "rank" ? "rankings" : "game";
  applySettings();
  updateLanguage();
  document.querySelectorAll(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.view === state.view));
  elements.watchCount.textContent = state.favorites.length || "";
  if (state.view === "welcome") elements.app.innerHTML = welcomePage();
  else if (state.view === "rankings") elements.app.innerHTML = rankPage();
  else if (state.view === "profile") elements.app.innerHTML = profilePage(false);
  else if (state.view === "history") elements.app.innerHTML = profilePage(true);
  else if (state.view === "compare") elements.app.innerHTML = comparisonPage();
  else if (state.view === "watchlist") elements.app.innerHTML = favoritesPage();
  else if (state.view === "tournaments") elements.app.innerHTML = tournamentsPage();
  else if (state.view === "game") {
    const labels = ["STARFALL", "DANMAKU"];
    const danmaku = state.arcadeMode === "danmaku";
    const controlsButton = `<button type="button" class="arcade-keybind-button" data-keybinds-open>⌘ ${state.language === "pt" ? "CONTROLES" : state.language === "es" ? "CONTROLES" : "CONTROLS"}</button>`;
    const modebar = isOsFrame ? `<nav class="arcade-modebar" aria-label="${state.language === "pt" ? "Controles do jogo" : state.language === "es" ? "Controles del juego" : "Game controls"}">${controlsButton}</nav>` : `<nav class="arcade-modebar" aria-label="Arcade game modes"><button type="button" data-arcade-mode="cometfall" class="${danmaku ? "" : "selected"}" aria-pressed="${!danmaku}"><span>01</span>${labels[0]}</button><button type="button" data-arcade-mode="danmaku" class="${danmaku ? "selected" : ""}" aria-pressed="${danmaku}"><span>02</span>${labels[1]}</button>${controlsButton}</nav>`;
    elements.app.innerHTML = `<div class="arcade-page">${modebar}${keybindMenuMarkup(state.language)}<div class="arcade-game-slot" data-arcade-slot>${danmaku ? danmakuMarkup(state.language) : meteorGameMarkup(state.language)}</div></div>`;
  }
  else elements.app.innerHTML = settingsPage();
  if (!isOsFrame) {
    elements.app.querySelector(".os-desktop")?.insertAdjacentHTML("beforeend", `${osStartMenuMarkup()}${desktopContextMenuMarkup()}<input data-os-wallpaper-input type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden>`);
  }
  if (!isOsFrame && !state.desktopProfileUnlocked) {
    elements.app.querySelector(".os-desktop,.os-runtime")?.setAttribute("inert", "");
    elements.app.insertAdjacentHTML("beforeend", profileGateMarkup());
  }
  if (isOsFrame && state.view === "game" && state.desktopProfileUnlocked) {
    const slot = elements.app.querySelector("[data-arcade-slot]");
    let mode = state.arcadeMode;
    let cleanup = mode === "danmaku" ? mountDanmaku(slot, state.language) : mountMeteorGame(slot, state.language);
    const keybindCleanup = mountKeybindMenu(elements.app.querySelector(".arcade-page"), state.language);
    elements.app.querySelectorAll("[data-arcade-mode]").forEach((button) => button.addEventListener("click", () => {
      const next = button.dataset.arcadeMode;
      if (next === mode) return;
      cleanup?.(); mode = next; state.arcadeMode = next;
      const osTitle = elements.app.querySelector(".os-window-titlebar > strong");
      if (osTitle) osTitle.textContent = mode === "danmaku" ? "DANMAKU" : "Starfall";
      elements.app.querySelectorAll("[data-arcade-mode]").forEach((item) => { const active = item === button; item.classList.toggle("selected", active); item.setAttribute("aria-pressed", String(active)); });
      slot.innerHTML = mode === "danmaku" ? danmakuMarkup(state.language) : meteorGameMarkup(state.language);
      cleanup = mode === "danmaku" ? mountDanmaku(slot, state.language) : mountMeteorGame(slot, state.language);
    }));
    state.gameCleanup = () => { cleanup?.(); keybindCleanup?.(); };
  }
  if (state.view === "watchlist" && state.favorites.length) loadFavoriteSummaries();
  bindPageEvents();
  bindDesktopInteractions();
  bindProfileGate();
  bindSkinErrors();
}

function setView(view) {
  state.view = view;
  if (view === "welcome") {
    state.osWindowMinimized = false;
    state.osWindowMaximized = false;
    state.osWindowPosition = null;
  } else {
    state.osWindowMinimized = false;
  }
  location.hash = view === "profile" && state.profileName
    ? `/profile/${encodeURIComponent(state.profileName)}`
    : `/${view}`;
  setError("");
  render();
  if ((view === "profile" || view === "history") && state.profileName && !state.profile) loadProfile(state.profileName);
  else if (view === "rankings" && !state.rankingRows.length) loadRankings();
}

async function loadRankings() {
  const requestId = ++state.rankRequestId;
  if (state.view === "rankings") setLoading(true);
  setError("");
  const season = seasonParam();
  try {
    if (state.ranking === "weekly") {
      const weeklyData = await apiGet(state.weeklyId ? `/weekly-race/${state.weeklyId}` : "/weekly-race");
      if (requestId !== state.rankRequestId) return;
      state.weeklyData = weeklyData;
      state.latestWeeklyId ||= state.weeklyData.id;
      state.rankingRows = state.weeklyData.leaderboard || [];
    } else {
      const common = { season };
      let data;
      if (state.ranking === "elo") {
        common.country = state.country || undefined;
        data = await apiGet(`/leaderboard${queryString(common)}`);
        if (requestId !== state.rankRequestId) return;
        state.currentSeason = data.season.number;
        state.rankingRows = data.users || [];
      } else if (state.ranking === "points") {
        common.country = state.country || undefined;
        if (state.predicted) common.predicted = true;
        data = await apiGet(`/phase-leaderboard${queryString(common)}`);
        if (requestId !== state.rankRequestId) return;
        state.currentSeason = data.phase.season;
        state.weeklyData = { phase: data.phase };
        state.rankingRows = data.users || [];
      } else {
        common.distinct = state.distinct;
        if (state.season === "all") delete common.season;
        else if (state.season === 0) common.season = 0;
        data = await apiGet(`/record-leaderboard${queryString(common)}`);
        if (requestId !== state.rankRequestId) return;
        state.rankingRows = Array.isArray(data) ? data : [];
      }
    }
    setError("");
  } catch (error) {
    if (requestId !== state.rankRequestId) return;
    setError(error.message || t("networkError"));
  } finally {
    if (requestId === state.rankRequestId) {
      setLoading(false);
      if (state.view === "rankings") render();
    }
  }
}

async function loadProfile(name) {
  const username = String(name || "").trim();
  if (!username) {
    setError(t("noUsername"));
    render();
    return;
  }
  state.profileName = username;
  location.hash = `/profile/${encodeURIComponent(username)}`;
  writePreference("mcsr-profile", username);
  state.profile = null;
  state.profileMatches = [];
  state.profilePbMedia = null;
  state.profilePbMediaLoading = false;
  state.profileSeasons = null;
  state.profileError = "";
  const requestId = ++state.profileRequestId;
  setError("");
  setLoading(true);
  render();

  const seasonQuery = queryString({ season: seasonParam() });
  const matchesPath = `/users/${encodeURIComponent(username)}/matches`;
  const [profileResult, matchesResult, seasonsResult] = await Promise.allSettled([
    apiGet(`/users/${encodeURIComponent(username)}${seasonQuery}`),
    Promise.allSettled([
      apiGet(`${matchesPath}${queryString({ count: 100, season: seasonParam(), type: 2 })}`),
      apiGet(`${matchesPath}${queryString({ count: 100, season: seasonParam(), type: 3 })}`),
      apiGet(`${matchesPath}${queryString({ count: 100, season: seasonParam() })}`)
    ]),
    apiGet(`/users/${encodeURIComponent(username)}/seasons`)
  ]);

  if (requestId !== state.profileRequestId) return;
  if (profileResult.status === "fulfilled") {
    state.profile = profileResult.value;
  } else {
    setError(profileResult.reason.message);
  }
  if (matchesResult.status === "fulfilled") {
    const available = matchesResult.value.filter((result) => result.status === "fulfilled").flatMap((result) => result.value || []);
    const unique = new Map(available.map((match) => [String(match.id), match]));
    state.profileMatches = [...unique.values()].sort((first, second) => Number(second.date || 0) - Number(first.date || 0));
    if (!state.profileMatches.length && matchesResult.value.every((result) => result.status === "rejected")) {
      state.profileError = `${t("matchesUnavailable")}: ${matchesResult.value[0].reason.message}`;
    }
  } else {
    state.profileError = `${t("matchesUnavailable")}: ${matchesResult.reason.message}`;
  }
  if (seasonsResult.status === "fulfilled") {
    state.profileSeasons = seasonsResult.value;
  } else {
    const seasonsError = `${t("seasonsUnavailable")}: ${seasonsResult.reason.message}`;
    state.profileError = state.profileError ? `${state.profileError}\n${seasonsError}` : seasonsError;
  }
  setLoading(false);
  render();
  if (state.profile) void loadProfilePbMedia(state.profile, requestId);
}

async function loadComparison(formData) {
  const firstName = String(formData.get("first") || "").trim();
  const secondName = String(formData.get("second") || "").trim();
  if (!firstName || !secondName) return;
  state.comparison = { names: [firstName, secondName], loading: true };
  const requestId = ++state.comparisonRequestId;
  setError("");
  render();
  const season = seasonParam();
  const path = `/users/${encodeURIComponent(firstName)}/versus/${encodeURIComponent(secondName)}`;
  const [result, matches] = await Promise.allSettled([
    apiGet(`${path}${queryString({ season })}`),
    apiGet(`${path}/matches${queryString({ count: 20, season })}`)
  ]);
  if (requestId !== state.comparisonRequestId) return;
  if (result.status === "fulfilled") {
    state.comparison = {
      names: [firstName, secondName],
      result: result.value,
      matches: matches.status === "fulfilled" ? matches.value : []
    };
    if (matches.status === "rejected") setError(matches.reason.message);
  } else {
    state.comparison = { names: [firstName, secondName], loading: false };
    setError(result.reason.message);
  }
  render();
}

async function loadFavoriteSummaries() {
  const container = document.querySelector("#favorite-list");
  if (!container || container.dataset.loaded) return;
  container.dataset.loaded = "true";
  const summaries = await Promise.allSettled(state.favorites.map((name) => apiGet(`/users/${encodeURIComponent(name)}`)));
  if (!document.querySelector("#favorite-list")) return;
  const cards = summaries.map((summary, index) => {
    const name = state.favorites[index];
    const profile = summary.status === "fulfilled" ? summary.value : null;
    return `<button class="favorite-card" data-player="${esc(name)}">${avatarMarkup(profile || { nickname: name })}<strong>${esc(profile?.nickname || name)}</strong><span class="favorite-rating">${profile ? `${Number(profile.eloRate || 0).toLocaleString()} ELO` : "—"}</span><small>${profile?.eloRank ? `#${profile.eloRank}` : esc(summary.status === "rejected" ? summary.reason.message : t("openProfile"))}</small></button>`;
  });
  container.innerHTML = cards.join("");
  bindSkinErrors();
}

async function showMatch(matchId) {
  try {
    const match = await apiGet(`/matches/${encodeURIComponent(matchId)}`);
    const players = (match.players || []).map((player) => `<span class="detail-player"><strong>${esc(player.nickname)}</strong><small>${Number(player.eloRate || 0).toLocaleString()} ELO</small></span>`).join("");
    const vod = match.vod?.[0]?.url;
    elements.dialog.innerHTML = `<header class="dialog-header"><div><span class="section-kicker">MATCH #${esc(match.id)}</span><h2>${esc(t("matchDetails"))}</h2></div><button class="icon-button" data-action="close-dialog">×</button></header><div class="dialog-body"><div class="detail-players">${players}</div><div class="detail-grid"><span>${esc(t("date"))}</span><strong>${esc(formatDate(match.date, localeCode()))}</strong><span>${esc(t("time"))}</span><strong>${formatDuration(match.result?.time)}</strong><span>${esc(t("result"))}</span><strong>${esc(match.category || "ANY")} · ${esc(match.forfeited ? t("forfeit") : t("ranked"))}</strong><span>${esc(t("seed"))}</span><strong>${esc(match.seedType || "—")} / ${esc(match.bastionType || "—")}</strong></div>${vod ? `<a class="primary-button vod-link" href="${esc(vod)}" target="_blank" rel="noreferrer">${esc(t("stream"))} ↗</a>` : ""}</div>`;
    const resultDetail = elements.dialog.querySelectorAll(".detail-grid strong")[2];
    if (resultDetail) resultDetail.textContent = `${match.category || "ANY"} · ${match.forfeited ? t("forfeit") : matchTypeLabel(match)}`;
    elements.dialog.showModal();
  } catch (error) {
    notify(error.message);
  }
}

async function resolveTournamentPlayers(names) {
  const knownPlayers = new Map();
  state.rankingRows.forEach((row) => {
    const player = row.user || row.player || row;
    if (player.nickname) knownPlayers.set(player.nickname.toLocaleLowerCase(), player);
  });
  if (state.profile?.nickname) knownPlayers.set(state.profile.nickname.toLocaleLowerCase(), state.profile);

  const resolved = new Array(names.length);
  const pending = [];
  names.forEach((name, index) => {
    const known = knownPlayers.get(name.toLocaleLowerCase());
    if (known?.uuid) {
      resolved[index] = known;
    } else if (/^[A-Za-z0-9_]{1,16}$/.test(name)) {
      pending.push({ name, index });
    } else {
      resolved[index] = { nickname: name };
    }
  });

  const failures = [];
  for (let start = 0; start < pending.length; start += 8) {
    const batch = pending.slice(start, start + 8);
    const results = await Promise.allSettled(batch.map(({ name }) => apiGet(`/users/${encodeURIComponent(name)}`)));
    results.forEach((result, batchIndex) => {
      const { name, index } = batch[batchIndex];
      if (result.status === "fulfilled" && result.value?.uuid) {
        resolved[index] = result.value;
      } else {
        resolved[index] = { nickname: name };
        if (result.status === "rejected") failures.push(result.reason.message || String(result.reason));
      }
    });
  }

  return {
    players: resolved.map((profile, index) => ({
      name: profile.nickname || names[index],
      uuid: profile.uuid || null,
      eloRate: profile.eloRate ?? null,
      country: profile.country || null
    })),
    failures
  };
}

function bindPageEvents() {
  document.querySelectorAll("#app [data-view]").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
  document.querySelectorAll("#app [data-action='go-back']").forEach((button) => button.addEventListener("click", () => {
    if (location.hash && window.history.length > 1) window.history.back();
    else setView("rankings");
  }));
  if (!elements.app.dataset.osMenuBound) {
    elements.app.dataset.osMenuBound = "true";
    elements.app.addEventListener("click", (event) => {
      if (event.target.closest(".os-start-menu,.os-start-button,.os-runtime-start")) return;
      const menu = elements.app.querySelector("[data-os-start-menu]");
      if (menu) menu.hidden = true;
    });
  }
  document.querySelectorAll("#app [data-match-filter]").forEach((button) => button.addEventListener("click", () => {
    state.profileMatchFilter = button.dataset.matchFilter;
    document.querySelectorAll("#app [data-match-filter]").forEach((item) => item.classList.toggle("selected", item === button));
    const selectedMatches = state.profileMatches.filter((match) => state.profileMatchFilter === "ranked"
      ? Number(match.type) === 2
      : state.profileMatchFilter === "private" ? Number(match.type) === 3 : ![2, 3].includes(Number(match.type)));
    const body = document.querySelector(".match-panel tbody");
    if (body && state.profile) {
      body.innerHTML = matchRows(selectedMatches, state.profile.uuid);
      body.querySelectorAll("[data-match]").forEach((matchButton) => matchButton.addEventListener("click", () => showMatch(matchButton.dataset.match)));
    }
    const count = document.querySelector(".match-panel .trend-period");
    if (count) count.textContent = `${selectedMatches.length} / 100`;
  }));
  const filterNav = document.querySelector(".match-history-filters");
  const matchPanelHeading = document.querySelector(".match-panel .panel-heading");
  if (filterNav && matchPanelHeading) matchPanelHeading.after(filterNav);
  const rankedTrendCount = document.querySelector(".trend-panel .trend-period");
  if (rankedTrendCount && state.profile) rankedTrendCount.textContent = `${state.profileMatches.filter((match) => Number(match.type) === 2).length} ${t("rankedHistory").toLowerCase()}`;
  const trendKicker = document.querySelector(".trend-panel .section-kicker");
  if (trendKicker) trendKicker.textContent = `${t("rankedHistory")} · ${t("lastMatches")}`;
  const initialHistoryCount = document.querySelector(".match-panel .trend-period");
  if (initialHistoryCount) {
    const selected = state.profileMatches.filter((match) => state.profileMatchFilter === "ranked"
      ? Number(match.type) === 2
      : state.profileMatchFilter === "private" ? Number(match.type) === 3 : ![2, 3].includes(Number(match.type)));
    initialHistoryCount.textContent = `${selected.length} / 100`;
  }
  document.querySelectorAll("[data-lookup-name]").forEach((button) => button.addEventListener("click", () => {
    state.profileName = button.dataset.lookupName;
    state.view = "profile";
    loadProfile(state.profileName);
  }));
  document.querySelectorAll("[data-ranking]").forEach((button) => button.addEventListener("click", () => {
    state.ranking = button.dataset.ranking;
    if (state.ranking !== "fastest" && state.season === "all") state.season = 0;
    state.country = "";
    state.roleFilter = "";
    state.search = "";
    state.sort = "rank";
    loadRankings();
  }));
  document.querySelectorAll("[data-player]").forEach((button) => button.addEventListener("click", () => {
    state.profileName = button.dataset.player;
    state.view = "profile";
    loadProfile(state.profileName);
  }));
  document.querySelectorAll("[data-action='retry']").forEach((button) => button.addEventListener("click", () => {
    if (state.view === "profile" || state.view === "history") loadProfile(state.profileName);
    else if (state.view === "compare" && state.comparison?.names) {
      const formData = new FormData();
      formData.set("first", state.comparison.names[0]);
      formData.set("second", state.comparison.names[1]);
      loadComparison(formData);
    }
    else loadRankings();
  }));

  const seasonSelect = document.querySelector("#season-filter");
  seasonSelect?.addEventListener("change", () => {
    state.season = seasonSelect.value === "all" ? "all" : Number(seasonSelect.value);
    state.country = "";
    state.roleFilter = "";
    if (state.season !== 0) state.predicted = false;
    loadRankings();
  });
  document.querySelector("#weekly-id")?.addEventListener("change", (event) => {
    const value = Number(event.currentTarget.value);
    state.weeklyId = Number.isInteger(value) && value > 0 ? value : null;
    loadRankings();
  });
  document.querySelector("#country-filter")?.addEventListener("change", (event) => {
    state.country = event.currentTarget.value;
    loadRankings();
  });
  document.querySelector("#role-filter")?.addEventListener("change", (event) => {
    state.roleFilter = event.currentTarget.value;
    render();
  });
  document.querySelector("#ranking-search")?.addEventListener("input", (event) => {
    state.search = event.currentTarget.value;
    render();
    const input = document.querySelector("#ranking-search");
    input?.focus();
    input?.setSelectionRange(state.search.length, state.search.length);
  });
  document.querySelector("#sort-filter")?.addEventListener("change", (event) => {
    state.sort = event.currentTarget.value;
    render();
  });
  document.querySelector("#predicted-filter")?.addEventListener("change", (event) => {
    state.predicted = event.currentTarget.checked;
    loadRankings();
  });
  document.querySelector("#distinct-filter")?.addEventListener("change", (event) => {
    state.distinct = event.currentTarget.checked;
    loadRankings();
  });
  document.querySelector("#profile-search-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    loadProfile(new FormData(event.currentTarget).get("name") || document.querySelector("#profile-name").value);
  });
  document.querySelector("#profile-search-form")?.querySelector("button")?.addEventListener("click", (event) => {
    event.preventDefault();
    loadProfile(document.querySelector("#profile-name").value);
  });
  document.querySelector("#compare-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    loadComparison(new FormData(event.currentTarget));
  });
  document.querySelector("#tournament-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (state.tournamentCreating) return;
    const formData = new FormData(event.currentTarget);
    const names = String(formData.get("players") || "").split(/[,\n]/).map((name) => name.trim()).filter(Boolean);
    try {
      createTournament(formData.get("name"), names, {
        bestOf: Number(formData.get("bestOf")),
        seeding: String(formData.get("seeding") || "rating")
      });
    } catch (error) {
      notify(error.message);
      return;
    }
    const submitButton = event.currentTarget.querySelector("button[type='submit']");
    state.tournamentCreating = true;
    submitButton.disabled = true;
    submitButton.textContent = t("resolvePlayers");
    try {
      const { players, failures } = await resolveTournamentPlayers(names);
      const tournament = createTournament(formData.get("name"), players, {
        bestOf: Number(formData.get("bestOf")),
        seeding: String(formData.get("seeding") || "rating")
      });
      state.tournaments.unshift(tournament);
      saveStorage("mcsr-tournaments", state.tournaments);
      state.tournamentCreating = false;
      render();
      notify(failures.length
        ? `${message("resolveWarning", { count: failures.length })} ${failures[0]}`
        : t("createTournament"));
    } catch (error) {
      state.tournamentCreating = false;
      submitButton.disabled = false;
      submitButton.textContent = `${t("create")} ↗`;
      notify(error.message);
    }
  });
  document.querySelectorAll("[data-score]").forEach((button) => button.addEventListener("click", () => {
    const tournamentIndex = state.tournaments.findIndex((entry) => entry.id === button.dataset.score);
    if (tournamentIndex === -1) return;
    try {
      state.tournaments[tournamentIndex] = updateTournamentScore(
        state.tournaments[tournamentIndex],
        Number(button.dataset.round),
        Number(button.dataset.matchIndex),
        Number(button.dataset.slot),
        Number(button.dataset.delta)
      );
      saveStorage("mcsr-tournaments", state.tournaments);
      const scrollY = window.scrollY;
      render();
      window.scrollTo(0, scrollY);
    } catch (error) {
      notify(error.message);
    }
  }));
  document.querySelectorAll("[data-undo-tournament]").forEach((button) => button.addEventListener("click", () => {
    const tournamentIndex = state.tournaments.findIndex((entry) => entry.id === button.dataset.undoTournament);
    if (tournamentIndex === -1) return;
    const tournament = state.tournaments[tournamentIndex];
    const hasLaterResults = tournament.rounds.slice(1).some((round) =>
      round.some((match) => match.winnerId && match.players?.[0] && match.players?.[1])
    );
    if (hasLaterResults && !window.confirm(t("confirmUndoResults"))) return;
    try {
      state.tournaments[tournamentIndex] = undoLastTournamentResult(tournament);
      saveStorage("mcsr-tournaments", state.tournaments);
      render();
    } catch (error) {
      notify(error.message);
    }
  }));
  document.querySelectorAll("[data-delete-tournament]").forEach((button) => button.addEventListener("click", () => {
    if (!window.confirm(t("confirmDelete"))) return;
    state.tournaments = state.tournaments.filter((entry) => entry.id !== button.dataset.deleteTournament);
    saveStorage("mcsr-tournaments", state.tournaments);
    render();
  }));
  document.querySelectorAll("[data-match]").forEach((button) => button.addEventListener("click", () => showMatch(button.dataset.match)));
  document.querySelector("[data-action='favorite']")?.addEventListener("click", (event) => {
    const name = event.currentTarget.dataset.name;
    const index = state.favorites.findIndex((favorite) => favorite.toLocaleLowerCase() === name.toLocaleLowerCase());
    if (index >= 0) state.favorites.splice(index, 1);
    else state.favorites.push(name);
    saveStorage("mcsr-favorites", state.favorites);
    render();
  });
  document.querySelectorAll("[data-theme-choice]").forEach((button) => button.addEventListener("click", () => {
    state.settings.theme = button.dataset.themeChoice;
    saveStorage("mcsr-settings", state.settings);
    render();
    notify(t("settingsSaved"));
  }));
  document.querySelectorAll("[data-setting]").forEach((input) => input.addEventListener("change", () => {
    state.settings[input.dataset.setting] = input.checked;
    saveStorage("mcsr-settings", state.settings);
    render();
    notify(t("settingsSaved"));
  }));
}

document.querySelectorAll(".nav-item").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
document.querySelector("#language-select").addEventListener("change", (event) => {
  state.language = event.currentTarget.value;
  writePreference("mcsr-language", state.language);
  render();
});
document.querySelector("#refresh-button").addEventListener("click", () => {
  if (state.view === "profile" || state.view === "history") loadProfile(state.profileName);
  else if (state.view === "compare" && state.comparison?.names) {
    const form = document.querySelector("#compare-form");
    if (form) loadComparison(new FormData(form));
  } else loadRankings();
});
document.querySelector("#match-dialog").addEventListener("click", (event) => {
  if (event.target === elements.dialog || event.target.closest("[data-action='close-dialog']")) elements.dialog.close();
});
window.addEventListener("hashchange", () => {
  if (!isOsFrame) return;
  const route = location.hash.slice(1);
  const profileName = profileNameFromHash();
  const defaultView = osFrameApp === "rank" ? osFrameView || "rankings" : "game";
  const view = profileName ? "profile" : route.slice(1) || defaultView;
  if (!["welcome", "rankings", "profile", "history", "compare", "watchlist", "tournaments", "settings", "game"].includes(view)) return;
  if (state.view === view && (!profileName || state.profileName === profileName)) return;

  state.view = view;
  if (profileName && profileName !== state.profileName) {
    state.profile = null;
    state.profileName = profileName;
  }
  render();
  if (view === "profile" && state.profileName && !state.profile) loadProfile(state.profileName);
  else if (view === "rankings" && !state.rankingRows.length) loadRankings();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName) && state.view === "rankings") {
    event.preventDefault();
    document.querySelector("#ranking-search")?.focus();
  }
});

updateLanguage();
render();
if (isOsFrame && state.view === "profile" && state.profileName) loadProfile(state.profileName);
else if (isOsFrame && state.view === "rankings") loadRankings();
