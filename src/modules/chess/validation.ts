import { z } from "zod";

export const privateTournamentDraftSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .catch("Torneo casual"),
  system: z.enum(["swiss", "round_robin"]).catch("swiss"),
  roundsPlanned: z.coerce
    .number()
    .int()
    .catch(3)
    .transform((value) => Math.max(1, Math.min(15, value))),
  playerNames: z
    .array(z.string().trim().min(1).max(60))
    .min(2)
    .max(64)
    .transform((names) => [...new Set(names)]),
  createdAt: z.string().datetime().catch(() => new Date().toISOString()),
});

export function sanitizePrivatePlayerNames(playerNames: string[]) {
  return playerNames
    .map((name) => name.trim().slice(0, 60))
    .filter(Boolean)
    .slice(0, 64);
}
