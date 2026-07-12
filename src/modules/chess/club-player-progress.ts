import {
  CLUB_ELO_K,
  DEFAULT_ELO,
  computeClubRanking,
  expectedClubEloScore,
  isClubRankedFinished,
  pointsForPosition,
} from "./club-ranking";
import { getGameScores } from "./scoring";
import { calculateStandings } from "./standings";
import type { ChessGame, ChessTournament, ClubPlayer } from "./types";

type ClubLink = {
  clubPlayerId: string;
  player: ClubPlayer;
};

type GameResultLabel = "win" | "draw" | "loss" | "bye" | "forfeit" | "unplayed";

export type ClubPlayerEloPoint = {
  tournamentId: string;
  tournamentSlug: string;
  tournamentTitle: string;
  startsAt: string;
  elo: number;
  eloDelta: number;
  gamesRated: number;
};

export type ClubPlayerGameProgress = {
  tournamentId: string;
  tournamentSlug: string;
  tournamentTitle: string;
  startsAt: string;
  roundNumber: number;
  boardNumber: number;
  color: "white" | "black";
  opponentName: string;
  opponentClubPlayerId?: string;
  result: GameResultLabel;
  ratedForElo: boolean;
  eloBefore: number;
  eloAfter: number;
  eloDelta: number;
};

export type ClubPlayerTournamentProgress = {
  tournamentId: string;
  tournamentSlug: string;
  tournamentTitle: string;
  startsAt: string;
  position: number;
  participants: number;
  points: number;
  circuitPoints: number;
  wins: number;
  draws: number;
  losses: number;
  byes: number;
  gamesRated: number;
  eloBefore: number;
  eloAfter: number;
  eloDelta: number;
};

export type ClubPlayerProgressGoal = {
  kind:
    | "first_tournament"
    | "rated_games"
    | "recover_peak"
    | "keep_playing"
    | "new_peak";
  label: string;
  current: number;
  target: number;
  remaining: number;
};

export type ClubPlayerProgress = {
  player: ClubPlayer;
  currentElo: number;
  baseElo: number;
  eloDelta: number;
  peakElo: number;
  lowestElo: number;
  eloGames: number;
  tournamentsPlayed: number;
  tournamentWins: number;
  lifetimePoints: number;
  lastPlayedAt?: string;
  resultTotals: {
    wins: number;
    draws: number;
    losses: number;
    byes: number;
  };
  activity: {
    tournaments30d: number;
    tournaments90d: number;
    tournaments365d: number;
  };
  streaks: {
    current: number;
    best: number;
  };
  bestMarks: {
    bestPosition?: number;
    bestTournamentTitle?: string;
    bestTournamentStartsAt?: string;
    bestTournamentEloGain: number;
  };
  eloSeries: ClubPlayerEloPoint[];
  tournaments: ClubPlayerTournamentProgress[];
  games: ClubPlayerGameProgress[];
  goal: ClubPlayerProgressGoal;
};

const ELO_RESULTS: Record<string, [number, number]> = {
  white_win: [1, 0],
  black_win: [0, 1],
  draw: [0.5, 0.5],
};

function normalizeName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function tournamentSort(a: ChessTournament, b: ChessTournament) {
  return (
    (a.startsAt ?? "").localeCompare(b.startsAt ?? "") ||
    a.id.localeCompare(b.id)
  );
}

function dateTime(value?: string) {
  const raw = value?.slice(0, 10);
  const time = raw ? new Date(`${raw}T00:00:00`).getTime() : Number.NaN;
  return Number.isNaN(time) ? undefined : time;
}

function resultLabel(
  game: ChessGame,
  color: "white" | "black",
): GameResultLabel {
  if (game.result === "unplayed") return "unplayed";
  if (game.isBye || game.result === "bye") return "bye";
  if (game.result.includes("forfeit")) return "forfeit";

  const { whiteScore, blackScore } = getGameScores(game);
  const own = color === "white" ? whiteScore : blackScore;
  const opponent = color === "white" ? blackScore : whiteScore;
  if (own > opponent) return "win";
  if (own === opponent) return "draw";
  return "loss";
}

