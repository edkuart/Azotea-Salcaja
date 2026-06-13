"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  ChessPlayer,
  TieBreakCode,
  TournamentSystem,
} from "@/modules/chess/types";

const TIEBREAK_PRESETS: Record<string, TieBreakCode[]> = {
  casual: ["points", "progressive", "buchholz", "median_buchholz", "wins"],
  formal: [
    "points",
    "buchholz_cut_1",
    "buchholz",
    "sonneborn_berger",
    "direct_encounter",
    "wins",
    "black_wins",
  ],
};

const RECURRING_PLAYERS_STORAGE_KEY = "az_recurring_chess_players";

type RecurringPlayer = {
  name: string;
  rating?: number;
};

const DEFAULT_RECURRING_PLAYERS: RecurringPlayer[] = [
  { name: "Carlos Mendez", rating: 1540 },
  { name: "Ana Lopez", rating: 1480 },
  { name: "Luis Garcia", rating: 1420 },
  { name: "Sofia Perez", rating: 1390 },
  { name: "Marco Diaz", rating: 1320 },
  { name: "Elena Ruiz" },
];

const MONDAY_TEMPLATE = {
  title: "Rapid nocturno de lunes",
  rounds: 5,
  location: "Azotea Salcajá",
  system: "swiss" as TournamentSystem,
  tiebreaks: "formal" as const,
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Etiqueta automática del lugar según su posición (1.º, 2.º, 3.º…).
function placeOrdinal(index: number) {
  return `${index + 1}.º lugar`;
}

function getTodayInputValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseRecurringPlayersText(text: string): RecurringPlayer[] {
  const seen = new Set<string>();

  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      const [rawName, rawRating] = line.split(",");
      const name = rawName?.trim();

      if (!name) return [];

      const key = name.toLowerCase();
      if (seen.has(key)) return [];
      seen.add(key);

      const ratingValue = rawRating
        ? Number.parseInt(rawRating.replace(/[^\d]/g, ""), 10)
        : Number.NaN;

      return [
        {
          name,
          rating: Number.isFinite(ratingValue) ? ratingValue : undefined,
        },
      ];
    });
}

function normalizeRecurringPlayers(value: unknown): RecurringPlayer[] {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  return value.flatMap((player) => {
    if (!player || typeof player !== "object") return [];

    const record = player as { name?: unknown; rating?: unknown };
    const name = typeof record.name === "string" ? record.name.trim() : "";

    if (!name) return [];

    const key = name.toLowerCase();
    if (seen.has(key)) return [];
    seen.add(key);

    const rating =
      typeof record.rating === "number" && Number.isFinite(record.rating)
        ? record.rating
        : undefined;

    return [{ name, rating }];
  });
}

function readStoredRecurringPlayers(raw: string): RecurringPlayer[] {
  try {
    const parsed = JSON.parse(raw);
    const players = normalizeRecurringPlayers(parsed);
    if (players.length > 0) return players;
  } catch {
    // Older versions stored this as one text block.
  }

  return parseRecurringPlayersText(raw);
}

function saveStoredRecurringPlayers(players: RecurringPlayer[]) {
  localStorage.setItem(RECURRING_PLAYERS_STORAGE_KEY, JSON.stringify(players));
}

function buildTournamentPlayers(
  players: RecurringPlayer[],
  tournamentId: string,
): ChessPlayer[] {
  return players.map((player, index) => ({
    id: `${tournamentId}-p${index + 1}`,
    name: player.name,
    rating: player.rating,
    seed: index + 1,
    status: "active",
  }));
}

