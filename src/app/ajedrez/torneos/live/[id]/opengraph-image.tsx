import { getTournament } from "@/lib/tournament-store";
import { officialChessTournaments } from "@/modules/chess/public-data";
import { renderResultsPoster, POSTER_SIZES } from "@/modules/chess/poster";
import { ImageResponse } from "next/og";

export const alt = "Resultados del torneo — Chessitos Salcajá";
export const size = POSTER_SIZES.og;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tournament =
    (await getTournament(id)) ??
    officialChessTournaments.find((t) => t.id === id);

  if (tournament && tournament.rounds.some((round) => round.games.length > 0)) {
    return renderResultsPoster(tournament, "og");
  }

  // Torneo sin partidas todavía (o no encontrado): marca genérica.
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #06182E 0%, #0B2A4A 60%, #1A1A1A 100%)",
          color: "#FFFDD0",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 8, textTransform: "uppercase", color: "#D4A017" }}>
          Chessitos · Salcajá
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, marginTop: 20 }}>
          {tournament?.title || "Torneo de ajedrez"}
        </div>
        <div style={{ display: "flex", fontSize: 28, marginTop: 18, opacity: 0.85 }}>
          Sigue el torneo en vivo · Cada lunes 7:30 p.m.
        </div>
      </div>
    ),
    size,
  );
}
