import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Flame, Medal, TrendingUp, Trophy } from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { PlayerAvatar } from "@/components/chess/StandingsTable";
import { listClubPlayers } from "@/lib/club-players-store";
import { listTournaments } from "@/lib/tournament-store";
import {
  PARTICIPATION_POINTS,
  POSITION_POINTS,
  computeClubRanking,
  getAnnualTable,
  getLifetimeTable,
  getRankingYears,
  isEntryInactive,
} from "@/modules/chess/club-ranking";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ranking del club",
  description:
    "Ranking ELO y circuito anual de puntos del club de ajedrez Chessitos en Azotea Salcajá. Cada lunes suma.",
};

const CARD_BASE = {
  background: "var(--color-cream)",
  borderColor: "var(--color-ink)",
  boxShadow: "var(--shadow-card)",
} as const;

const HEADER_CELL: React.CSSProperties = {
  fontFamily: "var(--font-poster)",
  textTransform: "uppercase",
  letterSpacing: "0.14em",
  fontSize: 10,
  fontWeight: 400,
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-xs uppercase"
      style={{
        fontFamily: "var(--font-poster)",
        letterSpacing: "0.2em",
        color: "var(--color-marquee)",
      }}
    >
      {children}
    </span>
  );
}

function InactiveBadge() {
  return (
    <span
      className="rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em]"
      style={{
        fontFamily: "var(--font-poster)",
        background: "rgba(26,26,26,0.08)",
        color: "#7a7a7a",
        border: "1px solid rgba(26,26,26,0.18)",
      }}
    >
      Inactivo
    </span>
  );
}

