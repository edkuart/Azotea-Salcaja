import type { ChessTournament } from "@/modules/chess/types";

declare global {
  // eslint-disable-next-line no-var
  var __tournamentStore: Map<string, ChessTournament> | undefined;
}

function getStore(): Map<string, ChessTournament> {
  if (!globalThis.__tournamentStore) {
    globalThis.__tournamentStore = new Map();
  }
  return globalThis.__tournamentStore;
}

export function storeTournament(t: ChessTournament): void {
  getStore().set(t.id, t);
}

export function getTournament(id: string): ChessTournament | undefined {
  return getStore().get(id);
}

export function listTournaments(): ChessTournament[] {
  return Array.from(getStore().values());
}

export function deleteTournament(id: string): void {
  getStore().delete(id);
}
