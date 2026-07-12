import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Flame,
  Medal,
  Share2,
  Sparkles,
  Target,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { notFound } from "next/navigation";

import { PublicLayout } from "@/components/public/PublicLayout";
import { Section } from "@/components/public/Section";
import { MemberBelongingKit } from "@/components/chess/MemberBelongingKit";
import { ClubMemberAvatar } from "@/components/chess/ClubMemberAvatar";
import {
  type PublicClubMemberProfile,
  getPublicClubMemberProfile,
} from "@/lib/public-club-members";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };
type PublicProgress = NonNullable<PublicClubMemberProfile["progress"]>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const member = await getPublicClubMemberProfile((await params).slug);
  if (!member)
    return {
      title: "Miembro no encontrado",
      robots: { index: false, follow: false },
    };
  return {
    title: `${member.displayName} | Club Chessitos`,
    description: `Perfil de ${member.displayName} en la comunidad de ajedrez Chessitos Salcajá.`,
    robots: member.allowSharing ? undefined : { index: false, follow: false },
  };
}

export default async function ClubMemberPage({ params }: Props) {
  const member = await getPublicClubMemberProfile((await params).slug);
  if (!member) notFound();

  return (
    <PublicLayout>
      <main>
        <section className="border-b-[3px] border-[var(--color-marquee)] bg-[var(--color-navy-deep)] text-[var(--color-cream)]">
          <div className="mx-auto w-full max-w-5xl px-4 py-7 sm:px-6 sm:py-14 lg:px-8">
            <Link
              href="/ajedrez/club#miembros"
              className="inline-flex min-h-9 items-center gap-2 text-sm font-semibold text-[var(--color-marquee)] no-underline sm:min-h-11"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden /> Volver a miembros
            </Link>
            <div className="mt-4 flex items-center gap-3 sm:mt-7 sm:gap-5">
              <ClubMemberAvatar
                name={member.displayName}
                photoUrl={member.photoUrl}
                avatarId={member.avatarId}
                size={112}
                className="h-16 w-16 border-[3px] border-[var(--color-marquee)] sm:h-28 sm:w-28"
              />
              <div className="min-w-0">
                <p
                  className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-marquee)] sm:text-xs sm:tracking-[0.2em]"
                  style={{ fontFamily: "var(--font-poster)" }}
                >
                  Comunidad Chessitos
                </p>
                <h1
                  className="mt-1 break-words sm:mt-2"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.55rem, 8vw, 4.5rem)",
                    lineHeight: 0.95,
                  }}
                >
                  {member.title ? `${member.title} ` : ""}
                  {member.displayName}
                </h1>
                <p className="mt-2 text-xs text-stone-300 sm:mt-3 sm:text-sm">
                  {[
                    member.category,
                    member.ageBand,
                    member.memberSince
                      ? `Miembro desde ${member.memberSince.slice(0, 4)}`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(" · ") || "Miembro del club"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <Section>
          <div
            className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4"
            aria-label="Resumen del miembro"
          >
            {member.stats ? (
              <>
                <Stat
                  icon={TrendingUp}
                  label="ELO del club"
                  value={String(member.stats.elo)}
                  detail={
                    member.stats.eloDelta === 0
                      ? "Sin cambio"
                      : `${member.stats.eloDelta > 0 ? "+" : ""}${member.stats.eloDelta} desde el inicio`
                  }
                />
                <Stat
                  icon={CalendarDays}
                  label="Torneos"
                  value={String(member.stats.tournamentsPlayed)}
                  detail={`${member.stats.eloGames} partidas valoradas`}
                />
                <Stat
                  icon={Trophy}
                  label="Primeros lugares"
                  value={String(member.stats.tournamentWins)}
                  detail="En torneos del club"
                />
                <Stat
                  icon={Medal}
                  label="Puntos históricos"
                  value={String(member.stats.lifetimePoints)}
                  detail="Circuito Chessitos"
                />
              </>
            ) : (
              <div className="border-2 border-dashed border-stone-300 p-5 text-center sm:col-span-2 sm:p-8 lg:col-span-4">
                <Sparkles
                  className="mx-auto h-6 w-6 text-[var(--color-marquee)]"
                  aria-hidden
                />
                <h2
                  className="mt-3 text-xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Su historia en el club está comenzando
                </h2>
                <p className="mt-2 text-sm text-stone-500">
                  Las estadísticas aparecerán cuando estén autorizadas y existan
                  torneos registrados.
                </p>
              </div>
            )}
          </div>

          {member.progress && <PlayerProgressProfile member={member} />}

          <MemberBelongingKit member={member} />

          <div className="mt-5 flex flex-col gap-3 border-2 border-[var(--color-ink)] bg-[var(--color-grain)] p-4 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h2
                className="text-xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Una historia construida cada lunes
              </h2>
              <p className="mt-1 text-sm text-stone-600">
                Consulta el circuito completo y la posición de toda la
                comunidad.
              </p>
            </div>
            <Link
              href="/ajedrez/club#ranking"
              className="btn btn-secondary min-h-11 shrink-0"
            >
              Ver ranking del club
            </Link>
          </div>

          {member.allowSharing && (
            <p className="mt-5 flex items-center gap-2 text-xs text-stone-500">
              <Share2 className="h-4 w-4" aria-hidden /> Este perfil está
              autorizado para compartirse mediante su enlace.
            </p>
          )}
        </Section>
      </main>
    </PublicLayout>
  );
}

