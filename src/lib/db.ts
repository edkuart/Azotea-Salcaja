import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export function db(): PrismaClient {
  if (!globalThis.__prisma) {
    const connectionString = (process.env.DATABASE_URL ?? process.env.DIRECT_URL)
      ?.trim()
      .replace(/[?&]pgbouncer=true/g, "");
    const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
    const adapter = new PrismaPg(pool);
    globalThis.__prisma = new PrismaClient({ adapter });
  }
  return globalThis.__prisma;
}
