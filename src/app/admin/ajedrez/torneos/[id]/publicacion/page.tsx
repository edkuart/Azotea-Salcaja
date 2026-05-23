import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";

import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusPill } from "@/components/admin/StatusPill";
import { TextAreaField } from "@/components/admin/TextAreaField";
import { TextField } from "@/components/admin/TextField";
import {
  formatTournamentStatus,
  officialChessTournaments,
} from "@/modules/chess/public-data";
import {
  getTournamentCoverImage,
  getTournamentPodium,
} from "@/modules/chess/publication";

export function generateStaticParams() {
  return officialChessTournaments.map((tournament) => ({ id: tournament.id }));
}

export default async function AdminTournamentPublicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tournament = officialChessTournaments.find((item) => item.id === id);

  if (!tournament) {
    notFound();
  }

  const podium = getTournamentPodium(tournament);

  return (
    <AdminShell>
      <AdminPageHeader
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              className="inline-flex h-11 items-center justify-center rounded-md border border-stone-300 px-4 text-sm font-semibold text-stone-700 transition hover:bg-white"
              href={`/admin/ajedrez/torneos/${tournament.id}`}
            >
              Volver
            </Link>
            <Link
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800"
              href={`/ajedrez/torneos/${tournament.slug}`}
            >
              Ver publico
              <ExternalLink className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        }
        description="Controla como se muestra el torneo oficial en la web publica."
        eyebrow="Publicacion"
        title={tournament.title}
      />

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_380px]">
        <AdminCard>
          <h2 className="text-lg font-semibold">Contenido publico</h2>
          <form className="mt-5 grid gap-4">
            <TextField defaultValue={tournament.title} label="Titulo publico" />
            <TextAreaField
              defaultValue={tournament.recap ?? tournament.description}
              label="Resumen para compartir"
            />
            <TextField
              defaultValue={getTournamentCoverImage(tournament)}
              label="Imagen principal"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-2 rounded-md border border-stone-200 bg-white p-3 text-sm font-medium text-stone-700">
                <input
                  className="h-4 w-4 accent-emerald-700"
                  defaultChecked={tournament.visibility === "published"}
                  type="checkbox"
                />
                Publicado en web
              </label>
              <label className="flex items-center gap-2 rounded-md border border-stone-200 bg-white p-3 text-sm font-medium text-stone-700">
                <input
                  className="h-4 w-4 accent-emerald-700"
                  defaultChecked
                  type="checkbox"
                />
                Mostrar galeria
              </label>
            </div>
            <button className="h-11 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800 sm:w-fit">
              Guardar publicacion
            </button>
          </form>
        </AdminCard>

        <div className="grid gap-5">
          <AdminCard>
            <h2 className="text-lg font-semibold">Estado publico</h2>
            <div className="mt-4 grid gap-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-stone-600">Torneo</span>
                <StatusPill label={formatTournamentStatus(tournament.status)} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-stone-600">Visibilidad</span>
                <StatusPill label={tournament.visibility} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-stone-600">Fotos</span>
                <span className="text-sm font-semibold text-stone-950">
                  {tournament.gallery?.length ?? 0}
                </span>
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <h2 className="text-lg font-semibold">Podio visible</h2>
            <div className="mt-4 grid gap-3">
              {podium.map((standing, index) => (
                <div
                  className="rounded-md bg-stone-50 p-3 text-sm"
                  key={standing.playerId}
                >
                  <p className="font-semibold text-stone-950">
                    {index + 1}. {standing.name}
                  </p>
                  <p className="mt-1 text-stone-600">
                    {standing.points} puntos · {standing.wins} victorias
                  </p>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      </div>
    </AdminShell>
  );
}
