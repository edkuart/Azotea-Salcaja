"use client";

import Link from "next/link";
import { Crown, Medal, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { ClubMemberAvatar } from "@/components/chess/ClubMemberAvatar";
import type { ClubAvatarId } from "@/modules/chess/avatars";

import styles from "./VictoryPodium.module.css";

export type VictoryPodiumEntry = {
  playerId: string;
  name: string;
  photoUrl?: string;
  avatarId?: ClubAvatarId;
  href?: string;
  points: number;
  wins?: number;
};

type VictoryPodiumProps = {
  entries: VictoryPodiumEntry[];
  variant?: "feature" | "compact";
  celebrate?: boolean;
  label?: string;
};

type CelebrationStyle = CSSProperties & {
  "--delay"?: string;
  "--left"?: string;
  "--drift"?: string;
  "--celebration-color"?: string;
};

const CONFETTI = [
  ["5%", "0ms", "22px", "#f2c94c"],
  ["12%", "180ms", "-16px", "#fffdd0"],
  ["20%", "60ms", "34px", "#d95d39"],
  ["28%", "260ms", "-28px", "#f2c94c"],
  ["36%", "110ms", "18px", "#4f86c6"],
  ["44%", "310ms", "-18px", "#fffdd0"],
  ["52%", "40ms", "26px", "#d95d39"],
  ["60%", "220ms", "-32px", "#f2c94c"],
  ["68%", "130ms", "20px", "#4f86c6"],
  ["76%", "340ms", "-22px", "#fffdd0"],
  ["84%", "90ms", "30px", "#d95d39"],
  ["92%", "280ms", "-26px", "#f2c94c"],
] as const;

function formatPoints(points: number) {
  return Number.isInteger(points) ? String(points) : points.toFixed(1);
}

function portraitSize(position: number, variant: "feature" | "compact") {
  if (variant === "compact") return position === 1 ? 64 : 52;
  return position === 1 ? 92 : 72;
}

function PodiumPortrait({
  entry,
  position,
  variant,
}: {
  entry: VictoryPodiumEntry;
  position: number;
  variant: "feature" | "compact";
}) {
  const avatar = (
    <ClubMemberAvatar
      name={entry.name}
      photoUrl={entry.photoUrl}
      avatarId={entry.avatarId}
      size={portraitSize(position, variant)}
      className={styles.avatar}
      decorative={false}
    />
  );

  if (!entry.href) return avatar;

  return (
    <Link
      href={entry.href}
      aria-label={`Ver perfil de ${entry.name}`}
      className={styles.profileLink}
    >
      {avatar}
    </Link>
  );
}

export function VictoryPodium({
  entries,
  variant = "feature",
  celebrate = true,
  label = "Podio final",
}: VictoryPodiumProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [celebrationKey, setCelebrationKey] = useState(0);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.22 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const podium = [0, 1, 2].map((index) => entries[index]);

  return (
    <div
      ref={rootRef}
      className={`${styles.podium} ${styles[variant]} ${isVisible ? styles.active : ""}`}
      aria-label={label}
    >
      <div className={styles.checkerGlow} aria-hidden="true" />

      {celebrate && isVisible ? (
        <div
          className={styles.celebration}
          aria-hidden="true"
          key={celebrationKey}
        >
          <span className={`${styles.burst} ${styles.burstLeft}`} />
          <span className={`${styles.burst} ${styles.burstCenter}`} />
          <span className={`${styles.burst} ${styles.burstRight}`} />
          {CONFETTI.map(([left, delay, drift, color], index) => (
            <span
              className={styles.confetti}
              key={`${celebrationKey}-${index}`}
              style={
                {
                  "--left": left,
                  "--delay": delay,
                  "--drift": drift,
                  "--celebration-color": color,
                } as CelebrationStyle
              }
            />
          ))}
        </div>
      ) : null}

      <div className={styles.topline}>
        <span className={styles.victoryLabel}>
          <Sparkles aria-hidden="true" />
          {celebrate ? "Noche de campeones" : "Clasificación provisional"}
        </span>
        {celebrate ? (
          <button
            className={styles.replay}
            type="button"
            onClick={() => setCelebrationKey((current) => current + 1)}
          >
            <RotateCcw aria-hidden="true" />
            Repetir festejo
          </button>
        ) : null}
      </div>

      <div className={styles.columns}>
        {podium.map((entry, index) => {
          const position = index + 1;
          return (
            <article
              className={styles.place}
              data-position={position}
              key={entry?.playerId ?? `empty-${position}`}
              aria-label={
                entry ? `${position}.º lugar: ${entry.name}` : `${position}.º lugar`
              }
            >
              {entry ? (
                <div className={styles.competitor}>
                  <div className={styles.portraitWrap}>
                    {position === 1 ? (
                      <Crown className={styles.crown} aria-hidden="true" />
                    ) : (
                      <Medal className={styles.medal} aria-hidden="true" />
                    )}
                    <PodiumPortrait
                      entry={entry}
                      position={position}
                      variant={variant}
                    />
                    <span className={styles.positionBadge}>{position}</span>
                  </div>
                  <h3 className={styles.playerName}>{entry.name}</h3>
                  <p className={styles.playerScore}>
                    {formatPoints(entry.points)} pts
                    {entry.wins !== undefined ? ` · ${entry.wins} vict.` : ""}
                  </p>
                </div>
              ) : (
                <div className={styles.emptyPlace}>Por definir</div>
              )}
              <div className={styles.step} aria-hidden="true">
                <span>{position}</span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
