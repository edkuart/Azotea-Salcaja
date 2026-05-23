import { getGameScores, isCompletedResult } from "./scoring";
import type {
  ChessGame,
  ChessTournament,
  PlayerStanding,
  TieBreakCalculator,
  TieBreakCode,
  TieBreakContext,
} from "./types";

function sortNumbersAscending(values: number[]) {
  return [...values].sort((a, b) => a - b);
}

function getOpponentPoints(
  standing: PlayerStanding,
  standingsByPlayer: Map<string, PlayerStanding>,
) {
  return standing.opponentIds
    .map((opponentId) => standingsByPlayer.get(opponentId)?.points ?? 0)
    .filter((points) => Number.isFinite(points));
}

function getPlayedGamesForPlayer(tournament: ChessTournament, playerId: string) {
  return tournament.rounds.flatMap((round) =>
    round.games.filter(
      (game) =>
        isCompletedResult(game.result) &&
        !game.isBye &&
        (game.whitePlayerId === playerId || game.blackPlayerId === playerId),
    ),
  );
}

function getOpponentId(game: ChessGame, playerId: string) {
  if (game.whitePlayerId === playerId) {
    return game.blackPlayerId;
  }

  if (game.blackPlayerId === playerId) {
    return game.whitePlayerId;
  }

  return undefined;
}

function getPlayerScoreInGame(game: ChessGame, playerId: string) {
  const { whiteScore, blackScore } = getGameScores(game);

  if (game.whitePlayerId === playerId) {
    return whiteScore;
  }

  if (game.blackPlayerId === playerId) {
    return blackScore;
  }

  return 0;
}

const points: TieBreakCalculator = (standing) => standing.points;

const progressive: TieBreakCalculator = (standing) => standing.progressive;

const buchholz: TieBreakCalculator = (standing, { standingsByPlayer }) =>
  getOpponentPoints(standing, standingsByPlayer).reduce(
    (total, value) => total + value,
    0,
  );

const medianBuchholz: TieBreakCalculator = (standing, { standingsByPlayer }) => {
  const values = sortNumbersAscending(getOpponentPoints(standing, standingsByPlayer));

  if (values.length <= 2) {
    return values.reduce((total, value) => total + value, 0);
  }

  return values.slice(1, -1).reduce((total, value) => total + value, 0);
};

const buchholzCut1: TieBreakCalculator = (standing, { standingsByPlayer }) => {
  const values = sortNumbersAscending(getOpponentPoints(standing, standingsByPlayer));

  if (values.length <= 1) {
    return 0;
  }

  return values.slice(1).reduce((total, value) => total + value, 0);
};

const sonnebornBerger: TieBreakCalculator = (
  standing,
  { tournament, standingsByPlayer },
) =>
  getPlayedGamesForPlayer(tournament, standing.playerId).reduce((total, game) => {
    const opponentId = getOpponentId(game, standing.playerId);
    const opponentPoints = opponentId
      ? standingsByPlayer.get(opponentId)?.points ?? 0
      : 0;
    const playerScore = getPlayerScoreInGame(game, standing.playerId);

    return total + opponentPoints * playerScore;
  }, 0);

const directEncounter: TieBreakCalculator = (
  standing,
  { tournament, standingsByPlayer },
) => {
  const tiedPlayerIds = [...standingsByPlayer.values()]
    .filter((candidate) => candidate.points === standing.points)
    .map((candidate) => candidate.playerId);

  if (tiedPlayerIds.length < 2) {
    return 0;
  }

  return getPlayedGamesForPlayer(tournament, standing.playerId)
    .filter((game) => {
      const opponentId = getOpponentId(game, standing.playerId);
      return opponentId ? tiedPlayerIds.includes(opponentId) : false;
    })
    .reduce(
      (total, game) => total + getPlayerScoreInGame(game, standing.playerId),
      0,
    );
};

export const tieBreakCalculators: Record<TieBreakCode, TieBreakCalculator> = {
  points,
  progressive,
  buchholz,
  median_buchholz: medianBuchholz,
  buchholz_cut_1: buchholzCut1,
  sonneborn_berger: sonnebornBerger,
  direct_encounter: directEncounter,
  wins: (standing) => standing.wins,
  black_wins: (standing) => standing.blackWins,
  manual: () => 0,
};

export function decorateStandingsWithTieBreaks(
  standings: PlayerStanding[],
  context: TieBreakContext,
) {
  return standings.map((standing) => {
    const tieBreaks = { ...standing.tieBreaks };

    for (const code of context.tournament.tieBreakOrder) {
      tieBreaks[code] = tieBreakCalculators[code](standing, context) ?? 0;
    }

    return {
      ...standing,
      tieBreaks,
    };
  });
}

export function compareStandingsByTieBreaks(
  tournament: ChessTournament,
  a: PlayerStanding,
  b: PlayerStanding,
) {
  for (const code of tournament.tieBreakOrder) {
    const diff = (b.tieBreaks[code] ?? 0) - (a.tieBreaks[code] ?? 0);

    if (diff !== 0) {
      return diff;
    }
  }

  return a.seed - b.seed;
}

export function formatTieBreakLabel(code: TieBreakCode) {
  const labels: Record<TieBreakCode, string> = {
    points: "Pts",
    progressive: "Prog",
    buchholz: "Buch",
    median_buchholz: "Med Buch",
    buchholz_cut_1: "Buch Cut 1",
    sonneborn_berger: "SB",
    direct_encounter: "Directo",
    wins: "Victorias",
    black_wins: "Victorias negras",
    manual: "Manual",
  };

  return labels[code];
}
