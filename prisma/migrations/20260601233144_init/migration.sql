-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('owner', 'admin', 'editor');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('restaurant', 'chess', 'community');

-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "TournamentKind" AS ENUM ('official', 'private');

-- CreateEnum
CREATE TYPE "TournamentVisibility" AS ENUM ('draft', 'published', 'unlisted', 'archived');

-- CreateEnum
CREATE TYPE "TournamentSystem" AS ENUM ('swiss', 'round_robin');

-- CreateEnum
CREATE TYPE "TournamentStatus" AS ENUM ('setup', 'active', 'closed', 'cancelled');

-- CreateEnum
CREATE TYPE "PlayerStatus" AS ENUM ('active', 'withdrawn', 'absent');

-- CreateEnum
CREATE TYPE "RoundStatus" AS ENUM ('pending', 'paired', 'in_progress', 'completed', 'locked');

-- CreateEnum
CREATE TYPE "GameResult" AS ENUM ('white_win', 'black_win', 'draw', 'white_forfeit', 'black_forfeit', 'double_forfeit', 'bye', 'unplayed');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'editor',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "before_json" JSONB,
    "after_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurant_profiles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "maps_url" TEXT,
    "latitude" DECIMAL(65,30),
    "longitude" DECIMAL(65,30),
    "phone" TEXT,
    "whatsapp_phone" TEXT,
    "email" TEXT,
    "instagram_url" TEXT,
    "facebook_url" TEXT,
    "tiktok_url" TEXT,
    "price_range" TEXT,
    "serves_cuisine" TEXT,
    "hero_image_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "restaurant_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_hours" (
    "id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "opens_at" TEXT,
    "closes_at" TEXT,
    "is_closed" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,

    CONSTRAINT "business_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_categories" (
    "id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "menu_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "price_cents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GTQ',
    "image_id" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "starts_at" TIMESTAMP(3),
    "ends_at" TIMESTAMP(3),
    "image_id" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "description" TEXT,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3),
    "location_label" TEXT,
    "image_id" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_assets" (
    "id" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "public_url" TEXT,
    "alt_text" TEXT,
    "mime_type" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "size_bytes" INTEGER,
    "created_by_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chess_tournaments" (
    "id" TEXT NOT NULL,
    "kind" "TournamentKind" NOT NULL,
    "visibility" "TournamentVisibility" NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "system" "TournamentSystem" NOT NULL,
    "rounds_planned" INTEGER NOT NULL,
    "current_round_number" INTEGER NOT NULL DEFAULT 0,
    "status" "TournamentStatus" NOT NULL DEFAULT 'setup',
    "starts_at" TIMESTAMP(3),
    "location_label" TEXT,
    "bye_points" DECIMAL(65,30) NOT NULL DEFAULT 1,
    "forfeit_win_points" DECIMAL(65,30) NOT NULL DEFAULT 1,
    "forfeit_loss_points" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "draw_points" DECIMAL(65,30) NOT NULL DEFAULT 0.5,
    "win_points" DECIMAL(65,30) NOT NULL DEFAULT 1,
    "loss_points" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "tie_break_order_json" JSONB NOT NULL,
    "public_token_hash" TEXT,
    "manage_token_hash" TEXT,
    "created_by_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chess_tournaments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chess_players" (
    "id" TEXT NOT NULL,
    "tournament_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rating" INTEGER,
    "seed" INTEGER,
    "photo_id" TEXT,
    "status" "PlayerStatus" NOT NULL DEFAULT 'active',
    "withdrawn_after_round" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chess_players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chess_rounds" (
    "id" TEXT NOT NULL,
    "tournament_id" TEXT NOT NULL,
    "round_number" INTEGER NOT NULL,
    "status" "RoundStatus" NOT NULL DEFAULT 'pending',
    "generated_at" TIMESTAMP(3),
    "locked_at" TIMESTAMP(3),

    CONSTRAINT "chess_rounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chess_games" (
    "id" TEXT NOT NULL,
    "tournament_id" TEXT NOT NULL,
    "round_id" TEXT NOT NULL,
    "board_number" INTEGER NOT NULL,
    "white_player_id" TEXT,
    "black_player_id" TEXT,
    "result" "GameResult" NOT NULL DEFAULT 'unplayed',
    "white_score" DECIMAL(65,30),
    "black_score" DECIMAL(65,30),
    "is_bye" BOOLEAN NOT NULL DEFAULT false,
    "is_forfeit" BOOLEAN NOT NULL DEFAULT false,
    "reported_by_user_id" TEXT,
    "reported_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chess_games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chess_standings_snapshots" (
    "id" TEXT NOT NULL,
    "tournament_id" TEXT NOT NULL,
    "round_number" INTEGER NOT NULL,
    "standings_json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chess_standings_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chess_pairing_attempts" (
    "id" TEXT NOT NULL,
    "tournament_id" TEXT NOT NULL,
    "round_number" INTEGER NOT NULL,
    "algorithm" TEXT NOT NULL,
    "input_json" JSONB NOT NULL,
    "output_json" JSONB NOT NULL,
    "warnings_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chess_pairing_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournament_blobs" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tournament_blobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private_tournament_sessions" (
    "id" TEXT NOT NULL,
    "tournament_id" TEXT NOT NULL,
    "device_label" TEXT,
    "manage_token_hash" TEXT NOT NULL,
    "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "private_tournament_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_profiles_slug_key" ON "restaurant_profiles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "business_hours_restaurant_id_day_of_week_key" ON "business_hours"("restaurant_id", "day_of_week");

-- CreateIndex
CREATE UNIQUE INDEX "menu_categories_restaurant_id_slug_key" ON "menu_categories"("restaurant_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_category_id_slug_key" ON "products"("category_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "media_assets_bucket_path_key" ON "media_assets"("bucket", "path");

-- CreateIndex
CREATE UNIQUE INDEX "chess_tournaments_kind_slug_key" ON "chess_tournaments"("kind", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "chess_rounds_tournament_id_round_number_key" ON "chess_rounds"("tournament_id", "round_number");

-- CreateIndex
CREATE UNIQUE INDEX "chess_games_round_id_board_number_key" ON "chess_games"("round_id", "board_number");

-- CreateIndex
CREATE UNIQUE INDEX "chess_standings_snapshots_tournament_id_round_number_key" ON "chess_standings_snapshots"("tournament_id", "round_number");

-- AddForeignKey
ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant_profiles" ADD CONSTRAINT "restaurant_profiles_hero_image_id_fkey" FOREIGN KEY ("hero_image_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_hours" ADD CONSTRAINT "business_hours_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurant_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_categories" ADD CONSTRAINT "menu_categories_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurant_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "menu_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chess_tournaments" ADD CONSTRAINT "chess_tournaments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chess_players" ADD CONSTRAINT "chess_players_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "chess_tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chess_players" ADD CONSTRAINT "chess_players_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chess_rounds" ADD CONSTRAINT "chess_rounds_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "chess_tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chess_games" ADD CONSTRAINT "chess_games_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "chess_tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chess_games" ADD CONSTRAINT "chess_games_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "chess_rounds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chess_games" ADD CONSTRAINT "chess_games_white_player_id_fkey" FOREIGN KEY ("white_player_id") REFERENCES "chess_players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chess_games" ADD CONSTRAINT "chess_games_black_player_id_fkey" FOREIGN KEY ("black_player_id") REFERENCES "chess_players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chess_standings_snapshots" ADD CONSTRAINT "chess_standings_snapshots_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "chess_tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chess_pairing_attempts" ADD CONSTRAINT "chess_pairing_attempts_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "chess_tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_tournament_sessions" ADD CONSTRAINT "private_tournament_sessions_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "chess_tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
