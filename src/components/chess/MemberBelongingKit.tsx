import { Award, CreditCard, ShieldCheck, Stamp } from "lucide-react";

import { MemberProfileQrCard } from "@/components/chess/MemberProfileQrCard";
import type { PublicClubMember } from "@/lib/public-club-members";

function memberNumber(slug: string) {
  return `CH-${
    slug
      .replace(/[^a-z0-9]/gi, "")
      .slice(-6)
      .toUpperCase() || "000001"
  }`;
}

function certificateLabel(member: PublicClubMember) {
  if ((member.stats?.tournamentWins ?? 0) > 0) return "Reconocimiento de podio";
  if ((member.stats?.tournamentsPlayed ?? 0) >= 3)
    return "Constancia de participación";
  if (member.stats) return "Constancia de progreso";
  return "Miembro de comunidad";
}

export function MemberBelongingKit({ member }: { member: PublicClubMember }) {
  const profilePath = `/ajedrez/club/jugadores/${member.slug}`;
  const number = memberNumber(member.slug);
  const certificate = certificateLabel(member);

  return (
    <section
      className="mt-7 min-w-0 sm:mt-10"
      aria-labelledby="kit-miembro-heading"
    >
      <div className="flex items-start gap-2.5 sm:gap-3">
        <Award
          className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-marquee)] sm:h-6 sm:w-6"
          aria-hidden
        />
        <div>
          <p
            className="text-xs uppercase tracking-[0.16em] text-[var(--color-marquee)]"
            style={{ fontFamily: "var(--font-poster)" }}
          >
            Kit de pertenencia
          </p>
          <h2
            id="kit-miembro-heading"
            className="mt-1"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.55rem, 7vw, 30px)",
              lineHeight: 1,
            }}
          >
            Carné, sellos y constancia
          </h2>
          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-stone-600 sm:mt-2 sm:text-sm sm:leading-6">
            Piezas digitales para conservar la historia del club sin revelar
            datos privados. La información mostrada depende de la autorización
            activa del perfil.
          </p>
        </div>
      </div>

      <div className="mt-4 grid min-w-0 gap-3 sm:mt-6 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <article
          className="overflow-hidden border-2 border-[var(--color-ink)] bg-[var(--color-navy-deep)] text-[var(--color-cream)]"
          style={{ boxShadow: "var(--shadow-card)" }}
          aria-label="Carné digital Chessitos"
        >
          <div className="border-b border-white/15 px-3 py-3 sm:px-5 sm:py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p
                  className="text-xs uppercase tracking-[0.18em] text-[var(--color-marquee)]"
                  style={{ fontFamily: "var(--font-poster)" }}
                >
                  Chessitos Salcajá
                </p>
                <h3 className="mt-0.5 text-base font-semibold sm:mt-1 sm:text-lg">
                  Carné digital
                </h3>
              </div>
              <CreditCard
                className="h-6 w-6 text-white/70 sm:h-8 sm:w-8"
                aria-hidden
              />
            </div>
          </div>
          <div className="grid grid-cols-[auto_1fr] items-center gap-3 p-3 sm:gap-5 sm:p-5">
            <div className="flex h-16 w-16 items-center justify-center border-2 border-[var(--color-marquee)] bg-[var(--color-cream)] text-lg font-bold text-[var(--color-navy)] sm:h-24 sm:w-24 sm:text-2xl">
              {member.displayName
                .split(/\s+/)
                .slice(0, 2)
                .map((part) => part[0])
                .join("")}
            </div>
            <div className="min-w-0">
              <p className="break-words text-lg font-bold leading-tight sm:text-2xl">
                {member.displayName}
              </p>
              <dl className="mt-2 grid grid-cols-2 gap-2 text-[11px] sm:mt-4 sm:gap-3 sm:text-xs">
                <div>
                  <dt className="text-white/55">Número</dt>
                  <dd className="mt-0.5 font-mono text-xs sm:mt-1 sm:text-sm">
                    {number}
                  </dd>
                </div>
                <div>
                  <dt className="text-white/55">Categoría</dt>
                  <dd className="mt-0.5 sm:mt-1">
                    {member.category || "Club"}
                  </dd>
                </div>
                <div>
                  <dt className="text-white/55">Desde</dt>
                  <dd className="mt-0.5 sm:mt-1">
                    {member.memberSince?.slice(0, 4) || "Activo"}
                  </dd>
                </div>
                <div>
                  <dt className="text-white/55">Estado</dt>
                  <dd className="mt-0.5 sm:mt-1">Autorizado</dd>
                </div>
              </dl>
            </div>
          </div>
          <p className="border-t border-white/15 px-3 py-2 text-[11px] leading-4 text-white/65 sm:px-5 sm:py-3 sm:text-xs">
            Este carné no es identificación legal. Es una pieza de comunidad del
            club Chessitos.
          </p>
        </article>

        <div className="grid gap-3 sm:gap-4">
          <article className="border-2 border-[var(--color-ink)] bg-[var(--color-cream)] p-3 sm:p-5">
            <div className="flex items-center gap-2">
              <Stamp
                className="h-5 w-5 text-[var(--color-stage)]"
                aria-hidden
              />
              <h3 className="font-semibold text-stone-950">
                Pasaporte de progreso
              </h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
              <span className="rounded-sm border border-stone-300 bg-white px-2 py-1.5 text-[11px] font-semibold text-stone-700 sm:px-3 sm:py-2 sm:text-xs">
                {member.stats?.tournamentsPlayed ?? 0} torneo
                {(member.stats?.tournamentsPlayed ?? 0) === 1 ? "" : "s"}
              </span>
              <span className="rounded-sm border border-stone-300 bg-white px-2 py-1.5 text-[11px] font-semibold text-stone-700 sm:px-3 sm:py-2 sm:text-xs">
                {member.stats?.eloGames ?? 0} partida
                {(member.stats?.eloGames ?? 0) === 1 ? "" : "s"}
              </span>
              <span className="rounded-sm border border-stone-300 bg-white px-2 py-1.5 text-[11px] font-semibold text-stone-700 sm:px-3 sm:py-2 sm:text-xs">
                {member.stats?.lifetimePoints ?? 0} puntos
              </span>
            </div>
          </article>

          <article className="border-2 border-[var(--color-ink)] bg-white p-3 sm:p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck
                className="h-5 w-5 text-[var(--color-navy)]"
                aria-hidden
              />
              <h3 className="font-semibold text-stone-950">{certificate}</h3>
            </div>
            <p className="mt-2 text-xs leading-5 text-stone-600 sm:text-sm sm:leading-6">
              Vista digital basada en datos autorizados del club. La constancia
              formal puede emitirse desde administración cuando exista
              responsable y fecha de entrega.
            </p>
          </article>
        </div>

        <div className="lg:col-span-2">
          {member.allowSharing ? (
            <MemberProfileQrCard
              path={profilePath}
              fileName={`chessitos-${member.slug}-qr`}
            />
          ) : (
            <div className="border-2 border-dashed border-stone-300 bg-white p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-stone-500" aria-hidden />
                <h3 className="font-semibold text-stone-950">
                  QR pendiente de autorización
                </h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                El perfil puede verse desde el directorio, pero el QR
                descargable solo se activa cuando el administrador permite
                compartirlo.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
