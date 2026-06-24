import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CalendarClock,
  Check,
  Clock,
  CreditCard,
  FileText,
  ListChecks,
  MapPin,
  Medal,
  ScrollText,
  Ticket,
  Trophy,
  Users,
} from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { listTournaments } from "@/lib/tournament-store";
import {
  formatGameResult,
  getEffectiveTournamentStatus,
  formatTournamentStatus,
  formatTournamentSystem,
  getPlayerName,
  getPublishedOfficialTournaments,
  getTournamentSummary,
  officialChessTournaments,
} from "@/modules/chess/public-data";
import type { ChessTournament } from "@/modules/chess/types";
import { generateNextRoundPreview } from "@/modules/chess/pairings";
import {
  getTournamentCoverImage,
  getTournamentPodium,
  getTournamentShareText,
} from "@/modules/chess/publication";
import { calculateStandings } from "@/modules/chess/standings";
import { formatTieBreakLabel } from "@/modules/chess/tiebreaks";
import { ImageGallery } from "@/components/media/ImageGallery";
import { AttachmentList } from "@/components/media/AttachmentList";

export function generateStaticParams() {
  return getPublishedOfficialTournaments().map((tournament) => ({
    slug: tournament.slug,
  }));
}

export const dynamic = "force-dynamic";

async function findTournamentBySlug(slug: string): Promise<ChessTournament | undefined> {
  const stored = await listTournaments();
  return (
    stored.find((item) => item.slug === slug) ??
    officialChessTournaments.find((item) => item.slug === slug)
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tournament = await findTournamentBySlug(slug);

  if (!tournament) {
    return {
      title: "Torneo de ajedrez",
    };
  }

  const image = getTournamentCoverImage(tournament);

  return {
    title: tournament.title,
    description: tournament.recap ?? tournament.description,
    openGraph: {
      title: getTournamentShareText(tournament),
      description: tournament.recap ?? tournament.description,
      images: [{ url: image }],
      type: "article",
    },
  };
}

/* ── Helpers de presentación (marca) ── */

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

function Heading({
  children,
  size = "30px",
}: {
  children: React.ReactNode;
  size?: string;
}) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-display)",
        fontSize: size,
        lineHeight: 1.02,
      }}
    >
      {children}
    </h2>
  );
}

const CARD_BASE = {
  background: "var(--color-cream)",
  borderColor: "var(--color-ink)",
  boxShadow: "var(--shadow-card)",
} as const;

function MetaItem({
  Icon,
  children,
}: {
  Icon: ComponentType<{ className?: string; style?: React.CSSProperties }>;
  children: React.ReactNode;
}) {
  return (
    <p className="flex items-center gap-2">
      <Icon className="h-4 w-4 shrink-0" style={{ color: "var(--color-marquee)" }} />
      {children}
    </p>
  );
}