function buildClubLinks(
  tournament: ChessTournament,
  clubPlayers: ClubPlayer[],
) {
  const byId = new Map(clubPlayers.map((player) => [player.id, player]));
  const byName = new Map(
    clubPlayers.map((player) => [normalizeName(player.name), player]),
  );
  const links = new Map<string, ClubLink>();

  for (const tournamentPlayer of tournament.players) {
    const player =
      (tournamentPlayer.clubPlayerId &&
        byId.get(tournamentPlayer.clubPlayerId)) ||
      byName.get(normalizeName(tournamentPlayer.name));
    if (player) {
      links.set(tournamentPlayer.id, { clubPlayerId: player.id, player });
    }
  }

  return links;
}

function createGoal(progress: {
  currentElo: number;
  peakElo: number;
  eloGames: number;
  tournamentsPlayed: number;
}): ClubPlayerProgressGoal {
  if (progress.tournamentsPlayed === 0) {
    return {
      kind: "first_tournament",
      label: "Jugar su primer torneo del club para activar historial.",
      current: 0,
      target: 1,
      remaining: 1,
    };
  }

  if (progress.eloGames < 10) {
    return {
      kind: "rated_games",
      label:
        "Llegar a 10 partidas valoradas para consolidar su primera muestra.",
      current: progress.eloGames,
      target: 10,
      remaining: 10 - progress.eloGames,
    };
  }

  if (progress.currentElo < progress.peakElo) {
    const remaining = progress.peakElo - progress.currentElo;
    return {
      kind: "recover_peak",
      label: `Recuperar su mejor ELO histórico (${progress.peakElo}).`,
      current: progress.currentElo,
      target: progress.peakElo,
      remaining,
    };
  }

  return {
    kind: "new_peak",
    label: "Buscar una nueva mejor marca personal de ELO.",
    current: progress.currentElo,
    target: progress.currentElo + 25,
    remaining: 25,
  };
}

