import Link from "next/link";
import { CalendarDays, Plus, Trash2 } from "lucide-react";

import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusPill } from "@/components/admin/StatusPill";
import {
  getActiveOfficialTournaments,
  getHistoricalOfficialTournaments,
  getTournamentSummary,
} from "@/modules/chess/public-data";
import { listTournaments } from "@/lib/tournament-store";
import { deleteTournamentAction } from "@/app/actions/tournaments";

export const dynamic = "force-dynamic";

export default async function AdminChessTournamentsPage() {
  const activeTournaments = getActiveOfficialTournaments();
  const historicalTournaments = getHistoricalOfficialTournaments();
  const storedTournaments = await listTournaments();

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

      {/* ── Torneos guardados (API / Supabase) ── */}
      {storedTournaments.length > 0 && (
        <div className="mt-8 grid gap-5">
          {storedTournaments.map((tournament) => {
            const summary = getTournamentSummary(tournament);
            const deleteWithId = deleteTournamentAction.bind(null, tournament.id);

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
                    {tournament.description && (
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
                        {tournament.description}
                      </p>
                    )}
                    <div className="mt-4 grid gap-3 text-sm text-stone-700 sm:grid-cols-4">
                      <span>{summary.players} jugadores</span>
                      <span>{tournament.roundsPlanned} rondas</span>
                      <span>
                        {tournament.system === "swiss" ? "Suizo" : "Round robin"}
                      </span>
                      <span>{summary.completedGames} partidas listas</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      className="inline-flex h-10 items-center justify-center rounded-md border border-stone-300 px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                      href={`/admin/ajedrez/torneos/${tournament.id}`}
                    >
                      Administrar
                    </Link>
                    <form action={deleteWithId}>
                      <button
                        type="submit"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-red-200 text-red-500 transition hover:bg-red-50 hover:border-red-300"
                        title="Eliminar torneo"
                        onClick={(e) => {
                          if (!confirm(`¿Eliminar "${tournament.title}"? Esta acción no se puede deshacer.`)) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </form>
                  </div>
                </div>
              </AdminCard>
            );
          })}
        </div>
      )}

      {/* ── Torneos estáticos oficiales ── */}
      {activeTournaments.length > 0 && (
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
      )}

      {storedTournaments.length === 0 && activeTournaments.length === 0 && (
        <div className="mt-12 rounded-lg border-2 border-dashed border-stone-200 p-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-400">
            Sin torneos
          </p>
          <p className="mt-2 text-sm text-stone-500">
            Crea un nuevo torneo para comenzar.
          </p>
        </div>
      )}

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
