import { describe, expect, it } from "vitest";

import {
  generateNextRoundPreview,
  generateRoundRobinRounds,
  generateSwissNextRound,
} from "./pairings";
import type { ChessTournament } from "./types";

const baseTournament: ChessTournament = {
  id: "test",
  kind: "official",
  visibility: "published",
  title: "Test tournament",
  slug: "test",
  description: "Test",
  system: "swiss",
  roundsPlanned: 3,
  currentRoundNumber: 0,
  status: "active",
  startsAt: "2026-01-01 19:30",
  locationLabel: "Azotea",
  tieBreakOrder: ["points", "wins"],
  players: [
    { id: "p1", name: "Player 1", seed: 1, status: "active" },
    { id: "p2", name: "Player 2", seed: 2, status: "active" },
    { id: "p3", name: "Player 3", seed: 3, status: "active" },
    { id: "p4", name: "Player 4", seed: 4, status: "active" },
  ],
  rounds: [],
};

describe("generateRoundRobinRounds", () => {
  it("generates n - 1 rounds for an even player count", () => {
    const rounds = generateRoundRobinRounds(baseTournament.players);

    expect(rounds).toHaveLength(3);
    expect(rounds.flatMap((round) => round.games)).toHaveLength(6);
  });

  it("adds a bye when player count is odd", () => {
    const rounds = generateRoundRobinRounds([
      ...baseTournament.players,
      { id: "p5", name: "Player 5", seed: 5, status: "active" },
    ]);

    expect(rounds).toHaveLength(5);
    expect(rounds.some((round) => round.games.some((game) => game.isBye))).toBe(
      true,
    );
  });

  it("balances colors and prevents long same-color streaks", () => {
    for (const playerCount of [7, 8]) {
      const players = Array.from({ length: playerCount }, (_, index) => ({
        id: `p${index + 1}`,
        name: `Player ${index + 1}`,
        seed: index + 1,
        status: "active" as const,
      }));
      const rounds = generateRoundRobinRounds(players);

      for (const player of players) {
        const colors = rounds.flatMap((round) =>
          round.games.flatMap((game) => {
            if (game.whitePlayerId === player.id) return ["W"];
            if (game.blackPlayerId === player.id) return ["B"];
            return [];
          }),
        );
        const white = colors.filter((color) => color === "W").length;
        const black = colors.filter((color) => color === "B").length;

        expect(Math.abs(white - black)).toBeLessThanOrEqual(1);
        expect(colors.join("")).not.toMatch(/WWWW|BBBB/);
      }
    }
  });
});

