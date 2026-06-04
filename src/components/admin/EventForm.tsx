"use client";

import { useState } from "react";
import type { Event } from "@prisma/client";
import type { TournamentStatus } from "@/modules/chess/types";
import { ImageUpload } from "@/components/admin/ImageUpload";

type TournamentOption = { id: string; title: string; status: TournamentStatus };

type Props = {
  action: (formData: FormData) => Promise<void>;
  tournaments: TournamentOption[];
  event?: Event;
};

const STATUS_OPTIONS = [
  { value: "draft", label: "Borrador" },
  { value: "published", label: "Publicado" },
  { value: "archived", label: "Archivado" },
];

const TYPE_OPTIONS = [
  { value: "restaurant", label: "Restaurante" },
  { value: "chess", label: "Ajedrez / Torneo" },
  { value: "community", label: "Comunidad" },
];

export function EventForm({ action, tournaments, event }: Props) {
  const [type, setType] = useState<"restaurant" | "chess" | "community">(event?.type ?? "restaurant");

  const toDatetimeLocal = (d?: Date | null) => {
    if (!d) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return (
    <form action={action} className="grid gap-5">
      {/* Tipo */}
      <div className="grid gap-1.5">
        <label className="text-sm font-semibold text-stone-700">
          Tipo de evento
        </label>
        <div className="flex gap-2 flex-wrap">
          {TYPE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition"
              style={{
                borderColor: type === opt.value ? "#1c1917" : "#d6d3d1",
                background: type === opt.value ? "#1c1917" : "white",
                color: type === opt.value ? "white" : "#44403c",
              }}
            >
              <input
                type="radio"
                name="type"
                value={opt.value}
                checked={type === opt.value}
                onChange={() => setType(opt.value as "restaurant" | "chess" | "community")}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Título */}
      <div className="grid gap-1.5">
        <label className="text-sm font-semibold text-stone-700" htmlFor="title">
          Título
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={event?.title}
          placeholder="Ej. Noche de ajedrez — Junio"
          className="h-10 rounded-md border border-stone-300 px-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-950"
        />
      </div>

      {/* Descripción */}
      <div className="grid gap-1.5">
        <label className="text-sm font-semibold text-stone-700" htmlFor="description">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={event?.description ?? ""}
          placeholder="Resumen público del evento."
          className="rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-950"
        />
      </div>

      {/* Fecha inicio / fin */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <label className="text-sm font-semibold text-stone-700" htmlFor="startsAt">
            Fecha y hora de inicio
          </label>
          <input
            id="startsAt"
            name="startsAt"
            type="datetime-local"
            required
            defaultValue={toDatetimeLocal(event?.startsAt)}
            className="h-10 rounded-md border border-stone-300 px-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-950"
          />
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm font-semibold text-stone-700" htmlFor="endsAt">
            Fecha y hora de fin <span className="font-normal text-stone-400">(opcional)</span>
          </label>
          <input
            id="endsAt"
            name="endsAt"
            type="datetime-local"
            defaultValue={toDatetimeLocal(event?.endsAt)}
            className="h-10 rounded-md border border-stone-300 px-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-950"
          />
        </div>
      </div>

      {/* Ubicación */}
      <div className="grid gap-1.5">
        <label className="text-sm font-semibold text-stone-700" htmlFor="locationLabel">
          Ubicación
        </label>
        <input
          id="locationLabel"
          name="locationLabel"
          defaultValue={event?.locationLabel ?? "Restaurante Azotea Salcajá"}
          className="h-10 rounded-md border border-stone-300 px-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-950"
        />
      </div>

      {/* Imagen portada */}
      <ImageUpload
        name="coverImageUrl"
        label="Imagen de portada"
        defaultValue={event?.coverImageUrl}
        folder="events"
      />

      {/* Vincular torneo (solo para chess) */}
      {type === "chess" && (
        <div className="grid gap-1.5 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <label className="text-sm font-semibold text-amber-900" htmlFor="linkedTournamentId">
            Vincular torneo de ajedrez <span className="font-normal text-amber-700">(opcional)</span>
          </label>
          <p className="text-xs text-amber-700">
            El torneo vinculado mostrará sus bases, desempates y premios en la página del evento.
          </p>
          <select
            id="linkedTournamentId"
            name="linkedTournamentId"
            defaultValue={event?.linkedTournamentId ?? ""}
            className="h-10 rounded-md border border-amber-300 bg-white px-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">— Sin torneo vinculado —</option>
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.status})
              </option>
            ))}
          </select>
          {tournaments.length === 0 && (
            <p className="text-xs text-amber-600">
              No hay torneos disponibles.{" "}
              <a href="/admin/ajedrez/torneos/nuevo" className="underline">
                Crea uno primero
              </a>.
            </p>
          )}
        </div>
      )}

      {/* Estado */}
      <div className="grid gap-1.5">
        <label className="text-sm font-semibold text-stone-700" htmlFor="status">
          Estado
        </label>
        <select
          id="status"
          name="status"
          defaultValue={event?.status ?? "draft"}
          className="h-10 rounded-md border border-stone-300 px-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-950"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="h-11 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800"
      >
        {event ? "Guardar cambios" : "Crear evento"}
      </button>
    </form>
  );
}