export default async function ChessTournamentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tournament = await findTournamentBySlug(slug);

  if (!tournament) {
    notFound();
  }

  const summary = getTournamentSummary(tournament);
  const status = getEffectiveTournamentStatus(tournament);
  const standings = calculateStandings(tournament);
  const podium = getTournamentPodium(tournament);
  const nextRoundPreview = generateNextRoundPreview(tournament);
  const coverImage = getTournamentCoverImage(tournament);

  const tieBreaks = tournament.tieBreakOrder.slice(0, 5);

  return (
    <PublicLayout>
      <main>
        {/* ── HERO ── */}
        <section
          className="relative overflow-hidden border-b-[3px]"
          style={{
            color: "var(--color-cream)",
            borderColor: "var(--color-marquee)",
            backgroundImage: `linear-gradient(90deg, rgba(11,42,74,0.94), rgba(26,26,26,0.6)), url(${coverImage})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <Link
              className="inline-flex items-center gap-2 text-sm font-semibold no-underline"
              href="/ajedrez/torneos"
              style={{ color: "var(--color-marquee)" }}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Volver a torneos
            </Link>

            <div className="mt-7">
              <Eyebrow>Torneo oficial</Eyebrow>
            </div>
            <h1
              className="mt-3 max-w-4xl"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-5xl)",
                lineHeight: 0.95,
              }}
            >
              {tournament.title}
            </h1>
            <p
              className="mt-5 max-w-2xl text-base leading-7"
              style={{ fontFamily: "var(--font-body)", opacity: 0.9 }}
            >
              {tournament.recap ?? tournament.description}
            </p>

            <div className="mt-8 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <MetaItem Icon={Trophy}>{formatTournamentStatus(status)}</MetaItem>
              <MetaItem Icon={ListChecks}>
                {formatTournamentSystem(tournament.system)}
              </MetaItem>
              <MetaItem Icon={CalendarDays}>{tournament.startsAt}</MetaItem>
              <MetaItem Icon={MapPin}>{tournament.locationLabel}</MetaItem>
            </div>
          </div>
        </section>

        {/* ── Resumen ── */}
        <Section>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {(
              [
                ["Jugadores", `${summary.players}`, Users],
                ["Rondas", `${tournament.roundsPlanned}`, ListChecks],
                ["Partidas", `${summary.completedGames}/${summary.games}`, Trophy],
                ["Actual", `${tournament.currentRoundNumber}`, CalendarDays],
              ] as const
            ).map(([label, value, Icon]) => (
              <article className="border-2 p-4" key={label} style={CARD_BASE}>
                <Icon className="h-5 w-5" style={{ color: "var(--color-navy)" }} aria-hidden />
                <p
                  className="mt-3 text-[11px] uppercase"
                  style={{
                    fontFamily: "var(--font-poster)",
                    letterSpacing: "0.14em",
                    color: "#5a5a5a",
                  }}
                >
                  {label}
                </p>
                <p
                  className="mt-1"
                  style={{ fontFamily: "var(--font-display)", fontSize: "26px", lineHeight: 1 }}
                >
                  {value}
                </p>
              </article>
            ))}
          </div>
        </Section>

        {/* ── Bases del torneo ── */}
        {(tournament.entryFee ||
          tournament.timeControl ||
          tournament.registrationDeadline ||
          (tournament.entryIncludes && tournament.entryIncludes.length > 0) ||
          (tournament.prizes && tournament.prizes.length > 0) ||
          (tournament.prizeCategories && tournament.prizeCategories.length > 0) ||
          tournament.paymentInstructions ||
          tournament.regulations ||
          (tournament.attachments && tournament.attachments.length > 0)) && (
          <Section>
            <div className="mb-6 flex items-center gap-3">
              <Trophy className="h-5 w-5" style={{ color: "var(--color-marquee)" }} />
              <Heading>Bases del torneo</Heading>
            </div>

            <div className="max-w-3xl">
              {/* Inscripción y tiempo */}
              {(tournament.entryFee ||
                tournament.timeControl ||
                tournament.registrationDeadline) && (
                <div className="mb-5 grid gap-3 sm:grid-cols-2">
                  {tournament.entryFee && (
                    <div
                      className="flex items-start gap-3 border-l-[3px] p-4"
                      style={{
                        background: "var(--color-grain)",
                        borderColor: "var(--color-navy)",
                      }}
                    >
                      <Ticket className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--color-navy)" }} />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--color-navy)" }}>
                          Inscripción
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-stone-900">{tournament.entryFee}</p>
                      </div>
                    </div>
                  )}
                  {tournament.timeControl && (
                    <div
                      className="flex items-start gap-3 border-l-[3px] p-4"
                      style={{ background: "var(--color-grain)", borderColor: "rgba(26,26,26,0.25)" }}
                    >
                      <Clock className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "#5a5a5a" }} />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#5a5a5a" }}>
                          Tiempo de juego
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-stone-900">{tournament.timeControl}</p>
                      </div>
                    </div>
                  )}
                  {tournament.registrationDeadline && (
                    <div
                      className="flex items-start gap-3 border-l-[3px] p-4"
                      style={{ background: "var(--color-grain)", borderColor: "rgba(26,26,26,0.25)" }}
                    >
                      <CalendarClock className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "#5a5a5a" }} />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#5a5a5a" }}>
                          Inscripciones hasta
                        </p>
                        <p className="mt-0.5 text-sm font-medium capitalize text-stone-900">
                          {new Date(`${tournament.registrationDeadline}T12:00:00`).toLocaleDateString("es", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Qué incluye */}
              {tournament.entryIncludes && tournament.entryIncludes.length > 0 && (
                <div className="mb-5 border-2 px-5 py-4" style={CARD_BASE}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "#5a5a5a" }}>
                    La inscripción incluye
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {tournament.entryIncludes.map((item, i) => (
                      <li
                        key={i}
                        className="inline-flex items-center gap-1.5 rounded-sm border px-3 py-1 text-sm"
                        style={{ borderColor: "var(--color-navy)", color: "var(--color-navy)" }}
                      >
                        <Check className="h-3.5 w-3.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Premios planos — solo si no hay premios por categoría (compatibilidad) */}
              {tournament.prizes &&
                tournament.prizes.length > 0 &&
                !(tournament.prizeCategories && tournament.prizeCategories.length > 0) && (
                  <div className="mb-5 overflow-hidden border-2" style={CARD_BASE}>
                    <div
                      className="flex items-center gap-2 border-b-2 px-5 py-3"
                      style={{ borderColor: "var(--color-ink)", background: "var(--color-marquee)" }}
                    >
                      <Medal className="h-4 w-4" style={{ color: "var(--color-ink)" }} />
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--color-ink)" }}>
                        Premios
                      </p>
                    </div>
                    <div className="divide-y" style={{ borderColor: "rgba(26,26,26,0.12)" }}>
                      {tournament.prizes.map((prize, i) => (
                        <div key={i} className="flex items-center justify-between gap-3 px-5 py-3">
                          <span className="text-sm font-semibold text-stone-900">{prize.place}</span>
                          <span className="text-right text-sm text-stone-700">{prize.award}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Premios por categoría */}
              {tournament.prizeCategories && tournament.prizeCategories.length > 0 && (
                <div className="mb-5 grid gap-4 sm:grid-cols-2">
                  {tournament.prizeCategories.map((category, ci) => (
                    <div key={ci} className="overflow-hidden border-2" style={CARD_BASE}>
                      <div
                        className="flex items-center gap-2 border-b-2 px-5 py-3"
                        style={{ borderColor: "var(--color-ink)", background: "var(--color-marquee)" }}
                      >
                        <Medal className="h-4 w-4" style={{ color: "var(--color-ink)" }} />
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--color-ink)" }}>
                          {category.name || "Categoría"}
                        </p>
                      </div>
                      <div className="divide-y" style={{ borderColor: "rgba(26,26,26,0.12)" }}>
                        {category.places.map((prize, pi) => (
                          <div key={pi} className="flex items-center justify-between gap-3 px-5 py-3">
                            <span className="text-sm font-semibold text-stone-900">
                              {prize.place || `${pi + 1}.º lugar`}
                            </span>
                            <span className="text-right text-sm text-stone-700">{prize.award}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Política de premios no acumulables */}
              {tournament.prizesNonCumulative && (
                <p
                  className="mb-5 border-l-[3px] px-4 py-3 text-sm leading-6"
                  style={{ background: "var(--color-grain)", borderColor: "var(--color-marquee)", color: "#3a3a3a" }}
                >
                  <span className="font-semibold text-stone-900">Premios no acumulables:</span>{" "}
                  si un jugador obtiene premio en una categoría superior, su premio de la
                  categoría menor pasa al siguiente mejor clasificado.
                </p>
              )}

              {/* Instrucciones de pago */}
              {tournament.paymentInstructions && (
                <div className="mb-5 overflow-hidden border-2" style={CARD_BASE}>
                  <div
                    className="flex items-center gap-2 border-b-2 px-5 py-3"
                    style={{ borderColor: "var(--color-ink)", background: "var(--color-grain)" }}
                  >
                    <CreditCard className="h-4 w-4" style={{ color: "var(--color-navy)" }} />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "#5a5a5a" }}>
                      Instrucciones de pago
                    </p>
                  </div>
                  <p className="whitespace-pre-line px-5 py-4 text-sm leading-7 text-stone-700">
                    {tournament.paymentInstructions}
                  </p>
                </div>
              )}

              {/* Reglamento */}
              {tournament.regulations && (
                <div className="overflow-hidden border-2" style={CARD_BASE}>
                  <div
                    className="flex items-center gap-2 border-b-2 px-5 py-3"
                    style={{ borderColor: "var(--color-ink)", background: "var(--color-grain)" }}
                  >
                    <ScrollText className="h-4 w-4" style={{ color: "var(--color-navy)" }} />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "#5a5a5a" }}>
                      Reglamento
                    </p>
                  </div>
                  <p className="whitespace-pre-line px-5 py-4 text-sm leading-7 text-stone-700">
                    {tournament.regulations}
                  </p>
                </div>
              )}

              {/* Documentos descargables */}
              {tournament.attachments && tournament.attachments.length > 0 && (
                <div className="mt-5">
                  <div className="mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" style={{ color: "var(--color-navy)" }} />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "#5a5a5a" }}>
                      Documentos
                    </p>
                  </div>
                  <AttachmentList items={tournament.attachments} />
                </div>
              )}
            </div>
          </Section>
        )}

        {/* ── Podio ── */}
        <div style={{ background: "var(--color-grain)" }}>
          <Section>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Eyebrow>Podio</Eyebrow>
                <div className="mt-3">
                  <Heading>Posiciones destacadas</Heading>
                </div>
              </div>
              <span
                className="self-start rounded-sm px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]"
                style={{
                  fontFamily: "var(--font-poster)",
                  background: status === "closed" ? "var(--color-navy)" : "var(--color-marquee)",
                  color: status === "closed" ? "var(--color-cream)" : "var(--color-ink)",
                }}
              >
                {status === "closed" ? "Final" : "Provisional"}
              </span>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {podium.map((standing, index) => (
                <article
                  className="border-2 p-5"
                  key={standing.playerId}
                  style={{
                    ...CARD_BASE,
                    borderColor: index === 0 ? "var(--color-marquee)" : "var(--color-ink)",
                  }}
                >
                  <Medal
                    className="h-6 w-6"
                    style={{ color: index === 0 ? "var(--color-marquee)" : "var(--color-navy)" }}
                    aria-hidden
                  />
                  <p
                    className="mt-4 text-[11px] uppercase"
                    style={{ fontFamily: "var(--font-poster)", letterSpacing: "0.14em", color: "#5a5a5a" }}
                  >
                    Lugar {index + 1}
                  </p>
                  <h3 className="mt-1" style={{ fontFamily: "var(--font-display)", fontSize: "22px", lineHeight: 1.05 }}>
                    {standing.name}
                  </h3>
                  <p className="mt-2 text-sm text-stone-600">
                    {standing.points} puntos · {standing.wins} victorias
                  </p>
                </article>
              ))}
            </div>
          </Section>
        </div>

        {/* ── Tabla de posiciones + Historial ── */}
        <Section>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <section>
              <Heading size="26px">Tabla de posiciones</Heading>
              <div className="mt-4 overflow-x-auto border-2" style={CARD_BASE}>
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead
                    className="text-xs uppercase tracking-[0.12em]"
                    style={{
                      fontFamily: "var(--font-poster)",
                      background: "var(--color-navy)",
                      color: "var(--color-cream)",
                    }}
                  >
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Jugador</th>
                      {tieBreaks.map((code) => (
                        <th className="px-4 py-3" key={code}>
                          {formatTieBreakLabel(code)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: "rgba(26,26,26,0.12)" }}>
                    {standings.map((standing, index) => (
                      <tr key={standing.playerId}>
                        <td className="px-4 py-3 font-semibold" style={{ color: "var(--color-navy)" }}>
                          {index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-stone-900">{standing.name}</p>
                          <p className="mt-1 text-xs text-stone-500">
                            {standing.wins}G {standing.draws}T {standing.losses}P
                          </p>
                        </td>
                        {tieBreaks.map((code) => (
                          <td className="px-4 py-3 font-semibold" style={{ color: "var(--color-navy)" }} key={code}>
                            {standing.tieBreaks[code] ?? 0}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <Heading size="26px">Historial de rondas</Heading>
              <div className="mt-4 grid gap-4">
                {tournament.rounds.length > 0 ? (
                  tournament.rounds.map((round) => (
                    <article className="border-2 p-4" key={round.id} style={CARD_BASE}>
                      <div className="flex items-center justify-between gap-4">
                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px" }}>
                          Ronda {round.roundNumber}
                        </h3>
                        <span
                          className="rounded-sm px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
                          style={{
                            fontFamily: "var(--font-poster)",
                            background: "var(--color-grain)",
                            color: "#5a5a5a",
                            border: "1px solid rgba(26,26,26,0.18)",
                          }}
                        >
                          {round.status}
                        </span>
                      </div>
                      <div className="mt-4 divide-y" style={{ borderColor: "rgba(26,26,26,0.12)" }}>
                        {round.games.map((game) => (
                          <div
                            className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-3 text-sm"
                            key={game.id}
                          >
                            <span
                              className="text-[11px] font-semibold uppercase tracking-[0.1em]"
                              style={{ fontFamily: "var(--font-poster)", color: "#7a7a7a" }}
                            >
                              M{game.boardNumber}
                            </span>
                            <span className="min-w-0 text-stone-800">
                              {getPlayerName(tournament, game.whitePlayerId)} vs{" "}
                              {getPlayerName(tournament, game.blackPlayerId)}
                            </span>
                            <span className="font-semibold" style={{ color: "var(--color-navy)" }}>
                              {formatGameResult(game.result)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="border-2 p-4 text-sm text-stone-600" style={CARD_BASE}>
                    Este torneo aun no tiene rondas generadas.
                  </p>
                )}
              </div>
            </section>
          </div>
        </Section>

        {/* ── Siguiente ronda ── */}
        <div style={{ background: "var(--color-grain)" }}>
          <Section>
            <Heading size="26px">Siguiente ronda</Heading>
            <div className="mt-4 border-2 p-4" style={CARD_BASE}>
              {nextRoundPreview.warnings.length > 0 ? (
                <div className="mb-4 grid gap-2">
                  {nextRoundPreview.warnings.map((warning) => (
                    <p
                      className="border-l-[3px] p-3 text-sm"
                      key={warning.code}
                      style={{ background: "rgba(212,160,23,0.12)", borderColor: "var(--color-marquee)", color: "#6b5310" }}
                    >
                      {warning.message}
                    </p>
                  ))}
                </div>
              ) : null}

              {nextRoundPreview.round.games.length > 0 ? (
                <div className="divide-y" style={{ borderColor: "rgba(26,26,26,0.12)" }}>
                  {nextRoundPreview.round.games.map((game) => (
                    <div
                      className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-3 text-sm"
                      key={game.id}
                    >
                      <span
                        className="text-[11px] font-semibold uppercase tracking-[0.1em]"
                        style={{ fontFamily: "var(--font-poster)", color: "#7a7a7a" }}
                      >
                        M{game.boardNumber}
                      </span>
                      <span className="min-w-0">
                        {getPlayerName(tournament, game.whitePlayerId)} vs{" "}
                        {getPlayerName(tournament, game.blackPlayerId)}
                      </span>
                      <span className="font-semibold" style={{ color: "var(--color-navy)" }}>
                        {game.isBye ? "BYE" : "Preview"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-600">No hay pareo disponible por ahora.</p>
              )}
            </div>
          </Section>
        </div>

        {/* ── Galería ── */}
        {tournament.gallery && tournament.gallery.length > 0 ? (
          <Section>
            <Eyebrow>Galería</Eyebrow>
            <div className="mt-3">
              <Heading>Fotos del evento</Heading>
            </div>
            <div className="mt-8">
              <ImageGallery
                images={tournament.gallery}
                columns="grid-cols-2 sm:grid-cols-2 lg:grid-cols-3"
              />
            </div>
          </Section>
        ) : null}
      </main>
    </PublicLayout>
  );
}
