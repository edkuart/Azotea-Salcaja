"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { restaurantInfo } from "@/modules/restaurant/public-data";
import type { ClubRankingEntry } from "@/modules/chess/club-ranking";
import type {
  ChessPlayer,
  ClubPlayerSex,
  TieBreakCode,
  TournamentSexCategory,
  TournamentSystem,
} from "@/modules/chess/types";
import {
  checkPlayerCategory,
  computeAge,
  SEX_CATEGORY_LABELS,
} from "@/modules/chess/categories";
import { roundRobinRoundCount } from "@/modules/chess/round-robin";

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

/** Invitado puntual: participa en este torneo sin pertenecer al club. */
type GuestPlayer = {
  name: string;
  rating?: number;
  birthDate?: string;
  sex?: ClubPlayerSex;
};

const MONDAY_TEMPLATE = {
  title: "Rapid nocturno de lunes",
  rounds: 5,
  location: `${restaurantInfo.name} · ${restaurantInfo.shortAddress}`,
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

/** Combina jugadores del club seleccionados + invitados y asigna seeds por
 *  rating (mayor primero; sin rating al final). Los del club entran con su
 *  ELO ACTUAL del ranking — así los pareos reflejan su nivel real — y llevan
 *  clubPlayerId para que el torneo cuente en su historial. */
function buildTournamentPlayers(
  clubEntries: ClubRankingEntry[],
  guests: GuestPlayer[],
  tournamentId: string,
): ChessPlayer[] {
  const combined: Array<
    Pick<
      ChessPlayer,
      "name" | "rating" | "photoUrl" | "clubPlayerId" | "sex" | "birthDate"
    >
  > = [
    ...clubEntries.map((entry) => ({
      name: entry.player.name,
      rating: entry.eloGames > 0 ? entry.elo : entry.player.rating,
      photoUrl: entry.player.photoUrl,
      clubPlayerId: entry.player.id,
      sex: entry.player.sex,
      birthDate: entry.player.birthDate,
    })),
    ...guests.map((guest) => ({
      name: guest.name,
      rating: guest.rating,
      photoUrl: undefined,
      clubPlayerId: undefined,
      sex: guest.sex,
      birthDate: guest.birthDate,
    })),
  ];

  combined.sort(
    (a, b) =>
      (b.rating ?? -1) - (a.rating ?? -1) || a.name.localeCompare(b.name, "es"),
  );

  return combined.map((player, index) => ({
    id: `${tournamentId}-p${index + 1}`,
    name: player.name,
    rating: player.rating,
    ...(player.photoUrl ? { photoUrl: player.photoUrl } : {}),
    ...(player.clubPlayerId ? { clubPlayerId: player.clubPlayerId } : {}),
    ...(player.sex ? { sex: player.sex } : {}),
    ...(player.birthDate ? { birthDate: player.birthDate } : {}),
    seed: index + 1,
    status: "active",
  }));
}

/** ¿La fecha (YYYY-MM-DD) cae en lunes? Define el default de clubRanked. */
function isMondayDate(value: string): boolean {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return false;
  return new Date(year, month - 1, day).getDay() === 1;
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
  const [startsAtDate, setStartsAtDate] = useState(getTodayInputValue);
  const [rounds, setRounds] = useState(
    isMondayTemplate ? MONDAY_TEMPLATE.rounds : 5,
  );

  // ── Jugadores: roster del club (seleccionables) + invitados puntuales ──
  const [clubEntries, setClubEntries] = useState<ClubRankingEntry[]>([]);
  const [clubLoading, setClubLoading] = useState(true);
  const [selectedClubIds, setSelectedClubIds] = useState<Set<string>>(new Set());
  const [guests, setGuests] = useState<GuestPlayer[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerRating, setNewPlayerRating] = useState("");
  const [newPlayerBirthDate, setNewPlayerBirthDate] = useState("");
  const [newPlayerSex, setNewPlayerSex] = useState<"" | ClubPlayerSex>("");

  // ── Categoría (cuando el torneo es una categoría de un evento con varias) ──
  const [categoryLabel, setCategoryLabel] = useState("");
  const [sexCategory, setSexCategory] = useState<TournamentSexCategory>("open");
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");

  // ── Ranking del club: por defecto solo los lunes cuenta; otros días el
  //    organizador decide (override manual con el checkbox). ──
  const [clubRankedOverride, setClubRankedOverride] = useState<boolean | null>(null);
  const clubRanked =
    clubRankedOverride ?? (isMondayTemplate || isMondayDate(startsAtDate));

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
    let cancelled = false;
    (async () => {
      try {
        // El ranking trae el roster + ELO actual (para seeds justos).
        const res = await fetch("/api/club-ranking");
        if (!res.ok || cancelled) return;
        const all = (await res.json()) as ClubRankingEntry[];
        const active = all.filter((entry) => entry.player.isActive);
        if (!cancelled) {
          setClubEntries(active);
          // Por defecto todos los del club participan: destildar al ausente
          // es menos trabajo que tildar uno por uno cada lunes.
          setSelectedClubIds(new Set(active.map((entry) => entry.player.id)));
        }
      } catch {
        // Sin conexión al club: el torneo aún puede crearse con invitados.
      } finally {
        if (!cancelled) setClubLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  function toggleClubPlayer(id: string) {
    setSelectedClubIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function addGuest() {
    const name = newPlayerName.trim();
    if (!name) return;

    const ratingValue = Number.parseInt(newPlayerRating, 10);
    const rating = Number.isFinite(ratingValue) ? ratingValue : undefined;
    const taken =
      guests.some((guest) => guest.name.trim().toLowerCase() === name.toLowerCase()) ||
      clubEntries.some(
        (entry) => entry.player.name.trim().toLowerCase() === name.toLowerCase(),
      );

    if (!taken) {
      setGuests((players) => [
        ...players,
        {
          name,
          rating,
          ...(newPlayerBirthDate ? { birthDate: newPlayerBirthDate } : {}),
          ...(newPlayerSex ? { sex: newPlayerSex } : {}),
        },
      ]);
    }
    setNewPlayerName("");
    setNewPlayerRating("");
    setNewPlayerBirthDate("");
    setNewPlayerSex("");
  }

  function removeGuest(index: number) {
    setGuests((players) => players.filter((_, i) => i !== index));
  }

  function handleGuestKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    addGuest();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = (fd.get("title") as string).trim();
    const id = `t${Date.now()}`;
    const selectedClub = clubEntries.filter((entry) =>
      selectedClubIds.has(entry.player.id),
    );
    const players = buildTournamentPlayers(selectedClub, guests, id);

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

    // Metadatos de categoría (opcionales) — solo se incluyen si tienen valor.
    const categoryLabelClean = categoryLabel.trim();
    const ageMinNum = ageMin.trim() ? Number.parseInt(ageMin, 10) : NaN;
    const ageMaxNum = ageMax.trim() ? Number.parseInt(ageMax, 10) : NaN;

    const tournament = {
      id,
      kind: "official" as const,
      visibility: "draft" as const,
      title,
      slug: slugify(title),
      description: ((fd.get("description") as string | null) ?? "").trim(),
      system,
      roundsPlanned:
        system === "round_robin"
          ? roundRobinRoundCount(players.length)
          : rounds,
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
      ...(clubRanked ? { clubRanked: true } : {}),
      ...(categoryLabelClean ? { categoryLabel: categoryLabelClean } : {}),
      ...(Number.isFinite(ageMinNum) ? { ageMin: ageMinNum } : {}),
      ...(Number.isFinite(ageMaxNum) ? { ageMax: ageMaxNum } : {}),
      ...(sexCategory !== "open" ? { sexCategory } : {}),
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

  // Restricciones de la categoría en curso, para avisos suaves al inscribir.
  const parsedAgeMin = ageMin.trim() ? Number.parseInt(ageMin, 10) : NaN;
  const parsedAgeMax = ageMax.trim() ? Number.parseInt(ageMax, 10) : NaN;
  const categoryForCheck = {
    ageMin: Number.isFinite(parsedAgeMin) ? parsedAgeMin : undefined,
    ageMax: Number.isFinite(parsedAgeMax) ? parsedAgeMax : undefined,
    sexCategory,
    startsAt: startsAtDate,
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ── Datos básicos ── */}
      <p style={SH}>
        <span style={{ width: 18, height: 2, background: "var(--color-navy)", display: "block", flexShrink: 0 }} />
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
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-navy)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(11,42,74,0.18)"; e.currentTarget.style.background = "var(--color-cream)"; }}
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
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-navy)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(11,42,74,0.18)"; }}
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
            value={
              system === "round_robin"
                ? roundRobinRoundCount(selectedClubIds.size + guests.length)
                : rounds
            }
            onChange={(e) => setRounds(Number.parseInt(e.currentTarget.value, 10) || 1)}
            disabled={system === "round_robin"}
            required={system === "swiss"}
            style={{
              ...INPUT,
              opacity: system === "round_robin" ? 0.65 : 1,
              cursor: system === "round_robin" ? "not-allowed" : "text",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-navy)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(11,42,74,0.18)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-ink)"; e.currentTarget.style.boxShadow = "none"; }}
          />
          {system === "round_robin" && (
            <p style={{ fontFamily: "monospace", fontSize: 10, color: "#666", marginTop: 4 }}>
              Automático: cada jugador se enfrenta una vez con todos.
            </p>
          )}
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <label style={LABEL}>Ubicación</label>
        <input
          name="location"
          style={INPUT}
          defaultValue={MONDAY_TEMPLATE.location}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-navy)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(11,42,74,0.18)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-ink)"; e.currentTarget.style.boxShadow = "none"; }}
        />
      </div>

      {/* ── Sistema ── */}
      <p style={SH}>
        <span style={{ width: 18, height: 2, background: "var(--color-navy)", display: "block", flexShrink: 0 }} />
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
                borderLeft: selected ? "5px solid var(--color-marquee)" : "2px solid var(--color-ink)",
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

      {/* ── Categoría (opcional) ── */}
      <p style={SH}>
        <span style={{ width: 18, height: 2, background: "var(--color-navy)", display: "block", flexShrink: 0 }} />
        Categoría <span style={{ fontFamily: "var(--font-body)", textTransform: "none", letterSpacing: 0, fontSize: 11, opacity: 0.55 }}>(opcional)</span>
      </p>

      <p style={{ fontFamily: "var(--font-body)", fontSize: 11, lineHeight: 1.4, color: "#555", marginBottom: 8 }}>
        Úsala cuando este torneo sea una categoría dentro de un evento con varias
        (ej. Sub-12, Femenino, Libre). Luego adjunta varios torneos-categoría al evento.
      </p>

      <div style={{ marginBottom: 10 }}>
        <label style={LABEL}>Nombre de la categoría</label>
        <input
          type="text"
          value={categoryLabel}
          onChange={(e) => setCategoryLabel(e.currentTarget.value)}
          placeholder="Ej. Sub-12, Femenino Absoluto, Libre"
          style={INPUT}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-navy)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(11,42,74,0.18)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-ink)"; e.currentTarget.style.boxShadow = "none"; }}
        />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label style={LABEL}>Sexo</label>
        <select
          value={sexCategory}
          onChange={(e) => setSexCategory(e.currentTarget.value as TournamentSexCategory)}
          style={INPUT}
        >
          {(["open", "female", "male"] as TournamentSexCategory[]).map((value) => (
            <option key={value} value={value}>
              {SEX_CATEGORY_LABELS[value]}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div>
          <label style={LABEL}>Edad mín.</label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={120}
            value={ageMin}
            onChange={(e) => setAgeMin(e.currentTarget.value)}
            placeholder="—"
            style={INPUT}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-navy)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(11,42,74,0.18)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-ink)"; e.currentTarget.style.boxShadow = "none"; }}
          />
        </div>
        <div>
          <label style={LABEL}>Edad máx.</label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={120}
            value={ageMax}
            onChange={(e) => setAgeMax(e.currentTarget.value)}
            placeholder="—"
            style={INPUT}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-navy)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(11,42,74,0.18)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-ink)"; e.currentTarget.style.boxShadow = "none"; }}
          />
        </div>
      </div>
      <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 10, letterSpacing: "0.05em", color: "#666", marginTop: 4 }}>
        Ej. Sub-12 → edad máx. 12. Mayores 35 → edad mín. 35. La edad se calcula a la fecha de inicio.
      </p>

      {/* ── Inscripción (opcional) ── */}
      <p style={SH}>
        <span style={{ width: 18, height: 2, background: "var(--color-navy)", display: "block", flexShrink: 0 }} />
        Inscripción <span style={{ fontFamily: "var(--font-body)", textTransform: "none", letterSpacing: 0, fontSize: 11, opacity: 0.55 }}>(opcional)</span>
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div>
          <label style={LABEL}>Ritmo de juego</label>
          <input
            name="timeControl"
            style={INPUT}
            placeholder="Ej. 10+0"
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-navy)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(11,42,74,0.18)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-ink)"; e.currentTarget.style.boxShadow = "none"; }}
          />
        </div>
        <div>
          <label style={LABEL}>Costo de inscripción</label>
          <input
            name="entryFee"
            style={INPUT}
            placeholder="Ej. Q30"
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-navy)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(11,42,74,0.18)"; }}
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
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-navy)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(11,42,74,0.18)"; }}
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
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-navy)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(11,42,74,0.18)"; }}
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
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-navy)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(11,42,74,0.18)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-ink)"; e.currentTarget.style.boxShadow = "none"; }}
        />
      </div>

      {/* ── Premios por categoría (opcional) ── */}
      <p style={SH}>
        <span style={{ width: 18, height: 2, background: "var(--color-navy)", display: "block", flexShrink: 0 }} />
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
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-navy)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(11,42,74,0.18)"; }}
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
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-navy)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(11,42,74,0.18)"; }}
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

      {/* ── Jugadores del club ── */}
      <p style={SH}>
        <span style={{ width: 18, height: 2, background: "var(--color-navy)", display: "block", flexShrink: 0 }} />
        Jugadores del club
      </p>

      <div style={{ border: "2px solid var(--color-ink)", background: "var(--color-grain)", padding: 12 }}>
        {/* Toggle: ¿este torneo cuenta para el ranking del club? */}
        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            padding: "10px 12px",
            marginBottom: 12,
            border: "2px solid var(--color-ink)",
            background: clubRanked ? "var(--color-navy)" : "var(--color-cream)",
            color: clubRanked ? "var(--color-cream)" : "var(--color-ink)",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={clubRanked}
            onChange={(e) => setClubRankedOverride(e.currentTarget.checked)}
            style={{ marginTop: 3 }}
          />
          <span>
            <span style={{ display: "block", fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.14em", fontSize: 11 }}>
              Cuenta para el ranking del club
            </span>
            <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 11, marginTop: 3, opacity: 0.8, lineHeight: 1.4 }}>
              Al finalizar, reparte puntos anuales por posición y actualiza el ELO del club.
              Se activa solo en lunes; otros días queda a tu criterio.
            </span>
          </span>
        </label>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
          <p style={{ fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 11 }}>
            Marcar quiénes juegan
          </p>
          <Link
            href="/admin/ajedrez/jugadores"
            style={{
              fontFamily: "var(--font-poster)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontSize: 10,
              color: "var(--color-navy)",
              textDecoration: "underline",
              flexShrink: 0,
            }}
          >
            Administrar club →
          </Link>
        </div>

        {clubLoading ? (
          <p style={{ padding: 14, fontFamily: "var(--font-body)", fontSize: 13, color: "#666", textAlign: "center" }}>
            Cargando jugadores del club…
          </p>
        ) : clubEntries.length === 0 ? (
          <p style={{ padding: 14, fontFamily: "var(--font-body)", fontSize: 13, color: "#666", textAlign: "center", border: "2px dashed rgba(26,26,26,0.25)" }}>
            El club aún no tiene jugadores.{" "}
            <Link href="/admin/ajedrez/jugadores" style={{ color: "var(--color-navy)", fontWeight: 600 }}>
              Crea el roster aquí
            </Link>{" "}
            o agrega invitados abajo.
          </p>
        ) : (
          <>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              <button
                type="button"
                onClick={() => setSelectedClubIds(new Set(clubEntries.map((e) => e.player.id)))}
                style={{ border: "1px solid rgba(26,26,26,0.3)", background: "transparent", color: "var(--color-ink)", padding: "5px 10px", fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.12em", fontSize: 10, cursor: "pointer" }}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setSelectedClubIds(new Set())}
                style={{ border: "1px solid rgba(26,26,26,0.3)", background: "transparent", color: "var(--color-ink)", padding: "5px 10px", fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.12em", fontSize: 10, cursor: "pointer" }}
              >
                Ninguno
              </button>
            </div>

            <div style={{ border: "2px solid var(--color-ink)", background: "var(--color-cream)" }}>
              {clubEntries.map((entry, index) => {
                const player = entry.player;
                const selected = selectedClubIds.has(player.id);
                const hasElo = entry.eloGames > 0;
                return (
                  <label
                    key={player.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 34px 1fr",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 10px",
                      borderBottom: index === clubEntries.length - 1 ? "none" : "1px dashed rgba(26,26,26,0.18)",
                      cursor: "pointer",
                      background: selected ? "transparent" : "rgba(26,26,26,0.04)",
                      opacity: selected ? 1 : 0.6,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleClubPlayer(player.id)}
                    />
                    {player.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={player.photoUrl}
                        alt=""
                        style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--color-ink)" }}
                      />
                    ) : (
                      <span
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          border: "2px solid var(--color-ink)",
                          background: "var(--color-grain)",
                          color: "var(--color-navy)",
                          fontFamily: "var(--font-poster)",
                          fontSize: 12,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {player.name
                          .split(/\s+/)
                          .slice(0, 2)
                          .map((part) => part[0]?.toUpperCase() ?? "")
                          .join("")}
                      </span>
                    )}
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "var(--color-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {player.title ? `${player.title} · ` : ""}{player.name}
                      </span>
                      <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 10, letterSpacing: "0.08em", color: "#666" }}>
                        {hasElo
                          ? `ELO club ${entry.elo}`
                          : player.rating
                            ? `Rating ${player.rating}`
                            : "Sin rating"}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </>
        )}

        {/* ── Invitados (solo este torneo) ── */}
        <p style={{ fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 11, margin: "14px 0 8px" }}>
          Invitados <span style={{ fontFamily: "var(--font-body)", textTransform: "none", letterSpacing: 0, fontSize: 11, opacity: 0.55 }}>(solo este torneo)</span>
        </p>
        <div style={{ display: "grid", gap: 8 }}>
          <input
            type="text"
            placeholder="Nombre completo"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.currentTarget.value)}
            onKeyDown={handleGuestKeyDown}
            style={INPUT}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-navy)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(11,42,74,0.18)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-ink)"; e.currentTarget.style.boxShadow = "none"; }}
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <div style={{ flex: "1 1 150px", minWidth: 0 }}>
              <label style={LABEL}>Fecha de nacimiento</label>
              <input
                type="date"
                value={newPlayerBirthDate}
                onChange={(e) => setNewPlayerBirthDate(e.currentTarget.value)}
                style={INPUT}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-navy)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(11,42,74,0.18)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-ink)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>
            <div style={{ flex: "1 1 110px", minWidth: 0 }}>
              <label style={LABEL}>Sexo</label>
              <select
                value={newPlayerSex}
                onChange={(e) => setNewPlayerSex(e.currentTarget.value as "" | ClubPlayerSex)}
                style={INPUT}
              >
                <option value="">—</option>
                <option value="F">Femenino</option>
                <option value="M">Masculino</option>
              </select>
            </div>
            <div style={{ flex: "1 1 90px", minWidth: 0 }}>
              <label style={LABEL}>Rating</label>
              <input
                type="number"
                inputMode="numeric"
                placeholder="—"
                value={newPlayerRating}
                onChange={(e) => setNewPlayerRating(e.currentTarget.value)}
                onKeyDown={handleGuestKeyDown}
                min={100}
                max={3000}
                style={INPUT}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-navy)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(11,42,74,0.18)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-ink)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={addGuest}
            style={{
              background: "var(--color-stage)",
              color: "var(--color-cream)",
              border: "2px solid var(--color-ink)",
              padding: "10px 14px",
              fontFamily: "var(--font-poster)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            + Agregar invitado
          </button>
        </div>

        {guests.length > 0 && (
          <div style={{ marginTop: 8, border: "2px solid var(--color-ink)", background: "var(--color-cream)" }}>
            {guests.map((guest, index) => {
              const age = computeAge(guest.birthDate, startsAtDate);
              const warnings = checkPlayerCategory(guest, categoryForCheck);
              const meta = [
                guest.rating ? `Rating ${guest.rating}` : "Sin rating",
                guest.sex === "F" ? "Femenino" : guest.sex === "M" ? "Masculino" : null,
                age != null ? `${age} años` : null,
                "Invitado",
              ].filter(Boolean);
              return (
                <div
                  key={`${guest.name}-${index}`}
                  style={{
                    padding: "9px 10px",
                    borderBottom: index === guests.length - 1 ? "none" : "1px dashed rgba(26,26,26,0.18)",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "var(--color-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {guest.name}
                      </span>
                      <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 10, letterSpacing: "0.08em", color: "#666" }}>
                        {meta.join(" · ")}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeGuest(index)}
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
                      Quitar
                    </button>
                  </div>
                  {warnings.map((warning, wi) => (
                    <p
                      key={wi}
                      style={{
                        marginTop: 6,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 6,
                        borderLeft: "3px solid var(--color-marquee)",
                        background: "rgba(212,160,23,0.12)",
                        padding: "6px 8px",
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        lineHeight: 1.35,
                        color: "#6b5310",
                      }}
                    >
                      <span aria-hidden>⚠</span>
                      {warning}
                    </p>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        <p style={{ marginTop: 10, textAlign: "right", fontFamily: "ui-monospace, monospace", fontSize: 10, letterSpacing: "0.1em", color: "#666", textTransform: "uppercase" }}>
          {selectedClubIds.size + guests.length} jugador{selectedClubIds.size + guests.length === 1 ? "" : "es"} en el torneo
        </p>
      </div>

      {/* ── Desempates ── */}
      <p style={SH}>
        <span style={{ width: 18, height: 2, background: "var(--color-navy)", display: "block", flexShrink: 0 }} />
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
                background: selected ? "var(--color-navy)" : "var(--color-grain)",
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
                      background: "var(--color-navy)",
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
