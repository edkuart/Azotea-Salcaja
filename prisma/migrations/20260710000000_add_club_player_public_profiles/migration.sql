ALTER TABLE "club_players"
  ADD COLUMN "public_slug" TEXT,
  ADD COLUMN "public_name" TEXT,
  ADD COLUMN "member_since" TEXT,
  ADD COLUMN "club_category" TEXT,
  ADD COLUMN "profile_visibility" TEXT NOT NULL DEFAULT 'private',
  ADD COLUMN "show_photo" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "show_age_band" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "show_stats" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "allow_sharing" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "consent_recorded_at" TEXT,
  ADD COLUMN "consent_reference" TEXT;

UPDATE "club_players"
SET "public_slug" = 'miembro-' || LOWER(SUBSTRING("id" FROM 1 FOR 10))
WHERE "public_slug" IS NULL;

CREATE UNIQUE INDEX "club_players_public_slug_key"
ON "club_players"("public_slug");

