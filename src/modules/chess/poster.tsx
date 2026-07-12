import { ImageResponse } from "next/og";

import { calculateStandings } from "./standings";
import { formatPoints, formatSpanishDate, SITE_URL } from "./share";
import type { ChessTournament } from "./types";

/**
 * Póster de resultados para redes sociales, generado con next/og (satori).
 * Solo texto — sin fotos de jugadores: el roster incluye menores y el póster
 * se publica fuera del sitio, así que no arrastramos imágenes personales.
 *
 * Dos tamaños: "feed" (1080×1350, publicación de Facebook/Instagram) y
 * "og" (1200×630, vista previa de enlaces).
 */

// Tokens de marca (espejo de globals.css — satori no lee CSS vars).
const INK = "#1A1A1A";
const STAGE = "#CC2D30";
const MARQUEE = "#D4A017";
const CREAM = "#FFFDD0";
const NAVY = "#0B2A4A";
const NAVY_DEEP = "#06182E";

const MEDAL_COLORS = [MARQUEE, "#9ca3af", "#8a5a2b"];

export type PosterFormat = "feed" | "og";

export const POSTER_SIZES: Record<PosterFormat, { width: number; height: number }> = {
  feed: { width: 1080, height: 1350 },
  og: { width: 1200, height: 630 },
};

export function renderResultsPoster(
  tournament: ChessTournament,
  format: PosterFormat = "feed",
): ImageResponse {
  const { width, height } = POSTER_SIZES[format];
  const standings = calculateStandings(tournament);
  const podium = standings.slice(0, 3);
  // En OG (bajo) solo cabe el podio; en feed mostramos tabla hasta el 10.º.
  const rest = format === "feed" ? standings.slice(3, 10) : [];
  const remaining = standings.length - 3 - rest.length;
  const date = formatSpanishDate(tournament.startsAt);
  const scale = format === "feed" ? 1 : 0.82;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: `linear-gradient(135deg, ${NAVY_DEEP} 0%, ${NAVY} 55%, ${INK} 100%)`,
          color: CREAM,
          padding: format === "feed" ? "56px 64px" : "40px 56px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Encabezado */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 26 * scale,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: MARQUEE,
            }}
          >
            Chessitos · Salcajá
          </div>
          <div
            style={{
              display: "flex",
              fontSize: (format === "feed" ? 58 : 48),
              fontWeight: 700,
              lineHeight: 1.05,
              marginTop: 14,
            }}
          >
            {tournament.title || "Torneo del club"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 18 }}>
            <div
              style={{
                display: "flex",
                background: STAGE,
                color: CREAM,
                fontSize: 24 * scale,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 3,
                padding: "8px 20px",
              }}
            >
              Resultados finales
            </div>
            {date ? (
              <div style={{ display: "flex", fontSize: 24 * scale, opacity: 0.85 }}>{date}</div>
            ) : null}
          </div>
        </div>

        {/* Podio */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 40 * scale, gap: 14 }}>
          {podium.map((standing, index) => (
            <div
              key={standing.playerId}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                background: "rgba(255,253,208,0.08)",
                borderLeft: `10px solid ${MEDAL_COLORS[index]}`,
                padding: `${(format === "feed" ? 20 : 12)}px 26px`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: (format === "feed" ? 52 : 40),
                  fontWeight: 700,
                  color: MEDAL_COLORS[index],
                  width: 64,
                }}
              >
                {index + 1}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: (format === "feed" ? 44 : 36),
                  fontWeight: 700,
                  flexGrow: 1,
                }}
              >
                {standing.name}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: (format === "feed" ? 40 : 32),
                  fontWeight: 700,
                  color: MARQUEE,
                }}
              >
                {formatPoints(standing.points)}
              </div>
            </div>
          ))}
        </div>

        {/* Resto de la tabla (solo formato feed) */}
        {rest.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", marginTop: 26, gap: 6 }}>
            {rest.map((standing, index) => (
              <div
                key={standing.playerId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  fontSize: 28,
                  padding: "7px 26px",
                  background: index % 2 === 0 ? "rgba(255,253,208,0.04)" : "transparent",
                }}
              >
                <div style={{ display: "flex", width: 46, opacity: 0.7 }}>{index + 4}</div>
                <div style={{ display: "flex", flexGrow: 1 }}>{standing.name}</div>
                <div style={{ display: "flex", opacity: 0.85 }}>{formatPoints(standing.points)}</div>
              </div>
            ))}
            {remaining > 0 ? (
              <div style={{ display: "flex", fontSize: 24, opacity: 0.6, padding: "6px 26px" }}>
                +{remaining} jugadores más
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Pie */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: 24,
            borderTop: "2px solid rgba(212,160,23,0.5)",
            fontSize: 24 * scale,
          }}
        >
          <div style={{ display: "flex", color: MARQUEE }}>
            {SITE_URL.replace(/^https?:\/\//, "")}/ajedrez/club
          </div>
          <div style={{ display: "flex", opacity: 0.85 }}>Cada lunes · 7:30 p.m.</div>
        </div>
      </div>
    ),
    { width, height },
  );
}
