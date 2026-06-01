"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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
  const isMounted = useRef(false);

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
    const timer = setTimeout(() => {
      fetch(`/api/tournaments/${apiId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(t),
      }).catch(() => {});
    }, 400);
    return () => clearTimeout(timer);
  }, [t, apiId]);

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
        {tab === "info"      && <InfoTab      t={t} />}
      </div>
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
      <div className="rounded-lg border border-stone-200 bg-white">
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

function InfoTab({ t }: { t: ChessTournament }) {
  const rows: { label: string; value: string }[] = [
    { label: "Sistema", value: formatTournamentSystem(t.system) },
    { label: "Estado", value: formatTournamentStatus(t.status) },
    { label: "Rondas", value: `${t.rounds.length} de ${t.roundsPlanned}` },
    { label: "Inicio", value: t.startsAt },
    { label: "Lugar", value: t.locationLabel },
    {
      label: "Desempates",
      value: t.tieBreakOrder.map(formatTieBreakLabel).join(" › "),
    },
    { label: "Visibilidad", value: t.visibility },
  ];

  return (
    <div className="rounded-lg border border-stone-200 bg-white">
      <div className="border-b border-stone-100 px-5 py-4">
        <h2 className="font-semibold text-stone-950">{t.title}</h2>
        {t.description && (
          <p className="mt-1 text-sm text-stone-500">{t.description}</p>
        )}
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
  );
}
