import { describe, expect, it } from "vitest";

import { calculateStandings } from "./standings";
import type { ChessTournament } from "./types";

const tieBreakTournament: ChessTournament = {
  id: "tie-break-test",
  kind: "official",
  visibility: "published",
  title: "Tie break test",
  slug: "tie-break-test",
  description: "Test tournament",
  system: "swiss",
  roundsPlanned: 3,
  currentRoundNumber: 3,
  status: "closed",
  startsAt: "2026-01-01 19:30",
  locationLabel: "Azotea",
  tieBreakOrder: [
    "points",
    "buchholz_cut_1",
    "buchholz",
    "median_buchholz",
    "sonneborn_berger",
    "direct_encounter",
    "wins",
    "black_wins",
  ],
  players: [
    { id: "a", name: "A", seed: 1, status: "active" },
    { id: "b", name: "B", seed: 2, status: "active" },
    { id: "c", name: "C", seed: 3, status: "active" },
    { id: "d", name: "D", seed: 4, status: "active" },
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
          whitePlayerId: "a",
          blackPlayerId: "b",
          result: "white_win",
        },
        {
          id: "g2",
          boardNumber: 2,
          whitePlayerId: "c",
          blackPlayerId: "d",
          result: "white_win",
        },
      ],
    },
    {
      id: "r2",
      roundNumber: 2,
      status: "completed",
      games: [
        {
          id: "g3",
          boardNumber: 1,
          whitePlayerId: "a",
          blackPlayerId: "c",
          result: "draw",
        },
        {
          id: "g4",
          boardNumber: 2,
          whitePlayerId: "b",
          blackPlayerId: "d",
          result: "black_win",
        },
      ],
    },
    {
      id: "r3",
      roundNumber: 3,
      status: "completed",
      games: [
        {
          id: "g5",
          boardNumber: 1,
          whitePlayerId: "a",
          blackPlayerId: "d",
          result: "black_win",
        },
        {
          id: "g6",
          boardNumber: 2,
          whitePlayerId: "b",
          blackPlayerId: "c",
          result: "white_win",
        },
      ],
    },
  ],
};

describe("tie-break calculators", () => {
  it("decorates standings with configured tie-break values", () => {
    const standings = calculateStandings(tieBreakTournament);
    const playerA = standings.find((standing) => standing.playerId === "a");
    const playerD = standings.find((standing) => standing.playerId === "d");

    expect(playerA?.tieBreaks).toMatchObject({
      points: 1.5,
      buchholz: 4.5,
      buchholz_cut_1: 3.5,
      median_buchholz: 1.5,
      sonneborn_berger: 1.75,
      direct_encounter: 0.5,
      wins: 1,
      black_wins: 0,
    });

    expect(playerD?.tieBreaks).toMatchObject({
      points: 2,
      buchholz: 4,
      buchholz_cut_1: 3,
      sonneborn_berger: 2.5,
      wins: 2,
      black_wins: 2,
    });
  });

  it("orders tied players by the configured tie-break order", () => {
    const standings = calculateStandings(tieBreakTournament);

    expect(standings.map((standing) => standing.playerId)).toEqual([
      "d",
      "c",
      "a",
      "b",
    ]);
  });
});
