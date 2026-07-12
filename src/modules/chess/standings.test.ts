import { describe, expect, it } from "vitest";

import {
  calculateStandings,
  getColorBalance,
  getNextRoundBlocker,
} from "./standings";
import type { ChessTournament } from "./types";

const baseTournament: ChessTournament = {
  id: "standings-test",
  kind: "official",
  visibility: "published",
  title: "Standings test",
  slug: "standings-test",
  description: "Test",
  system: "swiss",
  roundsPlanned: 3,
  currentRoundNumber: 1,
  status: "active",
  startsAt: "2026-01-01 19:30",
  locationLabel: "Azotea",
  tieBreakOrder: ["points", "buchholz_cut_1", "wins"],
  players: [
    {
      id: "p1",
      name: "Carlos Mendez",
      seed: 1,
      status: "active",
      avatarId: "chessitos-m01",
    },
    { id: "p2", name: "Sofia Perez", seed: 2, status: "active" },
    { id: "p3", name: "Ana Lopez", seed: 3, status: "active" },
    { id: "p4", name: "Diego Ramirez", seed: 4, status: "active" },
    { id: "p5", name: "Maria Garcia", seed: 5, status: "active" },
    { id: "p6", name: "Luis Hernandez", seed: 6, status: "active" },
  ],
  rounds: [],
};

describe("calculateStandings", () => {
  it("calculates points, wins, draws and losses from completed games", () => {
    const tournament: ChessTournament = {
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
              blackPlayerId: "p4",
              result: "white_win",
            },
            {
              id: "g2",
              boardNumber: 2,
              whitePlayerId: "p5",
              blackPlayerId: "p2",
              result: "black_win",
            },
            {
              id: "g3",
              boardNumber: 3,
              whitePlayerId: "p3",
              blackPlayerId: "p6",
              result: "draw",
            },
          ],
        },
      ],
    };

    const standings = calculateStandings(tournament);

    expect(standings[0]).toMatchObject({
      name: "Carlos Mendez",
      avatarId: "chessitos-m01",
      points: 1,
      wins: 1,
    });
    expect(standings[1]).toMatchObject({
      name: "Sofia Perez",
      points: 1,
      wins: 1,
      blackWins: 1,
    });
    expect(
      standings.find((standing) => standing.name === "Ana Lopez"),
    ).toMatchObject({
      points: 0.5,
      draws: 1,
    });
    expect(standings[0].tieBreaks.points).toBe(1);
    expect(standings[0].tieBreaks.buchholz_cut_1).toBeDefined();
  });

  it("counts bye points without affecting color balance", () => {
    const tournament: ChessTournament = {
      ...baseTournament,
      id: "bye-test",
      slug: "bye-test",
      title: "Bye test",
      tieBreakOrder: ["points", "wins"],
      players: [
        { id: "p1", name: "Player 1", seed: 1, status: "active" },
        { id: "p2", name: "Player 2", seed: 2, status: "active" },
        { id: "p3", name: "Player 3", seed: 3, status: "active" },
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
              whitePlayerId: "p3",
              result: "bye",
              whiteScore: 1,
              blackScore: 0,
              isBye: true,
            },
          ],
        },
      ],
    };

    const byeStanding = calculateStandings(tournament).find(
      (standing) => standing.playerId === "p3",
    );

    expect(byeStanding).toMatchObject({
      points: 1,
      played: 0,
      byes: 1,
      colorHistory: ["bye"],
    });
    expect(getColorBalance(byeStanding!)).toBe(0);
  });
});

describe("getNextRoundBlocker", () => {
  it("blocks next round generation when the latest round has pending games", () => {
    const tournament: ChessTournament = {
      ...baseTournament,
      rounds: [
        {
          id: "r1",
          roundNumber: 1,
          status: "in_progress",
          games: [
            {
              id: "g1",
              boardNumber: 1,
              whitePlayerId: "p1",
              blackPlayerId: "p4",
              result: "unplayed",
            },
            {
              id: "g2",
              boardNumber: 2,
              whitePlayerId: "p5",
              blackPlayerId: "p2",
              result: "unplayed",
            },
            {
              id: "g3",
              boardNumber: 3,
              whitePlayerId: "p3",
              blackPlayerId: "p6",
              result: "unplayed",
            },
          ],
        },
      ],
    };

    expect(getNextRoundBlocker(tournament)).toContain("Faltan 3 resultado");
  });

  it("allows first round generation when no rounds exist", () => {
    expect(getNextRoundBlocker(baseTournament)).toBeNull();
  });
});
