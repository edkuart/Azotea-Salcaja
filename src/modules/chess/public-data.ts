import type { ChessTournament } from "./types";

export const chessCommunity = {
  title: "Ajedrez en Azotea",
  schedule: "Lunes, 7:30 p.m.",
  description:
    "Una comunidad local se reune cada lunes para jugar, aprender y organizar torneos casuales.",
  image:
    "https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=1400&q=80",
  features: [
    "Torneos oficiales publicados por el restaurante",
    "Torneos casuales por link para grupos de amigos",
    "Pareos suizos y todos contra todos",
    "Resultados y tabla de posiciones desde telefono",
  ],
};

export const officialChessTournaments: ChessTournament[] = [
  {
    id: "azotea-rapid-nocturno-1",
    kind: "official",
    visibility: "published",
    title: "Rapid nocturno de lunes",
    slug: "rapid-nocturno-lunes",
    description:
      "Torneo oficial de comunidad con ritmo rapido, pensado para jugarse durante la noche de ajedrez.",
    recap:
      "Primera noche competitiva del ciclo, con partidas rapidas y una tabla abierta tras la ronda inicial.",
    coverImage:
      "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=900&q=80",
        alt: "Tablero de ajedrez preparado para torneo",
      },
      {
        src: "https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?auto=format&fit=crop&w=900&q=80",
        alt: "Piezas de ajedrez durante una partida",
      },
      {
        src: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=900&q=80",
        alt: "Ambiente de juego de ajedrez",
      },
    ],
    system: "swiss",
    roundsPlanned: 5,
    currentRoundNumber: 2,
    status: "active",
    startsAt: "2026-06-01 19:30",
    locationLabel: "Azotea Salcajá",
    tieBreakOrder: ["points", "buchholz_cut_1", "buchholz", "wins"],
    players: [
      { id: "p1", name: "Carlos Mendez", rating: 1540, seed: 1, status: "active" },
      { id: "p2", name: "Ana Lopez", rating: 1480, seed: 2, status: "active" },
      { id: "p3", name: "Luis Garcia", rating: 1420, seed: 3, status: "active" },
      { id: "p4", name: "Sofia Perez", rating: 1390, seed: 4, status: "active" },
      { id: "p5", name: "Marco Diaz", rating: 1320, seed: 5, status: "active" },
      { id: "p6", name: "Elena Ruiz", seed: 6, status: "active" },
    ],
    rounds: [
      {
        id: "r1",
        roundNumber: 1,
        status: "completed",
        games: [
          {
            id: "g1",
            boardNumber: 1,
            whitePlayerId: "p1",
            blackPlayerId: "p6",
            result: "white_win",
            whiteScore: 1,
            blackScore: 0,
          },
          {
            id: "g2",
            boardNumber: 2,
            whitePlayerId: "p2",
            blackPlayerId: "p5",
            result: "draw",
            whiteScore: 0.5,
            blackScore: 0.5,
          },
          {
            id: "g3",
            boardNumber: 3,
            whitePlayerId: "p3",
            blackPlayerId: "p4",
            result: "black_win",
            whiteScore: 0,
            blackScore: 1,
          },
        ],
      },
      {
        id: "r2",
        roundNumber: 2,
        status: "paired",
        games: [
          {
            id: "g4",
            boardNumber: 1,
            whitePlayerId: "p4",
            blackPlayerId: "p1",
            result: "unplayed",
          },
          {
            id: "g5",
            boardNumber: 2,
            whitePlayerId: "p2",
            blackPlayerId: "p3",
            result: "unplayed",
          },
          {
            id: "g6",
            boardNumber: 3,
            whitePlayerId: "p6",
            blackPlayerId: "p5",
            result: "unplayed",
          },
        ],
      },
    ],
  },
  {
    id: "azotea-amistoso-round-robin",
    kind: "official",
    visibility: "published",
    title: "Amistoso todos contra todos",
    slug: "amistoso-todos-contra-todos",
    description:
      "Formato casual round robin para grupos pequenos que quieren jugar una vuelta completa.",
    recap:
      "Formato ideal para grupos pequenos: todos se enfrentan y la tabla final queda clara para compartir.",
    coverImage:
      "https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1523875194681-bedd468c58bf?auto=format&fit=crop&w=900&q=80",
        alt: "Piezas blancas y negras sobre el tablero",
      },
      {
        src: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?auto=format&fit=crop&w=900&q=80",
        alt: "Partida casual de ajedrez",
      },
    ],
    system: "round_robin",
    roundsPlanned: 3,
    currentRoundNumber: 0,
    status: "setup",
    startsAt: "2026-06-08 19:30",
    locationLabel: "Azotea Salcajá",
    tieBreakOrder: ["points", "sonneborn_berger", "direct_encounter", "wins"],
    players: [
      { id: "p7", name: "Invitado 1", seed: 1, status: "active" },
      { id: "p8", name: "Invitado 2", seed: 2, status: "active" },
      { id: "p9", name: "Invitado 3", seed: 3, status: "active" },
      { id: "p10", name: "Invitado 4", seed: 4, status: "active" },
    ],
    rounds: [],
  },
];

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
