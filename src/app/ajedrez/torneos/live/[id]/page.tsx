"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { PublicLayout } from "@/components/public/PublicLayout";
import { TournamentPlayerIdentity } from "@/components/chess/TournamentPlayerIdentity";
import { VictoryPodium } from "@/components/chess/VictoryPodium";
import { StandingsTable } from "@/components/chess/StandingsTable";
import { calculateStandings } from "@/modules/chess/standings";
import {
  formatTournamentStatus,
  formatTournamentSystem,
  getEffectiveTournamentStatus,
  getTournamentSummary,
} from "@/modules/chess/public-data";
import type { ChessTournament } from "@/modules/chess/types";

function tournamentPlayer(t: ChessTournament, id?: string) {
  if (!id) return undefined;
  return t.players.find((player) => player.id === id);
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

export default function TournamentLivePage() {
  const { id } = useParams<{ id: string }>();
  const [tournament, setTournament] = useState<
    ChessTournament | null | "loading"
  >("loading");
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchTournament = useCallback(async () => {
    try {
      const res = await fetch(`/api/tournaments/${id}`);
      if (!res.ok) {
        setTournament(null);
        return;
      }
      setTournament(await res.json());
      setLastFetched(new Date());
    } catch {
      setTournament(null);
    }
  }, [id]);

  useEffect(() => {
    const initial = setTimeout(fetchTournament, 0);
    const interval = setInterval(fetchTournament, 30_000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [fetchTournament]);

  if (tournament === "loading") {
    return (
      <PublicLayout>
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              color: "#888",
              fontSize: 14,
            }}
          >
            Cargando torneo…
          </p>
        </div>
      </PublicLayout>
    );
  }

  if (!tournament) {
    return (
      <PublicLayout>
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              color: "var(--color-ink)",
            }}
          >
            Torneo no encontrado
          </p>
          <Link
            href="/ajedrez/torneos"
            style={{
              fontFamily: "var(--font-poster)",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              fontSize: 11,
              color: "var(--color-stage)",
            }}
          >
            ← Volver a torneos
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const standings = calculateStandings(tournament);
  const summary = getTournamentSummary(tournament);
  const currentRound = tournament.rounds.at(-1) ?? null;
  const lastRoundDone =
    !currentRound || currentRound.games.every((g) => g.result !== "unplayed");
  const isFinished = getEffectiveTournamentStatus(tournament) === "closed";
  // En curso, la ronda actual se destaca arriba; el histórico solo lista las
  // rondas anteriores. Al finalizar, todas las rondas van al histórico cerrado.
  const historyRounds = isFinished
    ? [...tournament.rounds].reverse()
    : tournament.rounds.slice(0, -1).reverse();
  const registeredPlayers = [...tournament.players].sort((a, b) =>
    a.name.localeCompare(b.name, "es"),
  );

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
          <div
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px 12px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                background: isFinished
                  ? "var(--color-navy)"
                  : "var(--color-stage)",
                color: "var(--color-cream)",
                fontFamily: "var(--font-poster)",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                fontSize: 10,
                padding: "3px 10px",
              }}
            >
              {formatTournamentStatus(getEffectiveTournamentStatus(tournament))}
            </span>
            {lastFetched && (
              <span
                style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 9.5,
                  color: "rgba(255,253,208,0.5)",
                  letterSpacing: "0.1em",
                }}
              >
                Actualizado{" "}
                {lastFetched.toLocaleTimeString("es", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
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

        {/* ── Podio principal (solo al finalizar el torneo) ── */}
        {isFinished && standings.length >= 2 && (
          <section style={{ marginTop: 20 }} aria-labelledby="podio-heading">
            <p
              id="podio-heading"
              style={{
                fontFamily: "var(--font-poster)",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                fontSize: 11,
                color: "var(--color-ink)",
                marginBottom: 12,
              }}
            >
              <em
                style={{
                  fontFamily: "var(--font-chess)",
                  fontStyle: "italic",
                  color: "var(--color-stage)",
                  marginRight: 5,
                  fontSize: 14,
                }}
              >
                ♛
              </em>
              Podio del torneo
            </p>
            <VictoryPodium
              celebrate={isFinished}
              entries={standings.slice(0, 3).map((standing) => ({
                playerId: standing.playerId,
                name: standing.name,
                photoUrl: standing.photoUrl,
                avatarId: standing.avatarId,
                points: standing.points,
                wins: standing.wins,
              }))}
              label={`Podio de ${tournament.title}`}
            />
          </section>
        )}

        {/* ── Emparejamientos de la ronda actual (torneo en curso) ── */}
        {!isFinished &&
          (currentRound ? (
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
                  <em
                    style={{
                      fontFamily: "var(--font-chess)",
                      fontStyle: "italic",
                      color: "var(--color-stage)",
                      marginRight: 4,
                      fontSize: 14,
                    }}
                  >
                    ♜
                  </em>
                  Ronda {currentRound.roundNumber}
                </p>
                <span
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: lastRoundDone
                      ? "var(--color-navy)"
                      : "var(--color-stage)",
                  }}
                >
                  {lastRoundDone
                    ? "Completada"
                    : `${currentRound.games.filter((g) => g.result === "unplayed").length} pendientes`}
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
                  const whitePlayer = tournamentPlayer(
                    tournament,
                    game.whitePlayerId,
                  );
                  const blackPlayer = tournamentPlayer(
                    tournament,
                    game.blackPlayerId,
                  );
                  const white = whitePlayer?.name ?? "BYE";
                  const black = blackPlayer?.name ?? "BYE";

                  if (game.isBye) {
                    return (
                      <div
                        key={game.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "13px 14px",
                          borderBottom: isLast
                            ? "none"
                            : "1px dashed rgba(26,26,26,0.2)",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-poster)",
                            fontSize: 15,
                            color: "var(--color-stage)",
                            width: 22,
                            textAlign: "center",
                            flexShrink: 0,
                          }}
                        >
                          B
                        </span>
                        <TournamentPlayerIdentity
                          name={white}
                          photoUrl={whitePlayer?.photoUrl}
                          avatarId={whitePlayer?.avatarId}
                          size={32}
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 14,
                            fontWeight: 700,
                            flex: 1,
                          }}
                          nameClassName="truncate"
                        />
                        <span
                          style={{
                            fontFamily: "ui-monospace, monospace",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            background: "var(--color-ink)",
                            color: "var(--color-cream)",
                            padding: "3px 10px",
                          }}
                        >
                          BYE · +1
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={game.id}
                      style={{
                        borderBottom: isLast
                          ? "none"
                          : "1px dashed rgba(26,26,26,0.2)",
                        padding: "13px 14px",
                      }}
                    >
                      {/* Board label */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          marginBottom: 8,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-poster)",
                            fontSize: 11,
                            color: "var(--color-stage)",
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                          }}
                        >
                          Mesa {game.boardNumber}
                        </span>
                        {!pending && (
                          <span
                            style={{
                              fontFamily: "ui-monospace, monospace",
                              fontSize: 10,
                              fontWeight: 700,
                              background: "var(--color-ink)",
                              color: "var(--color-cream)",
                              padding: "1px 8px",
                              letterSpacing: "0.08em",
                            }}
                          >
                            {RESULT_LABEL[game.result]}
                          </span>
                        )}
                        {pending && (
                          <span
                            style={{
                              fontFamily: "ui-monospace, monospace",
                              fontSize: 10,
                              border: "1px dashed rgba(26,26,26,0.3)",
                              color: "#999",
                              padding: "1px 8px",
                              letterSpacing: "0.08em",
                            }}
                          >
                            En juego
                          </span>
                        )}
                      </div>

                      {/* Players side by side */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 28px 1fr",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <div
                          style={{
                            minWidth: 0,
                            overflow: "hidden",
                            background: pending
                              ? "rgba(26,26,26,0.05)"
                              : "var(--color-ink)",
                            border: "2px solid var(--color-ink)",
                            padding: "8px 12px",
                          }}
                        >
                          <p
                            style={{
                              fontFamily: "var(--font-poster)",
                              textTransform: "uppercase",
                              letterSpacing: "0.12em",
                              fontSize: 9,
                              color: pending ? "#888" : "var(--color-marquee)",
                              marginBottom: 2,
                            }}
                          >
                            Blancas
                          </p>
                          <TournamentPlayerIdentity
                            name={white}
                            photoUrl={whitePlayer?.photoUrl}
                            avatarId={whitePlayer?.avatarId}
                            size={30}
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: 14,
                              fontWeight: 700,
                              color: pending
                                ? "var(--color-ink)"
                                : "var(--color-cream)",
                              lineHeight: 1.1,
                              maxWidth: "100%",
                            }}
                            nameClassName="truncate"
                          />
                        </div>
                        <div
                          style={{
                            textAlign: "center",
                            fontFamily: "var(--font-chess)",
                            fontStyle: "italic",
                            fontSize: 16,
                            color: "var(--color-stage)",
                          }}
                        >
                          vs
                        </div>
                        <div
                          style={{
                            minWidth: 0,
                            overflow: "hidden",
                            background: pending
                              ? "rgba(26,26,26,0.05)"
                              : "var(--color-stage)",
                            border: "2px solid var(--color-ink)",
                            padding: "8px 12px",
                          }}
                        >
                          <p
                            style={{
                              fontFamily: "var(--font-poster)",
                              textTransform: "uppercase",
                              letterSpacing: "0.12em",
                              fontSize: 9,
                              color: pending
                                ? "#888"
                                : "rgba(255,253,208,0.75)",
                              marginBottom: 2,
                            }}
                          >
                            Negras
                          </p>
                          <TournamentPlayerIdentity
                            name={black}
                            photoUrl={blackPlayer?.photoUrl}
                            avatarId={blackPlayer?.avatarId}
                            size={30}
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: 14,
                              fontWeight: 700,
                              color: pending
                                ? "var(--color-ink)"
                                : "var(--color-cream)",
                              lineHeight: 1.1,
                              maxWidth: "100%",
                            }}
                            nameClassName="truncate"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <section
              style={{ marginTop: 24 }}
              aria-labelledby="inscritos-heading"
            >
              <p
                id="inscritos-heading"
                style={{
                  fontFamily: "var(--font-poster)",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  fontSize: 11,
                  color: "var(--color-ink)",
                  marginBottom: 12,
                }}
              >
                <em
                  style={{
                    fontFamily: "var(--font-chess)",
                    fontStyle: "italic",
                    color: "var(--color-stage)",
                    marginRight: 5,
                    fontSize: 14,
                  }}
                >
                  ♟
                </em>
                Jugadores inscritos
              </p>
              {registeredPlayers.length > 0 ? (
                <div
                  style={{
                    border: "2px solid var(--color-ink)",
                    background: "var(--color-grain)",
                    boxShadow: "4px 4px 0 var(--color-ink)",
                  }}
                >
                  {registeredPlayers.map((player, i) => (
                    <div
                      key={player.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 14px",
                        borderBottom:
                          i === registeredPlayers.length - 1
                            ? "none"
                            : "1px dashed rgba(26,26,26,0.15)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-poster)",
                          fontSize: 12,
                          color: "var(--color-stage)",
                          width: 22,
                          textAlign: "center",
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </span>
                      <TournamentPlayerIdentity
                        name={player.name}
                        photoUrl={player.photoUrl}
                        avatarId={player.avatarId}
                        size={28}
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 13,
                          fontWeight: 600,
                          flex: 1,
                          minWidth: 0,
                        }}
                        nameClassName="truncate"
                      />
                      {player.rating && (
                        <span
                          style={{
                            fontFamily: "ui-monospace, monospace",
                            fontSize: 10,
                            color: "#888",
                            flexShrink: 0,
                          }}
                        >
                          {player.rating}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    border: "2px dashed rgba(26,26,26,0.2)",
                    padding: "32px 16px",
                    textAlign: "center",
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "#888",
                  }}
                >
                  Aún no hay jugadores inscritos.
                </div>
              )}
            </section>
          ))}

        {/* ── Tabla completa optimizada (solo con rondas jugadas) ── */}
        {tournament.rounds.length > 0 && standings.length > 0 && (
          <section style={{ marginTop: 28 }} aria-labelledby="tabla-heading">
            <p
              id="tabla-heading"
              style={{
                fontFamily: "var(--font-poster)",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                fontSize: 11,
                color: "var(--color-ink)",
                marginBottom: 12,
              }}
            >
              Tabla completa y desempates
            </p>
            <StandingsTable
              standings={standings}
              tieBreakCodes={tournament.tieBreakOrder}
              rounds={tournament.rounds}
            />
          </section>
        )}

        {/* ── Resumen del torneo ── */}
        <section
          aria-label="Resumen del torneo"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 8,
            marginTop: 16,
          }}
        >
          {[
            ["Jugadores", String(summary.players)],
            [
              "Rondas",
              `${tournament.rounds.length}/${tournament.roundsPlanned}`,
            ],
            ["Partidas", `${summary.completedGames}/${summary.games}`],
            [
              isFinished ? "Campeón" : "Líder",
              tournament.rounds.length > 0
                ? (standings[0]?.name ?? "Por definir")
                : "Por definir",
            ],
          ].map(([label, value], index) => (
            <article
              key={label}
              style={{
                minWidth: 0,
                border: "2px solid var(--color-ink)",
                borderTop: `4px solid ${index === 3 ? "var(--color-marquee)" : "var(--color-navy)"}`,
                background: "var(--color-grain)",
                padding: "11px 12px 12px",
                boxShadow: "2px 2px 0 var(--color-ink)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-poster)",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  fontSize: 9,
                  color: "#6f6f6f",
                }}
              >
                {label}
              </p>
              <p
                title={value}
                style={{
                  marginTop: 4,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontFamily: "var(--font-display)",
                  fontSize: index === 3 ? 18 : 24,
                  lineHeight: 1,
                  color:
                    index === 3 ? "var(--color-stage)" : "var(--color-ink)",
                }}
              >
                {value}
              </p>
            </article>
          ))}
        </section>

        {/* ── Histórico de rondas (colapsadas) ── */}
        {historyRounds.length > 0 && (
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
              {isFinished ? "Rondas del torneo" : "Rondas anteriores"}
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              {historyRounds.map((round) => (
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
                      <em
                        style={{
                          fontFamily: "var(--font-chess)",
                          fontStyle: "italic",
                          color: "var(--color-marquee)",
                          marginRight: 6,
                          fontSize: 12,
                        }}
                      >
                        ♜
                      </em>
                      Ronda {round.roundNumber}
                    </span>
                    <span
                      style={{
                        fontFamily: "ui-monospace, monospace",
                        fontSize: 9,
                        opacity: 0.6,
                      }}
                    >
                      {round.games.length} partidas
                    </span>
                  </summary>
                  <div>
                    {round.games.map((game, i) => {
                      const isLast = i === round.games.length - 1;
                      const whitePlayer = tournamentPlayer(
                        tournament,
                        game.whitePlayerId,
                      );
                      const blackPlayer = tournamentPlayer(
                        tournament,
                        game.blackPlayerId,
                      );
                      const w = whitePlayer?.name ?? "BYE";
                      const b = blackPlayer?.name ?? "BYE";
                      return (
                        <div
                          key={game.id}
                          style={{
                            padding: "10px 14px",
                            borderBottom: isLast
                              ? "none"
                              : "1px dashed rgba(26,26,26,0.15)",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              marginBottom: game.isBye ? 0 : 7,
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "var(--font-poster)",
                                fontSize: 10,
                                color: "var(--color-stage)",
                                letterSpacing: "0.14em",
                                textTransform: "uppercase",
                              }}
                            >
                              {game.isBye ? "BYE" : `Mesa ${game.boardNumber}`}
                            </span>
                            <span
                              style={{
                                fontFamily: "ui-monospace, monospace",
                                fontSize: 10,
                                fontWeight: 700,
                                background: "var(--color-ink)",
                                color: "var(--color-cream)",
                                padding: "1px 8px",
                              }}
                            >
                              {RESULT_LABEL[game.result]}
                            </span>
                          </div>
                          {!game.isBye ? (
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 24px 1fr",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <TournamentPlayerIdentity
                                name={w}
                                photoUrl={whitePlayer?.photoUrl}
                                avatarId={whitePlayer?.avatarId}
                                size={24}
                                style={{
                                  fontFamily: "var(--font-body)",
                                  fontSize: 12,
                                  fontWeight: 600,
                                  maxWidth: "100%",
                                }}
                                nameClassName="truncate"
                              />
                              <span
                                style={{
                                  textAlign: "center",
                                  fontFamily: "var(--font-chess)",
                                  fontStyle: "italic",
                                  fontSize: 13,
                                  color: "var(--color-stage)",
                                }}
                              >
                                vs
                              </span>
                              <TournamentPlayerIdentity
                                name={b}
                                photoUrl={blackPlayer?.photoUrl}
                                avatarId={blackPlayer?.avatarId}
                                size={24}
                                style={{
                                  fontFamily: "var(--font-body)",
                                  fontSize: 12,
                                  fontWeight: 600,
                                  maxWidth: "100%",
                                  justifyContent: "flex-end",
                                }}
                                nameClassName="truncate"
                              />
                            </div>
                          ) : (
                            <TournamentPlayerIdentity
                              name={w}
                              photoUrl={whitePlayer?.photoUrl}
                              avatarId={whitePlayer?.avatarId}
                              size={24}
                              style={{
                                fontFamily: "var(--font-body)",
                                fontSize: 13,
                                fontWeight: 600,
                              }}
                              nameClassName="truncate"
                            />
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
