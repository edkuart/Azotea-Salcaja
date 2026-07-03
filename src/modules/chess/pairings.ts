import { calculateStandings, getColorBalance, getNextRoundBlocker, hasPlayerHadBye } from "./standings";
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

/** Conjunto de jugadores que ya aparecieron en alguna partida (para detectar
 *  entradas tardías: quienes se inscribieron con el torneo ya empezado). */
function playersWhoHavePlayed(tournament: ChessTournament): Set<string> {
  const played = new Set<string>();
  for (const round of tournament.rounds) {
    for (const game of round.games) {
      if (game.whitePlayerId) played.add(game.whitePlayerId);
      if (game.blackPlayerId) played.add(game.blackPlayerId);
    }
  }
  return played;
}

function pairKey(idA: string, idB: string) {
  return idA < idB ? `${idA}|${idB}` : `${idB}|${idA}`;
}

/** Parejas que ya se enfrentaron, precalculadas para consultarlas en O(1)
 *  dentro del backtracking. */
function buildMetPairs(tournament: ChessTournament): Set<string> {
  const met = new Set<string>();
  for (const round of tournament.rounds) {
    for (const game of round.games) {
      if (game.whitePlayerId && game.blackPlayerId) {
        met.add(pairKey(game.whitePlayerId, game.blackPlayerId));
      }
    }
  }
  return met;
}

type PlayerPair = { a: PairingPlayer; b: PairingPlayer; repeat: boolean };

function comparePairingPlayers(a: PairingPlayer, b: PairingPlayer) {
  return b.points - a.points || a.seed - b.seed;
}

/** Emparejamiento con backtracking: recorre la lista en orden suizo y prueba
 *  rivales hasta cubrir a todos sin exceder `maxRepeats` repeticiones. A
 *  diferencia del pareo voraz, si los últimos de la cola quedan trabados
 *  (ya se enfrentaron) reacomoda las mesas anteriores en vez de forzar la
 *  repetición. `budget` acota los pasos totales por si la búsqueda explota. */
