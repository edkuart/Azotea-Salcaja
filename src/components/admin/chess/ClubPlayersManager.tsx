"use client";

import { useRef, useState } from "react";
import { Pencil, Plus, RotateCcw, Trash2, User, X } from "lucide-react";

import type { ClubPlayer, ClubPlayerSex } from "@/modules/chess/types";

/** Edad a partir de YYYY-MM-DD (aprox., suficiente para fichas del club). */
export function clubPlayerAge(birthDate?: string): number | null {
  if (!birthDate) return null;
  const birth = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());
  if (beforeBirthday) age -= 1;
  return age >= 0 ? age : null;
}

function sexLabel(sex?: ClubPlayerSex) {
  return sex === "M" ? "Masculino" : sex === "F" ? "Femenino" : null;
}

type FormState = {
  name: string;
  rating: string;
  fideId: string;
  title: string;
  sex: "" | ClubPlayerSex;
  birthDate: string;
  photoUrl: string;
  notes: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  rating: "",
  fideId: "",
  title: "",
  sex: "",
  birthDate: "",
  photoUrl: "",
  notes: "",
};

function playerToForm(player: ClubPlayer): FormState {
  return {
    name: player.name,
    rating: player.rating?.toString() ?? "",
    fideId: player.fideId ?? "",
    title: player.title ?? "",
    sex: player.sex ?? "",
    birthDate: player.birthDate ?? "",
    photoUrl: player.photoUrl ?? "",
    notes: player.notes ?? "",
  };
}

function formToPayload(form: FormState) {
  const rating = Number.parseInt(form.rating, 10);
  return {
    name: form.name.trim(),
    rating: Number.isFinite(rating) ? rating : undefined,
    fideId: form.fideId.trim() || undefined,
    title: form.title.trim() || undefined,
    sex: form.sex || undefined,
    birthDate: form.birthDate || undefined,
    photoUrl: form.photoUrl || undefined,
    notes: form.notes.trim() || undefined,
  };
}

function Avatar({ player, size = 44 }: { player: ClubPlayer; size?: number }) {
  if (player.photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={player.photoUrl}
        alt={player.name}
        className="shrink-0 rounded-full border-2 object-cover"
        style={{ width: size, height: size, borderColor: "var(--color-ink)" }}
      />
    );
  }
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full border-2 font-semibold"
      style={{
        width: size,
        height: size,
        borderColor: "var(--color-ink)",
        background: "var(--color-grain)",
        color: "var(--color-navy)",
        fontFamily: "var(--font-poster)",
        fontSize: size * 0.4,
      }}
    >
      {player.name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")}
    </span>
  );
}

