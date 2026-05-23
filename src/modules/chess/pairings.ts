import { calculateStandings, getColorBalance, getNextRoundBlocker, hasPlayerHadBye, havePlayersMet } from "./standings";
import type {
  ChessGame,
  ChessPlayer,
  ChessRound,
  ChessTournament,
  PairingResult,
  PlayerStanding,
} from "./types";

type PairingPlayer = ChessPlayer & {
  points: number;
  colorBalance: number;
};

function activePlayers(players: ChessPlayer[]) {
  return players
    .filter((player) => player.status === "active")
    .sort((a, b) => a.seed - b.seed);
}

function buildPairingPlayer(
  player: ChessPlayer,
  standingsByPlayer: Map<string, PlayerStanding>,
): PairingPlayer {
  const standing = standingsByPlayer.get(player.id);

  return {
    ...player,
    points: standing?.points ?? 0,
    colorBalance: standing ? getColorBalance(standing) : 0,
  };
}

function createGame(
  roundNumber: number,
  boardNumber: number,
  whitePlayerId?: string,
  blackPlayerId?: string,
): ChessGame {
  return {
    id: `r${roundNumber}-b${boardNumber}`,
    boardNumber,
    whitePlayerId,
    blackPlayerId,
    result: "unplayed",
  };
}

function assignColors(playerA: PairingPlayer, playerB: PairingPlayer) {
  if (playerA.colorBalance > playerB.colorBalance) {
    return { whitePlayerId: playerB.id, blackPlayerId: playerA.id };
  }

  if (playerB.colorBalance > playerA.colorBalance) {
    return { whitePlayerId: playerA.id, blackPlayerId: playerB.id };
  }

  return playerA.seed <= playerB.seed
    ? { whitePlayerId: playerA.id, blackPlayerId: playerB.id }
    : { whitePlayerId: playerB.id, blackPlayerId: playerA.id };
}

export function generateRoundRobinRounds(players: ChessPlayer[]) {
  const participants = activePlayers(players);

  if (participants.length < 2) {
    return [];
  }

  const needsBye = participants.length % 2 === 1;
  const slots = needsBye
    ? [...participants, { id: "BYE", name: "BYE", seed: 9999, status: "active" as const }]
    : participants;

  const rounds: ChessRound[] = [];
  const rotating = [...slots];
  const roundCount = rotating.length - 1;
  const half = rotating.length / 2;

  for (let roundIndex = 0; roundIndex < roundCount; roundIndex += 1) {
    const roundNumber = roundIndex + 1;
    const games: ChessGame[] = [];

    for (let boardIndex = 0; boardIndex < half; boardIndex += 1) {
      const playerA = rotating[boardIndex];
      const playerB = rotating[rotating.length - 1 - boardIndex];

      if (!playerA || !playerB) {
        continue;
      }

      const hasBye = playerA.id === "BYE" || playerB.id === "BYE";

      if (hasBye) {
        const realPlayer = playerA.id === "BYE" ? playerB : playerA;
        games.push({
          ...createGame(roundNumber, games.length + 1, realPlayer.id),
          result: "bye",
          whiteScore: 1,
          blackScore: 0,
          isBye: true,
        });
        continue;
      }

      const flip = (roundIndex + boardIndex) % 2 === 1;
      games.push(
        createGame(
          roundNumber,
          games.length + 1,
          flip ? playerB.id : playerA.id,
          flip ? playerA.id : playerB.id,
        ),
      );
    }

    rounds.push({
      id: `rr-r${roundNumber}`,
      roundNumber,
      status: "paired",
      games,
    });

    rotating.splice(1, 0, rotating.pop() as ChessPlayer);
  }

  return rounds;
}

export function generateSwissNextRound(tournament: ChessTournament): PairingResult {
  const blocker = getNextRoundBlocker(tournament);

  if (blocker) {
    return {
      round: {
        id: `blocked-r${tournament.rounds.length + 1}`,
        roundNumber: tournament.rounds.length + 1,
        status: "pending",
        games: [],
      },
      warnings: [{ code: "blocked", message: blocker }],
    };
  }

  const standings = calculateStandings(tournament);
  const standingsByPlayer = new Map(
    standings.map((standing) => [standing.playerId, standing]),
  );
  let pairingPlayers = activePlayers(tournament.players)
    .map((player) => buildPairingPlayer(player, standingsByPlayer))
    .sort((a, b) => b.points - a.points || a.seed - b.seed);
  const roundNumber = tournament.rounds.length + 1;
  const warnings: PairingResult["warnings"] = [];
  const games: ChessGame[] = [];

  if (pairingPlayers.length < 2) {
    return {
      round: {
        id: `swiss-r${roundNumber}`,
        roundNumber,
        status: "pending",
        games: [],
      },
      warnings: [
        {
          code: "not_enough_players",
          message: "Se necesitan al menos 2 jugadores activos para generar pareos.",
        },
      ],
    };
  }

  if (pairingPlayers.length % 2 === 1) {
    const byePlayer = [...pairingPlayers]
      .reverse()
      .find((player) => !hasPlayerHadBye(tournament, player.id));

    if (byePlayer) {
      games.push({
        ...createGame(roundNumber, 1, byePlayer.id),
        result: "bye",
        whiteScore: 1,
        blackScore: 0,
        isBye: true,
      });
      pairingPlayers = pairingPlayers.filter((player) => player.id !== byePlayer.id);
    } else {
      warnings.push({
        code: "bye_unavailable",
        message: "Todos los jugadores ya recibieron bye; se asigno el ultimo posible.",
      });
    }
  }

  let boardNumber = games.length + 1;
  const unpaired = [...pairingPlayers];

  while (unpaired.length > 1) {
    const player = unpaired.shift() as PairingPlayer;
    const opponentIndex = unpaired.findIndex(
      (candidate) => !havePlayersMet(tournament, player.id, candidate.id),
    );
    const selectedIndex = opponentIndex >= 0 ? opponentIndex : 0;
    const opponent = unpaired.splice(selectedIndex, 1)[0];

    if (!opponent) {
      break;
    }

    if (opponentIndex === -1) {
      warnings.push({
        code: "repeat_pairing",
        message: `No se encontro rival nuevo para ${player.name}; se permitio repeticion.`,
      });
    }

    const colors = assignColors(player, opponent);
    games.push(createGame(roundNumber, boardNumber, colors.whitePlayerId, colors.blackPlayerId));
    boardNumber += 1;
  }

  if (unpaired.length === 1) {
    warnings.push({
      code: "unpaired_player",
      message: `${unpaired[0].name} quedo sin pareo por configuracion inconsistente.`,
    });
  }

  return {
    round: {
      id: `swiss-r${roundNumber}`,
      roundNumber,
      status: "paired",
      games,
    },
    warnings,
  };
}

export function generateNextRoundPreview(tournament: ChessTournament) {
  if (tournament.system === "round_robin") {
    const rounds = generateRoundRobinRounds(tournament.players);
    const nextRound = rounds[tournament.rounds.length];

    return {
      round: nextRound ?? {
        id: "round-robin-complete",
        roundNumber: tournament.rounds.length + 1,
        status: "pending" as const,
        games: [],
      },
      warnings: nextRound
        ? []
        : [
            {
              code: "round_robin_complete",
              message: "Ya no hay rondas de round robin por generar.",
            },
          ],
    };
  }

  return generateSwissNextRound(tournament);
}
