import type { ChessTournament, PlayerStanding } from "./types";

/**
 * Texto listo para publicar en redes (Facebook) al finalizar un torneo.
 * Isomórfico: lo usa el botón "Copiar texto" del admin y la publicación
 * automática vía Graph API.
 */

const MEDALS = ["🥇", "🥈", "🥉"];

export function formatPoints(points: number): string {
  return `${points} ${points === 1 ? "pt" : "pts"}`;
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://web-production-5f909.up.railway.app";

export function formatSpanishDate(isoDate?: string): string {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return "";
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("es-GT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function buildResultsCaption(
  tournament: ChessTournament,
  standings: PlayerStanding[],
): string {
  const lines: string[] = [];
  lines.push(`♟️ ${tournament.title || "Torneo Chessitos"} — ¡Resultados finales!`);

  const date = formatSpanishDate(tournament.startsAt);
  if (date) lines.push(`📅 ${date}`);
  lines.push("");

  standings.slice(0, 3).forEach((standing, index) => {
    lines.push(`${MEDALS[index]} ${standing.name} — ${formatPoints(standing.points)}`);
  });

  const rest = standings.length - 3;
  if (rest > 0) {
    lines.push("");
    lines.push(
      `¡Gracias a los ${standings.length} jugadores que participaron! 👏`,
    );
  }

  lines.push("");
  if (tournament.clubRanked) {
    lines.push(`📊 Ranking del club: ${SITE_URL}/ajedrez/club`);
  } else {
    lines.push(`📊 Tabla completa: ${SITE_URL}/ajedrez/torneos/live/${tournament.id}`);
  }
  lines.push("");
  lines.push("♟️ Chessitos · Azotea Salcajá — nos vemos el próximo lunes 7:30 p.m.");

  return lines.join("\n");
}
