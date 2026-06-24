"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { PublicLayout } from "@/components/public/PublicLayout";
import { calculateStandings } from "@/modules/chess/standings";
import { formatTournamentSystem, formatTournamentStatus } from "@/modules/chess/public-data";
import type { ChessTournament } from "@/modules/chess/types";

function playerName(t: ChessTournament, id?: string) {
  if (!id) return "BYE";
  return t.players.find((p) => p.id === id)?.name ?? "?";
}

const RESULT_LABEL: Record<string, string> = {
  white_win: "1 – 0",
  black_win: "0 – 1",
  draw: "½ – ½",
  white_forfeit: "Forfeit",
  black_forfeit: "Forfeit",
  double_forfeit: "D.Forfeit",
  bye: "BYE",
  unplayed: "—",
};

const medalBorder = ["var(--color-marquee)", "#999", "#8a5a2b"];

export default function TournamentLivePage() {
  const { id } = useParams<{ id: string }>();
  const [tournament, setTournament] = useState<ChessTournament | null | "loading">("loading");
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchTournament = useCallback(async () => {
    try {
      const res = await fetch(`/api/tournaments/${id}`);
      if (!res.ok) { setTournament(null); return; }
      setTournament(await res.json());
      setLastFetched(new Date());
    } catch {
      setTournament(null);
    }
  }, [id]);

  useEffect(() => {
    fetchTournament();
    const interval = setInterval(fetchTournament, 30_000);
    return () => clearInterval(interval);
  }, [fetchTournament]);

  if (tournament === "loading") {
    return (
      <PublicLayout>
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontFamily: "var(--font-body)", color: "#888", fontSize: 14 }}>Cargando torneo…</p>
        </div>
      </PublicLayout>
    );
  }

  if (!tournament) {
    return (
      <PublicLayout>
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--color-ink)" }}>Torneo no encontrado</p>
          <Link href="/ajedrez/torneos" style={{ fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.14em", fontSize: 11, color: "var(--color-stage)" }}>
            ← Volver a torneos
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const standings = calculateStandings(tournament);
  const currentRound = tournament.rounds.at(-1) ?? null;
  const allRoundsGenerated = tournament.rounds.length >= tournament.roundsPlanned;
  const lastRoundDone = !currentRound || currentRound.games.every((g) => g.result !== "unplayed");
  const isFinished = allRoundsGenerated && lastRoundDone;

  return (
    <PublicLayout>
      <main style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px 64px" }}>

        {/* ── Header ── */}
        <div
          style={{
            background: "var(--color-ink)",
            color: "var(--color-cream)",
            padding: "20px 20px 18px",
            margin: "0 -16px",
            borderBottom: "4px solid var(--color-stage)",
          }}
        >
          <Link
            href="/ajedrez/torneos"
            style={{
              fontFamily: "var(--font-poster)",
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              fontSize: 10,
              color: "var(--color-marquee)",
              textDecoration: "none",
              display: "block",
              marginBottom: 10,
            }}
          >
            ← Torneos
          </Link>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
            }}
          >
            {tournament.title}
          </h1>
          <div
            style={{
              marginTop: 10,
              display: "flex",
              flexWrap: "wrap",
              gap: "6px 16px",
              fontFamily: "var(--font-poster)",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              fontSize: 10,
              color: "rgba(255,253,208,0.75)",
            }}
          >
            <span>{formatTournamentSystem(tournament.system)}</span>
            <span>·</span>
            <span>
              Ronda {tournament.rounds.length}/{tournament.roundsPlanned}
            </span>
            <span>·</span>
            <span>{tournament.players.length} jugadores</span>
            {tournament.locationLabel && (
              <>
                <span>·</span>
                <span>{tournament.locationLabel}</span>
              </>
            )}
          </div>

          {/* Status badge */}
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px 12px" }}>
            <span
              style={{
                display: "inline-block",
                background: isFinished ? "var(--color-navy)" : "var(--color-stage)",
                color: "var(--color-cream)",
                fontFamily: "var(--font-poster)",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                fontSize: 10,
                padding: "3px 10px",
              }}
            >
              {isFinished ? "Finalizado" : formatTournamentStatus(tournament.status)}
            </span>
            {lastFetched && (
              <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 9.5, color: "rgba(255,253,208,0.5)", letterSpacing: "0.1em" }}>
                Actualizado {lastFetched.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            )}
            <button
              type="button"
              onClick={fetchTournament}
              style={{
                marginLeft: "auto",
                fontFamily: "var(--font-poster)",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                fontSize: 10,
                background: "transparent",
                border: "1px solid rgba(255,253,208,0.3)",
                color: "rgba(255,253,208,0.7)",
                padding: "4px 10px",
                cursor: "pointer",
              }}
            >
              Actualizar ↺
            </button>
          </div>
        </div>

        {/* ── Current Round ── */}
        {currentRound ? (
          <div style={{ marginTop: 24 }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-poster)",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  fontSize: 11,
                  color: "var(--color-ink)",
                }}
              >
                <em style={{ fontFamily: "var(--font-chess)", fontStyle: "italic", color: "var(--color-stage)", marginRight: 4, fontSize: 14 }}>♜</em>
                Ronda {currentRound.roundNumber}
              </p>
              <span
                style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: lastRoundDone ? "var(--color-navy)" : "var(--color-stage)",
                }}
              >
                {lastRoundDone ? "Completada" : `${currentRound.games.filter((g) => g.result === "unplayed").length} pendientes`}
              </span>
            </div>

            <div
              style={{
                border: "2px solid var(--color-ink)",
                background: "var(--color-grain)",
                boxShadow: "4px 4px 0 var(--color-ink)",
              }}
            >
              {currentRound.games.map((game, i) => {
                const isLast = i === currentRound.games.length - 1;
                const pending = game.result === "unplayed";
                const white = playerName(tournament, game.whitePlayerId);
                const black = playerName(tournament, game.blackPlayerId);

                if (game.isBye) {
                  return (
                    <div
                      key={game.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "13px 14px",
                        borderBottom: isLast ? "none" : "1px dashed rgba(26,26,26,0.2)",
                      }}
                    >
                      <span style={{ fontFamily: "var(--font-poster)", fontSize: 15, color: "var(--color-stage)", width: 22, textAlign: "center", flexShrink: 0 }}>B</span>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, flex: 1 }}>{white}</span>
                      <span style={{
                        fontFamily: "ui-monospace, monospace",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        background: "var(--color-ink)",
                        color: "var(--color-cream)",
                        padding: "3px 10px",
                      }}>BYE · +1</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={game.id}
                    style={{
                      borderBottom: isLast ? "none" : "1px dashed rgba(26,26,26,0.2)",
                      padding: "13px 14px",
                    }}
                  >
                    {/* Board label */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                      <span style={{ fontFamily: "var(--font-poster)", fontSize: 11, color: "var(--color-stage)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
                        Mesa {game.boardNumber}
                      </span>
                      {!pending && (
                        <span style={{
                          fontFamily: "ui-monospace, monospace",
                          fontSize: 10,
                          fontWeight: 700,
                          background: "var(--color-ink)",
                          color: "var(--color-cream)",
                          padding: "1px 8px",
                          letterSpacing: "0.08em",
                        }}>
                          {RESULT_LABEL[game.result]}
                        </span>
                      )}
                      {pending && (
                        <span style={{
                          fontFamily: "ui-monospace, monospace",
                          fontSize: 10,
                          border: "1px dashed rgba(26,26,26,0.3)",
                          color: "#999",
                          padding: "1px 8px",
                          letterSpacing: "0.08em",
                        }}>
                          En juego
                        </span>
                      )}
                    </div>

                    {/* Players side by side */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 28px 1fr", alignItems: "center", gap: 4 }}>
                      <div style={{ background: pending ? "rgba(26,26,26,0.05)" : "var(--color-ink)", border: "2px solid var(--color-ink)", padding: "8px 12px" }}>
                        <p style={{ fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.12em", fontSize: 9, color: pending ? "#888" : "var(--color-marquee)", marginBottom: 2 }}>Blancas</p>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, color: pending ? "var(--color-ink)" : "var(--color-cream)", lineHeight: 1.1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{white}</p>
                      </div>
                      <div style={{ textAlign: "center", fontFamily: "var(--font-chess)", fontStyle: "italic", fontSize: 16, color: "var(--color-stage)" }}>vs</div>
                      <div style={{ background: pending ? "rgba(26,26,26,0.05)" : "var(--color-stage)", border: "2px solid var(--color-ink)", padding: "8px 12px" }}>
                        <p style={{ fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.12em", fontSize: 9, color: pending ? "#888" : "rgba(255,253,208,0.75)", marginBottom: 2 }}>Negras</p>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, color: pending ? "var(--color-ink)" : "var(--color-cream)", lineHeight: 1.1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{black}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div
            style={{
              marginTop: 24,
              border: "2px dashed rgba(26,26,26,0.2)",
              padding: "32px 16px",
              textAlign: "center",
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "#888",
            }}
          >
            El torneo aún no tiene rondas generadas.
          </div>
        )}

        {/* ── Standings ── */}
        {standings.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <p
              style={{
                fontFamily: "var(--font-poster)",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                fontSize: 11,
                color: "var(--color-ink)",
                marginBottom: 12,
              }}
            >
              <em style={{ fontFamily: "var(--font-chess)", fontStyle: "italic", color: "var(--color-stage)", marginRight: 4, fontSize: 14 }}>♛</em>
              Tabla de posiciones
            </p>

            {/* Top 3 */}
            {standings.length >= 2 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
                {[0, 1, 2].map((i) => {
                  const s = standings[i];
                  if (!s) return null;
                  return (
                    <div
                      key={i}
                      style={{
                        background: "var(--color-grain)",
                        border: "2px solid var(--color-ink)",
                        borderLeft: `4px solid ${medalBorder[i]}`,
                        padding: "8px 10px",
                        boxShadow: "2px 2px 0 var(--color-ink)",
                      }}
                    >
                      <p style={{ fontFamily: "var(--font-poster)", fontSize: 9, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.14em" }}>{i + 1}°</p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</p>
                      <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 16, fontWeight: 700, color: "var(--color-stage)", marginTop: 2 }}>{s.points}</p>
                    </div>
                  );
                })}
              </div>
            )}

            <div
              style={{
                border: "2px solid var(--color-ink)",
                background: "var(--color-grain)",
                overflowX: "auto",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "var(--color-ink)", color: "var(--color-cream)" }}>
                    <th style={{ padding: "8px 10px", fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.14em", fontSize: 9.5, fontWeight: 400, textAlign: "left" }}>#</th>
                    <th style={{ padding: "8px 10px", fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.14em", fontSize: 9.5, fontWeight: 400, textAlign: "left" }}>Jugador</th>
                    <th style={{ padding: "8px 10px", fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.14em", fontSize: 9.5, fontWeight: 400, textAlign: "right" }}>Pts</th>
                    <th style={{ padding: "8px 10px", fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.14em", fontSize: 9.5, fontWeight: 400, textAlign: "center" }}>G-T-P</th>
                    {tournament.rounds.map((r) => (
                      <th key={r.id} style={{ padding: "8px 6px", fontFamily: "var(--font-poster)", textTransform: "uppercase", fontSize: 9, fontWeight: 400, textAlign: "center", letterSpacing: "0.1em" }}>R{r.roundNumber}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {standings.map((s, i) => (
                    <tr
                      key={s.playerId}
                      style={{
                        borderBottom: "1px dashed rgba(26,26,26,0.18)",
                        borderLeft: i < 3 ? `4px solid ${medalBorder[i]}` : "4px solid transparent",
                        background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)",
                      }}
                    >
                      <td style={{ padding: "8px 10px", fontFamily: "var(--font-poster)", fontSize: 13, color: "var(--color-stage)" }}>{i + 1}</td>
                      <td style={{ padding: "8px 10px" }}>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600 }}>{s.name}</p>
                        {s.rating && <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 9, color: "#888" }}>{s.rating}</p>}
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "ui-monospace, monospace", fontSize: 14, fontWeight: 700, color: "var(--color-stage)" }}>{s.points}</td>
                      <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "ui-monospace, monospace", fontSize: 10, color: "#666" }}>{s.wins}-{s.draws}-{s.losses}</td>
                      {tournament.rounds.map((round) => {
                        const game = round.games.find((g) => g.whitePlayerId === s.playerId || g.blackPlayerId === s.playerId);
                        let cell = "·"; let color = "#ccc";
                        if (game) {
                          const isWhite = game.whitePlayerId === s.playerId;
                          const score = isWhite ? game.whiteScore : game.blackScore;
                          if (score !== undefined) {
                            if (game.isBye) { cell = "B"; color = "var(--color-emerald)"; }
                            else if (score === 1) { cell = "1"; color = "var(--color-emerald)"; }
                            else if (score === 0.5) { cell = "½"; color = "var(--color-amber)"; }
                            else { cell = "0"; color = "var(--color-stage)"; }
                          }
                        }
                        return (
                          <td key={round.id} style={{ padding: "8px 6px", textAlign: "center" }}>
                            <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, fontWeight: 700, color }}>{cell}</span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── All rounds history ── */}
        {tournament.rounds.length > 1 && (
          <div style={{ marginTop: 32 }}>
            <p
              style={{
                fontFamily: "var(--font-poster)",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                fontSize: 11,
                color: "var(--color-ink)",
                marginBottom: 12,
              }}
            >
              Rondas anteriores
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              {[...tournament.rounds].reverse().slice(1).map((round) => (
                <details
                  key={round.id}
                  style={{
                    border: "2px solid var(--color-ink)",
                    background: "var(--color-grain)",
                  }}
                >
                  <summary
                    style={{
                      padding: "10px 14px",
                      fontFamily: "var(--font-poster)",
                      textTransform: "uppercase",
                      letterSpacing: "0.16em",
                      fontSize: 10,
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "var(--color-ink)",
                      color: "var(--color-cream)",
                    }}
                  >
                    <span>
                      <em style={{ fontFamily: "var(--font-chess)", fontStyle: "italic", color: "var(--color-marquee)", marginRight: 6, fontSize: 12 }}>♜</em>
                      Ronda {round.roundNumber}
                    </span>
                    <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 9, opacity: 0.6 }}>
                      {round.games.length} partidas
                    </span>
                  </summary>
                  <div>
                    {round.games.map((game, i) => {
                      const isLast = i === round.games.length - 1;
                      const w = playerName(tournament, game.whitePlayerId);
                      const b = playerName(tournament, game.blackPlayerId);
                      return (
                        <div
                          key={game.id}
                          style={{
                            padding: "10px 14px",
                            borderBottom: isLast ? "none" : "1px dashed rgba(26,26,26,0.15)",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: game.isBye ? 0 : 7 }}>
                            <span style={{ fontFamily: "var(--font-poster)", fontSize: 10, color: "var(--color-stage)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                              {game.isBye ? "BYE" : `Mesa ${game.boardNumber}`}
                            </span>
                            <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 10, fontWeight: 700, background: "var(--color-ink)", color: "var(--color-cream)", padding: "1px 8px" }}>
                              {RESULT_LABEL[game.result]}
                            </span>
                          </div>
                          {!game.isBye ? (
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 24px 1fr", alignItems: "center", gap: 4 }}>
                              <p style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w}</p>
                              <span style={{ textAlign: "center", fontFamily: "var(--font-chess)", fontStyle: "italic", fontSize: 13, color: "var(--color-stage)" }}>vs</span>
                              <p style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "right" }}>{b}</p>
                            </div>
                          ) : (
                            <p style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600 }}>{w}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

      </main>
    </PublicLayout>
  );
}
