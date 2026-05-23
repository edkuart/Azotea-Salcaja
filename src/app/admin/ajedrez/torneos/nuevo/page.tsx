import Link from "next/link";

import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { ChessTournamentForm } from "@/components/admin/ChessTournamentForm";

export default function NewChessTournamentPage() {
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
        description="Crea la configuracion base: sistema, rondas, fecha, ubicacion y desempates."
        eyebrow="Ajedrez"
        title="Nuevo torneo oficial"
      />

      <div className="mt-8">
        <AdminCard>
          <ChessTournamentForm />
        </AdminCard>
      </div>
    </AdminShell>
  );
}