const dateFormatter = new Intl.DateTimeFormat("es-GT", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatDate(value?: string) {
  if (!value) return "Sin fecha";
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return dateFormatter.format(date);
}

function signed(value: number) {
  if (value > 0) return `+${value}`;
  if (value < 0) return String(value);
  return "0";
}

function resultLabel(result: PublicProgress["games"][number]["result"]) {
  switch (result) {
    case "win":
      return "Victoria";
    case "draw":
      return "Tablas";
    case "loss":
      return "Derrota";
    case "bye":
      return "Bye";
    case "forfeit":
      return "Incomparecencia";
    case "unplayed":
      return "Sin jugar";
  }
}

function PlayerProgressProfile({
  member,
}: {
  member: PublicClubMemberProfile;
}) {
  const progress = member.progress;
  if (!progress) return null;

  return (
    <div className="mt-4 grid min-w-0 gap-3 sm:mt-8 sm:gap-6 lg:grid-cols-[1.35fr_0.85fr]">
      <div className="grid min-w-0 gap-3 sm:gap-6">
        <EloEvolution member={member} />
        <TournamentTimeline member={member} />
      </div>
      <div className="grid min-w-0 gap-3 sm:gap-6">
        <GoalCard member={member} />
        <ActivityCard member={member} />
        <RecentGamesCard member={member} />
      </div>
    </div>
  );
}

function EloEvolution({ member }: { member: PublicClubMemberProfile }) {
  const progress = member.progress!;
  const series = progress.eloSeries;
  const values = [progress.baseElo, ...series.map((point) => point.elo)];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);

  return (
    <section
      className="min-w-0 overflow-hidden border-2 border-[var(--color-ink)] bg-[var(--color-cream)] p-3 sm:p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
      aria-labelledby="elo-evolution-title"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div>
          <p
            className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-marquee)] sm:text-xs sm:tracking-[0.16em]"
            style={{ fontFamily: "var(--font-poster)" }}
          >
            Evolución
          </p>
          <h2
            id="elo-evolution-title"
            className="mt-1 text-xl text-[var(--color-navy)] sm:text-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ELO del club en el tiempo
          </h2>
        </div>
        <div className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-stone-600">
          Mejor ELO: {progress.peakElo}
        </div>
      </div>

      {series.length > 0 ? (
        <>
          <div
            className="mt-3 flex h-24 items-end gap-1.5 overflow-x-auto border border-stone-200 bg-[var(--color-grain)] p-2 sm:mt-5 sm:h-40 sm:gap-2 sm:p-3"
            aria-hidden
          >
            {series.map((point) => {
              const height = 18 + ((point.elo - min) / range) * 82;
              return (
                <div
                  key={point.tournamentId}
                  className="flex min-w-11 flex-1 flex-col items-center justify-end gap-1.5 sm:min-w-14 sm:gap-2"
                >
                  <span className="text-[10px] font-semibold text-stone-500">
                    {point.elo}
                  </span>
                  <span
                    className="w-full rounded-t-sm border border-[var(--color-navy)] bg-[var(--color-marquee)]"
                    style={{ height: `${height}%` }}
                  />
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-xs leading-5 text-stone-600 sm:mt-3 sm:text-sm">
            Empezó en {progress.baseElo}, su mejor marca es {progress.peakElo} y
            actualmente está en {progress.currentElo}.
          </p>
          <div className="mt-3 overflow-x-auto sm:mt-4">
            <table className="w-full min-w-[520px] text-left text-xs">
              <thead className="border-b border-stone-200 text-stone-500">
                <tr>
                  <th className="py-2 pr-3">Torneo</th>
                  <th className="py-2 pr-3">Fecha</th>
                  <th className="py-2 pr-3 text-right">ELO</th>
                  <th className="py-2 text-right">Cambio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {series.map((point) => (
                  <tr key={`${point.tournamentId}-table`}>
                    <td className="py-2 pr-3 font-semibold text-stone-800">
                      {point.tournamentTitle}
                    </td>
                    <td className="py-2 pr-3 text-stone-500">
                      {formatDate(point.startsAt)}
                    </td>
                    <td className="py-2 pr-3 text-right font-bold text-[var(--color-navy)]">
                      {point.elo}
                    </td>
                    <td className="py-2 text-right font-semibold text-stone-600">
                      {signed(point.eloDelta)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <EmptyProgressState
          icon={BarChart3}
          title="Aún no hay curva de ELO"
          copy="La gráfica aparecerá cuando juegue su primer torneo valorado del club."
        />
      )}
    </section>
  );
}

function TournamentTimeline({ member }: { member: PublicClubMemberProfile }) {
  const tournaments = member
    .progress!.tournaments.slice()
    .reverse()
    .slice(0, 5);

  return (
    <section
      className="min-w-0 border-2 border-[var(--color-ink)] bg-white p-3 sm:p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
      aria-labelledby="tournament-history-title"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div>
          <p
            className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-marquee)] sm:text-xs sm:tracking-[0.16em]"
            style={{ fontFamily: "var(--font-poster)" }}
          >
            Historial
          </p>
          <h2
            id="tournament-history-title"
            className="mt-1 text-xl text-[var(--color-navy)] sm:text-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Últimos torneos del club
          </h2>
        </div>
        <Link
          href="/ajedrez/club#ranking"
          className="inline-flex min-h-10 items-center text-sm font-semibold text-[var(--color-navy)] underline decoration-[var(--color-marquee)] decoration-2 underline-offset-4"
        >
          Ver ranking
        </Link>
      </div>

      {tournaments.length > 0 ? (
        <div className="mt-3 grid gap-2 sm:mt-5 sm:gap-3">
          {tournaments.map((tournament) => (
            <article
              key={tournament.tournamentId}
              className="border border-stone-200 bg-[var(--color-grain)] p-2.5 sm:p-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <div>
                  <h3 className="font-semibold text-stone-900">
                    {tournament.tournamentTitle}
                  </h3>
                  <p className="mt-1 text-xs text-stone-500">
                    {formatDate(tournament.startsAt)} · Puesto #
                    {tournament.position}
                    de {tournament.participants}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-white px-2 py-1 text-[var(--color-navy)]">
                    {tournament.points} pts
                  </span>
                  <span className="rounded-full bg-white px-2 py-1 text-stone-600">
                    ELO {signed(tournament.eloDelta)}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-xs text-stone-600 sm:mt-3 sm:text-sm">
                {tournament.wins} victorias · {tournament.draws} tablas ·{" "}
                {tournament.losses} derrotas
                {tournament.byes > 0 ? ` · ${tournament.byes} bye` : ""}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <EmptyProgressState
          icon={CalendarDays}
          title="Sin torneos registrados todavía"
          copy="Cuando participe, aquí se verá su recorrido torneo por torneo."
        />
      )}
    </section>
  );
}

function GoalCard({ member }: { member: PublicClubMemberProfile }) {
  const goal = member.progress!.goal;
  const ratio =
    goal.target > 0 ? Math.min(100, (goal.current / goal.target) * 100) : 0;

  return (
    <section
      className="min-w-0 border-2 border-[var(--color-ink)] bg-[var(--color-navy)] p-3 text-[var(--color-cream)] sm:p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
      aria-labelledby="next-goal-title"
    >
      <Target className="h-5 w-5 text-[var(--color-marquee)]" aria-hidden />
      <p
        className="mt-3 text-[10px] uppercase tracking-[0.14em] text-[var(--color-marquee)] sm:mt-4 sm:text-xs sm:tracking-[0.16em]"
        style={{ fontFamily: "var(--font-poster)" }}
      >
        Próximo paso
      </p>
      <h2
        id="next-goal-title"
        className="mt-1 text-lg font-semibold sm:text-xl"
      >
        {goal.label}
      </h2>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15 sm:mt-5">
        <span
          className="block h-full rounded-full bg-[var(--color-marquee)]"
          style={{ width: `${ratio}%` }}
        />
      </div>
      <p className="mt-3 text-xs text-stone-300">
        Avance: {goal.current} / {goal.target}
        {goal.remaining > 0 ? ` · faltan ${goal.remaining}` : ""}
      </p>
    </section>
  );
}

function ActivityCard({ member }: { member: PublicClubMemberProfile }) {
  const progress = member.progress!;
  return (
    <section
      className="min-w-0 border-2 border-[var(--color-ink)] bg-[var(--color-cream)] p-3 sm:p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
      aria-labelledby="activity-title"
    >
      <Activity className="h-5 w-5 text-[var(--color-marquee)]" aria-hidden />
      <h2
        id="activity-title"
        className="mt-3 text-lg text-[var(--color-navy)] sm:mt-4 sm:text-xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Ritmo y constancia
      </h2>
      <dl className="mt-3 grid grid-cols-3 gap-1.5 text-center sm:mt-4 sm:gap-2">
        <MiniMetric
          label="30 días"
          value={String(progress.activity.tournaments30d)}
        />
        <MiniMetric
          label="90 días"
          value={String(progress.activity.tournaments90d)}
        />
        <MiniMetric
          label="365 días"
          value={String(progress.activity.tournaments365d)}
        />
      </dl>
      <div className="mt-3 border-t border-stone-200 pt-3 text-xs text-stone-600 sm:mt-4 sm:pt-4 sm:text-sm">
        <p>
          Racha actual:{" "}
          <span className="font-semibold text-[var(--color-navy)]">
            {progress.streaks.current}
          </span>{" "}
          torneo{progress.streaks.current === 1 ? "" : "s"}.
        </p>
        <p className="mt-1">
          Mejor racha:{" "}
          <span className="font-semibold text-[var(--color-navy)]">
            {progress.streaks.best}
          </span>
          .
        </p>
        {progress.bestMarks.bestPosition && (
          <p className="mt-1">
            Mejor puesto: #{progress.bestMarks.bestPosition}
            {progress.bestMarks.bestTournamentTitle
              ? ` en ${progress.bestMarks.bestTournamentTitle}`
              : ""}
            .
          </p>
        )}
      </div>
    </section>
  );
}

function RecentGamesCard({ member }: { member: PublicClubMemberProfile }) {
  const games = member.progress!.games;
  const recentGames = games.slice(0, 5);
  return (
    <section
      className="min-w-0 border-2 border-[var(--color-ink)] bg-white p-3 sm:p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
      aria-labelledby="recent-games-title"
    >
      <Flame className="h-5 w-5 text-[var(--color-marquee)]" aria-hidden />
      <h2
        id="recent-games-title"
        className="mt-3 text-lg text-[var(--color-navy)] sm:mt-4 sm:text-xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Últimos resultados
      </h2>
      {games.length > 0 ? (
        <div className="mt-3 grid gap-1.5 sm:mt-4 sm:gap-2">
          {recentGames.map((game) => (
            <div
              key={`${game.tournamentId}-${game.roundNumber}-${game.boardNumber}`}
              className="flex items-center justify-between gap-3 border border-stone-200 bg-[var(--color-grain)] px-2.5 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm"
            >
              <span className="min-w-0">
                <span className="block truncate font-semibold text-stone-900">
                  {resultLabel(game.result)}
                </span>
                <span className="block text-xs text-stone-500">
                  R{game.roundNumber} · Mesa {game.boardNumber} ·{" "}
                  {game.color === "white" ? "Blancas" : "Negras"}
                </span>
              </span>
              <span className="shrink-0 text-[11px] font-semibold text-[var(--color-navy)] sm:text-xs">
                {game.ratedForElo
                  ? `ELO ${signed(game.eloDelta)}`
                  : "No valorada"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-stone-500">
          Aún no hay partidas recientes publicables.
        </p>
      )}
    </section>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-stone-200 bg-white p-1.5 sm:p-2">
      <dt className="text-[10px] uppercase tracking-[0.12em] text-stone-500">
        {label}
      </dt>
      <dd className="mt-1 text-xl font-bold text-[var(--color-navy)] sm:text-2xl">
        {value}
      </dd>
    </div>
  );
}

function EmptyProgressState({
  icon: Icon,
  title,
  copy,
}: {
  icon: typeof Trophy;
  title: string;
  copy: string;
}) {
  return (
    <div className="mt-3 border border-dashed border-stone-300 bg-[var(--color-grain)] p-4 text-center sm:mt-5 sm:p-6">
      <Icon
        className="mx-auto h-6 w-6 text-[var(--color-marquee)]"
        aria-hidden
      />
      <h3
        className="mt-2 text-lg text-[var(--color-navy)] sm:mt-3 sm:text-xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h3>
      <p className="mt-2 text-sm text-stone-500">{copy}</p>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Trophy;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div
      className="border-2 border-[var(--color-ink)] bg-[var(--color-cream)] p-2.5 sm:p-4"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <Icon
        className="h-4 w-4 text-[var(--color-marquee)] sm:h-5 sm:w-5"
        aria-hidden
      />
      <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-stone-500 sm:mt-4 sm:text-xs sm:tracking-[0.12em]">
        {label}
      </p>
      <p className="mt-0.5 text-xl font-bold text-[var(--color-navy)] sm:mt-1 sm:text-3xl">
        {value}
      </p>
      <p className="mt-0.5 text-[11px] leading-4 text-stone-500 sm:mt-1 sm:text-xs">
        {detail}
      </p>
    </div>
  );
}
