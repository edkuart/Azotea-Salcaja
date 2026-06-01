import { getGameScores, isCompletedResult } from "./scoring";
import {
  compareStandingsByTieBreaks,
  decorateStandingsWithTieBreaks,
} from "./tiebreaks";
import type { ChessGame, ChessTournament, PlayerStanding } from "./types";

function createStanding(player: ChessTournament["players"][number]): PlayerStanding {
  return {
    playerId: player.id,
    name: player.name,
    seed: player.seed,
    rating: player.rating,
    points: 0,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    byes: 0,
    forfeits: 0,
    blackWins: 0,
    colorHistory: [],
    opponentIds: [],
    progressive: 0,
    tieBreaks: {},
  };
}

function applyGameToStanding(
  standing: PlayerStanding,
  game: ChessGame,
  color: "white" | "black",
) {
  if (!isCompletedResult(game.result)) {
    return;
  }

  const { whiteScore, blackScore } = getGameScores(game);
  const score = color === "white" ? whiteScore : blackScore;
  const opponentScore = color === "white" ? blackScore : whiteScore;

  standing.points += score;

  if (game.isBye || game.result === "bye") {
    standing.colorHistory.push("bye");
    standing.byes += 1;
    return;
  }

  standing.colorHistory.push(color);
  standing.played += 1;

  if (score > opponentScore) {
    standing.wins += 1;
    if (color === "black") {
      standing.blackWins += 1;
    }
  } else if (score === opponentScore) {
    standing.draws += 1;
  } else {
    standing.losses += 1;
  }

  if (game.isForfeit || game.result.includes("forfeit")) {
    standing.forfeits += 1;
  }
}

export function calculateStandings(tournament: ChessTournament) {
  const standingsByPlayer = new Map(
    tournament.players.map((player) => [player.id, createStanding(player)]),
  );

  for (const round of tournament.rounds) {
    for (const game of round.games) {
      if (!isCompletedResult(game.result)) {
        continue;
      }

      const whiteStanding = game.whitePlayerId
        ? standingsByPlayer.get(game.whitePlayerId)
        : undefined;
      const blackStanding = game.blackPlayerId
        ? standingsByPlayer.get(game.blackPlayerId)
        : undefined;

      if (whiteStanding) {
        applyGameToStanding(whiteStanding, game, "white");
        if (game.blackPlayerId) {
          whiteStanding.opponentIds.push(game.blackPlayerId);
        }
      }

      if (blackStanding) {
        applyGameToStanding(blackStanding, game, "black");
        if (game.whitePlayerId) {
          blackStanding.opponentIds.push(game.whitePlayerId);
        }
      }
    }

    for (const standing of standingsByPlayer.values()) {
      standing.progressive += standing.points;
    }
  }

  const baseStandings = [...standingsByPlayer.values()];
  const decoratedStandings = decorateStandingsWithTieBreaks(baseStandings, {
    tournament,
    standingsByPlayer,
  });

  return decoratedStandings.sort((a, b) =>
    compareStandingsByTieBreaks(tournament, a, b),
  );
}

export function compareStandings(a: PlayerStanding, b: PlayerStanding) {
  return b.points - a.points || b.wins - a.wins || a.seed - b.seed;
}

export function havePlayersMet(
  tournament: ChessTournament,
  playerAId: string,
  playerBId: string,
) {
  return tournament.rounds.some((round) =>
    round.games.some((game) => {
      const pair = [game.whitePlayerId, game.blackPlayerId];
      return pair.includes(playerAId) && pair.includes(playerBId);
    }),
  );
}

export function hasPlayerHadBye(tournament: ChessTournament, playerId: string) {
  return tournament.rounds.some((round) =>
    round.games.some(
      (game) =>
        (game.isBye || game.result === "bye") && game.whitePlayerId === playerId,
    ),
  );
}

export function getColorBalance(standing: PlayerStanding) {
  const whites = standing.colorHistory.filter((color) => color === "white").length;
  const blacks = standing.colorHistory.filter((color) => color === "black").length;

  return whites - blacks;
}

export function getNextRoundBlocker(tournament: ChessTournament) {
  const lastRound = tournament.rounds.at(-1);

  if (!lastRound) {
    return null;
  }

  const pendingGames = lastRound.games.filter((game) => game.result === "unplayed");

  if (pendingGames.length > 0) {
    return `Faltan ${pendingGames.length} resultado(s) de la ronda ${lastRound.roundNumber}.`;
  }

  if (tournament.rounds.length >= tournament.roundsPlanned) {
    return "El torneo ya alcanzo el numero de rondas configurado.";
  }

  return null;
}
