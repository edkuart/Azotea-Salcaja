import type { ChessTournament } from "@/modules/chess/types";
import { db } from "@/lib/db";

export async function storeTournament(t: ChessTournament): Promise<void> {
  await db().tournamentBlob.upsert({
    where: { id: t.id },
    update: { data: t as object },
    create: { id: t.id, data: t as object },
  });
}

export async function getTournament(id: string): Promise<ChessTournament | null> {
  const row = await db().tournamentBlob.findUnique({ where: { id } });
  return row ? (row.data as unknown as ChessTournament) : null;
}

/**
 * Trae varios torneos en una sola consulta, respetando el orden de `ids` y
 * omitiendo los que no existan. Evita N consultas al pintar un evento con
 * varias categorías.
 */
export async function getTournamentsByIds(
  ids: string[],
): Promise<ChessTournament[]> {
  if (ids.length === 0) return [];
  const rows = await db().tournamentBlob.findMany({ where: { id: { in: ids } } });
  const byId = new Map(
    rows.map((r) => [r.id, r.data as unknown as ChessTournament]),
  );
  return ids.map((id) => byId.get(id)).filter((t): t is ChessTournament => t != null);
}

export async function listTournaments(): Promise<ChessTournament[]> {
  const rows = await db().tournamentBlob.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map((r) => r.data as unknown as ChessTournament);
}

export async function deleteTournament(id: string): Promise<void> {
  try {
    await db().tournamentBlob.delete({ where: { id } });
  } catch { /* already deleted */ }
}
