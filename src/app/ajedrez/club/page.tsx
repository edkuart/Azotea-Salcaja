import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Flame,
  Medal,
  Search,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { ClubPlayerAvatarLink } from "@/components/chess/ClubPlayerAvatarLink";
import { ClubMemberDirectory } from "@/components/chess/ClubMemberDirectory";
import { listClubPlayers } from "@/lib/club-players-store";
import { listPublicClubMembers } from "@/lib/public-club-members";
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
  searchParams?: Promise<{
    ano?: string | string[];
    buscar?: string | string[];
    categoria?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const [tournaments, clubPlayers, publicMembers] = await Promise.all([
    listTournaments(),
    listClubPlayers(),
    listPublicClubMembers(),
  ]);

  // Se calcula con TODO el roster (incluidos desactivados) para que el
  // historial de por vida no se pierda cuando alguien deja de llegar.
  const entries = computeClubRanking(tournaments, clubPlayers);

  const years = getRankingYears(entries);
  const currentYear = String(new Date().getFullYear());
  const requestedYear = Array.isArray(params?.ano)
    ? params?.ano[0]
    : params?.ano;
  const selectedYear =
    requestedYear && years.includes(requestedYear)
      ? requestedYear
      : (years[0] ?? currentYear);

  // ELO: solo jugadores activos del roster (la competencia vigente).
  const eloTable = entries.filter((entry) => entry.player.isActive);
  const annualTable = getAnnualTable(entries, selectedYear);
  const lifetimeTable = getLifetimeTable(entries);
  const search =
    (Array.isArray(params?.buscar) ? params.buscar[0] : params?.buscar)
      ?.trim()
      .toLowerCase() ?? "";
  const category =
    (Array.isArray(params?.categoria)
      ? params.categoria[0]
      : params?.categoria
    )?.trim() ?? "";
  const categories = [
    ...new Set(
      publicMembers
        .map((member) => member.category)
        .filter(Boolean) as string[],
    ),
  ].sort((a, b) => a.localeCompare(b, "es"));
  const visibleMembers = publicMembers.filter(
    (member) =>
      (!search || member.displayName.toLowerCase().includes(search)) &&
      (!category || member.category === category),
  );
  const publicMemberByPlayerId = new Map(
    publicMembers.map((member) => [member.clubPlayerId, member]),
  );
  const playerProfileLink = (playerId: string) => {
    const member = publicMemberByPlayerId.get(playerId);
    return member ? `/ajedrez/club/jugadores/${member.slug}` : undefined;
  };
  const playerPublicPhoto = (playerId: string) =>
    publicMemberByPlayerId.get(playerId)?.photoUrl;
  const playerPublicAvatar = (playerId: string) =>
    publicMemberByPlayerId.get(playerId)?.avatarId;

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
          <div className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
            <div className="reveal flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <Link
                className="inline-flex items-center gap-2 text-sm font-semibold no-underline"
                href="/ajedrez"
                style={{ color: "var(--color-marquee)" }}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Ajedrez
              </Link>
              <Eyebrow>Chessitos · Circuito de lunes</Eyebrow>
            </div>
            <h1
              className="reveal mt-2 max-w-4xl"
              data-reveal-delay="80"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 9vw, var(--text-4xl))",
                lineHeight: 0.95,
              }}
            >
              Ranking del club
            </h1>
            <p
              className="reveal mt-2 max-w-2xl text-sm leading-6"
              data-reveal-delay="160"
              style={{ fontFamily: "var(--font-body)", opacity: 0.9 }}
            >
              Cada lunes reparte puntos por posición y mueve el ELO del club.
            </p>

            <nav
              aria-label="Secciones del club"
              className="reveal mt-4 overflow-x-auto pb-1"
              data-reveal-delay="240"
            >
              <div className="flex min-w-max gap-2">
                <a
                  href="#ranking"
                  className="inline-flex min-h-9 items-center rounded-sm border border-white/30 px-3 text-xs font-semibold text-white no-underline hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-marquee)] sm:px-4 sm:text-sm"
                >
                  Ranking
                </a>
                <a
                  href="#historia"
                  className="inline-flex min-h-9 items-center rounded-sm border border-white/30 px-3 text-xs font-semibold text-white no-underline hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-marquee)] sm:px-4 sm:text-sm"
                >
                  Historia
                </a>
                <a
                  href="#miembros"
                  className="inline-flex min-h-9 items-center rounded-sm border border-white/30 px-3 text-xs font-semibold text-white no-underline hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-marquee)] sm:px-4 sm:text-sm"
                >
                  Miembros
                </a>
                <Link
                  href="/ajedrez/ranking"
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-sm border border-[var(--color-marquee)] px-3 text-xs font-semibold text-[var(--color-marquee)] no-underline hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-marquee)] sm:px-4 sm:text-sm"
                >
                  Palmarés
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>
            </nav>
          </div>
        </section>

        {/* ── Ranking: ELO + Circuito lado a lado ── */}
        <Section id="ranking">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div className="reveal">
              <div className="flex items-center gap-2.5">
                <TrendingUp
                  className="h-5 w-5"
                  style={{ color: "var(--color-navy)" }}
                  aria-hidden
                />
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "24px",
                    lineHeight: 1,
                  }}
                >
                  ELO del club
                </h2>
              </div>
              <p className="mt-1.5 max-w-2xl text-sm text-stone-600">
                Se recalcula con cada torneo que finaliza; sin jugar 4 meses,
                aparece como inactivo.
              </p>

              <div className="mt-3 border-2" style={CARD_BASE}>
                {eloTable.length === 0 ? (
                  <p className="p-8 text-center text-sm text-stone-500">
                    El club aún no tiene jugadores registrados.
                  </p>
                ) : (
                  <div
                    className="divide-y"
                    style={{ borderColor: "rgba(26,26,26,0.12)" }}
                  >
                    <div
                      className="flex items-center gap-2.5 px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5"
                      style={{
                        background: "var(--color-navy)",
                        color: "var(--color-cream)",
                      }}
                    >
                      <span className="w-6 text-center" style={HEADER_CELL}>
                        #
                      </span>
                      <span className="flex-1" style={HEADER_CELL}>
                        Jugador
                      </span>
                      <span className="w-14 text-right" style={HEADER_CELL}>
                        ELO
                      </span>
                      <span className="w-12 text-right" style={HEADER_CELL}>
                        ±
                      </span>
                    </div>
                    {eloTable.map((entry, index) => {
                      const inactive = isEntryInactive(entry);
                      return (
                        <div
                          className="flex items-center gap-2.5 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3"
                          key={entry.player.id}
                        >
                          <span
                            className="w-6 text-center font-semibold"
                            style={{ color: "var(--color-navy)" }}
                          >
                            {index + 1}
                          </span>
                          <ClubPlayerAvatarLink
                            name={entry.player.name}
                            photoUrl={playerPublicPhoto(entry.player.id)}
                            avatarId={
                              playerPublicAvatar(entry.player.id) ??
                              entry.player.avatarId ??
                              undefined
                            }
                            href={playerProfileLink(entry.player.id)}
                            size={30}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-2">
                              <span className="truncate font-semibold text-stone-900">
                                {entry.player.title
                                  ? `${entry.player.title} `
                                  : ""}
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
                            style={{
                              fontFamily: "ui-monospace, monospace",
                              color: "var(--color-navy)",
                            }}
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
                            {entry.eloDelta > 0
                              ? `+${entry.eloDelta}`
                              : entry.eloDelta || "–"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="reveal" data-reveal-delay="120">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                <div className="flex items-center gap-2.5">
                  <Flame
                    className="h-5 w-5"
                    style={{ color: "var(--color-stage)" }}
                    aria-hidden
                  />
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "24px",
                      lineHeight: 1,
                    }}
                  >
                    Circuito {selectedYear}
                  </h2>
                </div>
                {years.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {years.map((year) => (
                      <Link
                        key={year}
                        href={`/ajedrez/club?ano=${year}#ranking`}
                        className="rounded-sm border-2 px-3 py-1 text-xs font-semibold no-underline"
                        style={{
                          fontFamily: "var(--font-poster)",
                          letterSpacing: "0.1em",
                          borderColor: "var(--color-ink)",
                          background:
                            year === selectedYear
                              ? "var(--color-ink)"
                              : "var(--color-cream)",
                          color:
                            year === selectedYear
                              ? "var(--color-cream)"
                              : "var(--color-ink)",
                        }}
                      >
                        {year}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <p className="mt-1.5 max-w-2xl text-sm text-stone-600">
                Puntos por posición en cada torneo, como en el circuito de
                tenis.
              </p>

              <div className="mt-3 border-2" style={CARD_BASE}>
                {annualTable.length === 0 ? (
                  <p className="p-8 text-center text-sm text-stone-500">
                    Todavía no hay torneos del club finalizados en{" "}
                    {selectedYear}. El próximo lunes arranca el circuito.
                  </p>
                ) : (
                  <div
                    className="divide-y"
                    style={{ borderColor: "rgba(26,26,26,0.12)" }}
                  >
                    <div
                      className="flex items-center gap-2.5 px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5"
                      style={{
                        background: "var(--color-navy)",
                        color: "var(--color-cream)",
                      }}
                    >
                      <span className="w-6 text-center" style={HEADER_CELL}>
                        #
                      </span>
                      <span className="flex-1" style={HEADER_CELL}>
                        Jugador
                      </span>
                      <span className="w-10 text-center" style={HEADER_CELL}>
                        1.º
                      </span>
                      <span className="w-14 text-right" style={HEADER_CELL}>
                        Pts
                      </span>
                    </div>
                    {annualTable.map(({ entry, points, wins }, index) => (
                      <div
                        className="flex items-center gap-2.5 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3"
                        key={entry.player.id}
                      >
                        <span
                          className="w-6 text-center font-semibold"
                          style={{ color: "var(--color-navy)" }}
                        >
                          {index + 1}
                        </span>
                        <ClubPlayerAvatarLink
                          name={entry.player.name}
                          photoUrl={playerPublicPhoto(entry.player.id)}
                          avatarId={
                            playerPublicAvatar(entry.player.id) ??
                            entry.player.avatarId ??
                            undefined
                          }
                          href={playerProfileLink(entry.player.id)}
                          size={30}
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
                          style={{
                            fontFamily: "ui-monospace, monospace",
                            color: "var(--color-marquee)",
                          }}
                        >
                          {wins > 0 ? `×${wins}` : "–"}
                        </span>
                        <span
                          className="w-14 text-right text-base font-bold"
                          style={{
                            fontFamily: "ui-monospace, monospace",
                            color: "var(--color-navy)",
                          }}
                        >
                          {points}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Escala de puntos */}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                <Medal
                  className="h-3.5 w-3.5"
                  style={{ color: "var(--color-marquee)" }}
                  aria-hidden
                />
                <span className="font-semibold">Puntos por posición:</span>
                {POSITION_POINTS.map((points, index) => (
                  <span
                    key={index}
                    className="rounded-sm border px-1.5 py-0.5"
                    style={{
                      borderColor: "rgba(26,26,26,0.18)",
                      fontFamily: "ui-monospace, monospace",
                    }}
                  >
                    {index + 1}.º {points}
                  </span>
                ))}
                <span
                  className="rounded-sm border px-1.5 py-0.5"
                  style={{
                    borderColor: "rgba(26,26,26,0.18)",
                    fontFamily: "ui-monospace, monospace",
                  }}
                >
                  resto {PARTICIPATION_POINTS}
                </span>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Histórico de toda la vida ── */}
        <Section id="historia" className="pt-0 sm:pt-0">
          <div className="reveal flex items-center gap-2.5">
            <Trophy
              className="h-5 w-5"
              style={{ color: "var(--color-marquee)" }}
              aria-hidden
            />
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "24px",
                lineHeight: 1,
              }}
            >
              Tabla de toda la vida
            </h2>
          </div>
          <p className="mt-1.5 max-w-2xl text-sm text-stone-600">
            El acumulado histórico del club. Quien deja de llegar conserva su
            lugar; su historia no se borra.
          </p>

          <div className="mt-3 border-2" style={CARD_BASE}>
            {lifetimeTable.length === 0 ? (
              <p className="p-8 text-center text-sm text-stone-500">
                Aún no hay torneos del club finalizados. La historia empieza el
                próximo lunes.
              </p>
            ) : (
              <div
                className="divide-y"
                style={{ borderColor: "rgba(26,26,26,0.12)" }}
              >
                <div
                  className="flex items-center gap-2.5 px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5"
                  style={{
                    background: "var(--color-navy)",
                    color: "var(--color-cream)",
                  }}
                >
                  <span className="w-6 text-center" style={HEADER_CELL}>
                    #
                  </span>
                  <span className="flex-1" style={HEADER_CELL}>
                    Jugador
                  </span>
                  <span
                    className="hidden w-16 text-center sm:block"
                    style={HEADER_CELL}
                  >
                    Torneos
                  </span>
                  <span className="w-10 text-center" style={HEADER_CELL}>
                    1.º
                  </span>
                  <span className="w-14 text-right" style={HEADER_CELL}>
                    Pts
                  </span>
                </div>
                {lifetimeTable.map((entry, index) => (
                  <div
                    className="flex items-center gap-2.5 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3"
                    key={entry.player.id}
                  >
                    <span
                      className="w-6 text-center font-semibold"
                      style={{ color: "var(--color-navy)" }}
                    >
                      {index + 1}
                    </span>
                    <ClubPlayerAvatarLink
                      name={entry.player.name}
                      photoUrl={playerPublicPhoto(entry.player.id)}
                      avatarId={
                        playerPublicAvatar(entry.player.id) ??
                        entry.player.avatarId ??
                        undefined
                      }
                      href={playerProfileLink(entry.player.id)}
                      size={30}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate font-semibold text-stone-900">
                          {entry.player.name}
                        </span>
                        {!entry.player.isActive && <InactiveBadge />}
                      </span>
                      <span className="mt-0.5 block text-xs text-stone-500 sm:hidden">
                        {entry.tournamentsPlayed} torneo
                        {entry.tournamentsPlayed === 1 ? "" : "s"}
                      </span>
                    </span>
                    <span
                      className="hidden w-16 text-center text-sm sm:block"
                      style={{
                        fontFamily: "ui-monospace, monospace",
                        color: "#666",
                      }}
                    >
                      {entry.tournamentsPlayed}
                    </span>
                    <span
                      className="w-10 text-center text-sm font-semibold"
                      style={{
                        fontFamily: "ui-monospace, monospace",
                        color: "var(--color-marquee)",
                      }}
                    >
                      {entry.tournamentWins > 0
                        ? `×${entry.tournamentWins}`
                        : "–"}
                    </span>
                    <span
                      className="w-14 text-right text-base font-bold"
                      style={{
                        fontFamily: "ui-monospace, monospace",
                        color: "var(--color-navy)",
                      }}
                    >
                      {entry.lifetimePoints}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Section>

        {/* ── Miembros del club ── */}
        <Section id="miembros" className="pt-0 sm:pt-0">
          <div className="reveal flex items-start gap-2.5">
            <Users
              className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-navy)]"
              aria-hidden
            />
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "24px",
                  lineHeight: 1,
                }}
              >
                Miembros del club
              </h2>
              <p className="mt-1.5 max-w-2xl text-sm leading-5 text-stone-600 sm:leading-6">
                Conoce a quienes construyen la historia del club. Cada ficha
                respeta la información autorizada por el participante o su
                responsable.
              </p>
            </div>
          </div>

          {publicMembers.length > 0 && (
            <form
              method="get"
              action="/ajedrez/club#miembros"
              className="mt-3 grid gap-2 rounded-sm border border-stone-200 bg-white p-2 sm:grid-cols-[1fr_220px_auto] sm:gap-3 sm:p-3"
              role="search"
            >
              <label className="relative min-w-0">
                <span className="sr-only">Buscar miembro</span>
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
                  aria-hidden
                />
                <input
                  name="buscar"
                  defaultValue={search}
                  placeholder="Buscar miembro"
                  className="h-10 w-full rounded-md border border-stone-300 bg-white pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] sm:h-11"
                />
              </label>
              <label>
                <span className="sr-only">Filtrar por categoría</span>
                <select
                  name="categoria"
                  defaultValue={category}
                  className="h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] sm:h-11"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="btn btn-secondary min-h-10 sm:min-h-11"
                type="submit"
              >
                Aplicar
              </button>
            </form>
          )}

          <p className="mt-2 text-xs text-stone-500" aria-live="polite">
            {publicMembers.length > 0
              ? `${visibleMembers.length} de ${publicMembers.length} miembros visibles`
              : ""}
          </p>
          <ClubMemberDirectory members={visibleMembers} />
        </Section>
      </main>
    </PublicLayout>
  );
}
