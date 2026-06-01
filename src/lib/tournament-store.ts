import { PrismaClient } from "@prisma/client";
import type { ChessTournament } from "@/modules/chess/types";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function db(): PrismaClient {
  if (!globalThis.__prisma) {
    globalThis.__prisma = new PrismaClient();
  }
  return globalThis.__prisma;
}

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

export async function listTournaments(): Promise<ChessTournament[]> {
  const rows = await db().tournamentBlob.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map((r) => r.data as unknown as ChessTournament);
}

export async function deleteTournament(id: string): Promise<void> {
  try {
    await db().tournamentBlob.delete({ where: { id } });
  } catch { /* already deleted */ }
}
