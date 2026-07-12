import Link from "next/link";

import { PlayerAvatar } from "@/components/chess/StandingsTable";
import type { ClubAvatarId } from "@/modules/chess/avatars";

export function ClubPlayerAvatarLink({
  name,
  photoUrl,
  avatarId,
  href,
  size = 32,
}: {
  name: string;
  photoUrl?: string;
  avatarId?: ClubAvatarId;
  href?: string;
  size?: number;
}) {
  const avatar = (
    <PlayerAvatar
      name={name}
      photoUrl={photoUrl}
      avatarId={avatarId}
      size={size}
    />
  );

  if (!href) return avatar;

  return (
    <Link
      href={href}
      aria-label={`Ver perfil de ${name}`}
      className="rounded-full no-underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-marquee)]"
    >
      {avatar}
    </Link>
  );
}
