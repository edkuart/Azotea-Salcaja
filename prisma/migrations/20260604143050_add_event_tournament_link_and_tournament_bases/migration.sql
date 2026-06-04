-- AlterTable
ALTER TABLE "chess_tournaments" ADD COLUMN     "prizes_json" JSONB,
ADD COLUMN     "regulations" TEXT;

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "cover_image_url" TEXT,
ADD COLUMN     "linked_tournament_id" TEXT;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_linked_tournament_id_fkey" FOREIGN KEY ("linked_tournament_id") REFERENCES "chess_tournaments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
