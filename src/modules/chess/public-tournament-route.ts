import type { ChessTournament } from "./types";

type TournamentRouteIdentity = Pick<
  ChessTournament,
  "id" | "slug" | "startsAt"
>;

function routeDate(startsAt: string) {
  const match = startsAt.match(/^\d{4}-\d{2}-\d{2}/);
  return match?.[0];
}

/**
 * Los títulos pueden repetirse semana a semana. La fecha convierte el slug
 * editorial en una ruta pública estable sin exponer identificadores internos.
 */
export function getTournamentArchiveSlug(tournament: TournamentRouteIdentity) {
  const suffix = routeDate(tournament.startsAt) ?? tournament.id;
  return `${tournament.slug}-${suffix}`;
}

export function getTournamentPublicHref(tournament: TournamentRouteIdentity) {
  return tournament.id.startsWith("t")
    ? `/ajedrez/torneos/live/${tournament.id}`
    : `/ajedrez/torneos/${getTournamentArchiveSlug(tournament)}`;
}

export function resolveTournamentArchiveSlug<T extends TournamentRouteIdentity>(
  tournaments: T[],
  requestedSlug: string,
): T | undefined {
  const exact = tournaments.find(
    (tournament) => getTournamentArchiveSlug(tournament) === requestedSlug,
  );
  if (exact) return exact;

  // Compatibilidad con URLs antiguas sin fecha. Si había duplicados, esa URL
  // ya era ambigua; dirigirla al torneo más reciente conserva su uso original.
  return tournaments
    .filter((tournament) => tournament.slug === requestedSlug)
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt))[0];
}
