import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getTournament } from "@/lib/tournament-store";
import { officialChessTournaments } from "@/modules/chess/public-data";
import { renderResultsPoster, POSTER_SIZES } from "@/modules/chess/poster";

export const dynamic = "force-dynamic";

/**
 * Póster PNG de resultados del torneo (1080×1350 por defecto, `?formato=og`
 * para 1200×630). Público: muestra lo mismo que la vista en vivo del torneo.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const tournament =
    (await getTournament(id)) ??
    officialChessTournaments.find((t) => t.id === id);

  if (!tournament) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!tournament.rounds.some((round) => round.games.length > 0)) {
    return NextResponse.json(
      { error: "El torneo aún no tiene partidas" },
      { status: 409 },
    );
  }

  const formato = req.nextUrl.searchParams.get("formato");
  const format = formato === "og" && formato in POSTER_SIZES ? "og" : "feed";
  return renderResultsPoster(tournament, format);
}
