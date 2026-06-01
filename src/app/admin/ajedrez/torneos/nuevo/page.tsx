import Link from "next/link";

import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { NewTournamentForm } from "@/components/admin/chess/NewTournamentForm";

export default async function NewChessTournamentPage({
  searchParams,
}: {
  searchParams?: Promise<{ plantilla?: string | string[] }>;
}) {
  const params = await searchParams;
  const template = params?.plantilla === "lunes" ? "lunes" : undefined;

  return (
    <AdminShell>
      <AdminPageHeader
        action={
          <Link
            className="inline-flex h-11 items-center justify-center rounded-md border border-stone-300 px-4 text-sm font-semibold text-stone-700 transition hover:bg-white"
            href="/admin/ajedrez/torneos"
          >
            Volver
          </Link>
        }
        description="Crea la configuración base: sistema, rondas, fecha, ubicación y desempates."
        eyebrow="Ajedrez"
        title="Nuevo torneo oficial"
      />

      <div className="mt-8">
        <AdminCard>
          <NewTournamentForm template={template} />
        </AdminCard>
      </div>
    </AdminShell>
  );
}