const SH = {
  fontFamily: "var(--font-poster)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.22em",
  fontSize: 11,
  color: "var(--color-ink)",
  margin: "18px 0 8px",
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const INPUT = {
  fontFamily: "var(--font-body)",
  fontSize: 14,
  padding: "10px 12px",
  border: "2px solid var(--color-ink)",
  background: "var(--color-grain)",
  width: "100%",
  outline: "none",
  color: "var(--color-ink)",
  display: "block",
};

const LABEL = {
  fontFamily: "var(--font-poster)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.16em",
  fontSize: 10,
  color: "var(--color-ink)",
  opacity: 0.8,
  display: "block",
  marginBottom: 4,
};

export function NewTournamentForm({ template }: { template?: "lunes" }) {
  const router = useRouter();
  const isMondayTemplate = template === "lunes";
  const [system, setSystem] = useState<TournamentSystem>(
    isMondayTemplate ? MONDAY_TEMPLATE.system : "swiss",
  );
  const [tiebreaks, setTiebreaks] = useState<"casual" | "formal">(
    isMondayTemplate ? MONDAY_TEMPLATE.tiebreaks : "formal",
  );
  const [startsAtDate, setStartsAtDate] = useState("");
  const [recurringPlayers, setRecurringPlayers] = useState<RecurringPlayer[]>(
    DEFAULT_RECURRING_PLAYERS,
  );
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerRating, setNewPlayerRating] = useState("");
  const [saveRecurringPlayers, setSaveRecurringPlayers] = useState(true);
  const [loadedStoredPlayers, setLoadedStoredPlayers] = useState(false);

  // ── Bases extendidas (todas opcionales) ──
  const [entryIncludes, setEntryIncludes] = useState<string[]>([]);
  const [newInclude, setNewInclude] = useState("");
  const [prizeCategories, setPrizeCategories] = useState<
    Array<{ name: string; places: Array<{ place: string; award: string }> }>
  >([]);
  const [prizesNonCumulative, setPrizesNonCumulative] = useState(false);

  function addInclude() {
    const value = newInclude.trim();
    if (!value) return;
    setEntryIncludes((items) => [...items, value]);
    setNewInclude("");
  }
  function removeInclude(index: number) {
    setEntryIncludes((items) => items.filter((_, i) => i !== index));
  }
  function handleIncludeKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    addInclude();
  }

  function addCategory() {
    setPrizeCategories((cats) => [
      ...cats,
      { name: "", places: [{ place: placeOrdinal(0), award: "" }] },
    ]);
  }
  function removeCategory(ci: number) {
    setPrizeCategories((cats) => cats.filter((_, i) => i !== ci));
  }
  function updateCategoryName(ci: number, name: string) {
    setPrizeCategories((cats) =>
      cats.map((c, i) => (i === ci ? { ...c, name } : c)),
    );
  }
  function addPlace(ci: number) {
    setPrizeCategories((cats) =>
      cats.map((c, i) =>
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
    );
  }
  function updateAward(ci: number, pi: number, val: string) {
    setPrizeCategories((cats) =>
      cats.map((c, i) =>
        i === ci
          ? {
              ...c,
              places: c.places.map((p, j) =>
                j === pi ? { ...p, award: val } : p,
              ),
            }
          : c,
      ),
    );
  }
  function removePlace(ci: number, pi: number) {
    setPrizeCategories((cats) =>
      cats.map((c, i) =>
        i === ci
          ? {
              ...c,
              places: c.places
                .filter((_, j) => j !== pi)
                .map((p, j) => ({ ...p, place: placeOrdinal(j) })),
            }
          : c,
      ),
    );
  }

  useEffect(() => {
    setStartsAtDate(getTodayInputValue());

    try {
      const stored = localStorage.getItem(RECURRING_PLAYERS_STORAGE_KEY);
      if (stored?.trim()) {
        const players = readStoredRecurringPlayers(stored);
        if (players.length > 0) {
          setRecurringPlayers(players);
        }
      }
    } catch {
      // Local storage is optional; the default roster still works without it.
    } finally {
      setLoadedStoredPlayers(true);
    }
  }, []);

  useEffect(() => {
    if (!loadedStoredPlayers || !saveRecurringPlayers) return;

    try {
      saveStoredRecurringPlayers(recurringPlayers);
    } catch {
      // Ignore storage failures and keep the in-memory roster for this form.
    }
  }, [loadedStoredPlayers, recurringPlayers, saveRecurringPlayers]);

  function addRecurringPlayer() {
    const name = newPlayerName.trim();
    if (!name) return;

    const ratingValue = Number.parseInt(newPlayerRating, 10);
    const rating = Number.isFinite(ratingValue) ? ratingValue : undefined;
    const exists = recurringPlayers.some(
      (player) => player.name.trim().toLowerCase() === name.toLowerCase(),
    );

    if (exists) {
      setNewPlayerName("");
      setNewPlayerRating("");
      return;
    }

    setRecurringPlayers((players) => [...players, { name, rating }]);
    setNewPlayerName("");
    setNewPlayerRating("");
  }

  function removeRecurringPlayer(index: number) {
    setRecurringPlayers((players) => players.filter((_, i) => i !== index));
  }

  function handleRecurringKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    addRecurringPlayer();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = (fd.get("title") as string).trim();
    const rounds = parseInt(fd.get("rounds") as string, 10);

    const id = `t${Date.now()}`;
    const players = buildTournamentPlayers(recurringPlayers, id);

    if (saveRecurringPlayers) {
      try {
        saveStoredRecurringPlayers(recurringPlayers);
      } catch {
        // Ignore storage failures and still create the tournament.
      }
    }

    // Bases extendidas — solo se incluyen si tienen valor, para no ensuciar el blob.
    const timeControl = ((fd.get("timeControl") as string | null) ?? "").trim();
    const entryFee = ((fd.get("entryFee") as string | null) ?? "").trim();
    const registrationDeadline = (
      (fd.get("registrationDeadline") as string | null) ?? ""
    ).trim();
    const paymentInstructions = (
      (fd.get("paymentInstructions") as string | null) ?? ""
    ).trim();
    const cleanedIncludes = entryIncludes
      .map((item) => item.trim())
      .filter(Boolean);
    const cleanedCategories = prizeCategories
      .map((cat) => ({
        name: cat.name.trim(),
        places: cat.places
          .map((p) => ({ place: p.place.trim(), award: p.award.trim() }))
          .filter((p) => p.place || p.award),
      }))
      .filter((cat) => cat.name || cat.places.length > 0);

    const tournament = {
      id,
      kind: "official" as const,
      visibility: "draft" as const,
      title,
      slug: slugify(title),
      description: ((fd.get("description") as string | null) ?? "").trim(),
      system,
      roundsPlanned: isNaN(rounds) ? 5 : rounds,
      currentRoundNumber: 0,
      status: "setup" as const,
      startsAt: startsAtDate || getTodayInputValue(),
      locationLabel: ((fd.get("location") as string | null) ?? "").trim(),
      tieBreakOrder: TIEBREAK_PRESETS[tiebreaks] ?? TIEBREAK_PRESETS.formal,
      ...(timeControl ? { timeControl } : {}),
      ...(entryFee ? { entryFee } : {}),
      ...(registrationDeadline ? { registrationDeadline } : {}),
      ...(paymentInstructions ? { paymentInstructions } : {}),
      ...(cleanedIncludes.length ? { entryIncludes: cleanedIncludes } : {}),
      ...(cleanedCategories.length ? { prizeCategories: cleanedCategories } : {}),
      ...(prizesNonCumulative ? { prizesNonCumulative: true } : {}),
      players,
      rounds: [],
    };

    await fetch("/api/tournaments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tournament),
    });

    router.push(`/admin/ajedrez/torneos/${id}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* ── Datos básicos ── */}
      <p style={SH}>
        <span style={{ width: 18, height: 2, background: "var(--color-stage)", display: "block", flexShrink: 0 }} />
        Datos básicos
      </p>

      <div style={{ marginBottom: 10 }}>
        <label style={LABEL}>Nombre del torneo</label>
        <input
          name="title"
          required
          style={INPUT}
          defaultValue={isMondayTemplate ? MONDAY_TEMPLATE.title : ""}
          placeholder="Copa de invierno 2026"
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-stage)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(204,45,48,0.18)"; e.currentTarget.style.background = "var(--color-cream)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-ink)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "var(--color-grain)"; }}
        />
        <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.1em", color: "#666", marginTop: 3 }}>
          Aparece en el sitio público.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div>
          <label style={LABEL}>Fecha inicio</label>
          <input
            name="startsAt"
            type="date"
            required
            value={startsAtDate}
            onChange={(e) => setStartsAtDate(e.currentTarget.value)}
            style={INPUT}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-stage)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(204,45,48,0.18)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-ink)"; e.currentTarget.style.boxShadow = "none"; }}
          />
        </div>
        <div>
          <label style={LABEL}>Rondas</label>
          <input
            name="rounds"
            type="number"
            min="1"
            max="20"
            defaultValue={isMondayTemplate ? MONDAY_TEMPLATE.rounds : 5}
            required
            style={INPUT}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-stage)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(204,45,48,0.18)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-ink)"; e.currentTarget.style.boxShadow = "none"; }}
          />
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <label style={LABEL}>Ubicación</label>
        <input
          name="location"
          style={INPUT}
          defaultValue={MONDAY_TEMPLATE.location}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-stage)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(204,45,48,0.18)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-ink)"; e.currentTarget.style.boxShadow = "none"; }}
        />
      </div>

      {/* ── Sistema ── */}
      <p style={SH}>
        <span style={{ width: 18, height: 2, background: "var(--color-stage)", display: "block", flexShrink: 0 }} />
        Sistema
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {(["swiss", "round_robin"] as TournamentSystem[]).map((sys) => {
          const selected = system === sys;
          return (
            <button
              key={sys}
              type="button"
              onClick={() => setSystem(sys)}
              style={{
                border: "2px solid var(--color-ink)",
                background: selected ? "var(--color-ink)" : "var(--color-grain)",
                color: selected ? "var(--color-cream)" : "var(--color-ink)",
                borderLeft: selected ? "5px solid var(--color-stage)" : "2px solid var(--color-ink)",
                padding: selected ? "10px 12px 12px 9px" : "10px 12px 12px",
                textAlign: "left" as const,
                cursor: "pointer",
                minHeight: 92,
              }}
            >
              <p style={{ fontFamily: "var(--font-poster)", textTransform: "uppercase" as const, letterSpacing: "0.16em", fontSize: 10, color: selected ? "var(--color-marquee)" : "inherit", opacity: selected ? 1 : 0.7 }}>
                {sys === "swiss" ? "Recomendado" : "Round Robin"}
              </p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 17, lineHeight: 1.05, marginTop: 4 }}>
                {sys === "swiss" ? <>Sistema <em style={{ fontFamily: "var(--font-chess)", fontStyle: "italic", color: "var(--color-marquee)" }}>Suizo</em></> : "Todos\ncontra todos"}
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 11, lineHeight: 1.3, marginTop: 4, color: selected ? "rgba(255,253,208,0.8)" : "#444" }}>
                {sys === "swiss" ? "Empareja por puntos. 5–9 rondas." : "Cada jugador juega a todos."}
              </p>
            </button>
          );
        })}
      </div>

      {/* ── Inscripción (opcional) ── */}
      <p style={SH}>
        <span style={{ width: 18, height: 2, background: "var(--color-stage)", display: "block", flexShrink: 0 }} />
        Inscripción <span style={{ fontFamily: "var(--font-body)", textTransform: "none", letterSpacing: 0, fontSize: 11, opacity: 0.55 }}>(opcional)</span>
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div>
          <label style={LABEL}>Ritmo de juego</label>
          <input
            name="timeControl"
            style={INPUT}
            placeholder="Ej. 10+0"
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-stage)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(204,45,48,0.18)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-ink)"; e.currentTarget.style.boxShadow = "none"; }}
          />
        </div>
        <div>
          <label style={LABEL}>Costo de inscripción</label>
          <input
            name="entryFee"
            style={INPUT}
            placeholder="Ej. Q30"
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-stage)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(204,45,48,0.18)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-ink)"; e.currentTarget.style.boxShadow = "none"; }}
          />
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <label style={LABEL}>Fecha límite de inscripción</label>
        <input
          name="registrationDeadline"
          type="date"
          style={INPUT}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-stage)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(204,45,48,0.18)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-ink)"; e.currentTarget.style.boxShadow = "none"; }}
        />
      </div>

      {/* Qué incluye */}
      <div style={{ marginTop: 10 }}>
        <label style={LABEL}>Qué incluye la inscripción</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            value={newInclude}
            onChange={(e) => setNewInclude(e.currentTarget.value)}
            onKeyDown={handleIncludeKeyDown}
            placeholder="Ej. Papas"
            style={{ ...INPUT, flex: 1 }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-stage)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(204,45,48,0.18)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-ink)"; e.currentTarget.style.boxShadow = "none"; }}
          />
          <button
            type="button"
            onClick={addInclude}
            style={{
              background: "var(--color-ink)",
              color: "var(--color-cream)",
              border: "2px solid var(--color-ink)",
              padding: "0 16px",
              fontFamily: "var(--font-poster)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontSize: 11,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            + Agregar
          </button>
        </div>
        {entryIncludes.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {entryIncludes.map((item, index) => (
              <span
                key={`${item}-${index}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "var(--color-grain)",
                  border: "2px solid var(--color-ink)",
                  padding: "4px 8px",
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  color: "var(--color-ink)",
                }}
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeInclude(index)}
                  aria-label={`Quitar ${item}`}
                  style={{ border: "none", background: "transparent", color: "var(--color-stage)", cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0 }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Instrucciones de pago */}
      <div style={{ marginTop: 10 }}>
        <label style={LABEL}>Instrucciones de pago</label>
        <textarea
          name="paymentInstructions"
          rows={3}
          placeholder={"Ej. Banco Industrial\nCuenta: 2230079290\nEnviar comprobante."}
          style={{ ...INPUT, resize: "vertical" as const }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-stage)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(204,45,48,0.18)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-ink)"; e.currentTarget.style.boxShadow = "none"; }}
        />
      </div>

      {/* ── Premios por categoría (opcional) ── */}
      <p style={SH}>
        <span style={{ width: 18, height: 2, background: "var(--color-stage)", display: "block", flexShrink: 0 }} />
        Premios <span style={{ fontFamily: "var(--font-body)", textTransform: "none", letterSpacing: 0, fontSize: 11, opacity: 0.55 }}>(opcional)</span>
      </p>

      {prizeCategories.map((cat, ci) => (
        <div
          key={ci}
          style={{ border: "2px solid var(--color-ink)", background: "var(--color-grain)", padding: 12, marginBottom: 10 }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="text"
              value={cat.name}
              onChange={(e) => updateCategoryName(ci, e.currentTarget.value)}
              placeholder="Categoría (ej. Libre, Sub-18)"
              style={{ ...INPUT, flex: 1, fontWeight: 600 }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-stage)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(204,45,48,0.18)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-ink)"; e.currentTarget.style.boxShadow = "none"; }}
            />
            <button
              type="button"
              onClick={() => removeCategory(ci)}
              style={{ border: "1px solid rgba(26,26,26,0.2)", background: "transparent", color: "var(--color-stage)", padding: "8px 10px", fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.12em", fontSize: 10, cursor: "pointer", flexShrink: 0 }}
            >
              Quitar
            </button>
          </div>

          <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
            {cat.places.map((place, pi) => (
              <div key={pi} style={{ display: "flex", gap: 6, alignItems: "stretch" }}>
                <span
                  style={{
                    ...INPUT,
                    width: 96,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    opacity: 0.85,
                  }}
                >
                  {placeOrdinal(pi)}
                </span>
                <input
                  type="text"
                  value={place.award}
                  onChange={(e) => updateAward(ci, pi, e.currentTarget.value)}
                  placeholder="Premio (ej. Trofeo + Q100)"
                  style={{ ...INPUT, flex: 1 }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-stage)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(204,45,48,0.18)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-ink)"; e.currentTarget.style.boxShadow = "none"; }}
                />
                <button
                  type="button"
                  onClick={() => removePlace(ci, pi)}
                  aria-label="Quitar lugar"
                  style={{ border: "1px solid rgba(26,26,26,0.2)", background: "transparent", color: "var(--color-stage)", padding: "0 10px", cursor: "pointer", fontSize: 16, flexShrink: 0 }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => addPlace(ci)}
            style={{ marginTop: 8, background: "transparent", color: "var(--color-ink)", border: "1px dashed rgba(26,26,26,0.4)", padding: "6px 12px", fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.12em", fontSize: 10, cursor: "pointer" }}
          >
            + Lugar
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addCategory}
        style={{
          width: "100%",
          background: "var(--color-stage)",
          color: "var(--color-cream)",
          border: "2px solid var(--color-ink)",
          padding: "10px 16px",
          fontFamily: "var(--font-poster)",
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        + Agregar categoría
      </button>

      <label
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
          marginTop: 12,
          fontFamily: "var(--font-body)",
          fontSize: 13,
          color: "var(--color-ink)",
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={prizesNonCumulative}
          onChange={(e) => setPrizesNonCumulative(e.currentTarget.checked)}
          style={{ marginTop: 3 }}
        />
        <span>
          Premios no acumulables
          <span style={{ display: "block", fontSize: 11, color: "#666", marginTop: 2 }}>
            Si un jugador Sub-18 obtiene premio en Libre, el premio Sub-18 pasa al siguiente mejor clasificado.
          </span>
        </span>
      </label>

      {/* ── Jugadores recurrentes ── */}
      <p style={SH}>
        <span style={{ width: 18, height: 2, background: "var(--color-stage)", display: "block", flexShrink: 0 }} />
        Jugadores frecuentes
      </p>

      <div style={{ border: "2px solid var(--color-ink)", background: "var(--color-grain)", padding: 12 }}>
        <p style={{ fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 11, marginBottom: 10 }}>
          Agregar jugador
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            placeholder="Nombre completo *"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.currentTarget.value)}
            onKeyDown={handleRecurringKeyDown}
            style={{ ...INPUT, flex: 1 }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-stage)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(204,45,48,0.18)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-ink)"; e.currentTarget.style.boxShadow = "none"; }}
          />
          <input
            type="number"
            placeholder="Rating"
            value={newPlayerRating}
            onChange={(e) => setNewPlayerRating(e.currentTarget.value)}
            onKeyDown={handleRecurringKeyDown}
            min={100}
            max={3000}
            style={{ ...INPUT, width: 90 }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-stage)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(204,45,48,0.18)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-ink)"; e.currentTarget.style.boxShadow = "none"; }}
          />
        </div>
        <button
          type="button"
          onClick={addRecurringPlayer}
          style={{
            width: "100%",
            marginTop: 8,
            background: "var(--color-stage)",
            color: "var(--color-cream)",
            border: "2px solid var(--color-ink)",
            padding: "10px 16px",
            fontFamily: "var(--font-poster)",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          + Agregar
        </button>

        <div style={{ marginTop: 12, border: "2px solid var(--color-ink)", background: "var(--color-cream)" }}>
          {recurringPlayers.length === 0 ? (
            <p style={{ padding: 14, fontFamily: "var(--font-body)", fontSize: 13, color: "#666", textAlign: "center" }}>
              Sin jugadores frecuentes.
            </p>
          ) : (
            recurringPlayers.map((player, index) => (
              <div
                key={`${player.name}-${index}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "32px 1fr auto",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 10px",
                  borderBottom: index === recurringPlayers.length - 1 ? "none" : "1px dashed rgba(26,26,26,0.18)",
                }}
              >
                <span style={{ fontFamily: "var(--font-poster)", fontSize: 14, color: "var(--color-stage)", textAlign: "center" }}>
                  {index + 1}
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "var(--color-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {player.name}
                  </span>
                  <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 10, letterSpacing: "0.08em", color: "#666" }}>
                    {player.rating ? `Rating ${player.rating}` : "Sin rating"}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => removeRecurringPlayer(index)}
                  style={{
                    border: "1px solid rgba(26,26,26,0.2)",
                    background: "transparent",
                    color: "var(--color-stage)",
                    padding: "5px 8px",
                    fontFamily: "var(--font-poster)",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    fontSize: 10,
                    cursor: "pointer",
                  }}
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 10 }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--color-ink)",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={saveRecurringPlayers}
              onChange={(e) => setSaveRecurringPlayers(e.currentTarget.checked)}
            />
            Guardar como lista recurrente
          </label>
          <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 10, letterSpacing: "0.1em", color: "#666", textTransform: "uppercase" }}>
            {recurringPlayers.length} jugador{recurringPlayers.length === 1 ? "" : "es"}
          </span>
        </div>
      </div>

      {/* ── Desempates ── */}
      <p style={SH}>
        <span style={{ width: 18, height: 2, background: "var(--color-stage)", display: "block", flexShrink: 0 }} />
        Desempates
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {(["casual", "formal"] as const).map((preset) => {
          const selected = tiebreaks === preset;
          return (
            <button
              key={preset}
              type="button"
              onClick={() => setTiebreaks(preset)}
              style={{
                border: "2px solid var(--color-ink)",
                background: selected ? "var(--color-stage)" : "var(--color-grain)",
                color: selected ? "var(--color-cream)" : "var(--color-ink)",
                padding: "10px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                textAlign: "left" as const,
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  border: `2px solid ${selected ? "var(--color-cream)" : "var(--color-ink)"}`,
                  borderRadius: "50%",
                  marginTop: 2,
                  flexShrink: 0,
                  background: selected ? "var(--color-cream)" : "transparent",
                  position: "relative",
                  display: "block",
                }}
              >
                {selected && (
                  <span
                    style={{
                      position: "absolute",
                      inset: 3,
                      background: "var(--color-stage)",
                      borderRadius: "50%",
                      display: "block",
                    }}
                  />
                )}
              </span>
              <span>
                <p style={{ fontFamily: "var(--font-poster)", textTransform: "uppercase" as const, letterSpacing: "0.14em", fontSize: 11, lineHeight: 1.1 }}>
                  {preset === "casual" ? "Casual" : "Formal"}
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 11, lineHeight: 1.3, marginTop: 2 }}>
                  {preset === "casual" ? "Buchholz + progresivo." : "Buchholz · Sonneborn · directo."}
                </p>
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        style={{
          width: "100%",
          background: "var(--color-ink)",
          color: "var(--color-cream)",
          border: "2px solid var(--color-ink)",
          padding: 14,
          fontFamily: "var(--font-display)",
          fontSize: 20,
          letterSpacing: "0.01em",
          marginTop: 22,
          cursor: "pointer",
          boxShadow: "var(--shadow-card)",
          textAlign: "center" as const,
        }}
      >
        Guardar{" "}
        <em style={{ fontFamily: "var(--font-chess)", fontStyle: "italic", color: "var(--color-marquee)" }}>
          torneo
        </em>
      </button>
    </form>
  );
}
