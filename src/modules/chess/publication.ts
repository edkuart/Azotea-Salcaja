import { calculateStandings } from "./standings";
import type { ChessTournament } from "./types";

export function getTournamentPodium(tournament: ChessTournament) {
  return calculateStandings(tournament).slice(0, 3);
}

export function getTournamentShareText(tournament: ChessTournament) {
  return `${tournament.title} en ${tournament.locationLabel}`;
}

/**
 * Portadas por defecto: pool de pósters de la marca en /public/images/torneos.
 * Se asignan por hash del id para que cada torneo conserve siempre la misma
 * portada, pero torneos distintos no se vean todos iguales.
 */
const DEFAULT_COVERS = [
  "/images/torneos/cover-01.svg",
  "/images/torneos/cover-02.svg",
  "/images/torneos/cover-03.svg",
  "/images/torneos/cover-04.svg",
  "/images/torneos/cover-05.svg",
  "/images/torneos/cover-06.svg",
];

/** Raster de respaldo para redes sociales (OG no acepta SVG). */
const SHARE_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=1600&q=80";

function hashId(id: string) {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

export function getTournamentCoverImage(tournament: ChessTournament) {
  return (
    tournament.coverImage ??
    DEFAULT_COVERS[hashId(tournament.id) % DEFAULT_COVERS.length]
  );
}

/** Imagen para compartir (OpenGraph): nunca SVG. */
export function getTournamentShareImage(tournament: ChessTournament) {
  const image = getTournamentCoverImage(tournament);
  return image.endsWith(".svg") ? SHARE_FALLBACK_IMAGE : image;
}
