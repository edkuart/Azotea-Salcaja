import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalendarDays, MapPin, Trophy, ScrollText, Medal, Clock, Ticket, CalendarClock, CreditCard, Check } from "lucide-react";

import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { db } from "@/lib/db";
import { getTournament } from "@/lib/tournament-store";
import { formatTieBreakLabel } from "@/modules/chess/tiebreaks";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await db().event.findUnique({ where: { slug } });
  if (!event) return {};
  return {
    title: event.title,
    description: event.description ?? undefined,
  };
}

const TYPE_LABEL: Record<string, string> = {
  restaurant: "Restaurante",
  chess: "Ajedrez",
  community: "Comunidad",
};

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const event = await db().event.findUnique({ where: { slug } });
  if (!event || event.status !== "published") notFound();

  const tournament = event.linkedTournamentId
    ? await getTournament(event.linkedTournamentId)
    : null;

  const dateStr = event.startsAt.toLocaleDateString("es", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = event.startsAt.toLocaleTimeString("es", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endsStr = event.endsAt
    ? event.endsAt.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <PublicLayout>
      <main>
        {/* Hero */}
        {event.coverImageUrl && (
          <div
            className="h-72 w-full bg-stone-200 md:h-96"
            style={{
              backgroundImage: `url(${event.coverImageUrl})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
        )}

        <Section>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">
            {TYPE_LABEL[event.type] ?? event.type}
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-stone-950">
            {event.title}
          </h1>

          <div className="mt-5 flex flex-wrap gap-5 text-sm text-stone-600">
            <p className="flex items-center gap-2 capitalize">
              <CalendarDays className="h-4 w-4 text-emerald-700 shrink-0" />
              {dateStr} · {timeStr}
              {endsStr && ` — ${endsStr}`}
            </p>
            {event.locationLabel && (
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-700 shrink-0" />
                {event.locationLabel}
              </p>
            )}
          </div>

          {event.description && (
            <p className="mt-6 max-w-2xl text-base leading-7 text-stone-700">
              {event.description}
            </p>
          )}
        </Section>

        {/* Bases del torneo */}
        {tournament && (
          <Section className="pt-0">
            <div className="max-w-2xl">
              <div className="mb-6 flex items-center gap-3">
                <Trophy className="h-5 w-5 text-amber-600" />
                <h2 className="text-2xl font-semibold text-stone-950">
                  Bases del torneo
                </h2>
              </div>

              {/* Inscripción y tiempo — destacados */}
              {(tournament.entryFee || tournament.timeControl || tournament.registrationDeadline) && (
                <div className="mb-5 grid gap-3 sm:grid-cols-2">
                  {tournament.entryFee && (
                    <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                      <Ticket className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Inscripción</p>
                        <p className="mt-0.5 text-sm font-medium text-stone-900">{tournament.entryFee}</p>
                      </div>
                    </div>
                  )}
                  {tournament.timeControl && (
                    <div className="flex items-start gap-3 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3">
                      <Clock className="mt-0.5 h-5 w-5 shrink-0 text-stone-500" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Tiempo de juego</p>
                        <p className="mt-0.5 text-sm font-medium text-stone-900">{tournament.timeControl}</p>
                      </div>
                    </div>
                  )}
                  {tournament.registrationDeadline && (
                    <div className="flex items-start gap-3 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3">
                      <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-stone-500" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Inscripciones hasta</p>
                        <p className="mt-0.5 text-sm font-medium text-stone-900 capitalize">
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

              {/* Qué incluye la inscripción */}
              {tournament.entryIncludes && tournament.entryIncludes.length > 0 && (
                <div className="mb-5 rounded-lg border border-stone-200 bg-white px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                    La inscripción incluye
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {tournament.entryIncludes.map((item, i) => (
                      <li
                        key={i}
                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm text-emerald-800"
                      >
                        <Check className="h-3.5 w-3.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ficha técnica */}
              <div className="rounded-lg border border-stone-200 bg-white overflow-hidden">
                <div className="border-b border-stone-100 bg-stone-50 px-5 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                    Ficha técnica
                  </p>
                </div>
                <dl className="divide-y divide-stone-100">
                  {[
                    { label: "Nombre", value: tournament.title },
                    { label: "Sistema", value: tournament.system === "swiss" ? "Sistema suizo" : "Todos contra todos" },
                    { label: "Rondas", value: String(tournament.roundsPlanned) },
                    { label: "Desempates", value: tournament.tieBreakOrder.map(formatTieBreakLabel).join(" › ") },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between gap-3 px-5 py-3.5">
                      <dt className="text-sm text-stone-500">{label}</dt>
                      <dd className="text-right text-sm font-medium text-stone-950">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Premios planos — solo para torneos sin premios por categoría (compatibilidad) */}
              {tournament.prizes &&
                tournament.prizes.length > 0 &&
                !(tournament.prizeCategories && tournament.prizeCategories.length > 0) && (
                <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 overflow-hidden">
                  <div className="border-b border-amber-100 px-5 py-3 flex items-center gap-2">
                    <Medal className="h-4 w-4 text-amber-600" />
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
                      Premios
                    </p>
                  </div>
                  <div className="divide-y divide-amber-100">
                    {tournament.prizes.map((prize, i) => (
                      <div key={i} className="flex items-center justify-between px-5 py-3.5 gap-3">
                        <span className="text-sm font-semibold text-stone-800">
                          {prize.place}
                        </span>
                        <span className="text-sm text-stone-700">{prize.award}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Premios por categoría */}
              {tournament.prizeCategories && tournament.prizeCategories.length > 0 && (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {tournament.prizeCategories.map((category, ci) => (
                    <div key={ci} className="rounded-lg border border-amber-200 bg-amber-50 overflow-hidden">
                      <div className="border-b border-amber-100 px-5 py-3 flex items-center gap-2">
                        <Medal className="h-4 w-4 text-amber-600" />
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
                          {category.name || "Categoría"}
                        </p>
                      </div>
                      <div className="divide-y divide-amber-100">
                        {category.places.map((prize, pi) => (
                          <div key={pi} className="flex items-center justify-between px-5 py-3 gap-3">
                            <span className="text-sm font-semibold text-stone-800">{prize.place || `${pi + 1}.º lugar`}</span>
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
                <p className="mt-3 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-6 text-stone-600">
                  <span className="font-semibold text-stone-800">Premios no acumulables:</span>{" "}
                  si un jugador obtiene premio en una categoría superior, su premio de la categoría menor pasa al siguiente mejor clasificado.
                </p>
              )}

              {/* Instrucciones de pago */}
              {tournament.paymentInstructions && (
                <div className="mt-5 rounded-lg border border-stone-200 bg-white overflow-hidden">
                  <div className="border-b border-stone-100 bg-stone-50 px-5 py-3 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-stone-500" />
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                      Instrucciones de pago
                    </p>
                  </div>
                  <div className="px-5 py-4">
                    <p className="whitespace-pre-line text-sm leading-7 text-stone-700">
                      {tournament.paymentInstructions}
                    </p>
                  </div>
                </div>
              )}

              {/* Reglamento */}
              {tournament.regulations && (
                <div className="mt-5 rounded-lg border border-stone-200 bg-white overflow-hidden">
                  <div className="border-b border-stone-100 bg-stone-50 px-5 py-3 flex items-center gap-2">
                    <ScrollText className="h-4 w-4 text-stone-500" />
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                      Reglamento
                    </p>
                  </div>
                  <div className="px-5 py-4">
                    <p className="whitespace-pre-line text-sm leading-7 text-stone-700">
                      {tournament.regulations}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Galería */}
            {tournament.gallery && tournament.gallery.length > 0 && (
              <div className="mt-8 max-w-3xl">
                <h3 className="mb-4 text-lg font-semibold text-stone-950">Galería</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {tournament.gallery.map((img, i) => (
                    <div key={i} className="overflow-hidden rounded-lg border border-stone-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.src}
                        alt={img.alt || "Galería del torneo"}
                        className="h-40 w-full object-cover"
                      />
                      {img.alt && (
                        <p className="px-3 py-2 text-xs text-stone-500">{img.alt}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Section>
        )}
      </main>
    </PublicLayout>
  );
}
