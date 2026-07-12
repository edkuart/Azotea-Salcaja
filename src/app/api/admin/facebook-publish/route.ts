import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { requireApiSession } from "@/lib/auth/api";
import { getTournament } from "@/lib/tournament-store";
import { officialChessTournaments } from "@/modules/chess/public-data";
import { calculateStandings } from "@/modules/chess/standings";
import { buildResultsCaption } from "@/modules/chess/share";
import { renderResultsPoster } from "@/modules/chess/poster";

const GRAPH_VERSION = "v23.0";

/** ¿Está configurada la publicación en Facebook? (para que el admin lo sepa) */
export async function GET() {
  const auth = await requireApiSession();
  if (auth.response) return auth.response;
  return NextResponse.json({
    configured: Boolean(
      process.env.FACEBOOK_PAGE_ID && process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
    ),
  });
}

/**
 * Publica el póster de resultados + caption en la página de Facebook del club.
 * Requiere FACEBOOK_PAGE_ID y FACEBOOK_PAGE_ACCESS_TOKEN (token de página de
 * larga duración; ver docs/FACEBOOK_PUBLICACION.md). Sube el PNG como binario
 * para no depender de que Facebook pueda alcanzar la URL del sitio.
 */
export async function POST(req: NextRequest) {
  const auth = await requireApiSession();
  if (auth.response) return auth.response;

  const pageId = process.env.FACEBOOK_PAGE_ID;
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!pageId || !token) {
    return NextResponse.json(
      {
        error:
          "Publicación en Facebook sin configurar: faltan FACEBOOK_PAGE_ID y FACEBOOK_PAGE_ACCESS_TOKEN (ver docs/FACEBOOK_PUBLICACION.md).",
      },
      { status: 501 },
    );
  }

  const { tournamentId } = (await req.json().catch(() => ({}))) as {
    tournamentId?: string;
  };
  if (!tournamentId) {
    return NextResponse.json({ error: "Falta tournamentId" }, { status: 400 });
  }

  const tournament =
    (await getTournament(tournamentId)) ??
    officialChessTournaments.find((t) => t.id === tournamentId);
  if (!tournament) {
    return NextResponse.json({ error: "Torneo no encontrado" }, { status: 404 });
  }
  if (!tournament.rounds.some((round) => round.games.length > 0)) {
    return NextResponse.json(
      { error: "El torneo aún no tiene partidas" },
      { status: 409 },
    );
  }

  const caption = buildResultsCaption(tournament, calculateStandings(tournament));
  const posterPng = await renderResultsPoster(tournament, "feed").arrayBuffer();

  const form = new FormData();
  form.append("caption", caption);
  form.append("published", "true");
  form.append("access_token", token);
  form.append(
    "source",
    new Blob([posterPng], { type: "image/png" }),
    `resultados-${tournament.slug || tournament.id}.png`,
  );

  const res = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/${pageId}/photos`,
    { method: "POST", body: form },
  );
  const data = (await res.json().catch(() => ({}))) as {
    id?: string;
    post_id?: string;
    error?: { message?: string; code?: number };
  };

  if (!res.ok || data.error) {
    return NextResponse.json(
      {
        error:
          data.error?.message ??
          `Facebook respondió ${res.status}. Revisa el token de página.`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    postId: data.post_id ?? data.id,
    postUrl: data.post_id
      ? `https://www.facebook.com/${data.post_id}`
      : undefined,
  });
}
