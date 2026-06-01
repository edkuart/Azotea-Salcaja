"use client";

import { useEffect, useState } from "react";
import type { ChessTournament } from "@/modules/chess/types";
import { TournamentManager } from "./TournamentManager";

export function LocalTournamentLoader({ id }: { id: string }) {
  const [tournament, setTournament] = useState<ChessTournament | null | "loading">("loading");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("az_tournaments");
      if (!raw) { setTournament(null); return; }
      const list = JSON.parse(raw) as ChessTournament[];
      const found = list.find((t) => t.id === id);
      setTournament(found ?? null);
    } catch {
      setTournament(null);
    }
  }, [id]);

  if (tournament === "loading") {
    return (
      <div className="flex h-48 items-center justify-center text-stone-400 text-sm">
        Cargando torneo…
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="flex h-48 items-center justify-center text-stone-400 text-sm">
        Torneo no encontrado. Puede que hayas borrado el almacenamiento local.
      </div>
    );
  }

  return <TournamentManager initial={tournament} storageKey={id} />;
}
