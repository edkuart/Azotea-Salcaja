-- AlterTable
ALTER TABLE "events" ADD COLUMN "linked_tournament_ids" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Backfill: eventos con un torneo único ya vinculado pasan a la lista.
UPDATE "events"
SET "linked_tournament_ids" = ARRAY["linked_tournament_id"]
WHERE "linked_tournament_id" IS NOT NULL
  AND cardinality("linked_tournament_ids") = 0;
