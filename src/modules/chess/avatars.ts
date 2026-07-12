export const CLUB_AVATARS = [
  { id: "chessitos-m01", label: "Avatar 01", group: "masculino", stage: "Niñez" },
  { id: "chessitos-m02", label: "Avatar 02", group: "masculino", stage: "Niñez" },
  { id: "chessitos-m03", label: "Avatar 03", group: "masculino", stage: "Niñez" },
  { id: "chessitos-m04", label: "Avatar 04", group: "masculino", stage: "Adolescencia" },
  { id: "chessitos-m05", label: "Avatar 05", group: "masculino", stage: "Adolescencia" },
  { id: "chessitos-m06", label: "Avatar 06", group: "masculino", stage: "Adolescencia" },
  { id: "chessitos-m07", label: "Avatar 07", group: "masculino", stage: "Adolescencia" },
  { id: "chessitos-m08", label: "Avatar 08", group: "masculino", stage: "Juventud" },
  { id: "chessitos-m09", label: "Avatar 09", group: "masculino", stage: "Juventud" },
  { id: "chessitos-m10", label: "Avatar 10", group: "masculino", stage: "Adultez" },
  { id: "chessitos-m11", label: "Avatar 11", group: "masculino", stage: "Adultez" },
  { id: "chessitos-m12", label: "Avatar 12", group: "masculino", stage: "Adultez" },
  { id: "chessitos-m13", label: "Avatar 13", group: "masculino", stage: "Adultez" },
  { id: "chessitos-f01", label: "Avatar 14", group: "femenino", stage: "Niñez y adolescencia" },
  { id: "chessitos-f02", label: "Avatar 15", group: "femenino", stage: "Juventud y adultez" },
] as const;

export type ClubAvatarId = (typeof CLUB_AVATARS)[number]["id"];

export const CLUB_AVATAR_IDS = CLUB_AVATARS.map(
  (avatar) => avatar.id,
) as [ClubAvatarId, ...ClubAvatarId[]];

export function isClubAvatarId(value: unknown): value is ClubAvatarId {
  return (
    typeof value === "string" &&
    CLUB_AVATAR_IDS.includes(value as ClubAvatarId)
  );
}

export function clubAvatarPath(id?: string) {
  return isClubAvatarId(id)
    ? `/images/chessitos/avatars/${id}.webp`
    : undefined;
}