export function ClubPlayersManager({ initial }: { initial: ClubPlayer[] }) {
  const [players, setPlayers] = useState<ClubPlayer[]>(initial);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function startEdit(player: ClubPlayer) {
    setEditingId(player.id);
    setForm(playerToForm(player));
    setError(null);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
  }

  async function handlePhotoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "club/players");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (res.ok) {
        setField("photoUrl", json.url);
      } else {
        setError(json.error ?? "No se pudo subir la foto.");
      }
    } catch {
      setError("No se pudo subir la foto.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || saving) return;
    setSaving(true);
    setError(null);
    try {
      const payload = formToPayload(form);
      const res = editingId
        ? await fetch(`/api/club-players/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/club-players", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "No se pudo guardar.");
        return;
      }
      setPlayers((prev) =>
        editingId
          ? prev.map((p) => (p.id === editingId ? (json as ClubPlayer) : p))
          : [...prev, json as ClubPlayer],
      );
      cancelEdit();
    } catch {
      setError("No se pudo guardar. Revisa tu conexión.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(player: ClubPlayer) {
    const res = await fetch(`/api/club-players/${player.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...player, isActive: !player.isActive }),
    });
    if (res.ok) {
      const updated = (await res.json()) as ClubPlayer;
      setPlayers((prev) => prev.map((p) => (p.id === player.id ? updated : p)));
    }
  }

  async function removePlayer(player: ClubPlayer) {
    const confirmed = window.confirm(
      `¿Eliminar a ${player.name} del club? Los torneos donde ya jugó no se modifican.`,
    );
    if (!confirmed) return;
    const res = await fetch(`/api/club-players/${player.id}`, { method: "DELETE" });
    if (res.ok) {
      setPlayers((prev) => prev.filter((p) => p.id !== player.id));
      if (editingId === player.id) cancelEdit();
    }
  }

  const active = players.filter((p) => p.isActive);
  const inactive = players.filter((p) => !p.isActive);

  const inputClass =
    "h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400";
  const labelClass =
    "text-xs font-semibold uppercase tracking-[0.14em] text-stone-500";

  return (
    <div className="grid gap-6">
      {/* ── Formulario alta / edición ── */}
      <div ref={formRef} className="rounded-sm border-2 border-[var(--color-ink)] bg-white">
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
          <h2 className="font-semibold text-stone-950">
            {editingId ? "Editar jugador" : "Agregar jugador al club"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
              Cancelar edición
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 p-5">
          <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
            <div className="grid gap-1.5">
              <label className={labelClass} htmlFor="club-name">Nombre completo *</label>
              <input
                id="club-name"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                required
                placeholder="Ej. Miguel Mazariegos"
                className={inputClass}
              />
            </div>
            <div className="grid gap-1.5">
              <label className={labelClass} htmlFor="club-rating">Rating / ELO</label>
              <input
                id="club-rating"
                type="number"
                min={100}
                max={3000}
                value={form.rating}
                onChange={(e) => setField("rating", e.target.value)}
                placeholder="1500"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-1.5">
              <label className={labelClass} htmlFor="club-sex">Sexo</label>
              <select
                id="club-sex"
                value={form.sex}
                onChange={(e) => setField("sex", e.target.value as FormState["sex"])}
                className={inputClass}
              >
                <option value="">Sin especificar</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
            <div className="grid gap-1.5">
              <label className={labelClass} htmlFor="club-birth">Fecha de nacimiento</label>
              <input
                id="club-birth"
                type="date"
                value={form.birthDate}
                onChange={(e) => setField("birthDate", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="grid gap-1.5">
              <label className={labelClass} htmlFor="club-fide">ID FIDE</label>
              <input
                id="club-fide"
                value={form.fideId}
                onChange={(e) => setField("fideId", e.target.value)}
                placeholder="Ej. 14400120"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
            <div className="grid gap-1.5">
              <label className={labelClass} htmlFor="club-title">Título</label>
              <input
                id="club-title"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="Ej. CM, FM"
                className={inputClass}
              />
            </div>
            <div className="grid gap-1.5">
              <label className={labelClass}>Foto</label>
              <div className="flex items-center gap-3">
                {form.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.photoUrl}
                    alt="Foto del jugador"
                    className="h-10 w-10 rounded-full border-2 border-[var(--color-ink)] object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-400">
                    <User className="h-5 w-5" aria-hidden />
                  </span>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handlePhotoFile}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-300 px-3 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50"
                >
                  {uploading ? (
                    <RotateCcw className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <Plus className="h-4 w-4" aria-hidden />
                  )}
                  {form.photoUrl ? "Cambiar foto" : "Subir foto"}
                </button>
                {form.photoUrl && (
                  <button
                    type="button"
                    onClick={() => setField("photoUrl", "")}
                    className="text-xs font-semibold text-stone-400 hover:text-red-600"
                  >
                    Quitar
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-1.5">
            <label className={labelClass} htmlFor="club-notes">Notas ajedrecísticas</label>
            <textarea
              id="club-notes"
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              rows={2}
              placeholder="Ej. Aperturas favoritas, categoría escolar, club anterior…"
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>

          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving || !form.name.trim()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" aria-hidden />
            {saving ? "Guardando…" : editingId ? "Guardar cambios" : "Agregar al club"}
          </button>
        </form>
      </div>

      {/* ── Listado ── */}
      <PlayerList
        title={`Jugadores activos (${active.length})`}
        players={active}
        emptyText="Sin jugadores todavía. Agrega al primero con el formulario."
        onEdit={startEdit}
        onToggleActive={toggleActive}
        onRemove={removePlayer}
      />
      {inactive.length > 0 && (
        <PlayerList
          title={`Inactivos (${inactive.length})`}
          players={inactive}
          emptyText=""
          onEdit={startEdit}
          onToggleActive={toggleActive}
          onRemove={removePlayer}
        />
      )}
    </div>
  );
}

function PlayerList({
  title,
  players,
  emptyText,
  onEdit,
  onToggleActive,
  onRemove,
}: {
  title: string;
  players: ClubPlayer[];
  emptyText: string;
  onEdit: (player: ClubPlayer) => void;
  onToggleActive: (player: ClubPlayer) => void;
  onRemove: (player: ClubPlayer) => void;
}) {
  return (
    <div className="rounded-sm border-2 border-[var(--color-ink)] bg-white">
      <div className="border-b border-stone-100 px-5 py-4">
        <h2 className="font-semibold text-stone-950">{title}</h2>
      </div>
      {players.length === 0 ? (
        <p className="p-8 text-center text-sm text-stone-500">{emptyText}</p>
      ) : (
        <div className="divide-y divide-stone-100">
          {players.map((player) => {
            const age = clubPlayerAge(player.birthDate);
            const meta = [
              player.rating ? `Rating ${player.rating}` : null,
              sexLabel(player.sex),
              age !== null ? `${age} años` : null,
              player.fideId ? `FIDE ${player.fideId}` : null,
            ].filter(Boolean);

            return (
              <div key={player.id} className="flex items-center gap-3 p-4">
                <Avatar player={player} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-stone-950">
                    {player.title ? (
                      <span
                        className="mr-1.5 rounded-sm px-1.5 py-0.5 text-[10px] font-bold uppercase"
                        style={{ background: "var(--color-marquee)", color: "var(--color-ink)" }}
                      >
                        {player.title}
                      </span>
                    ) : null}
                    {player.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-stone-500">
                    {meta.length > 0 ? meta.join(" · ") : "Sin datos adicionales"}
                  </p>
                  {player.notes && (
                    <p className="mt-0.5 truncate text-xs italic text-stone-400">{player.notes}</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(player)}
                    aria-label={`Editar a ${player.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-stone-400 transition hover:bg-stone-100 hover:text-stone-800"
                  >
                    <Pencil className="h-4 w-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleActive(player)}
                    className="hidden rounded-md px-2.5 py-1.5 text-xs font-semibold text-stone-500 transition hover:bg-stone-100 sm:block"
                  >
                    {player.isActive ? "Desactivar" : "Activar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(player)}
                    aria-label={`Eliminar a ${player.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-stone-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
