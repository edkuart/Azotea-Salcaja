import {
  CalendarClock,
  Check,
  Clock,
  CreditCard,
  FileText,
  Medal,
  ScrollText,
  Ticket,
  Trophy,
} from "lucide-react";

import { AttachmentList } from "@/components/media/AttachmentList";
import { formatTieBreakLabel } from "@/modules/chess/tiebreaks";
import type { ChessTournament } from "@/modules/chess/types";

/**
 * Bloque "Bases del torneo" — fuente única usada por el detalle de torneo
 * y por el detalle de evento (antes estaba duplicado en ambas páginas).
 * Estilizado con el sistema de marca (crema/navy/dorado, bordes 2px).
 */

const CARD_BASE = {
  background: "var(--color-cream)",
  borderColor: "var(--color-ink)",
  boxShadow: "var(--shadow-card)",
} as const;

/** ¿El torneo tiene contenido de bases más allá de la ficha técnica? */
export function hasTournamentBases(t: ChessTournament): boolean {
  return Boolean(
    t.entryFee ||
      t.timeControl ||
      t.registrationDeadline ||
      (t.entryIncludes && t.entryIncludes.length > 0) ||
      (t.prizes && t.prizes.length > 0) ||
      (t.prizeCategories && t.prizeCategories.length > 0) ||
      t.paymentInstructions ||
      t.regulations ||
      (t.attachments && t.attachments.length > 0),
  );
}

function PanelHeader({
  Icon,
  children,
  variant = "neutral",
}: {
  Icon: typeof Trophy;
  children: React.ReactNode;
  variant?: "neutral" | "gold";
}) {
  const gold = variant === "gold";
  return (
    <div
      className="flex items-center gap-2 border-b-2 px-5 py-3"
      style={{
        borderColor: "var(--color-ink)",
        background: gold ? "var(--color-marquee)" : "var(--color-grain)",
      }}
    >
      <Icon className="h-4 w-4" style={{ color: gold ? "var(--color-ink)" : "var(--color-navy)" }} />
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.16em]"
        style={{ color: gold ? "var(--color-ink)" : "#5a5a5a" }}
      >
        {children}
      </p>
    </div>
  );
}

export function TournamentBases({
  tournament,
  showFicha = false,
}: {
  tournament: ChessTournament;
  showFicha?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <Trophy className="h-5 w-5" style={{ color: "var(--color-marquee)" }} />
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "30px", lineHeight: 1.02 }}>
          Bases del torneo
        </h2>
      </div>

      {/* Inscripción y tiempo */}
      {(tournament.entryFee || tournament.timeControl || tournament.registrationDeadline) && (
        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          {tournament.entryFee && (
            <div
              className="flex items-start gap-3 border-l-[3px] p-4"
              style={{ background: "var(--color-grain)", borderColor: "var(--color-navy)" }}
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

      {/* Ficha técnica (opcional) */}
      {showFicha && (
        <div className="mb-5 overflow-hidden border-2" style={CARD_BASE}>
          <PanelHeader Icon={ScrollText}>Ficha técnica</PanelHeader>
          <dl className="divide-y" style={{ borderColor: "rgba(26,26,26,0.12)" }}>
            {[
              { label: "Nombre", value: tournament.title },
              {
                label: "Sistema",
                value: tournament.system === "swiss" ? "Sistema suizo" : "Todos contra todos",
              },
              { label: "Rondas", value: String(tournament.roundsPlanned) },
              {
                label: "Desempates",
                value: tournament.tieBreakOrder.map(formatTieBreakLabel).join(" › "),
              },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-3 px-5 py-3.5">
                <dt className="text-sm text-stone-500">{label}</dt>
                <dd className="text-right text-sm font-medium text-stone-900">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Premios planos — solo si no hay premios por categoría (compatibilidad) */}
      {tournament.prizes &&
        tournament.prizes.length > 0 &&
        !(tournament.prizeCategories && tournament.prizeCategories.length > 0) && (
          <div className="mb-5 overflow-hidden border-2" style={CARD_BASE}>
            <PanelHeader Icon={Medal} variant="gold">
              Premios
            </PanelHeader>
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
              <PanelHeader Icon={Medal} variant="gold">
                {category.name || "Categoría"}
              </PanelHeader>
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
          si un jugador obtiene premio en una categoría superior, su premio de la categoría menor
          pasa al siguiente mejor clasificado.
        </p>
      )}

      {/* Instrucciones de pago */}
      {tournament.paymentInstructions && (
        <div className="mb-5 overflow-hidden border-2" style={CARD_BASE}>
          <PanelHeader Icon={CreditCard}>Instrucciones de pago</PanelHeader>
          <p className="whitespace-pre-line px-5 py-4 text-sm leading-7 text-stone-700">
            {tournament.paymentInstructions}
          </p>
        </div>
      )}

      {/* Reglamento */}
      {tournament.regulations && (
        <div className="mb-5 overflow-hidden border-2" style={CARD_BASE}>
          <PanelHeader Icon={ScrollText}>Reglamento</PanelHeader>
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
  );
}
