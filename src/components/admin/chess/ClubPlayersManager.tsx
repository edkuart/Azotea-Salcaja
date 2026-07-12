"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  ChevronUp,
  Eye,
  Pencil,
  Plus,
  RotateCcw,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import {
  ageFromBirthDate,
  clubCategoryFromBirthDate,
  localDateInputValue,
} from "@/modules/chess/club-player-categories";
import { ClubMemberAvatar } from "@/components/chess/ClubMemberAvatar";
import {
  CLUB_AVATARS,
  type ClubAvatarId,
} from "@/modules/chess/avatars";
import type {
  ClubPlayer,
  ClubPlayerSex,
  ClubProfileVisibility,
} from "@/modules/chess/types";

function sexLabel(sex?: ClubPlayerSex) {
  return sex === "M" ? "Masculino" : sex === "F" ? "Femenino" : null;
}

type FormState = {
  name: string;
  rating: string;
  currentEloDelta: number;
  fideId: string;
  title: string;
  sex: "" | ClubPlayerSex;
  birthDate: string;
  photoUrl: string;
  avatarId: "" | ClubAvatarId;
  notes: string;
  publicName: string;
  memberSince: string;
  profileVisibility: ClubProfileVisibility;
  showPhoto: boolean;
  showAgeBand: boolean;
  showStats: boolean;
  allowSharing: boolean;
  consentRecordedAt: string;
};

type ClubPlayerForAdmin = ClubPlayer & {
  currentElo?: number;
  currentEloDelta?: number;
  currentEloGames?: number;
};

function emptyForm(): FormState {
  return {
    name: "",
    rating: "",
    currentEloDelta: 0,
    fideId: "",
    title: "",
    sex: "",
    birthDate: "",
    photoUrl: "",
    avatarId: "",
    notes: "",
    publicName: "",
    memberSince: localDateInputValue(),
    profileVisibility: "private",
    showPhoto: false,
    showAgeBand: false,
    showStats: true,
    allowSharing: false,
    consentRecordedAt: "",
  };
}

function playerToForm(player: ClubPlayerForAdmin): FormState {
  return {
    name: player.name,
    rating: (player.currentElo ?? player.rating)?.toString() ?? "",
    currentEloDelta: player.currentEloDelta ?? 0,
    fideId: player.fideId ?? "",
    title: player.title ?? "",
    sex: player.sex ?? "",
    birthDate: player.birthDate ?? "",
    photoUrl: player.photoUrl ?? "",
    avatarId: player.avatarId ?? "",
    notes: player.notes ?? "",
    publicName: player.publicName ?? "",
    memberSince: player.memberSince ?? "",
    profileVisibility: player.profileVisibility ?? "private",
    showPhoto: player.showPhoto ?? false,
    showAgeBand: player.showAgeBand ?? false,
    showStats: player.showStats ?? true,
    allowSharing: player.allowSharing ?? false,
    consentRecordedAt: player.consentRecordedAt ?? "",
  };
}

function formToPayload(form: FormState) {
  const currentElo = Number.parseInt(form.rating, 10);
  const rating =
    Number.isFinite(currentElo) && form.rating.trim()
      ? currentElo - form.currentEloDelta
      : undefined;
  const isPublicProfile = form.profileVisibility === "public";
  return {
    name: form.name.trim(),
    rating: rating !== undefined ? Math.round(rating) : undefined,
    fideId: form.fideId.trim() || undefined,
    title: form.title.trim() || undefined,
    sex: form.sex || undefined,
    birthDate: form.birthDate || undefined,
    photoUrl: form.photoUrl || undefined,
    avatarId: form.avatarId || null,
    notes: form.notes.trim() || undefined,
    publicName: form.publicName.trim() || undefined,
    memberSince: form.memberSince || undefined,
    profileVisibility: form.profileVisibility,
    showPhoto: isPublicProfile && form.showPhoto,
    showAgeBand: isPublicProfile && form.showAgeBand,
    showStats: form.showStats,
    allowSharing: isPublicProfile && form.allowSharing,
    consentRecordedAt: form.consentRecordedAt || undefined,
  };
}

