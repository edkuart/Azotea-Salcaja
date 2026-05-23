import { calculateStandings } from "./standings";
import type { ChessTournament } from "./types";

export function getTournamentPodium(tournament: ChessTournament) {
  return calculateStandings(tournament).slice(0, 3);
}

export function getTournamentShareText(tournament: ChessTournament) {
  return `${tournament.title} en ${tournament.locationLabel}`;
}

export function getTournamentCoverImage(tournament: ChessTournament) {
  return (
    tournament.coverImage ??
    "https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=1600&q=80"
  );
}