describe("generateSwissNextRound", () => {
  it("pairs the first swiss round by upper and lower ranking halves", () => {
    const result = generateSwissNextRound(baseTournament);

    expect(result.warnings).toHaveLength(0);
    expect(result.round.games).toMatchObject([
      { whitePlayerId: "p1", blackPlayerId: "p3" },
      { whitePlayerId: "p2", blackPlayerId: "p4" },
    ]);
  });

  it("keeps the upper ranking half apart during the first two rounds", () => {
    const players = Array.from({ length: 8 }, (_, index) => ({
      id: `p${index + 1}`,
      name: `Player ${index + 1}`,
      rating: 2000 - index * 50,
      seed: index + 1,
      status: "active" as const,
    }));
    const firstRound = generateSwissNextRound({
      ...baseTournament,
      players,
    }).round;

    expect(
      firstRound.games.map((game) => [game.whitePlayerId, game.blackPlayerId]),
    ).toEqual([
      ["p1", "p5"],
      ["p2", "p6"],
      ["p3", "p7"],
      ["p4", "p8"],
    ]);

    const completedFirstRound = {
      ...firstRound,
      status: "completed" as const,
      games: firstRound.games.map((game) => ({
        ...game,
        result: "white_win" as const,
      })),
    };
    const secondRound = generateSwissNextRound({
      ...baseTournament,
      players,
      rounds: [completedFirstRound],
    }).round;
    const upperHalf = new Set(["p1", "p2", "p3", "p4"]);

    for (const game of secondRound.games) {
      expect(
        upperHalf.has(game.whitePlayerId!) &&
          upperHalf.has(game.blackPlayerId!),
      ).toBe(false);
      expect(
        upperHalf.has(game.whitePlayerId!) ||
          upperHalf.has(game.blackPlayerId!),
      ).toBe(true);
    }
  });

  it("uses rating before legacy seed when establishing the protected ranking", () => {
    const players = Array.from({ length: 8 }, (_, index) => ({
      id: `rank${index + 1}`,
      name: `Rank ${index + 1}`,
      rating: 2000 - index * 50,
      seed: 8 - index,
      status: "active" as const,
    }));
    const result = generateSwissNextRound({ ...baseTournament, players });
    const pairOfBest = result.round.games.find(
      (game) =>
        game.whitePlayerId === "rank1" || game.blackPlayerId === "rank1",
    );

    expect([pairOfBest?.whitePlayerId, pairOfBest?.blackPlayerId]).toContain(
      "rank5",
    );
  });

  it("assigns the bye and places it last, without displacing real boards", () => {
    const result = generateSwissNextRound({
      ...baseTournament,
      players: [
        ...baseTournament.players,
        { id: "p5", name: "Player 5", seed: 5, status: "active" },
      ],
    });

    const byeGame = result.round.games.find((game) => game.isBye);
    expect(byeGame).toMatchObject({
      whitePlayerId: "p5",
      result: "bye",
      isBye: true,
    });
    // El bye va al final y las partidas reales se numeran 1..N.
    expect(result.round.games.at(-1)).toBe(byeGame);
    const realBoards = result.round.games
      .filter((game) => !game.isBye)
      .map((game) => game.boardNumber);
    expect(realBoards).toEqual([1, 2]);
  });

  it("pairs late entrants with veterans, not only with each other", () => {
    const result = generateSwissNextRound({
      ...baseTournament,
      roundsPlanned: 5,
      players: [
        ...baseTournament.players,
        { id: "p5", name: "New 5", seed: 5, status: "active" },
        { id: "p6", name: "New 6", seed: 6, status: "active" },
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
              blackPlayerId: "p2",
              result: "white_win",
            },
            {
              id: "g2",
              boardNumber: 2,
              whitePlayerId: "p3",
              blackPlayerId: "p4",
              result: "white_win",
            },
          ],
        },
      ],
    });

    const gameOf = (id: string) =>
      result.round.games.find(
        (game) => game.whitePlayerId === id || game.blackPlayerId === id,
      )!;
    const opponentOf = (id: string) => {
      const game = gameOf(id);
      return game.whitePlayerId === id
        ? game.blackPlayerId
        : game.whitePlayerId;
    };
    const veterans = new Set(["p1", "p2", "p3", "p4"]);

    expect(opponentOf("p5")).not.toBe("p6");
    expect(veterans.has(opponentOf("p5")!)).toBe(true);
    expect(veterans.has(opponentOf("p6")!)).toBe(true);
  });

  it("warns when there are not enough active players", () => {
    const result = generateSwissNextRound({
      ...baseTournament,
      players: [{ id: "p1", name: "Player 1", seed: 1, status: "active" }],
    });

    expect(result.round.games).toHaveLength(0);
    expect(result.warnings[0]).toMatchObject({ code: "not_enough_players" });
  });

  // Regresión del torneo real: el pareo voraz dejaba al final a dos jugadores
  // que ya se habían enfrentado y los repetía, aunque existía una combinación
  // válida reacomodando las mesas anteriores.
  it("backtracks to avoid a repeat when a valid alternative pairing exists", () => {
    const result = generateSwissNextRound({
      ...baseTournament,
      players: [
        ...baseTournament.players,
        { id: "p5", name: "Player 5", seed: 5, status: "active" },
        { id: "p6", name: "Player 6", seed: 6, status: "active" },
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
              blackPlayerId: "p4",
              result: "draw",
            },
            {
              id: "g2",
              boardNumber: 2,
              whitePlayerId: "p2",
              blackPlayerId: "p3",
              result: "draw",
            },
            {
              id: "g3",
              boardNumber: 3,
              whitePlayerId: "p5",
              blackPlayerId: "p6",
              result: "draw",
            },
          ],
        },
      ],
    });

    // Con todos a 0.5 el orden es por seed: el voraz pareaba p1-p2 y p3-p4,
    // dejando a p5-p6 (que ya jugaron) como única mesa restante.
    const pairs = result.round.games.map((game) =>
      [game.whitePlayerId, game.blackPlayerId].sort().join("-"),
    );

    expect(pairs).not.toContain("p1-p4");
    expect(pairs).not.toContain("p2-p3");
    expect(pairs).not.toContain("p5-p6");
    expect(result.warnings).toHaveLength(0);
  });

  it("allows a repeat with a warning only when no alternative exists", () => {
    const result = generateSwissNextRound({
      ...baseTournament,
      players: [
        { id: "p1", name: "Player 1", seed: 1, status: "active" },
        { id: "p2", name: "Player 2", seed: 2, status: "active" },
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
              blackPlayerId: "p2",
              result: "white_win",
            },
          ],
        },
      ],
    });

    expect(result.round.games).toHaveLength(1);
    expect(result.warnings[0]).toMatchObject({ code: "repeat_pairing" });
  });

  it("does not give the bye to a late entrant on their first round", () => {
    const result = generateSwissNextRound({
      ...baseTournament,
      roundsPlanned: 5,
      players: [
        ...baseTournament.players,
        { id: "p5", name: "Late 5", seed: 5, status: "active" },
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
              blackPlayerId: "p2",
              result: "white_win",
            },
            {
              id: "g2",
              boardNumber: 2,
              whitePlayerId: "p3",
              blackPlayerId: "p4",
              result: "white_win",
            },
          ],
        },
      ],
    });

    const byeGame = result.round.games.find((game) => game.isBye);
    expect(byeGame).toBeDefined();
    expect(byeGame!.whitePlayerId).not.toBe("p5");

    const p5Game = result.round.games.find(
      (game) =>
        !game.isBye &&
        (game.whitePlayerId === "p5" || game.blackPlayerId === "p5"),
    );
    expect(p5Game).toBeDefined();
  });

  it("avoids repeated pairings when generating a later round", () => {
    const result = generateSwissNextRound({
      ...baseTournament,
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
              blackPlayerId: "p2",
              result: "white_win",
            },
            {
              id: "g2",
              boardNumber: 2,
              whitePlayerId: "p3",
              blackPlayerId: "p4",
              result: "white_win",
            },
          ],
        },
      ],
    });

    const pairs = result.round.games.map((game) =>
      [game.whitePlayerId, game.blackPlayerId].sort().join("-"),
    );

    expect(pairs).not.toContain("p1-p2");
    expect(pairs).not.toContain("p3-p4");
  });
});

describe("generateNextRoundPreview", () => {
  it("uses round robin generation for round robin tournaments", () => {
    const result = generateNextRoundPreview({
      ...baseTournament,
      system: "round_robin",
    });

    expect(result.round.games).toHaveLength(2);
  });

  it("uses actual round robin color history when assigning the next round", () => {
    const result = generateNextRoundPreview({
      ...baseTournament,
      system: "round_robin",
      roundsPlanned: 3,
      rounds: [
        {
          id: "rr-r1",
          roundNumber: 1,
          status: "completed",
          games: [
            {
              id: "r1-b1",
              boardNumber: 1,
              whitePlayerId: "p4",
              blackPlayerId: "p1",
              result: "white_win",
            },
            {
              id: "r1-b2",
              boardNumber: 2,
              whitePlayerId: "p3",
              blackPlayerId: "p2",
              result: "white_win",
            },
          ],
        },
      ],
    });

    expect(result.round.games).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ whitePlayerId: "p1", blackPlayerId: "p3" }),
        expect.objectContaining({ whitePlayerId: "p2", blackPlayerId: "p4" }),
      ]),
    );
  });
});