function displayNamePreview(form: FormState) {
  if (form.profileVisibility === "initials") {
    return (form.publicName || form.name)
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => `${part[0]?.toUpperCase() ?? ""}.`)
      .join(" ");
  }
  return form.publicName.trim() || form.name.trim() || "Nombre del miembro";
}

function visibilityCopy(visibility?: ClubProfileVisibility) {
  if (visibility === "public")
    return {
      label: "Público",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  if (visibility === "initials")
    return {
      label: "Iniciales",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    };
  return {
    label: "Privado",
    className: "border-stone-200 bg-stone-50 text-stone-500",
  };
}

function publicProfileHref(player: ClubPlayerForAdmin) {
  if (!player.publicSlug || player.profileVisibility === "private") return null;
  return `/ajedrez/club/jugadores/${player.publicSlug}`;
}

/**
 * Formulario reutilizable de ficha de jugador. Se usa arriba para AGREGAR y
 * dentro de la lista (debajo de cada fila) para EDITAR — así la edición está
 * donde el ojo la busca, junto al jugador.
 */
function ClubPlayerForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial: FormState;
  submitLabel: string;
  /** Devuelve mensaje de error, o null si guardó bien (resetea el form). */
  onSubmit: (
    payload: ReturnType<typeof formToPayload>,
  ) => Promise<string | null>;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const formId = useId();

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
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
      const submitError = await onSubmit(formToPayload(form));
      if (submitError) {
        setError(submitError);
      } else {
        setForm(emptyForm());
      }
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "h-10 w-full min-w-0 rounded-md border border-stone-300 bg-white px-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400";
  const labelClass =
    "text-xs font-semibold uppercase tracking-[0.14em] text-stone-500";

  return (
    <form onSubmit={handleSubmit} className="grid min-w-0 gap-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
        <div className="grid min-w-0 gap-1.5">
          <label className={labelClass}>Nombre completo *</label>
          <input
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            required
            placeholder="Ej. Miguel Mazariegos"
            className={inputClass}
          />
        </div>
        <div className="grid min-w-0 gap-1.5">
          <label className={labelClass}>ELO actual</label>
          <input
            type="number"
            min={100}
            max={3000}
            value={form.rating}
            onChange={(e) => setField("rating", e.target.value)}
            placeholder="1500"
            className={inputClass}
          />
          <p className="text-xs leading-5 text-stone-500">
            Coincide con el ranking del club. Si lo ajustas, se corrige el
            rating base para que el ELO final quede en este número.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid min-w-0 gap-1.5">
          <label className={labelClass}>Sexo</label>
          <select
            value={form.sex}
            onChange={(e) =>
              setField("sex", e.target.value as FormState["sex"])
            }
            className={inputClass}
          >
            <option value="">Sin especificar</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>
        <div className="grid min-w-0 gap-1.5">
          <label className={labelClass}>Fecha de nacimiento</label>
          <input
            type="date"
            value={form.birthDate}
            onChange={(e) => setField("birthDate", e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="grid min-w-0 gap-1.5">
          <label className={labelClass}>ID FIDE</label>
          <input
            value={form.fideId}
            onChange={(e) => setField("fideId", e.target.value)}
            placeholder="Ej. 14400120"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
        <div className="grid min-w-0 gap-1.5">
          <label className={labelClass}>Título</label>
          <input
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
            placeholder="Ej. CM, FM"
            className={inputClass}
          />
        </div>
        <div className="grid min-w-0 gap-1.5">
          <label className={labelClass}>Fotografía real</label>
          <div className="flex flex-wrap items-center gap-3">
            <ClubMemberAvatar
              name={displayNamePreview(form)}
              photoUrl={form.photoUrl || undefined}
              avatarId={form.avatarId || undefined}
              size={40}
              decorative={false}
            />
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

      <fieldset className="grid gap-3 rounded-md border border-stone-200 bg-stone-50 p-4">
        <legend className="px-1 text-sm font-semibold text-stone-950">
          Avatar ilustrado del club
        </legend>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="max-w-2xl text-xs leading-5 text-stone-500">
            Se usa cuando no hay una fotografía pública autorizada. Es un
            personaje ficticio y puede cambiarse sin borrar la foto guardada.
          </p>
          <button
            type="button"
            onClick={() => setField("avatarId", "")}
            className={`min-h-9 rounded-md border px-3 text-xs font-semibold ${
              !form.avatarId
                ? "border-stone-950 bg-stone-950 text-white"
                : "border-stone-300 bg-white text-stone-600 hover:bg-stone-100"
            }`}
          >
            Usar iniciales
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5" role="list">
          {CLUB_AVATARS.map((avatar) => {
            const selected = form.avatarId === avatar.id;
            return (
              <div key={avatar.id} role="listitem" className="min-w-0">
                <button
                  type="button"
                  aria-pressed={selected}
                  aria-label={`Seleccionar ${avatar.label}, ${avatar.stage}`}
                  onClick={() => setField("avatarId", avatar.id)}
                  className={`group relative grid w-full min-w-0 justify-items-center gap-1.5 rounded-md border-2 bg-white p-2 text-center transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-marquee)] ${
                    selected
                      ? "-translate-y-0.5 border-stone-950 shadow-[3px_3px_0_#1a1a1a]"
                      : "border-stone-200 hover:border-stone-500"
                  }`}
                >
                  <ClubMemberAvatar
                    name={avatar.label}
                    avatarId={avatar.id}
                    size={56}
                  />
                  <span className="truncate text-[10px] font-semibold text-stone-700">
                    {avatar.label}
                  </span>
                  <span className="text-[9px] text-stone-400">
                    {avatar.stage}
                  </span>
                  {selected && (
                    <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-stone-950 text-white">
                      <Check className="h-3 w-3" aria-hidden />
                      <span className="sr-only">Seleccionado</span>
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </fieldset>

      <div className="grid min-w-0 gap-1.5">
        <label className={labelClass}>Notas ajedrecísticas</label>
        <textarea
          value={form.notes}
          onChange={(e) => setField("notes", e.target.value)}
          rows={2}
          placeholder="Ej. Aperturas favoritas, categoría escolar, club anterior…"
          className="w-full min-w-0 rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
        />
      </div>

      <fieldset className="grid gap-4 rounded-md border border-stone-200 bg-stone-50 p-4">
        <legend className="px-1 text-sm font-semibold text-stone-950">
          Perfil público y privacidad
        </legend>
        <p className="text-xs leading-5 text-stone-500">
          El perfil nace privado. Publica únicamente información autorizada; la
          fecha de nacimiento y las notas nunca se muestran.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid min-w-0 gap-1.5">
            <label htmlFor={`${formId}-public-name`} className={labelClass}>
              Nombre público o alias
            </label>
            <input
              id={`${formId}-public-name`}
              value={form.publicName}
              onChange={(e) => setField("publicName", e.target.value)}
              placeholder="Vacío = nombre completo"
              className={inputClass}
            />
          </div>
          <div className="grid min-w-0 gap-1.5">
            <label htmlFor={`${formId}-visibility`} className={labelClass}>
              Visibilidad
            </label>
            <select
              id={`${formId}-visibility`}
              value={form.profileVisibility}
              onChange={(e) =>
                setForm((prev) => {
                  const profileVisibility = e.target
                    .value as ClubProfileVisibility;
                  const isPublicProfile = profileVisibility === "public";
                  return {
                    ...prev,
                    profileVisibility,
                    showPhoto: isPublicProfile ? prev.showPhoto : false,
                    showAgeBand: isPublicProfile ? prev.showAgeBand : false,
                    allowSharing: isPublicProfile ? prev.allowSharing : false,
                  };
                })
              }
              className={inputClass}
            >
              <option value="private">Privado — solo administración</option>
              <option value="initials">Iniciales — identidad protegida</option>
              <option value="public">Público — nombre autorizado</option>
            </select>
          </div>
          <div className="grid min-w-0 gap-1.5">
            <label htmlFor={`${formId}-member-since`} className={labelClass}>
              Miembro desde
            </label>
            <input
              id={`${formId}-member-since`}
              type="date"
              value={form.memberSince}
              onChange={(e) => setField("memberSince", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="grid min-w-0 gap-1.5">
            <span className={labelClass}>Categoría actual</span>
            <div className="flex min-h-10 items-center rounded-md border border-stone-200 bg-white px-3 text-sm font-semibold text-stone-900">
              {clubCategoryFromBirthDate(form.birthDate)}
            </div>
            <p className="text-xs leading-5 text-stone-500">
              Se recalcula automáticamente: Sub 10, Sub 12, Sub 14, Sub 16, Sub
              18 o Libre.
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {(
            [
              ["showPhoto", "Mostrar fotografía autorizada", "public"],
              ["showAgeBand", "Mostrar solamente rango de edad", "public"],
              ["showStats", "Mostrar estadísticas del club", "any"],
              ["allowSharing", "Permitir compartir el perfil", "public"],
            ] as const
          ).map(([key, label, scope]) => {
            const disabled =
              scope === "public" && form.profileVisibility !== "public";
            return (
              <label
                key={key}
                className={`flex min-h-11 items-center gap-3 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm ${
                  disabled ? "text-stone-400" : "text-stone-700"
                }`}
              >
                <input
                  type="checkbox"
                  disabled={disabled}
                  checked={
                    !disabled &&
                    (form[
                      key as keyof Pick<
                        FormState,
                        | "showPhoto"
                        | "showAgeBand"
                        | "showStats"
                        | "allowSharing"
                      >
                    ] as boolean)
                  }
                  onChange={(e) =>
                    setField(
                      key as
                        | "showPhoto"
                        | "showAgeBand"
                        | "showStats"
                        | "allowSharing",
                      e.target.checked,
                    )
                  }
                  className="h-4 w-4 accent-stone-950"
                />
                {label}
              </label>
            );
          })}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid min-w-0 gap-1.5">
            <label htmlFor={`${formId}-consent-date`} className={labelClass}>
              Autorización registrada
            </label>
            <input
              id={`${formId}-consent-date`}
              type="date"
              value={form.consentRecordedAt}
              onChange={(e) => setField("consentRecordedAt", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      <div className="rounded-md border border-stone-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <Eye className="mt-0.5 h-5 w-5 text-stone-500" aria-hidden />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-stone-950">
              Vista previa pública
            </p>
            <p className="mt-1 text-sm text-stone-600">
              {form.profileVisibility === "private"
                ? "No aparecerá en el directorio público."
                : `${displayNamePreview(form)} aparecerá como perfil ${form.profileVisibility === "initials" ? "con identidad protegida" : "público autorizado"}.`}
            </p>
            <p className="mt-2 text-xs text-stone-400">
              Foto, edad y QR compartible solo se habilitan para perfiles
              públicos con autorización registrada.
            </p>
          </div>
        </div>
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
        {saving ? "Guardando…" : submitLabel}
      </button>
    </form>
  );
}

export function ClubPlayersManager({
  initial,
}: {
  initial: ClubPlayerForAdmin[];
}) {
  const [players, setPlayers] = useState<ClubPlayerForAdmin[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function addPlayer(payload: ReturnType<typeof formToPayload>) {
    try {
      const res = await fetch("/api/club-players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) return json.error ?? "No se pudo guardar.";
      const created = json as ClubPlayer;
      setPlayers((prev) => [
        ...prev,
        {
          ...created,
          currentElo: created.rating,
          currentEloDelta: 0,
          currentEloGames: 0,
        },
      ]);
      return null;
    } catch {
      return "No se pudo guardar. Revisa tu conexión.";
    }
  }

  async function savePlayer(
    id: string,
    payload: ReturnType<typeof formToPayload>,
  ) {
    try {
      const res = await fetch(`/api/club-players/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) return json.error ?? "No se pudo guardar.";
      setPlayers((prev) => {
        const current = prev.find((p) => p.id === id);
        const updated = json as ClubPlayer;
        const currentEloDelta = current?.currentEloDelta ?? 0;
        const currentElo =
          payload.rating !== undefined
            ? payload.rating + currentEloDelta
            : current?.currentElo;
        return prev.map((p) =>
          p.id === id
            ? {
                ...updated,
                currentElo,
                currentEloDelta,
                currentEloGames: current?.currentEloGames ?? 0,
              }
            : p,
        );
      });
      setEditingId(null);
      return null;
    } catch {
      return "No se pudo guardar. Revisa tu conexión.";
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
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === player.id
            ? {
                ...updated,
                currentElo: p.currentElo,
                currentEloDelta: p.currentEloDelta,
                currentEloGames: p.currentEloGames,
              }
            : p,
        ),
      );
    }
  }

  async function removePlayer(player: ClubPlayer) {
    const confirmed = window.confirm(
      `¿Eliminar a ${player.name} del club? Se pierde su vínculo con el ranking histórico. ` +
        `Si solo dejó de llegar, mejor usa "Desactivar".`,
    );
    if (!confirmed) return;
    const res = await fetch(`/api/club-players/${player.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setPlayers((prev) => prev.filter((p) => p.id !== player.id));
      if (editingId === player.id) setEditingId(null);
    }
  }

  const active = players.filter((p) => p.isActive);
  const inactive = players.filter((p) => !p.isActive);
  const visible = active.filter(
    (p) => p.profileVisibility && p.profileVisibility !== "private",
  );
  const shareable = visible.filter((p) => p.allowSharing);
  const withAuthorization = active.filter((p) => p.consentRecordedAt);

  const listProps = {
    editingId,
    onEditToggle: (id: string) =>
      setEditingId((prev) => (prev === id ? null : id)),
    onSave: savePlayer,
    onToggleActive: toggleActive,
    onRemove: removePlayer,
  };

  return (
    <div className="grid min-w-0 gap-6">
      <div className="grid gap-3 rounded-sm border-2 border-[var(--color-ink)] bg-[var(--color-grain)] p-5 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2">
            <ShieldCheck
              className="h-5 w-5 text-[var(--color-navy)]"
              aria-hidden
            />
            <h2 className="font-semibold text-stone-950">
              Piloto seguro de perfiles
            </h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Selecciona pocos miembros, registra autorización y publica solo la
            información autorizada. El directorio se mantiene privado por
            defecto.
          </p>
          <Link
            href="/ajedrez/club#miembros"
            className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-md border border-stone-300 bg-white px-3 text-sm font-semibold text-stone-700 no-underline hover:bg-stone-50"
            target="_blank"
          >
            Ver directorio público
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        {[
          ["Activos", active.length],
          ["Con autorización", withAuthorization.length],
          ["Visibles", visible.length],
          ["Compartibles", shareable.length],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-md border border-stone-200 bg-white p-3"
          >
            <p className="text-2xl font-bold text-[var(--color-navy)]">
              {value}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Alta de jugador ── */}
      <div className="min-w-0 rounded-sm border-2 border-[var(--color-ink)] bg-white">
        <div className="border-b border-stone-100 px-5 py-4">
          <h2 className="font-semibold text-stone-950">
            Agregar jugador al club
          </h2>
        </div>
        <div className="p-5">
          <ClubPlayerForm
            initial={emptyForm()}
            submitLabel="Agregar al club"
            onSubmit={addPlayer}
          />
        </div>
      </div>

      {/* ── Listado (toca "Editar" para modificar la ficha ahí mismo) ── */}
      <PlayerList
        title={`Jugadores activos (${active.length})`}
        players={active}
        emptyText="Sin jugadores todavía. Agrega al primero con el formulario."
        {...listProps}
      />
      {inactive.length > 0 && (
        <PlayerList
          title={`Inactivos (${inactive.length})`}
          players={inactive}
          emptyText=""
          {...listProps}
        />
      )}
    </div>
  );
}

function PlayerList({
  title,
  players,
  emptyText,
  editingId,
  onEditToggle,
  onSave,
  onToggleActive,
  onRemove,
}: {
  title: string;
  players: ClubPlayerForAdmin[];
  emptyText: string;
  editingId: string | null;
  onEditToggle: (id: string) => void;
  onSave: (
    id: string,
    payload: ReturnType<typeof formToPayload>,
  ) => Promise<string | null>;
  onToggleActive: (player: ClubPlayerForAdmin) => void;
  onRemove: (player: ClubPlayerForAdmin) => void;
}) {
  return (
    <div className="min-w-0 rounded-sm border-2 border-[var(--color-ink)] bg-white">
      <div className="border-b border-stone-100 px-5 py-4">
        <h2 className="font-semibold text-stone-950">{title}</h2>
        <p className="mt-0.5 text-xs text-stone-400">
          Toca «Editar» para modificar la ficha de un jugador.
        </p>
      </div>
      {players.length === 0 ? (
        <p className="p-8 text-center text-sm text-stone-500">{emptyText}</p>
      ) : (
        <div className="divide-y divide-stone-100">
          {players.map((player) => {
            const isEditing = editingId === player.id;
            const age = ageFromBirthDate(player.birthDate);
            const href = publicProfileHref(player);
            const visibility = visibilityCopy(player.profileVisibility);
            const category = clubCategoryFromBirthDate(player.birthDate);
            const meta = [
              player.currentElo ? `ELO ${player.currentElo}` : null,
              category,
              sexLabel(player.sex),
              age !== null ? `${age} años` : null,
              player.fideId ? `FIDE ${player.fideId}` : null,
            ].filter(Boolean);

            return (
              <div key={player.id}>
                <div className="flex min-w-0 items-center gap-3 p-4">
                  <ClubMemberAvatar
                    name={player.name}
                    photoUrl={player.photoUrl}
                    avatarId={player.avatarId ?? undefined}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-stone-950">
                      {player.title ? (
                        <span
                          className="mr-1.5 rounded-sm px-1.5 py-0.5 text-[10px] font-bold uppercase"
                          style={{
                            background: "var(--color-marquee)",
                            color: "var(--color-ink)",
                          }}
                        >
                          {player.title}
                        </span>
                      ) : null}
                      {player.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-stone-500">
                      {meta.length > 0
                        ? meta.join(" · ")
                        : "Sin datos adicionales"}
                    </p>
                    {player.notes && !isEditing && (
                      <p className="mt-0.5 truncate text-xs italic text-stone-400">
                        {player.notes}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${visibility.className}`}
                      >
                        {visibility.label}
                      </span>
                      {player.allowSharing && (
                        <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                          QR activo
                        </span>
                      )}
                      {player.consentRecordedAt && (
                        <span className="rounded-full border border-stone-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-stone-500">
                          Consentimiento {player.consentRecordedAt}
                        </span>
                      )}
                      {href && (
                        <Link
                          href={href}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--color-navy)] no-underline hover:underline"
                        >
                          Ver perfil
                          <ArrowUpRight className="h-3 w-3" aria-hidden />
                        </Link>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onEditToggle(player.id)}
                    className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border px-3 text-xs font-semibold transition ${
                      isEditing
                        ? "border-stone-950 bg-stone-950 text-white"
                        : "border-stone-300 text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    {isEditing ? (
                      <ChevronUp className="h-3.5 w-3.5" aria-hidden />
                    ) : (
                      <Pencil className="h-3.5 w-3.5" aria-hidden />
                    )}
                    {isEditing ? "Cerrar" : "Editar"}
                  </button>
                </div>

                {/* Panel de edición inline, debajo de la fila */}
                {isEditing && (
                  <div className="border-t border-dashed border-stone-200 bg-stone-50 p-4 sm:p-5">
                    <ClubPlayerForm
                      key={player.id}
                      initial={playerToForm(player)}
                      submitLabel="Guardar cambios"
                      onSubmit={(payload) => onSave(player.id, payload)}
                    />
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-3">
                      <button
                        type="button"
                        onClick={() => onToggleActive(player)}
                        className="rounded-md border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-white"
                      >
                        {player.isActive
                          ? "Desactivar (dejó de llegar)"
                          : "Reactivar jugador"}
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemove(player)}
                        className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        Eliminar del club
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
