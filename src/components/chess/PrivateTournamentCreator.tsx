"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Copy, Link2, Play } from "lucide-react";

import { createPrivateTournamentToken } from "@/modules/chess/private-tournaments";
import type { TournamentSystem } from "@/modules/chess/types";

const defaultPlayers = `Jugador 1
Jugador 2
Jugador 3
Jugador 4`;

export function PrivateTournamentCreator() {
  const [title, setTitle] = useState("Torneo casual");
  const [system, setSystem] = useState<TournamentSystem>("swiss");
  const [rounds, setRounds] = useState(3);
  const [playersText, setPlayersText] = useState(defaultPlayers);
  const [origin, setOrigin] = useState("");

  const playerNames = useMemo(
    () =>
      playersText
        .split("\n")
        .map((name) => name.trim())
        .filter(Boolean),
    [playersText],
  );

  const token = useMemo(
    () =>
      createPrivateTournamentToken({
        title,
        system,
        roundsPlanned: rounds,
        playerNames,
        createdAt: new Date().toISOString(),
      }),
    [playerNames, rounds, system, title],
  );

  const viewPath = `/ajedrez/privado/${token}`;
  const managePath = `/ajedrez/privado/${token}/admin`;
  const canCreate = playerNames.length >= 2;
  const viewUrl = `${origin}${viewPath}`;
  const manageUrl = `${origin}${managePath}`;

  function ensureOrigin() {
    if (!origin && typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }

  async function copyLink(value: string) {
    ensureOrigin();

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(value || `${window.location.origin}${viewPath}`);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-stone-950">
          Crear torneo rapido
        </h2>
        <div className="mt-5 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-stone-700">
            Nombre
            <input
              className="h-11 rounded-md border border-stone-300 px-3 text-sm text-stone-950 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
              onChange={(event) => setTitle(event.target.value)}
              value={title}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-stone-700">
              Sistema
              <select
                className="h-11 rounded-md border border-stone-300 px-3 text-sm text-stone-950 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
                onChange={(event) =>
                  setSystem(event.target.value as TournamentSystem)
                }
                value={system}
              >
                <option value="swiss">Sistema suizo</option>
                <option value="round_robin">Todos contra todos</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-stone-700">
              Rondas
              <input
                className="h-11 rounded-md border border-stone-300 px-3 text-sm text-stone-950 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
                max={15}
                min={1}
                onChange={(event) => setRounds(Number(event.target.value))}
                type="number"
                value={rounds}
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-medium text-stone-700">
            Jugadores, uno por linea
            <textarea
              className="min-h-48 rounded-md border border-stone-300 px-3 py-2 text-sm leading-6 text-stone-950 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
              onChange={(event) => setPlayersText(event.target.value)}
              value={playersText}
            />
          </label>
        </div>
      </section>

      <aside className="rounded-lg border border-stone-200 bg-stone-950 p-5 text-white shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">
          Privado casual
        </p>
        <h2 className="mt-3 text-2xl font-semibold">Links compartibles</h2>
        <p className="mt-3 text-sm leading-6 text-stone-200">
          Este torneo no aparece en la home, no es oficial del restaurante y se
          comparte solo con el link.
        </p>

        <div className="mt-5 grid gap-3 text-sm">
          <div className="rounded-md bg-white/10 p-3">
            <p className="font-semibold">Jugadores</p>
            <p className="mt-1 text-stone-200">{playerNames.length}</p>
          </div>
          <div className="rounded-md bg-white/10 p-3">
            <p className="font-semibold">Formato</p>
            <p className="mt-1 text-stone-200">
              {system === "swiss" ? "Sistema suizo" : "Todos contra todos"} ·{" "}
              {rounds} rondas
            </p>
          </div>
        </div>

        {!canCreate ? (
          <p className="mt-5 rounded-md bg-amber-100 p-3 text-sm font-semibold text-amber-950">
            Agrega al menos 2 jugadores.
          </p>
        ) : (
          <div className="mt-5 grid gap-3">
            <Link
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-amber-300 px-4 text-sm font-semibold text-stone-950 transition hover:bg-amber-200"
              href={managePath}
            >
              <Play className="h-4 w-4" aria-hidden />
              Abrir administrador
            </Link>
            <Link
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/50 px-4 text-sm font-semibold text-white transition hover:bg-white hover:text-stone-950"
              href={viewPath}
            >
              <Link2 className="h-4 w-4" aria-hidden />
              Abrir vista
            </Link>
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/50 px-4 text-sm font-semibold text-white transition hover:bg-white hover:text-stone-950"
              onClick={() => copyLink(manageUrl)}
              type="button"
            >
              <Copy className="h-4 w-4" aria-hidden />
              Copiar link admin
            </button>
            <p className="break-all rounded-md bg-white/10 p-3 text-xs leading-5 text-stone-200">
              {origin ? manageUrl : managePath}
            </p>
            <p className="break-all rounded-md bg-white/10 p-3 text-xs leading-5 text-stone-200">
              {origin ? viewUrl : viewPath}
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
