"use client";

import { useState } from "react";
import Link from "next/link";
import type { Event } from "@prisma/client";
import type {
  TournamentSexCategory,
  TournamentStatus,
} from "@/modules/chess/types";
import {
  describeSexCategory,
  formatAgeRange,
  getEventTournamentIds,
} from "@/modules/chess/categories";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { restaurantInfo } from "@/modules/restaurant/public-data";

type TournamentOption = {
  id: string;
  title: string;
  status: TournamentStatus;
  categoryLabel?: string;
  sexCategory?: TournamentSexCategory;
  ageMin?: number;
  ageMax?: number;
};

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

const TOURNAMENT_STATUS_LABELS: Record<TournamentStatus, string> = {
  setup: "En preparación",
  active: "En juego",
  closed: "Finalizado",
  cancelled: "Cancelado",
};

function categoryTags(t: TournamentOption): string[] {
  const tags: string[] = [];
  if (t.sexCategory && t.sexCategory !== "open") tags.push(describeSexCategory(t.sexCategory));
  if (t.ageMin != null || t.ageMax != null) tags.push(formatAgeRange(t));
  return tags;
}

export function EventForm({ action, tournaments, event }: Props) {
  const [type, setType] = useState<"restaurant" | "chess" | "community">(event?.type ?? "restaurant");

  // Torneos-categoría adjuntos al evento, en orden. Se puede adjuntar varios
  // (cada uno es una categoría: Sub-12, Femenino, Libre…).
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    event ? getEventTournamentIds(event) : [],
  );

  const byId = new Map(tournaments.map((t) => [t.id, t]));
  // Disponibles para adjuntar: activos/en preparación y aún no seleccionados.
  const available = tournaments.filter(
    (t) =>
      t.status !== "cancelled" &&
      t.status !== "closed" &&
      !selectedIds.includes(t.id),
  );

  function attach(id: string) {
    setSelectedIds((ids) => (ids.includes(id) ? ids : [...ids, id]));
  }
  function detach(id: string) {
    setSelectedIds((ids) => ids.filter((x) => x !== id));
  }
  function move(index: number, delta: number) {
    setSelectedIds((ids) => {
      const target = index + delta;
      if (target < 0 || target >= ids.length) return ids;
      const next = [...ids];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

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
          className="h-10 rounded-md border-2 border-[var(--color-ink)] px-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-stage)]/20 focus:border-[var(--color-stage)]"
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
          rows={12}
          defaultValue={event?.description ?? ""}
          placeholder="Resumen público del evento."
          className="min-h-48 resize-y rounded-md border-2 border-[var(--color-ink)] px-3 py-2 text-sm leading-6 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-stage)]/20 focus:border-[var(--color-stage)]"
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
            className="h-10 rounded-md border-2 border-[var(--color-ink)] px-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-stage)]/20 focus:border-[var(--color-stage)]"
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
            className="h-10 rounded-md border-2 border-[var(--color-ink)] px-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-stage)]/20 focus:border-[var(--color-stage)]"
          />
        </div>
      </div>

      {/* Ubicación */}
      <div className="grid gap-4 rounded-lg border border-stone-200 bg-stone-50 p-4">
        <div>
          <p className="text-sm font-semibold text-stone-800">
            Ubicación pública del evento
          </p>
          <p className="mt-1 text-xs leading-5 text-stone-500">
            Estos datos aparecen en la página pública para que los visitantes puedan abrir Google Maps y llegar al lugar.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <label className="text-sm font-semibold text-stone-700" htmlFor="locationLabel">
              Nombre del lugar
            </label>
            <input
              id="locationLabel"
              name="locationLabel"
              defaultValue={event?.locationLabel ?? restaurantInfo.name}
              placeholder="Ej. Azotea Salcajá"
              className="h-10 rounded-md border-2 border-[var(--color-ink)] bg-white px-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-stage)]/20 focus:border-[var(--color-stage)]"
            />
          </div>
          <div className="grid gap-1.5">
            <label className="text-sm font-semibold text-stone-700" htmlFor="locationMapsUrl">
              Link de Google Maps
            </label>
            <input
              id="locationMapsUrl"
              name="locationMapsUrl"
              type="url"
              defaultValue={event?.locationMapsUrl ?? restaurantInfo.mapsUrl}
              placeholder="https://maps.google.com/..."
              className="h-10 rounded-md border-2 border-[var(--color-ink)] bg-white px-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-stage)]/20 focus:border-[var(--color-stage)]"
            />
          </div>
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm font-semibold text-stone-700" htmlFor="locationAddress">
            Dirección visible
          </label>
          <textarea
            id="locationAddress"
            name="locationAddress"
            rows={3}
            defaultValue={event?.locationAddress ?? restaurantInfo.address}
            className="resize-y rounded-md border-2 border-[var(--color-ink)] bg-white px-3 py-2 text-sm leading-6 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-stage)]/20 focus:border-[var(--color-stage)]"
          />
        </div>
      </div>

      {/* Imagen portada */}
      <ImageUpload
        name="coverImageUrl"
        label="Imagen de portada"
        defaultValue={event?.coverImageUrl}
        folder="events"
      />

      {/* Torneos del evento — categorías (solo para chess) */}
      {type === "chess" && (
        <div className="grid gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div>
            <p className="text-sm font-semibold text-amber-900">
              Torneos del evento (categorías) <span className="font-normal text-amber-700">(opcional)</span>
            </p>
            <p className="mt-1 text-xs leading-5 text-amber-700">
              Adjunta uno o varios torneos. Con varios, la página del evento los muestra
              como categorías (Sub-12, Femenino, Libre…), cada una con su propia tabla y
              vista en vivo. Las bases se administran en cada torneo, no aquí.
            </p>
          </div>

          {/* Adjuntos, en orden */}
          {selectedIds.length > 0 ? (
            <ul className="grid gap-2">
              {selectedIds.map((id, index) => {
                const t = byId.get(id);
                const tags = t ? categoryTags(t) : [];
                return (
                  <li
                    key={id}
                    className="flex items-center gap-2 rounded-md border border-amber-300 bg-white px-3 py-2"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-800">
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-stone-900">
                        {t ? t.categoryLabel || t.title : `Torneo ${id}`}
                      </span>
                      {t && tags.length > 0 && (
                        <span className="block truncate text-xs text-stone-500">
                          {tags.join(" · ")} · {TOURNAMENT_STATUS_LABELS[t.status]}
                        </span>
                      )}
                      {t && tags.length === 0 && (
                        <span className="block truncate text-xs text-stone-500">
                          {TOURNAMENT_STATUS_LABELS[t.status]}
                        </span>
                      )}
                      {!t && (
                        <span className="block text-xs text-red-600">
                          No encontrado (¿eliminado?)
                        </span>
                      )}
                    </span>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                        aria-label="Subir"
                        className="flex h-7 w-7 items-center justify-center rounded border border-amber-300 text-stone-600 disabled:opacity-30 enabled:hover:bg-amber-100"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => move(index, 1)}
                        disabled={index === selectedIds.length - 1}
                        aria-label="Bajar"
                        className="flex h-7 w-7 items-center justify-center rounded border border-amber-300 text-stone-600 disabled:opacity-30 enabled:hover:bg-amber-100"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => detach(id)}
                        aria-label="Quitar"
                        className="flex h-7 w-7 items-center justify-center rounded border border-red-200 text-red-600 hover:bg-red-50"
                      >
                        ✕
                      </button>
                    </div>
                    <input type="hidden" name="linkedTournamentIds" value={id} />
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="rounded-md border border-dashed border-amber-300 px-3 py-3 text-xs text-amber-700">
              Aún no has adjuntado torneos. Elige uno o más abajo.
            </p>
          )}

          {/* Disponibles para adjuntar */}
          {available.length > 0 && (
            <div className="grid gap-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                Disponibles para adjuntar
              </p>
              <div className="flex flex-wrap gap-2">
                {available.map((t) => {
                  const tags = categoryTags(t);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => attach(t.id)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-white px-3 py-1.5 text-sm text-stone-800 transition hover:bg-amber-100"
                    >
                      <span className="font-semibold text-amber-700">+</span>
                      {t.categoryLabel || t.title}
                      {tags.length > 0 && (
                        <span className="text-xs text-stone-500">({tags.join(" · ")})</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {tournaments.length === 0 && (
            <p className="text-xs text-amber-600">
              No hay torneos creados todavía.{" "}
              <Link href="/admin/ajedrez/torneos/nuevo" className="underline">
                Crea uno primero
              </Link>{" "}
              (define ahí su categoría: nombre, sexo y rango de edad).
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
          className="h-10 rounded-md border-2 border-[var(--color-ink)] px-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-stage)]/20 focus:border-[var(--color-stage)]"
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
