import type { ChessTournament } from "./types";

export const chessCommunity = {
  title: "Chessitos",
  schedule: "Lunes, 7:30 p.m.",
  description:
    "Comunidad de ajedrez en Salcajá. Nos reunimos cada lunes para jugar, aprender y organizar torneos.",
  image:
    "https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=1400&q=80",
  features: [
    "Torneos oficiales publicados por el restaurante",
    "Torneos casuales por link para grupos de amigos",
    "Pareos suizos y todos contra todos",
    "Resultados y tabla de posiciones desde telefono",
  ],
};

export const officialChessTournaments: ChessTournament[] = [];

export function getPublishedOfficialTournaments() {
  return officialChessTournaments.filter(
    (tournament) =>
      tournament.kind === "official" &&
      tournament.visibility === "published" &&
      !isTournamentHistorical(tournament),
  );
}

export function isTournamentHistorical(tournament: ChessTournament) {
  return (
    tournament.status === "closed" ||
    tournament.status === "cancelled" ||
    isTournamentComplete(tournament)
  );
}

export function isTournamentComplete(tournament: ChessTournament) {
  if (tournament.rounds.length < tournament.roundsPlanned) {
    return false;
  }

  const lastRound = tournament.rounds.at(-1);
  return (
    tournament.rounds.length > 0 &&
    (!lastRound ||
      lastRound.games.every((game) => game.result !== "unplayed"))
  );
}

export function getEffectiveTournamentStatus(
  tournament: ChessTournament,
): ChessTournament["status"] {
  if (tournament.status === "cancelled") {
    return "cancelled";
  }

  if (tournament.status === "closed" || isTournamentComplete(tournament)) {
    return "closed";
  }

  return tournament.status;
}

export function getActiveOfficialTournaments() {
  return officialChessTournaments.filter(
    (tournament) => tournament.kind === "official" && !isTournamentHistorical(tournament),
  );
}

export function getHistoricalOfficialTournaments() {
  return officialChessTournaments.filter(
    (tournament) => tournament.kind === "official" && isTournamentHistorical(tournament),
  );
}

export function formatTournamentSystem(system: ChessTournament["system"]) {
  return system === "swiss" ? "Sistema suizo" : "Todos contra todos";
}

export function formatTournamentStatus(status: ChessTournament["status"]) {
  const labels: Record<ChessTournament["status"], string> = {
    setup: "En preparacion",
    active: "En juego",
    closed: "Finalizado",
    cancelled: "Cancelado",
  };

  return labels[status];
}

export function formatGameResult(result: ChessTournament["rounds"][number]["games"][number]["result"]) {
  const labels: Record<
    ChessTournament["rounds"][number]["games"][number]["result"],
    string
  > = {
    white_win: "1 - 0",
    black_win: "0 - 1",
    draw: "0.5 - 0.5",
    white_forfeit: "0F - 1",
    black_forfeit: "1 - 0F",
    double_forfeit: "0F - 0F",
    bye: "BYE",
    unplayed: "Pendiente",
  };

  return labels[result];
}

export function getPlayerName(
  tournament: ChessTournament,
  playerId?: string,
) {
  if (!playerId) {
    return "BYE";
  }

  return (
    tournament.players.find((player) => player.id === playerId)?.name ??
    "Jugador no encontrado"
  );
}

export function getTournamentSummary(tournament: ChessTournament) {
  const games = tournament.rounds.flatMap((round) => round.games);
  const completedGames = games.filter((game) => game.result !== "unplayed");

  return {
    players: tournament.players.length,
    rounds: tournament.rounds.length,
    games: games.length,
    completedGames: completedGames.length,
  };
}
