"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  Users,
  Trophy,
  Swords,
  Info,
  Plus,
  X,
  ChevronDown,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import type {
  ChessTournament,
  ChessPlayer,
  GameResult,
  TieBreakCode,
} from "@/modules/chess/types";
import { calculateStandings, getNextRoundBlocker } from "@/modules/chess/standings";
import {
  generateSwissNextRound,
  generateRoundRobinRounds,
} from "@/modules/chess/pairings";
import { formatTieBreakLabel } from "@/modules/chess/tiebreaks";
import {
  formatTournamentSystem,
  formatTournamentStatus,
} from "@/modules/chess/public-data";

// ─── helpers ─────────────────────────────────────────────────────────────────

const RESULT_SCORES: Record<GameResult, { white: number; black: number }> = {
  white_win:      { white: 1,   black: 0   },
  black_win:      { white: 0,   black: 1   },
  draw:           { white: 0.5, black: 0.5 },
  white_forfeit:  { white: 0,   black: 1   },
  black_forfeit:  { white: 1,   black: 0   },
  double_forfeit: { white: 0,   black: 0   },
  bye:            { white: 1,   black: 0   },
  unplayed:       { white: 0,   black: 0   },
};

function playerName(t: ChessTournament, id?: string) {
  if (!id) return "BYE";
  return t.players.find((p) => p.id === id)?.name ?? "?";
}

function statusLabel(s: ChessPlayer["status"]) {
  return s === "active" ? "Activo" : s === "withdrawn" ? "Retirado" : "Ausente";
}

function statusColor(s: ChessPlayer["status"]) {
  if (s === "active") return "#16a34a";
  if (s === "withdrawn") return "#dc2626";
  return "#d97706";
}

// ─── Tab bar ─────────────────────────────────────────────────────────────────

type Tab = "players" | "rounds" | "standings" | "info";

const TABS: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "players",   label: "Jugadores", icon: Users   },
  { id: "rounds",    label: "Rondas",    icon: Swords  },
  { id: "standings", label: "Tabla",     icon: Trophy  },
  { id: "info",      label: "Info",      icon: Info    },
];

// ─── Main component ───────────────────────────────────────────────────────────

