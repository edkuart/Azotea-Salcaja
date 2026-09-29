import {
  calculateStandings,
  getColorBalance,
  getNextRoundBlocker,
  hasPlayerHadBye,
} from "./standings";
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

type RoundRobinColor = "white" | "black";

type RoundRobinColorState = {
  balance: number;
  lastColor?: RoundRobinColor;
  streak: number;
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

function roundRobinColorCost(
  state: RoundRobinColorState,
  color: RoundRobinColor,
) {
  const nextBalance = state.balance + (color === "white" ? 1 : -1);
  const nextStreak = state.lastColor === color ? state.streak + 1 : 1;

  return (
    Math.abs(nextBalance) * 100 +
    (nextStreak >= 3 ? 1_000 + (nextStreak - 2) * 100 : 0) +
    (state.lastColor === color ? 10 : 0)
  );
}

function updateRoundRobinColorState(
  state: RoundRobinColorState,
  color: RoundRobinColor,
) {
  state.balance += color === "white" ? 1 : -1;
  state.streak = state.lastColor === color ? state.streak + 1 : 1;
  state.lastColor = color;
}

function recordRoundRobinRoundColors(
  round: ChessRound,
  states: Map<string, RoundRobinColorState>,
) {
  for (const game of round.games) {
    if (game.isBye) continue;

    if (game.whitePlayerId) {
      const state = states.get(game.whitePlayerId) ?? { balance: 0, streak: 0 };
      updateRoundRobinColorState(state, "white");
      states.set(game.whitePlayerId, state);
    }
    if (game.blackPlayerId) {
      const state = states.get(game.blackPlayerId) ?? { balance: 0, streak: 0 };
      updateRoundRobinColorState(state, "black");
      states.set(game.blackPlayerId, state);
    }
  }
}

function assignRoundRobinColors(
  playerA: ChessPlayer,
  playerB: ChessPlayer,
  states: Map<string, RoundRobinColorState>,
  fallbackFlip: boolean,
) {
  const stateA = states.get(playerA.id) ?? { balance: 0, streak: 0 };
  const stateB = states.get(playerB.id) ?? { balance: 0, streak: 0 };
  const aWhiteCost =
    roundRobinColorCost(stateA, "white") + roundRobinColorCost(stateB, "black");
  const bWhiteCost =
    roundRobinColorCost(stateA, "black") + roundRobinColorCost(stateB, "white");
  const aGetsWhite =
    aWhiteCost === bWhiteCost ? !fallbackFlip : aWhiteCost < bWhiteCost;

  updateRoundRobinColorState(stateA, aGetsWhite ? "white" : "black");
  updateRoundRobinColorState(stateB, aGetsWhite ? "black" : "white");
  states.set(playerA.id, stateA);
  states.set(playerB.id, stateB);

  return aGetsWhite
    ? { whitePlayerId: playerA.id, blackPlayerId: playerB.id }
    : { whitePlayerId: playerB.id, blackPlayerId: playerA.id };
}

export function generateRoundRobinRounds(
  players: ChessPlayer[],
  existingRounds: ChessRound[] = [],
) {
  const participants = activePlayers(players);

  if (participants.length < 2) {
    return [];
  }

  const needsBye = participants.length % 2 === 1;
  const slots = needsBye
    ? [
        ...participants,
        { id: "BYE", name: "BYE", seed: 9999, status: "active" as const },
      ]
    : participants;

  const rounds: ChessRound[] = [];
  const colorStates = new Map<string, RoundRobinColorState>();
  const rotating = [...slots];
  const roundCount = rotating.length - 1;
  const half = rotating.length / 2;

  for (let roundIndex = 0; roundIndex < roundCount; roundIndex += 1) {
    const roundNumber = roundIndex + 1;
    const games: ChessGame[] = [];
    const existingRound = existingRounds[roundIndex];

    if (existingRound) {
      recordRoundRobinRoundColors(existingRound, colorStates);
      rounds.push(existingRound);
      rotating.splice(1, 0, rotating.pop() as ChessPlayer);
      continue;
    }

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

      const colors = assignRoundRobinColors(
        playerA,
        playerB,
        colorStates,
        (roundIndex + boardIndex) % 2 === 1,
      );
      games.push(
        createGame(
          roundNumber,
          games.length + 1,
          colors.whitePlayerId,
          colors.blackPlayerId,
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

function compareInitialRanking(a: ChessPlayer, b: ChessPlayer) {
  const ratingA = a.rating ?? Number.NEGATIVE_INFINITY;
  const ratingB = b.rating ?? Number.NEGATIVE_INFINITY;

  return ratingB - ratingA || a.seed - b.seed;
}

function comparePairingPlayers(a: PairingPlayer, b: PairingPlayer) {
  return b.points - a.points || compareInitialRanking(a, b);
}

/** Orden de rivales preferido dentro de un grupo de puntaje. En vez de cruzar
 *  posiciones consecutivas (1-2, 3-4), divide el grupo por ranking y busca
 *  primero el cruce entre su mitad superior e inferior. */
function orderSwissCandidates(
  first: PairingPlayer,
  rest: PairingPlayer[],
  ordered: PairingPlayer[],
) {
  const scoreGroup = ordered.filter((player) => player.points === first.points);
  const lowerHalfStart = Math.max(1, Math.floor(scoreGroup.length / 2));
  const scoreGroupIndexes = new Map(
    scoreGroup.map((player, index) => [player.id, index]),
  );

  return [...rest].sort((a, b) => {
    const pointGap =
      Math.abs(first.points - a.points) - Math.abs(first.points - b.points);
    if (pointGap !== 0) return pointGap;

    const indexA = scoreGroupIndexes.get(a.id);
    const indexB = scoreGroupIndexes.get(b.id);
    const preferenceA =
      indexA === undefined
        ? Number.MAX_SAFE_INTEGER
        : indexA >= lowerHalfStart
          ? indexA - lowerHalfStart
          : scoreGroup.length + lowerHalfStart - indexA;
    const preferenceB =
      indexB === undefined
        ? Number.MAX_SAFE_INTEGER
        : indexB >= lowerHalfStart
          ? indexB - lowerHalfStart
          : scoreGroup.length + lowerHalfStart - indexB;

    return preferenceA - preferenceB || compareInitialRanking(a, b);
  });
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
  protectedPlayerIds: Set<string>,
  maxProtectedPairs: number,
  budget: { steps: number },
): PlayerPair[] | null {
  if (ordered.length < 2) {
    return ordered.length === 0 ? [] : null;
  }

  const [first, ...rest] = ordered;
  const candidates = orderSwissCandidates(first, rest, ordered);

  for (const candidate of candidates) {
    if (budget.steps <= 0) {
      return null;
    }
    budget.steps -= 1;

    const repeat = hasMet(first, candidate);
    const protectedPair =
      protectedPlayerIds.has(first.id) && protectedPlayerIds.has(candidate.id);

    if (
      (repeat && maxRepeats === 0) ||
      (protectedPair && maxProtectedPairs === 0)
    ) {
      continue;
    }

    const remaining = rest.filter((player) => player.id !== candidate.id);
    const sub = matchWithBacktracking(
      remaining,
      hasMet,
      maxRepeats - (repeat ? 1 : 0),
      protectedPlayerIds,
      maxProtectedPairs - (protectedPair ? 1 : 0),
      budget,
    );

    if (sub) {
      return [{ a: first, b: candidate, repeat }, ...sub];
    }
  }

  return null;
}

export function generateSwissNextRound(
  tournament: ChessTournament,
): PairingResult {
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
    .sort(comparePairingPlayers);
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
          message:
            "Se necesitan al menos 2 jugadores activos para generar pareos.",
        },
      ],
    };
  }

  const metPairs = buildMetPairs(tournament);
  const hasMet = (a: PairingPlayer, b: PairingPlayer) =>
    metPairs.has(pairKey(a.id, b.id));
  const played = playersWhoHavePlayed(tournament);
  const isNewcomer = (player: PairingPlayer) =>
    tournament.rounds.length > 0 && !played.has(player.id);

  // Durante las dos primeras rondas, la mitad superior del ranking queda
  // protegida: se priorizan cruces contra la mitad media/inferior. Si altas,
  // bajas o restricciones previas vuelven imposible el cruce, el backtracking
  // relaja la protección con la menor cantidad de excepciones necesaria.
  const openingProtectionActive = roundNumber <= 2;
  const rankedActivePlayers = activePlayers(tournament.players).sort(
    compareInitialRanking,
  );
  const protectedPlayerIds = openingProtectionActive
    ? new Set(
        rankedActivePlayers
          .slice(0, Math.floor(rankedActivePlayers.length / 2))
          .map((player) => player.id),
      )
    : new Set<string>();

  // ── Bye: se elige aquí pero se agrega al FINAL (última mesa), para que las
  //    partidas reales queden numeradas 1..N y el bye no desplace una mesa.
  //    Un recién incorporado no recibe bye en su ronda de entrada: jugar su
  //    primera partida tiene prioridad sobre el punto gratis. ──
  let byePlayerId: string | undefined;
  if (pairingPlayers.length % 2 === 1) {
    const reversed = [...pairingPlayers].reverse();
    const byePlayer =
      reversed.find(
        (player) =>
          !hasPlayerHadBye(tournament, player.id) && !isNewcomer(player),
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
    pairingPlayers = pairingPlayers.filter(
      (player) => player.id !== byePlayer.id,
    );
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

      pairingPlayers = pairingPlayers.filter(
        (player) => !pairedIds.has(player.id),
      );
    }
  }

  // ── Pareo suizo del resto, con backtracking ──
  // Primero se busca un emparejamiento sin repeticiones; solo si no existe se
  // permite el mínimo de repeticiones necesario.
  let matched: PlayerPair[] | null = null;
  const maxRepeats = Math.ceil(pairingPlayers.length / 2);
  const maxProtectedPairs = Math.ceil(pairingPlayers.length / 2);

  for (
    let allowedRepeats = 0;
    allowedRepeats <= maxRepeats && !matched;
    allowedRepeats += 1
  ) {
    for (
      let allowedProtectedPairs = 0;
      allowedProtectedPairs <= maxProtectedPairs && !matched;
      allowedProtectedPairs += 1
    ) {
      matched = matchWithBacktracking(
        pairingPlayers,
        hasMet,
        allowedRepeats,
        protectedPlayerIds,
        allowedProtectedPairs,
        { steps: 200_000 },
      );
    }
  }

  if (!matched) {
    // Salvaguarda (presupuesto agotado o cantidad impar): pareo secuencial.
    matched = [];
    const queue = [...pairingPlayers];
    while (queue.length > 1) {
      const player = queue.shift() as PairingPlayer;
      const unmetIndex = queue.findIndex(
        (candidate) => !hasMet(player, candidate),
      );
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
    const leaderX =
      comparePairingPlayers(pairX.a, pairX.b) <= 0 ? pairX.a : pairX.b;
    const leaderY =
      comparePairingPlayers(pairY.a, pairY.b) <= 0 ? pairY.a : pairY.b;
    return comparePairingPlayers(leaderX, leaderY);
  });

  let boardNumber = 1;
  for (const pair of pairs) {
    const colors = assignColors(pair.a, pair.b);
    games.push(
      createGame(
        roundNumber,
        boardNumber,
        colors.whitePlayerId,
        colors.blackPlayerId,
      ),
    );
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
    const rounds = generateRoundRobinRounds(
      tournament.players,
      tournament.rounds,
    );
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
