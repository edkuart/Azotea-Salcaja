UPDATE "club_players"
SET "member_since" = '2026-07-06'
WHERE "member_since" IS NULL;

UPDATE "club_players"
SET "club_category" = CASE
  WHEN "birth_date" IS NULL OR "birth_date" !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' THEN 'Libre'
  WHEN (
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, ("birth_date")::date))
  ) <= 10 THEN 'Sub 10'
  WHEN (
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, ("birth_date")::date))
  ) <= 12 THEN 'Sub 12'
  WHEN (
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, ("birth_date")::date))
  ) <= 14 THEN 'Sub 14'
  WHEN (
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, ("birth_date")::date))
  ) <= 16 THEN 'Sub 16'
  WHEN (
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, ("birth_date")::date))
  ) <= 18 THEN 'Sub 18'
  ELSE 'Libre'
END;

ALTER TABLE "club_players" DROP COLUMN "consent_reference";
