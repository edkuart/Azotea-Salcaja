import { Plus } from "lucide-react";

import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusPill } from "@/components/admin/StatusPill";
import { TextAreaField } from "@/components/admin/TextAreaField";
import { TextField } from "@/components/admin/TextField";
import { adminEvents } from "@/modules/admin/restaurant-data";

export default function AdminEventsPage() {
  return (
    <AdminShell>
      <AdminPageHeader
        action={
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800">
            <Plus className="h-4 w-4" aria-hidden />
            Nuevo evento
          </button>
        }
        description="Publica actividades especiales, promociones y eventos comunitarios."
        eyebrow="Restaurante"
        title="Eventos"
      />

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_380px]">
        <AdminCard>
          <div className="grid gap-4">
            {adminEvents.map((event) => (
              <article
                className="grid gap-4 rounded-lg border border-stone-200 p-4 md:grid-cols-[160px_1fr_auto] md:items-center"
                key={event.id}
              >
                <div
                  className="min-h-32 rounded-md bg-stone-200"
                  style={{
                    backgroundImage: `url(${event.image})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-700">
                    {event.type}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-stone-950">
                    {event.title}
                  </h2>
                  <p className="mt-1 text-sm text-stone-600">
                    {event.date} - {event.time}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {event.description}
                  </p>
                </div>
                <StatusPill label={event.status} />
              </article>
            ))}
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="text-lg font-semibold">Crear o editar evento</h2>
          <form className="mt-4 grid gap-4">
            <TextField label="Titulo" placeholder="Ej. Lunes de ajedrez" />
            <TextField label="Fecha" placeholder="Todos los lunes" />
            <TextField label="Hora" placeholder="7:30 p.m." />
            <TextAreaField
              label="Descripcion"
              placeholder="Resumen publico del evento."
            />
            <TextField label="URL de imagen" placeholder="https://..." />
            <button className="h-11 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800">
              Guardar evento
            </button>
          </form>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
