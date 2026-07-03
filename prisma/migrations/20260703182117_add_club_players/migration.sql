-- CreateTable
CREATE TABLE "club_players" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rating" INTEGER,
    "fide_id" TEXT,
    "title" TEXT,
    "sex" TEXT,
    "birth_date" TEXT,
    "photo_url" TEXT,
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "club_players_pkey" PRIMARY KEY ("id")
);
