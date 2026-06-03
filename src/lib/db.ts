import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export function db(): PrismaClient {
  if (!globalThis.__prisma) {
    // El adapter-pg necesita la URL directa (no el pooler pgbouncer de Supabase)
    const pool = new Pool({
      connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
    const adapter = new PrismaPg(pool);
    globalThis.__prisma = new PrismaClient({ adapter });
  }
  return globalThis.__prisma;
}
