"use client";

import { useState } from "react";

import { clubAvatarPath, type ClubAvatarId } from "@/modules/chess/avatars";

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type ClubMemberAvatarProps = {
  name: string;
  photoUrl?: string;
  avatarId?: ClubAvatarId;
  size?: number;
  decorative?: boolean;
  className?: string;
};

function ClubMemberAvatarFrame({
  name,
  photoUrl,
  avatarId,
  size = 44,
  decorative = true,
  className = "",
}: ClubMemberAvatarProps) {
  const [failedPhoto, setFailedPhoto] = useState(false);
  const [failedAvatar, setFailedAvatar] = useState(false);
  const avatarUrl = clubAvatarPath(avatarId);

  const src =
    photoUrl && !failedPhoto
      ? photoUrl
      : avatarUrl && !failedAvatar
        ? avatarUrl
        : undefined;

  if (src) {
    return (
      // The source can be an uploaded remote photo, so next/image cannot safely
      // infer its host. Avatar assets are already optimized WebP files.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={decorative ? "" : `Representación visual de ${name}`}
        loading="lazy"
        className={`shrink-0 rounded-full border-2 border-[var(--color-ink)] object-cover ${className}`}
        style={{ width: size, height: size }}
        onError={() => {
          if (src === photoUrl) setFailedPhoto(true);
          else setFailedAvatar(true);
        }}
      />
    );
  }

  return (
    <span
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : `Iniciales de ${name}`}
      className={`flex shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-grain)] font-semibold text-[var(--color-navy)] ${className}`}
      style={{
        width: size,
        height: size,
        fontFamily: "var(--font-poster)",
        fontSize: size * 0.38,
      }}
    >
      {initials(name) || "?"}
    </span>
  );
}

export function ClubMemberAvatar(props: ClubMemberAvatarProps) {
  return (
    <ClubMemberAvatarFrame
      key={`${props.photoUrl ?? ""}:${props.avatarId ?? ""}`}
      {...props}
    />
  );
}