export function TournamentManager({
  initial,
  storageKey,
  apiId,
}: {
  initial: ChessTournament;
  storageKey?: string;
  apiId?: string;
}) {
  const [t, setT] = useState<ChessTournament>(initial);
  const [tab, setTab] = useState<Tab>("players");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const isMounted = useRef(false);

  const saveTournament = useCallback(
    async (data: ChessTournament) => {
      if (!apiId) return;
      setSaveState("saving");
      try {
        const res = await fetch(`/api/tournaments/${apiId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        setSaveState(res.ok ? "saved" : "error");
      } catch {
        setSaveState("error");
      }
    },
    [apiId],
  );

  useEffect(() => {
    if (!storageKey) return;
    try {
      const raw = localStorage.getItem("az_tournaments");
      const list: ChessTournament[] = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex((x) => x.id === storageKey);
      if (idx >= 0) list[idx] = t; else list.push(t);
      localStorage.setItem("az_tournaments", JSON.stringify(list));
    } catch { /* ignore */ }
  }, [t, storageKey]);

  useEffect(() => {
    if (!isMounted.current) { isMounted.current = true; return; }
    if (!apiId) return;
    const timer = setTimeout(() => { saveTournament(t); }, 400);
    return () => clearTimeout(timer);
  }, [t, apiId, saveTournament]);

  // ─ derived ─
  const standings  = useMemo(() => calculateStandings(t), [t]);
  const blocker    = useMemo(() => getNextRoundBlocker(t), [t]);
  const hasRounds  = t.rounds.length > 0;
  const allRoundsGenerated = t.rounds.length >= t.roundsPlanned;
  const lastRoundDone =
    !t.rounds.at(-1) ||
    t.rounds.at(-1)!.games.every((g) => g.result !== "unplayed");
  const isFinished = allRoundsGenerated && lastRoundDone;

  // ─ player actions ─
  function addPlayer(name: string, rating?: number) {
    const nextSeed = t.players.reduce((m, p) => Math.max(m, p.seed), 0) + 1;
    const player: ChessPlayer = {
      id: `p${Date.now()}`,
      name: name.trim(),
      rating: rating || undefined,
      seed: nextSeed,
      status: "active",
    };
    setT((prev) => ({ ...prev, players: [...prev.players, player] }));
  }

  function removePlayer(id: string) {
    setT((prev) => ({
      ...prev,
      players: prev.players.filter((p) => p.id !== id),
      rounds: prev.rounds.map((round) => {
        const games = round.games
          .filter(
            (game) =>
              game.whitePlayerId !== id && game.blackPlayerId !== id,
          )
          .map((game, index) => ({ ...game, boardNumber: index + 1 }));
        const hasPendingGames = games.some((game) => game.result === "unplayed");
        const status =
          games.length === 0
            ? ("pending" as const)
            : hasPendingGames
              ? round.status === "in_progress"
                ? ("in_progress" as const)
                : ("paired" as const)
              : ("completed" as const);

        return { ...round, games, status };
      }),
    }));
  }

  function setPlayerStatus(id: string, status: ChessPlayer["status"]) {
    setT((prev) => ({
      ...prev,
      players: prev.players.map((p) => (p.id === id ? { ...p, status } : p)),
    }));
  }

  // ─ round actions ─
  function generateRound() {
    if (blocker || isFinished) return;
    let newRound;
    if (t.system === "swiss") {
      const result = generateSwissNextRound(t);
      newRound = result.round;
    } else {
      const allRounds = generateRoundRobinRounds(t.players);
      newRound = allRounds[t.rounds.length];
      if (!newRound) return;
    }
    setT((prev) => ({
      ...prev,
      rounds: [...prev.rounds, newRound],
      currentRoundNumber: prev.currentRoundNumber + 1,
      status: "active",
    }));
  }

  // ─ result actions ─
  function applyResult(roundIdx: number, gameId: string, result: GameResult) {
    setT((prev) => {
      const rounds = prev.rounds.map((r, i) => {
        if (i !== roundIdx) return r;
        const scores = RESULT_SCORES[result];
        const games = r.games.map((g) =>
          g.id !== gameId
            ? g
            : {
                ...g,
                result,
                whiteScore: scores.white,
                blackScore: scores.black,
                isForfeit: result.includes("forfeit"),
              },
        );
        const allDone = games.every((g) => g.result !== "unplayed");
        return { ...r, games, status: allDone ? ("completed" as const) : ("in_progress" as const) };
      });
      return { ...prev, rounds };
    });
  }

  function undoResult(roundIdx: number, gameId: string) {
    setT((prev) => {
      const rounds = prev.rounds.map((r, i) => {
        if (i !== roundIdx) return r;
        const games = r.games.map((g) =>
          g.id !== gameId
            ? g
            : { ...g, result: "unplayed" as GameResult, whiteScore: undefined, blackScore: undefined, isForfeit: false },
        );
        return { ...r, games, status: "paired" as const };
      });
      return { ...prev, rounds };
    });
  }

  // ─ render ─
  return (
    <div>
      {/* Sticky tab bar */}
      <div
        className="sticky z-10 -mx-4 sm:-mx-6"
        style={{
          top: 60,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          background: "var(--color-cream)",
          borderTop: "2px solid var(--color-ink)",
          borderBottom: "2px solid var(--color-ink)",
        }}
      >
        {TABS.map(({ id, label }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              style={{
                fontFamily: "var(--font-poster)",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                fontSize: 11,
                padding: "12px 4px 11px",
                textAlign: "center",
                color: active ? "var(--color-ink)" : "rgba(26,26,26,0.4)",
                borderBottom: active ? "3px solid var(--color-stage)" : "3px solid transparent",
                background: active ? "var(--color-grain)" : "transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        {tab === "players"   && <PlayersTab   t={t} hasRounds={hasRounds} onAdd={addPlayer} onRemove={removePlayer} onStatus={setPlayerStatus} />}
        {tab === "rounds"    && <RoundsTab    t={t} blocker={blocker} isFinished={isFinished} allRoundsGenerated={allRoundsGenerated} onGenerate={generateRound} onResult={applyResult} onUndo={undoResult} />}
        {tab === "standings" && <StandingsTab t={t} standings={standings} />}
        {tab === "info"      && <InfoTab      t={t} onChange={(patch) => setT((prev) => ({ ...prev, ...patch }))} />}
      </div>

      {/* Barra de guardado */}
      {apiId && (
        <div
          className="sticky -mx-4 sm:-mx-6"
          style={{
            bottom: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginTop: 20,
            padding: "12px 16px",
            background: "var(--color-cream)",
            borderTop: "2px solid var(--color-ink)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-poster)",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              fontSize: 10,
              color:
                saveState === "error"
                  ? "var(--color-stage)"
                  : saveState === "saved"
                    ? "var(--color-emerald)"
                    : "rgba(26,26,26,0.55)",
            }}
          >
            {saveState === "saving"
              ? "Guardando…"
              : saveState === "saved"
                ? "Guardado ✓"
                : saveState === "error"
                  ? "Error al guardar — reintenta"
                  : "Los cambios se guardan automáticamente"}
          </span>
          <button
            type="button"
            onClick={() => saveTournament(t)}
            disabled={saveState === "saving"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              border: "2px solid var(--color-ink)",
              background: "var(--color-ink)",
              color: "var(--color-cream)",
              padding: "9px 18px",
              fontFamily: "var(--font-poster)",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              fontSize: 11,
              cursor: saveState === "saving" ? "default" : "pointer",
              opacity: saveState === "saving" ? 0.6 : 1,
              boxShadow: "var(--shadow-card)",
            }}
          >
            {saveState === "saving" ? "Guardando…" : "Guardar ahora"}
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: JUGADORES
// ═══════════════════════════════════════════════════════════════════════════════

function PlayersTab({
  t, hasRounds, onAdd, onRemove, onStatus,
}: {
  t: ChessTournament;
  hasRounds: boolean;
  onAdd: (name: string, rating?: number) => void;
  onRemove: (id: string) => void;
  onStatus: (id: string, status: ChessPlayer["status"]) => void;
}) {
  const [name, setName]     = useState("");
  const [rating, setRating] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name, rating ? parseInt(rating, 10) : undefined);
    setName("");
    setRating("");
  }

  function handleRemove(player: ChessPlayer) {
    const confirmed =
      !hasRounds ||
      window.confirm(
        `Eliminar a ${player.name} tambien quitara sus partidas de las rondas generadas. Esta accion no se puede deshacer.`,
      );

    if (!confirmed) return;

    onRemove(player.id);
    setOpenMenu(null);
  }

  const active    = t.players.filter((p) => p.status === "active").length;
  const absent    = t.players.filter((p) => p.status === "absent").length;
  const withdrawn = t.players.filter((p) => p.status === "withdrawn").length;

  const inputStyle = {
    fontFamily: "var(--font-body)",
    fontSize: 14,
    padding: "10px 12px",
    border: "2px solid var(--color-ink)",
    background: "var(--color-grain)",
    outline: "none",
    color: "var(--color-ink)",
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* Summary strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
        {[
          { label: "Total",   value: t.players.length },
          { label: "Activos", value: active },
          { label: "Ausentes", value: absent },
          { label: "Retirados", value: withdrawn },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              background: "var(--color-grain)",
              border: "2px solid var(--color-ink)",
              padding: "10px 12px",
              boxShadow: "3px 3px 0 var(--color-ink)",
              textAlign: "center",
            }}
          >
            <p style={{ fontFamily: "var(--font-display)", fontSize: 36, lineHeight: 0.95, color: "var(--color-stage)" }}>{value}</p>
            <p style={{ fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.16em", fontSize: 9.5, opacity: 0.7, marginTop: 4 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Add player form */}
      <div style={{ border: "2px solid var(--color-ink)", background: "var(--color-grain)", padding: 16 }}>
        <p style={{ fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 11, marginBottom: 10 }}>
          Agregar jugador
        </p>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="Nombre completo *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ ...inputStyle, flex: 1 }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-stage)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-ink)"; }}
            />
            <input
              type="number"
              placeholder="Rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              min={100}
              max={3000}
              style={{ ...inputStyle, width: 90 }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-stage)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-ink)"; }}
            />
          </div>
          <button
            type="submit"
            style={{
              background: "var(--color-stage)",
              color: "var(--color-cream)",
              border: "2px solid var(--color-ink)",
              padding: "10px 16px",
              fontFamily: "var(--font-poster)",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              fontSize: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Plus className="h-4 w-4" aria-hidden />
            Agregar
          </button>
        </form>
        {hasRounds && (
          <p className="mt-2.5 flex items-center gap-1.5 text-xs text-amber-700">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
            El torneo ya tiene rondas. Los nuevos jugadores recibirán bye en las rondas pasadas.
          </p>
        )}
      </div>

      {/* Player list */}
      <div className="rounded-sm border-2 border-[var(--color-ink)] bg-white">
        {t.players.length === 0 ? (
          <div className="p-8 text-center text-sm text-stone-500">
            Sin jugadores todavía. Agrega al menos 2 para iniciar.
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {t.players.map((player) => (
              <div
                key={player.id}
                className="flex items-center gap-3 p-4"
              >
                {/* Seed badge */}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-stone-600">
                  {player.seed}
                </span>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="truncate font-semibold text-stone-950">{player.name}</p>
                  <p className="text-xs text-stone-500">
                    {player.rating ? `Rating ${player.rating}` : "Sin rating"}
                  </p>
                </div>

                {/* Status badge */}
                <span
                  className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{
                    background: statusColor(player.status) + "18",
                    color: statusColor(player.status),
                  }}
                >
                  {statusLabel(player.status)}
                </span>

                {/* Actions menu */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenMenu(openMenu === player.id ? null : player.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
                    aria-label="Opciones"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {openMenu === player.id && (
                    <div
                      className="absolute right-0 z-10 mt-1 w-56 rounded-md border border-stone-200 bg-white py-1 shadow-lg"
                      onBlur={() => setOpenMenu(null)}
                    >
                      {player.status !== "active" && (
                        <button
                          type="button"
                          onClick={() => { onStatus(player.id, "active"); setOpenMenu(null); }}
                          className="w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-50"
                        >
                          Marcar activo
                        </button>
                      )}
                      {player.status !== "absent" && (
                        <button
                          type="button"
                          onClick={() => { onStatus(player.id, "absent"); setOpenMenu(null); }}
                          className="w-full px-4 py-2 text-left text-sm text-amber-700 hover:bg-amber-50"
                        >
                          Marcar ausente
                        </button>
                      )}
                      {player.status !== "withdrawn" && (
                        <button
                          type="button"
                          onClick={() => { onStatus(player.id, "withdrawn"); setOpenMenu(null); }}
                          className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50"
                        >
                          Retirar del torneo
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemove(player)}
                        className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50"
                      >
                        Eliminar jugador
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: RONDAS
// ═══════════════════════════════════════════════════════════════════════════════

function RoundsTab({
  t, blocker, isFinished, allRoundsGenerated, onGenerate, onResult, onUndo,
}: {
  t: ChessTournament;
  blocker: string | null;
  isFinished: boolean;
  allRoundsGenerated: boolean;
  onGenerate: () => void;
  onResult: (roundIdx: number, gameId: string, result: GameResult) => void;
  onUndo: (roundIdx: number, gameId: string) => void;
}) {
  const canGenerate = !blocker && !isFinished && t.players.filter((p) => p.status === "active").length >= 2;

  // Banner state
  const bannerBg = isFinished
    ? "var(--color-emerald)"
    : blocker && !allRoundsGenerated
    ? "var(--color-amber)"
    : "var(--color-stage)";

  const roundLabel = isFinished
    ? `${t.roundsPlanned}`
    : allRoundsGenerated
    ? `${t.rounds.length}`
    : `${t.rounds.length + 1}`;

  const bannerText = isFinished
    ? "Torneo finalizado"
    : allRoundsGenerated
    ? `Completando · ${t.rounds.length} pendientes`
    : blocker
    ? blocker
    : `${t.players.filter((p) => p.status === "active").length} jugadores · ${t.system === "swiss" ? "Suizo" : "Round Robin"}`;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {/* Generation banner */}
      <div
        style={{
          background: bannerBg,
          color: "var(--color-cream)",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: "2px solid var(--color-ink)",
          boxShadow: "0 4px 0 var(--color-ink)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 36,
            lineHeight: 0.9,
            flexShrink: 0,
          }}
        >
          {roundLabel}
          <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, opacity: 0.7, marginLeft: 4, letterSpacing: "0.1em" }}>
            /{t.roundsPlanned}
          </span>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 10, opacity: 0.85 }}>
            {isFinished ? "Completado" : allRoundsGenerated ? "Ronda en curso" : "Próxima ronda"}
          </p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 15, lineHeight: 1.1, marginTop: 2 }}>
            {bannerText}
          </p>
        </div>
        {!isFinished && (
          <button
            type="button"
            onClick={onGenerate}
            disabled={!canGenerate}
            style={{
              fontFamily: "var(--font-poster)",
              background: "var(--color-ink)",
              color: "var(--color-cream)",
              border: "2px solid var(--color-cream)",
              padding: "8px 12px",
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              boxShadow: "-3px 3px 0 rgba(0,0,0,0.4)",
              cursor: canGenerate ? "pointer" : "not-allowed",
              opacity: canGenerate ? 1 : 0.5,
              flexShrink: 0,
            }}
          >
            Generar →
          </button>
        )}
      </div>

      {/* Round cards (newest first) */}
      {[...t.rounds].reverse().map((round, revIdx) => {
        const roundIdx = t.rounds.length - 1 - revIdx;
        const pending = round.games.filter((g) => g.result === "unplayed").length;

        return (
          <div
            key={round.id}
            style={{
              background: "var(--color-grain)",
              border: "2px solid var(--color-ink)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            {/* Round header — ink bar */}
            <div
              style={{
                background: "var(--color-ink)",
                color: "var(--color-cream)",
                padding: "8px 12px",
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-poster)",
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  fontSize: 11,
                }}
              >
                <em style={{ fontFamily: "var(--font-chess)", fontStyle: "italic", color: "var(--color-marquee)", fontSize: 13, marginRight: 4 }}>
                  ♜
                </em>
                Ronda {round.roundNumber}
              </span>
              <span
                style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 9.5,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: pending > 0 ? "var(--color-marquee)" : "var(--color-cream)",
                  opacity: pending > 0 ? 1 : 0.7,
                }}
              >
                {pending > 0 ? `${pending} pendiente${pending > 1 ? "s" : ""}` : "Completada ✓"}
              </span>
            </div>

            {/* Games */}
            <div>
              {round.games.map((game) => (
                <GameRow
                  key={game.id}
                  game={game}
                  whiteName={playerName(t, game.whitePlayerId)}
                  blackName={playerName(t, game.blackPlayerId)}
                  onResult={(r) => onResult(roundIdx, game.id, r)}
                  onUndo={() => onUndo(roundIdx, game.id)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {t.rounds.length === 0 && (
        <div
          style={{
            border: "2px dashed rgba(26,26,26,0.25)",
            padding: "32px 16px",
            textAlign: "center",
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "#666",
          }}
        >
          No hay rondas todavía. Agrega jugadores y genera la primera ronda.
        </div>
      )}
    </div>
  );
}

function RoundStatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; bg: string; color: string }> = {
    pending:     { label: "Pendiente",   bg: "#fafaf9", color: "#78716c" },
    paired:      { label: "Pareada",     bg: "#eff6ff", color: "#1d4ed8" },
    in_progress: { label: "En curso",    bg: "#fefce8", color: "#a16207" },
    completed:   { label: "Completada",  bg: "#f0fdf4", color: "#15803d" },
    locked:      { label: "Bloqueada",   bg: "#faf5ff", color: "#7e22ce" },
  };
  const { label, bg, color } = cfg[status] ?? cfg["pending"];
  return (
    <span className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: bg, color }}>
      {label}
    </span>
  );
}

function GameRow({
  game, whiteName, blackName, onResult, onUndo,
}: {
  game: { id: string; boardNumber: number; result: GameResult; whiteScore?: number; blackScore?: number; isBye?: boolean };
  whiteName: string;
  blackName: string;
  onResult: (r: GameResult) => void;
  onUndo: () => void;
}) {
  const [showForfeit, setShowForfeit] = useState(false);
  const played = game.result !== "unplayed";

  const rowBorder = { borderBottom: "1px dashed rgba(26,26,26,0.18)" };

  if (game.isBye) {
    return (
      <div style={{ ...rowBorder, display: "grid", gridTemplateColumns: "22px 1fr", gap: 8, padding: "10px 12px", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-poster)", fontSize: 18, color: "var(--color-stage)", textAlign: "center" }}>
          B
        </span>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500 }}>{whiteName}</span>
          <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 10, letterSpacing: "0.1em", background: "var(--color-grain)", border: "1px solid var(--color-ink)", padding: "2px 8px", color: "var(--color-emerald)" }}>
            BYE · +1
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...rowBorder, display: "grid", gridTemplateColumns: "22px 1fr", gap: 8, padding: "10px 12px", alignItems: "center" }}>
      {/* Board number */}
      <span style={{ fontFamily: "var(--font-poster)", fontSize: 18, color: "var(--color-stage)", textAlign: "center", lineHeight: 1 }}>
        {game.boardNumber}
      </span>

      <div style={{ display: "grid", gap: 6 }}>
        {/* Players */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "center", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500 }}>
          <span>{whiteName}</span>
          <span style={{ fontFamily: "var(--font-chess)", fontStyle: "italic", color: "var(--color-ink)", opacity: 0.5, fontSize: 12 }}>vs</span>
          <span style={{ textAlign: "right" }}>{blackName}</span>
        </div>

        {/* Result row */}
        {played ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "ui-monospace, monospace", fontWeight: 700, fontSize: 13, color: "var(--color-ink)" }}>
              {game.whiteScore} – {game.blackScore}
            </span>
            <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888" }}>
              {game.result === "draw" ? "Tablas" : game.result === "white_win" ? `Gana blancas` : game.result === "black_win" ? "Gana negras" : game.result.replace(/_/g, " ")}
            </span>
            <button
              type="button"
              onClick={onUndo}
              style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, fontFamily: "ui-monospace, monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", background: "none", border: "none", cursor: "pointer" }}
            >
              <RotateCcw className="h-3 w-3" />
              Deshacer
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
            <button
              type="button"
              onClick={() => onResult("white_win")}
              style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, fontWeight: 700, padding: "6px 0", textAlign: "center", border: "2px solid var(--color-ink)", background: "var(--color-ink)", color: "var(--color-cream)", cursor: "pointer", letterSpacing: "0.04em" }}
            >
              1 – 0
            </button>
            <button
              type="button"
              onClick={() => onResult("draw")}
              style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, fontWeight: 700, padding: "6px 0", textAlign: "center", border: "2px solid var(--color-ink)", background: "transparent", color: "var(--color-ink)", cursor: "pointer" }}
            >
              ½ – ½
            </button>
            <button
              type="button"
              onClick={() => onResult("black_win")}
              style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, fontWeight: 700, padding: "6px 0", textAlign: "center", border: "2px solid var(--color-stage)", background: "var(--color-stage)", color: "var(--color-cream)", cursor: "pointer" }}
            >
              0 – 1
            </button>

            {/* Forfeit */}
            <div style={{ position: "relative", gridColumn: "1 / -1" }}>
              <button
                type="button"
                onClick={() => setShowForfeit((v) => !v)}
                style={{ fontFamily: "ui-monospace, monospace", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", border: "1px solid rgba(26,26,26,0.25)", background: "transparent", padding: "4px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
              >
                Forfeit <ChevronDown className="h-3 w-3" />
              </button>
              {showForfeit && (
                <div style={{ position: "absolute", bottom: "100%", left: 0, zIndex: 10, marginBottom: 4, width: 200, background: "var(--color-grain)", border: "2px solid var(--color-ink)", boxShadow: "var(--shadow-card)" }}>
                  {[
                    { label: `Forfeit blancas · pierde ${whiteName}`, result: "white_forfeit" as GameResult },
                    { label: `Forfeit negras · pierde ${blackName}`,  result: "black_forfeit" as GameResult },
                    { label: "Doble forfeit",                          result: "double_forfeit" as GameResult },
                  ].map((opt) => (
                    <button key={opt.result} type="button" onClick={() => { onResult(opt.result); setShowForfeit(false); }}
                      style={{ width: "100%", padding: "10px 12px", textAlign: "left", fontFamily: "var(--font-body)", fontSize: 12, background: "none", border: "none", borderBottom: "1px dashed rgba(26,26,26,0.18)", cursor: "pointer", color: "var(--color-stage)" }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: TABLA
// ═══════════════════════════════════════════════════════════════════════════════

function StandingsTab({
  t,
  standings,
}: {
  t: ChessTournament;
  standings: ReturnType<typeof calculateStandings>;
}) {
  if (standings.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-stone-300 p-8 text-center text-sm text-stone-500">
        La tabla aparecerá cuando haya jugadores y resultados.
      </div>
    );
  }

  const tieBreakCols = t.tieBreakOrder.slice(0, 4);

  const medalColors = [
    { border: "var(--color-marquee)" },
    { border: "#999" },
    { border: "#8a5a2b" },
  ];

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {/* Top 3 */}
      {standings.length >= 2 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
          {[0, 1, 2].map((i) => {
            const s = standings[i];
            if (!s) return null;
            return (
              <div
                key={i}
                style={{
                  background: "var(--color-grain)",
                  border: "2px solid var(--color-ink)",
                  borderLeft: `4px solid ${medalColors[i]!.border}`,
                  padding: "6px 8px 8px 6px",
                }}
              >
                <p style={{ fontFamily: "var(--font-poster)", fontSize: 9.5, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.14em" }}>{i + 1}°</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, marginTop: 2, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</p>
                <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 13, fontWeight: 700, color: "var(--color-stage)", marginTop: 2 }}>{s.points}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Full table */}
      <div style={{ overflowX: "auto", border: "2px solid var(--color-ink)", background: "var(--color-grain)" }}>
        <table style={{ width: "100%", minWidth: 480, textAlign: "left", fontSize: 12, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--color-ink)", color: "var(--color-cream)" }}>
              <th style={{ padding: "8px 10px", fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.16em", fontSize: 9.5, fontWeight: 400 }}>#</th>
              <th style={{ padding: "8px 10px", fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.16em", fontSize: 9.5, fontWeight: 400 }}>Jugador</th>
              <th style={{ padding: "8px 10px", fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.16em", fontSize: 9.5, fontWeight: 400, textAlign: "right" }}>Pts</th>
              <th style={{ padding: "8px 10px", fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.16em", fontSize: 9.5, fontWeight: 400, textAlign: "center" }}>G-T-P</th>
              {t.rounds.map((r) => (
                <th key={r.id} style={{ padding: "8px 6px", fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.12em", fontSize: 9, fontWeight: 400, textAlign: "center" }}>R{r.roundNumber}</th>
              ))}
              {tieBreakCols.slice(1).map((code) => (
                <th key={code} style={{ padding: "8px 10px", fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.12em", fontSize: 9, fontWeight: 400, textAlign: "right" }}>{formatTieBreakLabel(code)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {standings.map((s, i) => (
              <tr key={s.playerId} style={{ borderBottom: "1px dashed rgba(26,26,26,0.18)", borderLeft: i < 3 ? `4px solid ${medalColors[i]!.border}` : "4px solid transparent" }}>
                <td style={{ padding: "8px 10px", fontFamily: "var(--font-poster)", fontSize: 13, color: "var(--color-stage)" }}>{i + 1}</td>
                <td style={{ padding: "8px 10px" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600 }}>{s.name}</p>
                  {s.rating && <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 9, color: "#888", letterSpacing: "0.1em" }}>{s.rating}</p>}
                </td>
                <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "ui-monospace, monospace", fontSize: 14, fontWeight: 700, color: "var(--color-stage)" }}>{s.points}</td>
                <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "ui-monospace, monospace", fontSize: 10, color: "#666" }}>{s.wins}-{s.draws}-{s.losses}</td>
                {t.rounds.map((round) => {
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
                {tieBreakCols.slice(1).map((code) => (
                  <td key={code} style={{ padding: "8px 10px", textAlign: "right", fontFamily: "ui-monospace, monospace", fontSize: 10, color: "#666" }}>
                    {s.tieBreaks[code as TieBreakCode] ?? 0}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: INFO
// ═══════════════════════════════════════════════════════════════════════════════

// Etiqueta automática del lugar según su posición (1.º, 2.º, 3.º…).
function placeOrdinal(index: number) {
  return `${index + 1}.º lugar`;
}

function InfoTab({ t, onChange }: { t: ChessTournament; onChange: (patch: Partial<ChessTournament>) => void }) {
  const rows: { label: string; value: string }[] = [
    { label: "Sistema",     value: formatTournamentSystem(t.system) },
    { label: "Estado",      value: formatTournamentStatus(t.status) },
    { label: "Rondas",      value: `${t.rounds.length} de ${t.roundsPlanned}` },
    { label: "Inicio",      value: t.startsAt },
    { label: "Lugar",       value: t.locationLabel },
    { label: "Desempates",  value: t.tieBreakOrder.map(formatTieBreakLabel).join(" › ") },
    { label: "Visibilidad", value: t.visibility },
  ];

  // ── Qué incluye la inscripción ──
  function addInclude(value: string) {
    const v = value.trim();
    if (!v) return;
    onChange({ entryIncludes: [...(t.entryIncludes ?? []), v] });
  }
  function removeInclude(i: number) {
    onChange({ entryIncludes: (t.entryIncludes ?? []).filter((_, idx) => idx !== i) });
  }

  // ── Premios por categoría ──
  function addCategory() {
    onChange({
      prizeCategories: [
        ...(t.prizeCategories ?? []),
        { name: "", places: [{ place: placeOrdinal(0), award: "" }] },
      ],
    });
  }
  function removeCategory(ci: number) {
    onChange({
      prizeCategories: (t.prizeCategories ?? []).filter((_, i) => i !== ci),
    });
  }
  function updateCategoryName(ci: number, name: string) {
    onChange({
      prizeCategories: (t.prizeCategories ?? []).map((c, i) =>
        i === ci ? { ...c, name } : c,
      ),
    });
  }
  function addCategoryPlace(ci: number) {
    onChange({
      prizeCategories: (t.prizeCategories ?? []).map((c, i) =>
        i === ci
          ? {
              ...c,
              places: [...c.places, { place: "", award: "" }].map((p, j) => ({
                ...p,
                place: placeOrdinal(j),
              })),
            }
          : c,
      ),
    });
  }
  function updateCategoryAward(ci: number, pi: number, val: string) {
    onChange({
      prizeCategories: (t.prizeCategories ?? []).map((c, i) =>
        i === ci
          ? {
              ...c,
              places: c.places.map((p, j) =>
                j === pi ? { ...p, award: val } : p,
              ),
            }
          : c,
      ),
    });
  }
  function removeCategoryPlace(ci: number, pi: number) {
    onChange({
      prizeCategories: (t.prizeCategories ?? []).map((c, i) =>
        i === ci
          ? {
              ...c,
              places: c.places
                .filter((_, j) => j !== pi)
                .map((p, j) => ({ ...p, place: placeOrdinal(j) })),
            }
          : c,
      ),
    });
  }

  const [includeInput, setIncludeInput] = useState("");

  function addGalleryImage(url: string) {
    if (!url.trim()) return;
    onChange({ gallery: [...(t.gallery ?? []), { src: url.trim(), alt: "" }] });
  }
  function updateGalleryAlt(i: number, alt: string) {
    onChange({ gallery: (t.gallery ?? []).map((g, idx) => idx === i ? { ...g, alt } : g) });
  }
  function removeGalleryImage(i: number) {
    onChange({ gallery: (t.gallery ?? []).filter((_, idx) => idx !== i) });
  }

  const [galleryInput, setGalleryInput] = useState("");
  const [galleryUploading, setGalleryUploading] = useState(false);
  const galleryFileRef = useRef<HTMLInputElement>(null);

  async function handleGalleryFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setGalleryUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "tournaments/gallery");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (res.ok) addGalleryImage(json.url);
    } finally {
      setGalleryUploading(false);
      if (galleryFileRef.current) galleryFileRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-5">
      {/* Ficha técnica */}
      <div className="rounded-sm border-2 border-[var(--color-ink)] bg-white">
        <div className="border-b border-stone-100 px-5 py-4">
          <h2 className="font-semibold text-stone-950">{t.title}</h2>
          {t.description && <p className="mt-1 text-sm text-stone-500">{t.description}</p>}
        </div>
        <dl className="divide-y divide-stone-100">
          {rows.map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-3 px-5 py-3.5">
              <dt className="text-sm text-stone-500">{label}</dt>
              <dd className="text-right text-sm font-medium text-stone-950">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Inscripción y tiempo */}
      <div className="rounded-sm border-2 border-[var(--color-ink)] bg-white">
        <div className="border-b border-stone-100 px-5 py-4">
          <h3 className="font-semibold text-stone-950">Inscripción y tiempo de juego</h3>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              Costo de inscripción
            </label>
            <input
              value={t.entryFee ?? ""}
              onChange={(e) => onChange({ entryFee: e.target.value })}
              placeholder="Ej. Q 35 (incluye papas y soda)"
              className="h-9 rounded-md border border-stone-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>
          <div className="grid gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              Tiempo de reloj
            </label>
            <input
              value={t.timeControl ?? ""}
              onChange={(e) => onChange({ timeControl: e.target.value })}
              placeholder="Ej. 10+0"
              className="h-9 rounded-md border border-stone-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>
          <div className="grid gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              Fecha límite de inscripción
            </label>
            <input
              type="date"
              value={t.registrationDeadline ?? ""}
              onChange={(e) => onChange({ registrationDeadline: e.target.value })}
              className="h-9 rounded-md border border-stone-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>
        </div>

        {/* Qué incluye */}
        <div className="border-t border-stone-100 px-5 py-4">
          <label className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
            Qué incluye la inscripción
          </label>
          <div className="mt-2 flex gap-2">
            <input
              value={includeInput}
              onChange={(e) => setIncludeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addInclude(includeInput);
                  setIncludeInput("");
                }
              }}
              placeholder="Ej. Papas"
              className="h-9 flex-1 rounded-md border border-stone-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
            <button
              type="button"
              onClick={() => { addInclude(includeInput); setIncludeInput(""); }}
              className="inline-flex items-center gap-1.5 rounded-md bg-stone-950 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-800"
            >
              <Plus className="h-3 w-3" />
              Agregar
            </button>
          </div>
          {(t.entryIncludes ?? []).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {(t.entryIncludes ?? []).map((item, i) => (
                <span
                  key={`${item}-${i}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-stone-700"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeInclude(i)}
                    className="text-stone-400 hover:text-red-500"
                    aria-label={`Quitar ${item}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Instrucciones de pago */}
        <div className="border-t border-stone-100 px-5 py-4">
          <label className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
            Instrucciones de pago
          </label>
          <textarea
            value={t.paymentInstructions ?? ""}
            onChange={(e) => onChange({ paymentInstructions: e.target.value })}
            rows={3}
            placeholder={"Ej. Banco Industrial\nCuenta: 2230079290\nEnviar comprobante."}
            className="mt-2 w-full rounded-md border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>
      </div>

      {/* Premios por categoría */}
      <div className="rounded-sm border-2 border-[var(--color-ink)] bg-white">
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
          <div>
            <h3 className="font-semibold text-stone-950">Premios por categoría</h3>
            <p className="mt-0.5 text-xs text-stone-400">Ej. Libre y Sub-18, cada una con sus lugares.</p>
          </div>
          <button
            type="button"
            onClick={addCategory}
            className="inline-flex items-center gap-1.5 rounded-md bg-stone-950 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-800"
          >
            <Plus className="h-3 w-3" />
            Categoría
          </button>
        </div>
        {(t.prizeCategories ?? []).length === 0 ? (
          <p className="px-5 py-4 text-sm text-stone-400">Sin categorías definidas.</p>
        ) : (
          <div className="divide-y divide-stone-100">
            {(t.prizeCategories ?? []).map((cat, ci) => (
              <div key={ci} className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <input
                    value={cat.name}
                    onChange={(e) => updateCategoryName(ci, e.target.value)}
                    placeholder="Categoría (ej. Libre)"
                    className="h-8 flex-1 rounded border border-stone-200 px-2 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                  <button
                    type="button"
                    onClick={() => removeCategory(ci)}
                    className="text-xs font-semibold text-stone-400 hover:text-red-500"
                  >
                    Quitar categoría
                  </button>
                </div>
                <div className="mt-2 grid gap-2">
                  {cat.places.map((place, pi) => (
                    <div key={pi} className="flex items-center gap-2">
                      <span className="inline-flex h-8 w-24 shrink-0 items-center justify-center rounded border border-stone-200 bg-stone-50 px-2 text-sm font-semibold text-stone-600">
                        {placeOrdinal(pi)}
                      </span>
                      <input
                        value={place.award}
                        onChange={(e) => updateCategoryAward(ci, pi, e.target.value)}
                        placeholder="Premio (ej. Trofeo + Q100)"
                        className="h-8 flex-1 rounded border border-stone-200 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
                      />
                      <button
                        type="button"
                        onClick={() => removeCategoryPlace(ci, pi)}
                        className="text-stone-400 hover:text-red-500"
                        aria-label="Quitar lugar"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addCategoryPlace(ci)}
                  className="mt-2 rounded-md border border-dashed border-stone-300 px-3 py-1 text-xs font-semibold text-stone-500 hover:bg-stone-50"
                >
                  + Lugar
                </button>
              </div>
            ))}
          </div>
        )}
        <label className="flex cursor-pointer items-start gap-2 border-t border-stone-100 px-5 py-4 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={t.prizesNonCumulative ?? false}
            onChange={(e) => onChange({ prizesNonCumulative: e.target.checked })}
            className="mt-0.5"
          />
          <span>
            Premios no acumulables
            <span className="mt-0.5 block text-xs text-stone-400">
              Si un jugador Sub-18 obtiene premio en Libre, el premio Sub-18 pasa al siguiente mejor clasificado.
            </span>
          </span>
        </label>
      </div>

      {/* Galería */}
      <div className="rounded-sm border-2 border-[var(--color-ink)] bg-white">
        <div className="border-b border-stone-100 px-5 py-4">
          <h3 className="font-semibold text-stone-950">Galería de imágenes</h3>
          <p className="mt-0.5 text-xs text-stone-400">Fotos del lugar, trofeos, ambiente. Se muestran en la página pública.</p>
        </div>
        <div className="p-5 grid gap-4">
          {/* Subir imagen */}
          <div className="flex gap-2">
            <input
              ref={galleryFileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleGalleryFile}
            />
            <button
              type="button"
              onClick={() => galleryFileRef.current?.click()}
              disabled={galleryUploading}
              className="inline-flex items-center gap-2 rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50"
            >
              {galleryUploading ? (
                <RotateCcw className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Subir foto
            </button>
            <input
              value={galleryInput}
              onChange={(e) => setGalleryInput(e.target.value)}
              placeholder="o pega una URL de imagen…"
              className="h-9 flex-1 rounded-md border border-stone-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addGalleryImage(galleryInput);
                  setGalleryInput("");
                }
              }}
            />
            <button
              type="button"
              onClick={() => { addGalleryImage(galleryInput); setGalleryInput(""); }}
              className="inline-flex h-9 items-center rounded-md border border-stone-300 px-3 text-sm text-stone-600 hover:bg-stone-50"
            >
              +
            </button>
          </div>
          {/* Grid de imágenes */}
          {(t.gallery ?? []).length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {(t.gallery ?? []).map((img, i) => (
                <div key={i} className="group relative overflow-hidden rounded-md border border-stone-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt={img.alt || "Galería"} className="h-28 w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/50 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <input
                      value={img.alt}
                      onChange={(e) => updateGalleryAlt(i, e.target.value)}
                      placeholder="Descripción…"
                      className="w-full rounded bg-white/20 px-1.5 py-0.5 text-xs text-white placeholder-white/60 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(i)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reglamento */}
      <div className="rounded-sm border-2 border-[var(--color-ink)] bg-white">
        <div className="border-b border-stone-100 px-5 py-4">
          <h3 className="font-semibold text-stone-950">Reglamento y bases</h3>
          <p className="mt-0.5 text-xs text-stone-400">Visible en la página pública del evento vinculado.</p>
        </div>
        <div className="p-5">
          <textarea
            value={t.regulations ?? ""}
            onChange={(e) => onChange({ regulations: e.target.value })}
            rows={8}
            placeholder={"Ej:\n• Tiempo de juego: 10 min + 5 seg por jugada\n• Sistema suizo con desempate Buchholz\n• Los jugadores deben presentarse 10 min antes\n• Categorías: Libre (1.º–3.º) y Sub-18\n• Premios entregados al finalizar la última ronda"}
            className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>
      </div>
    </div>
  );
}