export function computeClubPlayerProgress(
  tournaments: ChessTournament[],
  clubPlayers: ClubPlayer[],
  clubPlayerId: string,
  now = new Date(),
): ClubPlayerProgress | null {
  const player = clubPlayers.find((entry) => entry.id === clubPlayerId);
  if (!player) return null;

  const baseElo = player.rating ?? DEFAULT_ELO;
  const currentEloByClubId = new Map(
    clubPlayers.map((entry) => [entry.id, entry.rating ?? DEFAULT_ELO]),
  );
  const counted = tournaments.filter(isClubRankedFinished).sort(tournamentSort);

  const eloSeries: ClubPlayerEloPoint[] = [];
  const tournamentProgress: ClubPlayerTournamentProgress[] = [];
  const gameProgress: ClubPlayerGameProgress[] = [];

  let peakElo = baseElo;
  let lowestElo = baseElo;
  let eloGames = 0;
  let currentStreak = 0;
  let bestStreak = 0;
  let runningStreak = 0;
  let lastPlayedAt: string | undefined;
  let bestPosition: number | undefined;
  let bestTournamentTitle: string | undefined;
  let bestTournamentStartsAt: string | undefined;
  let bestTournamentEloGain = Number.NEGATIVE_INFINITY;

  for (const tournament of counted) {
    const links = buildClubLinks(tournament, clubPlayers);
    const targetTournamentPlayer = tournament.players.find(
      (tournamentPlayer) => {
        const link = links.get(tournamentPlayer.id);
        return link?.clubPlayerId === clubPlayerId;
      },
    );

    const targetEloBeforeTournament =
      currentEloByClubId.get(clubPlayerId) ?? baseElo;
    let targetRatedGamesInTournament = 0;

    for (const round of tournament.rounds) {
      for (const game of round.games) {
        const scores = ELO_RESULTS[game.result];
        const whiteLink = game.whitePlayerId
          ? links.get(game.whitePlayerId)
          : undefined;
        const blackLink = game.blackPlayerId
          ? links.get(game.blackPlayerId)
          : undefined;
        const whiteTournamentPlayer = tournament.players.find(
          (entry) => entry.id === game.whitePlayerId,
        );
        const blackTournamentPlayer = tournament.players.find(
          (entry) => entry.id === game.blackPlayerId,
        );

        const targetColor =
          whiteLink?.clubPlayerId === clubPlayerId
            ? "white"
            : blackLink?.clubPlayerId === clubPlayerId
              ? "black"
              : null;
        const targetEloBeforeGame =
          currentEloByClubId.get(clubPlayerId) ?? baseElo;

        if (scores && game.whitePlayerId && game.blackPlayerId) {
          const whiteRating = whiteLink
            ? (currentEloByClubId.get(whiteLink.clubPlayerId) ?? DEFAULT_ELO)
            : (whiteTournamentPlayer?.rating ?? DEFAULT_ELO);
          const blackRating = blackLink
            ? (currentEloByClubId.get(blackLink.clubPlayerId) ?? DEFAULT_ELO)
            : (blackTournamentPlayer?.rating ?? DEFAULT_ELO);

          if (whiteLink) {
            currentEloByClubId.set(
              whiteLink.clubPlayerId,
              whiteRating +
                CLUB_ELO_K *
                  (scores[0] - expectedClubEloScore(whiteRating, blackRating)),
            );
          }
          if (blackLink) {
            currentEloByClubId.set(
              blackLink.clubPlayerId,
              blackRating +
                CLUB_ELO_K *
                  (scores[1] - expectedClubEloScore(blackRating, whiteRating)),
            );
          }
        }

        if (!targetColor) continue;

        const targetEloAfterGame =
          currentEloByClubId.get(clubPlayerId) ?? targetEloBeforeGame;
        const opponentPlayer =
          targetColor === "white"
            ? blackTournamentPlayer
            : whiteTournamentPlayer;
        const opponentLink = targetColor === "white" ? blackLink : whiteLink;
        const ratedForElo = Boolean(
          scores && game.whitePlayerId && game.blackPlayerId,
        );

        if (ratedForElo) {
          eloGames += 1;
          targetRatedGamesInTournament += 1;
        }

        gameProgress.push({
          tournamentId: tournament.id,
          tournamentSlug: tournament.slug,
          tournamentTitle: tournament.title,
          startsAt: tournament.startsAt,
          roundNumber: round.roundNumber,
          boardNumber: game.boardNumber,
          color: targetColor,
          opponentName: opponentPlayer?.name ?? "Rival del torneo",
          opponentClubPlayerId: opponentLink?.clubPlayerId,
          result: resultLabel(game, targetColor),
          ratedForElo,
          eloBefore: Math.round(targetEloBeforeGame),
          eloAfter: Math.round(targetEloAfterGame),
          eloDelta:
            Math.round(targetEloAfterGame) - Math.round(targetEloBeforeGame),
        });
      }
    }

    if (!targetTournamentPlayer) {
      runningStreak = 0;
      continue;
    }

    const standings = calculateStandings(tournament);
    const standingIndex = standings.findIndex(
      (standing) => standing.playerId === targetTournamentPlayer.id,
    );
    const standing = standingIndex >= 0 ? standings[standingIndex] : undefined;
    if (!standing || (standing.played === 0 && standing.byes === 0)) {
      runningStreak = 0;
      continue;
    }

    const targetEloAfterTournament =
      currentEloByClubId.get(clubPlayerId) ?? baseElo;
    const roundedEloAfterTournament = Math.round(targetEloAfterTournament);
    const roundedEloBeforeTournament = Math.round(targetEloBeforeTournament);
    const eloDelta = roundedEloAfterTournament - roundedEloBeforeTournament;

    peakElo = Math.max(peakElo, roundedEloAfterTournament);
    lowestElo = Math.min(lowestElo, roundedEloAfterTournament);
    lastPlayedAt = tournament.startsAt;
    runningStreak += 1;
    bestStreak = Math.max(bestStreak, runningStreak);

    const position = standingIndex + 1;
    if (!bestPosition || position < bestPosition) {
      bestPosition = position;
      bestTournamentTitle = tournament.title;
      bestTournamentStartsAt = tournament.startsAt;
    }
    if (eloDelta > bestTournamentEloGain) {
      bestTournamentEloGain = eloDelta;
    }

    const circuitPoints = pointsForPosition(standingIndex);
    tournamentProgress.push({
      tournamentId: tournament.id,
      tournamentSlug: tournament.slug,
      tournamentTitle: tournament.title,
      startsAt: tournament.startsAt,
      position,
      participants: standings.length,
      points: standing.points,
      circuitPoints,
      wins: standing.wins,
      draws: standing.draws,
      losses: standing.losses,
      byes: standing.byes,
      gamesRated: targetRatedGamesInTournament,
      eloBefore: roundedEloBeforeTournament,
      eloAfter: roundedEloAfterTournament,
      eloDelta,
    });

    eloSeries.push({
      tournamentId: tournament.id,
      tournamentSlug: tournament.slug,
      tournamentTitle: tournament.title,
      startsAt: tournament.startsAt,
      elo: roundedEloAfterTournament,
      eloDelta,
      gamesRated: targetRatedGamesInTournament,
    });
  }

  currentStreak = runningStreak;

  const rankingEntry = computeClubRanking(tournaments, clubPlayers).find(
    (entry) => entry.player.id === clubPlayerId,
  );
  const currentElo =
    rankingEntry?.elo ??
    Math.round(currentEloByClubId.get(clubPlayerId) ?? baseElo);
  const nowTime = now.getTime();
  const activityCount = (days: number) =>
    tournamentProgress.filter((entry) => {
      const time = dateTime(entry.startsAt);
      if (time === undefined) return false;
      return nowTime - time <= days * 86_400_000 && nowTime >= time;
    }).length;

  const resultTotals = tournamentProgress.reduce(
    (totals, entry) => ({
      wins: totals.wins + entry.wins,
      draws: totals.draws + entry.draws,
      losses: totals.losses + entry.losses,
      byes: totals.byes + entry.byes,
    }),
    { wins: 0, draws: 0, losses: 0, byes: 0 },
  );

  const progress = {
    player,
    currentElo,
    baseElo,
    eloDelta: currentElo - baseElo,
    peakElo: Math.max(peakElo, currentElo),
    lowestElo: Math.min(lowestElo, currentElo),
    eloGames: rankingEntry?.eloGames ?? eloGames,
    tournamentsPlayed:
      rankingEntry?.tournamentsPlayed ?? tournamentProgress.length,
    tournamentWins:
      rankingEntry?.tournamentWins ??
      tournamentProgress.filter((t) => t.position === 1).length,
    lifetimePoints:
      rankingEntry?.lifetimePoints ??
      tournamentProgress.reduce(
        (total, entry) => total + entry.circuitPoints,
        0,
      ),
    lastPlayedAt: rankingEntry?.lastPlayedAt ?? lastPlayedAt,
    resultTotals,
    activity: {
      tournaments30d: activityCount(30),
      tournaments90d: activityCount(90),
      tournaments365d: activityCount(365),
    },
    streaks: {
      current: currentStreak,
      best: bestStreak,
    },
    bestMarks: {
      bestPosition,
      bestTournamentTitle,
      bestTournamentStartsAt,
      bestTournamentEloGain:
        bestTournamentEloGain === Number.NEGATIVE_INFINITY
          ? 0
          : bestTournamentEloGain,
    },
    eloSeries,
    tournaments: tournamentProgress,
    games: gameProgress.sort(
      (a, b) =>
        b.startsAt.localeCompare(a.startsAt) ||
        b.roundNumber - a.roundNumber ||
        b.boardNumber - a.boardNumber,
    ),
    goal: createGoal({
      currentElo,
      peakElo: Math.max(peakElo, currentElo),
      eloGames: rankingEntry?.eloGames ?? eloGames,
      tournamentsPlayed:
        rankingEntry?.tournamentsPlayed ?? tournamentProgress.length,
    }),
  } satisfies ClubPlayerProgress;

  return progress;
}