export default async function ClubRankingPage({
  searchParams,
}: {
  searchParams?: Promise<{ ano?: string | string[] }>;
}) {
  const params = await searchParams;
  const [tournaments, clubPlayers] = await Promise.all([
    listTournaments(),
    listClubPlayers(),
  ]);

  // Se calcula con TODO el roster (incluidos desactivados) para que el
  // historial de por vida no se pierda cuando alguien deja de llegar.
  const entries = computeClubRanking(tournaments, clubPlayers);

  const years = getRankingYears(entries);
  const currentYear = String(new Date().getFullYear());
  const requestedYear = Array.isArray(params?.ano) ? params?.ano[0] : params?.ano;
  const selectedYear =
    requestedYear && years.includes(requestedYear)
      ? requestedYear
      : years[0] ?? currentYear;

  // ELO: solo jugadores activos del roster (la competencia vigente).
  const eloTable = entries.filter((entry) => entry.player.isActive);
  const annualTable = getAnnualTable(entries, selectedYear);
  const lifetimeTable = getLifetimeTable(entries);

  return (
    <PublicLayout>
      <main>
        {/* ── HERO ── */}
        <section
          className="border-b-[3px]"
          style={{
            background:
              "linear-gradient(135deg, var(--color-navy-deep) 0%, var(--color-navy) 60%, var(--color-ink) 100%)",
            color: "var(--color-cream)",
            borderColor: "var(--color-marquee)",
          }}
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <Link
              className="inline-flex items-center gap-2 text-sm font-semibold no-underline"
              href="/ajedrez"
              style={{ color: "var(--color-marquee)" }}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Volver a ajedrez
            </Link>

            <div className="mt-7">
              <Eyebrow>Chessitos · Circuito de lunes</Eyebrow>
            </div>
            <h1
              className="mt-3 max-w-4xl"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-5xl)",
                lineHeight: 0.95,
              }}
            >
              Ranking del club
            </h1>
            <p
              className="mt-5 max-w-2xl text-base leading-7"
              style={{ fontFamily: "var(--font-body)", opacity: 0.9 }}
            >
              Cada torneo de lunes reparte puntos por posición y mueve el ELO del club.
              Jugar constante suma: participar siempre da puntos, ganar da más.
            </p>
          </div>
        </section>

        {/* ── ELO del club ── */}
        <Section>
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6" style={{ color: "var(--color-navy)" }} aria-hidden />
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", lineHeight: 1 }}>
              ELO del club
            </h2>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-stone-600">
            Se recalcula partida a partida con cada torneo del club que finaliza.
            Quien no juega hace más de 4 meses aparece como inactivo.
          </p>

          <div className="mt-6 border-2" style={CARD_BASE}>
            {eloTable.length === 0 ? (
              <p className="p-8 text-center text-sm text-stone-500">
                El club aún no tiene jugadores registrados.
              </p>
            ) : (
              <div className="divide-y" style={{ borderColor: "rgba(26,26,26,0.12)" }}>
                <div
                  className="flex items-center gap-3 px-4 py-2.5"
                  style={{ background: "var(--color-navy)", color: "var(--color-cream)" }}
                >
                  <span className="w-6 text-center" style={HEADER_CELL}>#</span>
                  <span className="flex-1" style={HEADER_CELL}>Jugador</span>
                  <span className="w-14 text-right" style={HEADER_CELL}>ELO</span>
                  <span className="w-12 text-right" style={HEADER_CELL}>±</span>
                </div>
                {eloTable.map((entry, index) => {
                  const inactive = isEntryInactive(entry);
                  return (
                    <div className="flex items-center gap-3 px-4 py-3" key={entry.player.id}>
                      <span
                        className="w-6 text-center font-semibold"
                        style={{ color: "var(--color-navy)" }}
                      >
                        {index + 1}
                      </span>
                      <PlayerAvatar
                        name={entry.player.name}
                        photoUrl={entry.player.photoUrl}
                        size={36}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate font-semibold text-stone-900">
                            {entry.player.title ? `${entry.player.title} ` : ""}
                            {entry.player.name}
                          </span>
                          {inactive && <InactiveBadge />}
                        </span>
                        <span className="mt-0.5 block text-xs text-stone-500">
                          {entry.eloGames > 0
                            ? `${entry.eloGames} partidas valoradas`
                            : "Sin torneos del club todavía"}
                        </span>
                      </span>
                      <span
                        className="w-14 text-right text-base font-bold"
                        style={{ fontFamily: "ui-monospace, monospace", color: "var(--color-navy)" }}
                      >
                        {entry.elo}
                      </span>
                      <span
                        className="w-12 text-right text-xs font-semibold"
                        style={{
                          fontFamily: "ui-monospace, monospace",
                          color:
                            entry.eloDelta > 0
                              ? "var(--color-emerald)"
                              : entry.eloDelta < 0
                                ? "var(--color-stage)"
                                : "#999",
                        }}
                      >
                        {entry.eloDelta > 0 ? `+${entry.eloDelta}` : entry.eloDelta || "–"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Section>

        {/* ── Circuito anual de puntos ── */}
        <div style={{ background: "var(--color-grain)" }}>
          <Section>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <Flame className="h-6 w-6" style={{ color: "var(--color-stage)" }} aria-hidden />
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", lineHeight: 1 }}>
                    Circuito {selectedYear}
                  </h2>
                </div>
                <p className="mt-2 max-w-2xl text-sm text-stone-600">
                  Puntos acumulados por posición en cada torneo del club, como en el
                  circuito de tenis. Al cierre del año se premia a los más constantes.
                </p>
              </div>
              {years.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {years.map((year) => (
                    <Link
                      key={year}
                      href={`/ajedrez/club?ano=${year}`}
                      className="rounded-sm border-2 px-3 py-1 text-xs font-semibold no-underline"
                      style={{
                        fontFamily: "var(--font-poster)",
                        letterSpacing: "0.1em",
                        borderColor: "var(--color-ink)",
                        background:
                          year === selectedYear ? "var(--color-ink)" : "var(--color-cream)",
                        color:
                          year === selectedYear ? "var(--color-cream)" : "var(--color-ink)",
                      }}
                    >
                      {year}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 border-2" style={CARD_BASE}>
              {annualTable.length === 0 ? (
                <p className="p-8 text-center text-sm text-stone-500">
                  Todavía no hay torneos del club finalizados en {selectedYear}.
                  El próximo lunes arranca el circuito.
                </p>
              ) : (
                <div className="divide-y" style={{ borderColor: "rgba(26,26,26,0.12)" }}>
                  <div
                    className="flex items-center gap-3 px-4 py-2.5"
                    style={{ background: "var(--color-navy)", color: "var(--color-cream)" }}
                  >
                    <span className="w-6 text-center" style={HEADER_CELL}>#</span>
                    <span className="flex-1" style={HEADER_CELL}>Jugador</span>
                    <span className="w-10 text-center" style={HEADER_CELL}>1.º</span>
                    <span className="w-14 text-right" style={HEADER_CELL}>Pts</span>
                  </div>
                  {annualTable.map(({ entry, points, wins }, index) => (
                    <div className="flex items-center gap-3 px-4 py-3" key={entry.player.id}>
                      <span
                        className="w-6 text-center font-semibold"
                        style={{ color: "var(--color-navy)" }}
                      >
                        {index + 1}
                      </span>
                      <PlayerAvatar
                        name={entry.player.name}
                        photoUrl={entry.player.photoUrl}
                        size={36}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate font-semibold text-stone-900">
                            {entry.player.name}
                          </span>
                          {!entry.player.isActive && <InactiveBadge />}
                        </span>
                      </span>
                      <span
                        className="w-10 text-center text-sm font-semibold"
                        style={{ fontFamily: "ui-monospace, monospace", color: "var(--color-marquee)" }}
                      >
                        {wins > 0 ? `×${wins}` : "–"}
                      </span>
                      <span
                        className="w-14 text-right text-base font-bold"
                        style={{ fontFamily: "ui-monospace, monospace", color: "var(--color-navy)" }}
                      >
                        {points}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Escala de puntos */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-stone-500">
              <Medal className="h-3.5 w-3.5" style={{ color: "var(--color-marquee)" }} aria-hidden />
              <span className="font-semibold">Puntos por posición:</span>
              {POSITION_POINTS.map((points, index) => (
                <span
                  key={index}
                  className="rounded-sm border px-1.5 py-0.5"
                  style={{ borderColor: "rgba(26,26,26,0.18)", fontFamily: "ui-monospace, monospace" }}
                >
                  {index + 1}.º {points}
                </span>
              ))}
              <span
                className="rounded-sm border px-1.5 py-0.5"
                style={{ borderColor: "rgba(26,26,26,0.18)", fontFamily: "ui-monospace, monospace" }}
              >
                resto {PARTICIPATION_POINTS}
              </span>
            </div>
          </Section>
        </div>

        {/* ── Histórico de toda la vida ── */}
        <Section>
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6" style={{ color: "var(--color-marquee)" }} aria-hidden />
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", lineHeight: 1 }}>
              Tabla de toda la vida
            </h2>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-stone-600">
            El acumulado histórico del club. Quien deja de llegar conserva su lugar
            en esta tabla; su historia no se borra.
          </p>

          <div className="mt-6 border-2" style={CARD_BASE}>
            {lifetimeTable.length === 0 ? (
              <p className="p-8 text-center text-sm text-stone-500">
                Aún no hay torneos del club finalizados. La historia empieza el próximo lunes.
              </p>
            ) : (
              <div className="divide-y" style={{ borderColor: "rgba(26,26,26,0.12)" }}>
                <div
                  className="flex items-center gap-3 px-4 py-2.5"
                  style={{ background: "var(--color-navy)", color: "var(--color-cream)" }}
                >
                  <span className="w-6 text-center" style={HEADER_CELL}>#</span>
                  <span className="flex-1" style={HEADER_CELL}>Jugador</span>
                  <span className="hidden w-16 text-center sm:block" style={HEADER_CELL}>Torneos</span>
                  <span className="w-10 text-center" style={HEADER_CELL}>1.º</span>
                  <span className="w-14 text-right" style={HEADER_CELL}>Pts</span>
                </div>
                {lifetimeTable.map((entry, index) => (
                  <div className="flex items-center gap-3 px-4 py-3" key={entry.player.id}>
                    <span
                      className="w-6 text-center font-semibold"
                      style={{ color: "var(--color-navy)" }}
                    >
                      {index + 1}
                    </span>
                    <PlayerAvatar
                      name={entry.player.name}
                      photoUrl={entry.player.photoUrl}
                      size={36}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate font-semibold text-stone-900">
                          {entry.player.name}
                        </span>
                        {!entry.player.isActive && <InactiveBadge />}
                      </span>
                      <span className="mt-0.5 block text-xs text-stone-500 sm:hidden">
                        {entry.tournamentsPlayed} torneo{entry.tournamentsPlayed === 1 ? "" : "s"}
                      </span>
                    </span>
                    <span
                      className="hidden w-16 text-center text-sm sm:block"
                      style={{ fontFamily: "ui-monospace, monospace", color: "#666" }}
                    >
                      {entry.tournamentsPlayed}
                    </span>
                    <span
                      className="w-10 text-center text-sm font-semibold"
                      style={{ fontFamily: "ui-monospace, monospace", color: "var(--color-marquee)" }}
                    >
                      {entry.tournamentWins > 0 ? `×${entry.tournamentWins}` : "–"}
                    </span>
                    <span
                      className="w-14 text-right text-base font-bold"
                      style={{ fontFamily: "ui-monospace, monospace", color: "var(--color-navy)" }}
                    >
                      {entry.lifetimePoints}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Section>
      </main>
    </PublicLayout>
  );
}