function matchWithBacktracking(
  ordered: PairingPlayer[],
  hasMet: (a: PairingPlayer, b: PairingPlayer) => boolean,
  maxRepeats: number,
  budget: { steps: number },
): PlayerPair[] | null {
  if (ordered.length < 2) {
    return ordered.length === 0 ? [] : null;
  }

  const [first, ...rest] = ordered;

  for (let index = 0; index < rest.length; index += 1) {
    if (budget.steps <= 0) {
      return null;
    }
    budget.steps -= 1;

    const candidate = rest[index];
    const repeat = hasMet(first, candidate);

    if (repeat && maxRepeats === 0) {
      continue;
    }

    const remaining = rest.filter((_, i) => i !== index);
    const sub = matchWithBacktracking(
      remaining,
      hasMet,
      maxRepeats - (repeat ? 1 : 0),
      budget,
    );

    if (sub) {
      return [{ a: first, b: candidate, repeat }, ...sub];
    }
  }

  return null;
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

  const metPairs = buildMetPairs(tournament);
  const hasMet = (a: PairingPlayer, b: PairingPlayer) => metPairs.has(pairKey(a.id, b.id));
  const played = playersWhoHavePlayed(tournament);
  const isNewcomer = (player: PairingPlayer) =>
    tournament.rounds.length > 0 && !played.has(player.id);

  // ── Bye: se elige aquí pero se agrega al FINAL (última mesa), para que las
  //    partidas reales queden numeradas 1..N y el bye no desplace una mesa.
  //    Un recién incorporado no recibe bye en su ronda de entrada: jugar su
  //    primera partida tiene prioridad sobre el punto gratis. ──
  let byePlayerId: string | undefined;
  if (pairingPlayers.length % 2 === 1) {
    const reversed = [...pairingPlayers].reverse();
    const byePlayer =
      reversed.find(
        (player) => !hasPlayerHadBye(tournament, player.id) && !isNewcomer(player),
      ) ??
      reversed.find((player) => !hasPlayerHadBye(tournament, player.id)) ??
      reversed[0];

    if (hasPlayerHadBye(tournament, byePlayer.id)) {
      warnings.push({
        code: "bye_unavailable",
        message: `Todos los jugadores ya recibieron bye; se repitió con ${byePlayer.name}.`,
      });
    }

    byePlayerId = byePlayer.id;
    pairingPlayers = pairingPlayers.filter((player) => player.id !== byePlayer.id);
  }

  const pairs: PlayerPair[] = [];

  // ── Integración de entradas tardías ──
  // Quien se inscribe con el torneo ya empezado entra con 0 puntos y caería al
  // fondo formando un bloque aislado que solo juega entre nuevos. Para evitarlo,
  // se empareja a cada nuevo con un VETERANO de bajo puntaje (de menor a mayor).
  if (tournament.rounds.length > 0) {
    const newcomers = pairingPlayers.filter((player) => !played.has(player.id));

    if (newcomers.length > 0 && newcomers.length < pairingPlayers.length) {
      const veterans = pairingPlayers
        .filter((player) => played.has(player.id))
        .sort((a, b) => a.points - b.points || b.seed - a.seed); // bajo puntaje primero
      const pairedIds = new Set<string>();
      const orderedNewcomers = [...newcomers].sort((a, b) => a.seed - b.seed);

      for (const newcomer of orderedNewcomers) {
        const unmetIndex = veterans.findIndex(
          (vet) => !pairedIds.has(vet.id) && !hasMet(newcomer, vet),
        );
        const index =
          unmetIndex >= 0
            ? unmetIndex
            : veterans.findIndex((vet) => !pairedIds.has(vet.id));

        if (index < 0) {
          break; // ya no quedan veteranos libres; el resto se empareja abajo
        }

        const veteran = veterans[index];
        pairedIds.add(newcomer.id);
        pairedIds.add(veteran.id);
        pairs.push({ a: newcomer, b: veteran, repeat: unmetIndex < 0 });
      }

      pairingPlayers = pairingPlayers.filter((player) => !pairedIds.has(player.id));
    }
  }

  // ── Pareo suizo del resto, con backtracking ──
  // Primero se busca un emparejamiento sin repeticiones; solo si no existe se
  // permite el mínimo de repeticiones necesario.
  let matched: PlayerPair[] | null = null;
  const maxRepeats = Math.ceil(pairingPlayers.length / 2);

  for (let allowed = 0; allowed <= maxRepeats && !matched; allowed += 1) {
    matched = matchWithBacktracking(pairingPlayers, hasMet, allowed, { steps: 200_000 });
  }

  if (!matched) {
    // Salvaguarda (presupuesto agotado o cantidad impar): pareo secuencial.
    matched = [];
    const queue = [...pairingPlayers];
    while (queue.length > 1) {
      const player = queue.shift() as PairingPlayer;
      const unmetIndex = queue.findIndex((candidate) => !hasMet(player, candidate));
      const opponent = queue.splice(Math.max(unmetIndex, 0), 1)[0];
      matched.push({ a: player, b: opponent, repeat: unmetIndex < 0 });
    }
    if (queue.length === 1) {
      warnings.push({
        code: "unpaired_player",
        message: `${queue[0].name} quedo sin pareo por configuracion inconsistente.`,
      });
    }
  }

  pairs.push(...matched);

  for (const pair of pairs) {
    if (pair.repeat) {
      warnings.push({
        code: "repeat_pairing",
        message: `${pair.a.name} y ${pair.b.name} ya se habían enfrentado; no existía pareo alternativo sin repetir.`,
      });
    }
  }

  // ── Mesas: la partida del jugador mejor clasificado va en la mesa 1 ──
  pairs.sort((pairX, pairY) => {
    const leaderX = comparePairingPlayers(pairX.a, pairX.b) <= 0 ? pairX.a : pairX.b;
    const leaderY = comparePairingPlayers(pairY.a, pairY.b) <= 0 ? pairY.a : pairY.b;
    return comparePairingPlayers(leaderX, leaderY);
  });

  let boardNumber = 1;
  for (const pair of pairs) {
    const colors = assignColors(pair.a, pair.b);
    games.push(createGame(roundNumber, boardNumber, colors.whitePlayerId, colors.blackPlayerId));
    boardNumber += 1;
  }

  // ── Bye al final (última mesa) ──
  if (byePlayerId) {
    games.push({
      ...createGame(roundNumber, boardNumber, byePlayerId),
      result: "bye",
      whiteScore: 1,
      blackScore: 0,
      isBye: true,
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
