"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

import { ClubMemberAvatar } from "@/components/chess/ClubMemberAvatar";
import type { ClubAvatarId } from "@/modules/chess/avatars";

type TournamentPlayerIdentityProps = {
  name: string;
  photoUrl?: string;
  avatarId?: ClubAvatarId;
  href?: string;
  size?: number;
  className?: string;
  nameClassName?: string;
  style?: CSSProperties;
  nameStyle?: CSSProperties;
};

export function TournamentPlayerIdentity({
  name,
  photoUrl,
  avatarId,
  href,
  size = 30,
  className = "",
  nameClassName = "",
  style,
  nameStyle,
}: TournamentPlayerIdentityProps) {
  const content = (
    <>
      {(photoUrl || avatarId) && (
        <ClubMemberAvatar
          name={name}
          photoUrl={photoUrl}
          avatarId={avatarId}
          size={size}
        />
      )}
      <span className={nameClassName} style={nameStyle}>
        {name}
      </span>
    </>
  );

  const sharedClassName = `inline-flex min-w-0 items-center gap-2 ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        aria-label={`Ver perfil de ${name}`}
        className={`${sharedClassName} no-underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-marquee)]`}
        style={style}
      >
        {content}
      </Link>
    );
  }

  return (
    <span className={sharedClassName} style={style}>
      {content}
    </span>
  );
}
