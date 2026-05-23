import { TextAreaField } from "@/components/admin/TextAreaField";
import { TextField } from "@/components/admin/TextField";
import type { ChessTournament } from "@/modules/chess/types";

export function ChessTournamentForm({
  tournament,
}: {
  tournament?: ChessTournament;
}) {
  return (
    <form className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          defaultValue={tournament?.title}
          label="Nombre del torneo"
          placeholder="Ej. Rapid nocturno de lunes"
        />
        <TextField
          defaultValue={tournament?.startsAt}
          label="Fecha y hora"
          placeholder="2026-06-01 19:30"
        />
      </div>

      <TextAreaField
        defaultValue={tournament?.description}
        label="Descripcion"
        placeholder="Resumen publico del torneo."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-2 text-sm font-medium text-stone-700">
          Sistema
          <select
            className="h-11 rounded-md border border-stone-300 bg-white px-3 text-sm font-normal text-stone-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
            defaultValue={tournament?.system ?? "swiss"}
          >
            <option value="swiss">Sistema suizo</option>
            <option value="round_robin">Todos contra todos</option>
          </select>
        </label>
        <TextField
          defaultValue={tournament?.roundsPlanned.toString()}
          label="Rondas"
          placeholder="5"
          type="number"
        />
        <TextField
          defaultValue={tournament?.locationLabel}
          label="Ubicacion"
          placeholder="Azotea Salcaja"
        />
      </div>

      <label className="grid gap-2 text-sm font-medium text-stone-700">
        Desempates
        <select
          className="h-11 rounded-md border border-stone-300 bg-white px-3 text-sm font-normal text-stone-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
          defaultValue="formal"
        >
          <option value="casual">Casual: puntos, progresivo, Buchholz</option>
          <option value="formal">Formal local: Buchholz Cut 1, Buchholz</option>
        </select>
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="h-11 rounded-md bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800">
          Guardar torneo
        </button>
        <button
          className="h-11 rounded-md border border-stone-300 px-5 text-sm font-semibold text-stone-700 transition hover:bg-white"
          type="button"
        >
          Guardar borrador
        </button>
      </div>
    </form>
  );
}
