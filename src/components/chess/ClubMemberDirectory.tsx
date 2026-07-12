import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

import type { PublicClubMember } from "@/lib/public-club-members";
import { ClubMemberAvatar } from "@/components/chess/ClubMemberAvatar";

export function ClubMemberDirectory({
  members,
}: {
  members: PublicClubMember[];
}) {
  if (members.length === 0) {
    return (
      <div className="mt-3 border-2 border-dashed border-stone-300 bg-white px-4 py-6 text-center sm:mt-6 sm:px-5 sm:py-10">
        <ShieldCheck
          className="mx-auto h-6 w-6 text-stone-400 sm:h-7 sm:w-7"
          aria-hidden
        />
        <h3 className="mt-2 font-semibold text-stone-900 sm:mt-3">
          Perfiles en preparación
        </h3>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-stone-500">
          Los miembros aparecerán aquí cuando su información pública y
          autorización estén configuradas.
        </p>
      </div>
    );
  }

  return (
    <ul className="mt-3 grid list-none gap-2 p-0 sm:mt-6 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
      {members.map((member) => (
        <li key={member.slug}>
          <Link
            href={`/ajedrez/club/jugadores/${member.slug}`}
            className="group flex h-full items-start gap-3 border-2 border-[var(--color-ink)] bg-[var(--color-cream)] p-3 no-underline transition motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-marquee)] sm:min-h-32 sm:gap-4 sm:p-4"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <ClubMemberAvatar
              name={member.displayName}
              photoUrl={member.photoUrl}
              avatarId={member.avatarId}
              size={56}
              className="h-11 w-11 sm:h-14 sm:w-14"
            />
            <span className="min-w-0 flex-1">
              <span className="flex items-start justify-between gap-2">
                <span className="truncate text-sm font-semibold text-stone-950 sm:text-base">
                  {member.title ? `${member.title} ` : ""}
                  {member.displayName}
                </span>
                <ArrowUpRight
                  className="mt-0.5 h-4 w-4 shrink-0 text-stone-400 transition group-hover:text-stone-900"
                  aria-hidden
                />
              </span>
              <span className="mt-0.5 block text-[11px] text-stone-500 sm:mt-1 sm:text-xs">
                {[
                  member.category,
                  member.memberSince
                    ? `Desde ${member.memberSince.slice(0, 4)}`
                    : null,
                ]
                  .filter(Boolean)
                  .join(" · ") || "Miembro Chessitos"}
              </span>
              {member.stats ? (
                <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-semibold text-[var(--color-navy)] sm:mt-3 sm:text-xs">
                  <span>ELO {member.stats.elo}</span>
                  <span>
                    {member.stats.tournamentsPlayed} torneo
                    {member.stats.tournamentsPlayed === 1 ? "" : "s"}
                  </span>
                </span>
              ) : (
                <span className="mt-2 block text-[11px] text-stone-400 sm:mt-3 sm:text-xs">
                  Ficha de comunidad
                </span>
              )}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
