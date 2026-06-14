import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { TournamentManager } from "@/components/admin/chess/TournamentManager";
import { LocalTournamentLoader } from "@/components/admin/chess/LocalTournamentLoader";
import { officialChessTournaments } from "@/modules/chess/public-data";
import { getTournament } from "@/lib/tournament-store";
import type { ChessTournament } from "@/modules/chess/types";
import { ShareQrCard } from "@/components/admin/ShareQrCard";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return officialChessTournaments.map((t) => ({ id: t.id }));
}

const BackButton = (
  <Link
    style={{
      display: "inline-flex",
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      padding: "0 16px",
      border: "2px solid var(--color-ink)",
      background: "var(--color-grain)",
      fontFamily: "var(--font-poster)",
      textTransform: "uppercase",
      letterSpacing: "0.14em",
      fontSize: 11,
      color: "var(--color-ink)",
      textDecoration: "none",
    }}
    href="/admin/ajedrez/torneos"
  >
    ← Torneos
  </Link>
);

function TournamentShell({
  title,
  tournament,
  id,
  extra,
  shareId,
}: {
  title: string;
  tournament: ChessTournament;
  id: string;
  extra?: React.ReactNode;
  /** Si se pasa, muestra el QR/enlace público (vista en vivo) del torneo */
  shareId?: string;
}) {
  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Ajedrez"
        title={title}
        description="Administra jugadores, genera rondas y registra resultados."
        action={
          <div style={{ display: "flex", gap: 8 }}>
            {BackButton}
            {extra}
          </div>
        }
      />
      {shareId && (
        <div className="mt-6">
          <ShareQrCard
            path={`/ajedrez/torneos/live/${shareId}`}
            title="Compartir torneo (QR y enlace)"
            description="Comparte este código o enlace con los jugadores para que sigan el torneo en vivo: posiciones, pareos y resultados."
            fileName={`qr-torneo-${tournament.slug ?? shareId}`}
          />
        </div>
      )}
      <div className="mt-6">
        <TournamentManager initial={tournament} apiId={id} />
      </div>
    </AdminShell>
  );
}

export default async function AdminChessTournamentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Legacy localStorage-backed IDs
  if (id.startsWith("local-")) {
    return (
      <AdminShell>
        <AdminPageHeader
          eyebrow="Ajedrez"
          title="Torneo"
          description="Administra jugadores, genera rondas y registra resultados."
          action={BackButton}
        />
        <div className="mt-6">
          <LocalTournamentLoader id={id} />
        </div>
      </AdminShell>
    );
  }

  // Server-stored tournament (API)
  if (id.startsWith("t")) {
    const tournament = await getTournament(id);
    if (!tournament) notFound();
    return (
      <TournamentShell
        title={tournament.title}
        tournament={tournament}
        id={id}
        shareId={id}
        extra={
          <Link
            href={`/ajedrez/torneos/live/${id}`}
            target="_blank"
            style={{
              display: "inline-flex",
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              padding: "0 16px",
              border: "2px solid var(--color-ink)",
              background: "var(--color-stage)",
              color: "var(--color-cream)",
              fontFamily: "var(--font-poster)",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              fontSize: 11,
              textDecoration: "none",
            }}
          >
            Ver público ↗
          </Link>
        }
      />
    );
  }

  // Static official tournament
  const tournament = officialChessTournaments.find((t) => t.id === id);
  if (!tournament) notFound();

  return (
    <TournamentShell
      title={tournament.title}
      tournament={tournament}
      id={id}
      extra={
        <Link
          href={`/admin/ajedrez/torneos/${tournament.id}/publicacion`}
          style={{
            display: "inline-flex",
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            padding: "0 16px",
            border: "2px solid var(--color-ink)",
            background: "var(--color-stage)",
            color: "var(--color-cream)",
            fontFamily: "var(--font-poster)",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            fontSize: 11,
            textDecoration: "none",
          }}
        >
          Publicación
        </Link>
      }
    />
  );
}
