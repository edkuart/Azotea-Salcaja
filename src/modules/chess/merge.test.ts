import { describe, expect, it } from "vitest";

import { mergeTournamentResults, tournamentResultsEqual } from "./merge";
import type { ChessTournament } from "./types";

function make(
  results: Record<string, ChessTournament["rounds"][number]["games"][number]["result"]>,
): ChessTournament {
  return {
    id: "t",
    kind: "official",
    visibility: "published",
    title: "T",
    slug: "t",
    description: "",
    system: "swiss",
    roundsPlanned: 3,
    currentRoundNumber: 1,
    status: "active",
    startsAt: "2026-01-01 19:30",
    locationLabel: "Azotea",
    tieBreakOrder: ["points", "wins"],
    players: [
      { id: "p1", name: "P1", seed: 1, status: "active" },
      { id: "p2", name: "P2", seed: 2, status: "active" },
      { id: "p3", name: "P3", seed: 3, status: "active" },
      { id: "p4", name: "P4", seed: 4, status: "active" },
    ],
    rounds: [
      {
        id: "r1",
        roundNumber: 1,
        status: "paired",
        games: [
          { id: "g1", boardNumber: 1, whitePlayerId: "p1", blackPlayerId: "p2", result: results.g1 },
          { id: "g2", boardNumber: 2, whitePlayerId: "p3", blackPlayerId: "p4", result: results.g2 },
        ],
      },
    ],
  };
}

const resultOf = (t: ChessTournament, gid: string) =>
  t.rounds[0].games.find((g) => g.id === gid)!.result;

describe("mergeTournamentResults", () => {
  it("no pierde el resultado que registró otro árbitro", () => {
    // El que guarda (incoming) registró g1; el servidor ya tenía g2 de otro árbitro.
    const incoming = make({ g1: "white_win", g2: "unplayed" });
    const stored = make({ g1: "unplayed", g2: "black_win" });

    const merged = mergeTournamentResults(incoming, stored, "base");

    expect(resultOf(merged, "g1")).toBe("white_win");
    expect(resultOf(merged, "g2")).toBe("black_win");
  });

  it("conserva el resultado decidido frente a uno sin jugar", () => {
    const base = make({ g1: "unplayed", g2: "unplayed" });
    const overlay = make({ g1: "draw", g2: "unplayed" });

    const merged = mergeTournamentResults(base, overlay, "base");
    expect(resultOf(merged, "g1")).toBe("draw");
  });

  it("ante conflicto real respeta conflictWinner", () => {
    const base = make({ g1: "white_win", g2: "unplayed" });
    const overlay = make({ g1: "black_win", g2: "unplayed" });

    expect(resultOf(mergeTournamentResults(base, overlay, "base"), "g1")).toBe("white_win");
    expect(resultOf(mergeTournamentResults(base, overlay, "overlay"), "g1")).toBe("black_win");
  });

  it("tournamentResultsEqual detecta cambios de resultado", () => {
    const a = make({ g1: "unplayed", g2: "unplayed" });
    const b = make({ g1: "unplayed", g2: "unplayed" });
    const c = make({ g1: "white_win", g2: "unplayed" });

    expect(tournamentResultsEqual(a, b)).toBe(true);
    expect(tournamentResultsEqual(a, c)).toBe(false);
  });
});
