import { ImageResponse } from "next/og";

import { listClubPlayers } from "@/lib/club-players-store";
import { listTournaments } from "@/lib/tournament-store";
import {
  computeClubRanking,
  getAnnualTable,
  getRankingYears,
} from "@/modules/chess/club-ranking";

export const alt = "Ranking del club — Chessitos Salcajá";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MEDAL_COLORS = ["#D4A017", "#9ca3af", "#8a5a2b"];

export default async function Image() {
  const [tournaments, clubPlayers] = await Promise.all([
    listTournaments(),
    listClubPlayers(),
  ]);
  const entries = computeClubRanking(tournaments, clubPlayers);
  const eloTop = entries.filter((e) => e.player.isActive && e.eloGames > 0).slice(0, 3);
  const year = getRankingYears(entries)[0] ?? String(new Date().getFullYear());
  const circuitTop = getAnnualTable(entries, year).slice(0, 3);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #06182E 0%, #0B2A4A 60%, #1A1A1A 100%)",
          color: "#FFFDD0",
          padding: "44px 56px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 6, textTransform: "uppercase", color: "#D4A017" }}>
          Chessitos · Salcajá
        </div>
        <div style={{ display: "flex", fontSize: 56, fontWeight: 700, marginTop: 10 }}>
          Ranking del club
        </div>

        <div style={{ display: "flex", gap: 40, marginTop: 34, flexGrow: 1 }}>
          {/* ELO */}
          <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, gap: 10 }}>
            <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#D4A017" }}>
              ELO del club
            </div>
            {eloTop.map((entry, index) => (
              <div
                key={entry.player.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  background: "rgba(255,253,208,0.08)",
                  borderLeft: `8px solid ${MEDAL_COLORS[index]}`,
                  padding: "12px 18px",
                  fontSize: 30,
                }}
              >
                <div style={{ display: "flex", fontWeight: 700, color: MEDAL_COLORS[index], width: 36 }}>
                  {index + 1}
                </div>
                <div style={{ display: "flex", flexGrow: 1, fontWeight: 700 }}>{entry.player.name}</div>
                <div style={{ display: "flex", color: "#D4A017", fontWeight: 700 }}>{entry.elo}</div>
              </div>
            ))}
          </div>

          {/* Circuito anual */}
          <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, gap: 10 }}>
            <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#D4A017" }}>
              Circuito {year}
            </div>
            {circuitTop.map(({ entry, points }, index) => (
              <div
                key={entry.player.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  background: "rgba(255,253,208,0.08)",
                  borderLeft: `8px solid ${MEDAL_COLORS[index]}`,
                  padding: "12px 18px",
                  fontSize: 30,
                }}
              >
                <div style={{ display: "flex", fontWeight: 700, color: MEDAL_COLORS[index], width: 36 }}>
                  {index + 1}
                </div>
                <div style={{ display: "flex", flexGrow: 1, fontWeight: 700 }}>{entry.player.name}</div>
                <div style={{ display: "flex", color: "#D4A017", fontWeight: 700 }}>{points} pts</div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 20,
            borderTop: "2px solid rgba(212,160,23,0.5)",
            fontSize: 22,
          }}
        >
          <div style={{ display: "flex", color: "#D4A017" }}>{new URL(process.env.APP_URL ?? "https://web-production-5f909.up.railway.app").host}/ajedrez/club</div>
          <div style={{ display: "flex", opacity: 0.85 }}>Cada lunes · 7:30 p.m.</div>
        </div>
      </div>
    ),
    size,
  );
}
