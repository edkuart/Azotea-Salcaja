import Link from "next/link";
import { CalendarDays, Plus } from "lucide-react";

import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusPill } from "@/components/admin/StatusPill";
import {
  getActiveOfficialTournaments,
  getHistoricalOfficialTournaments,
  getTournamentSummary,
} from "@/modules/chess/public-data";

export default function AdminChessTournamentsPage() {
  const activeTournaments = getActiveOfficialTournaments();
  const historicalTournaments = getHistoricalOfficialTournaments();

  return (
    <AdminShell>
      <AdminPageHeader
        action={
          <>
            <Link
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
              href="/admin/ajedrez/torneos/nuevo?plantilla=lunes"
            >
              <CalendarDays className="h-4 w-4" aria-hidden />
              Preparar lunes
            </Link>
            <Link
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800"
              href="/admin/ajedrez/torneos/nuevo"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Nuevo torneo
            </Link>
          </>
        }
        description="Gestiona torneos oficiales del restaurante: configuracion, jugadores, rondas, partidas y resultados."
        eyebrow="Ajedrez"
        title="Torneos oficiales"
      />

      <div className="mt-8 grid gap-5">
        {activeTournaments.map((tournament) => {
          const summary = getTournamentSummary(tournament);

          return (
            <AdminCard key={tournament.id}>
              <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold text-stone-950">
                      {tournament.title}
                    </h2>
                    <StatusPill label={tournament.status} />
                    <StatusPill label={tournament.visibility} />
                  </div>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
                    {tournament.description}
                  </p>
                  <div className="mt-4 grid gap-3 text-sm text-stone-700 sm:grid-cols-4">
                    <span>{summary.players} jugadores</span>
                    <span>{tournament.roundsPlanned} rondas</span>
                    <span>
                      {tournament.system === "swiss" ? "Suizo" : "Round robin"}
                    </span>
                    <span>{summary.completedGames} partidas listas</span>
                  </div>
                </div>

                <Link
                  className="inline-flex h-10 items-center justify-center rounded-md border border-stone-300 px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                  href={`/admin/ajedrez/torneos/${tournament.id}`}
                >
                  Administrar
                </Link>
              </div>
            </AdminCard>
          );
        })}
      </div>

      {historicalTournaments.length > 0 && (
        <details className="mt-8">
          <summary className="cursor-pointer text-sm font-semibold uppercase tracking-[0.16em] text-stone-600">
            Historial ({historicalTournaments.length})
          </summary>
          <div className="mt-4 grid gap-4">
            {historicalTournaments.map((tournament) => {
              const summary = getTournamentSummary(tournament);

              return (
                <AdminCard key={tournament.id}>
                  <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-semibold text-stone-950">
                          {tournament.title}
                        </h2>
                        <StatusPill label={tournament.status} />
                        <StatusPill label={tournament.visibility} />
                      </div>
                      <div className="mt-4 grid gap-3 text-sm text-stone-700 sm:grid-cols-4">
                        <span>{summary.players} jugadores</span>
                        <span>{tournament.roundsPlanned} rondas</span>
                        <span>
                          {tournament.system === "swiss" ? "Suizo" : "Round robin"}
                        </span>
                        <span>{summary.completedGames} partidas listas</span>
                      </div>
                    </div>

                    <Link
                      className="inline-flex h-10 items-center justify-center rounded-md border border-stone-300 px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                      href={`/admin/ajedrez/torneos/${tournament.id}`}
                    >
                      Ver historial
                    </Link>
                  </div>
                </AdminCard>
              );
            })}
          </div>
        </details>
      )}
    </AdminShell>
  );
}
