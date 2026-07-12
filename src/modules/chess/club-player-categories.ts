export const LEGACY_MEMBER_SINCE = "2026-07-06";

export const CLUB_AGE_CATEGORIES = [
  "Sub 10",
  "Sub 12",
  "Sub 14",
  "Sub 16",
  "Sub 18",
  "Libre",
] as const;

export type ClubAgeCategory = (typeof CLUB_AGE_CATEGORIES)[number];

export function localDateInputValue(date = new Date()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function ageFromBirthDate(
  birthDate?: string,
  referenceDate = new Date(),
): number | null {
  if (!birthDate) return null;
  const birth = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return null;
  let age = referenceDate.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    referenceDate.getMonth() < birth.getMonth() ||
    (referenceDate.getMonth() === birth.getMonth() &&
      referenceDate.getDate() < birth.getDate());
  if (beforeBirthday) age -= 1;
  return age >= 0 ? age : null;
}

export function clubCategoryFromBirthDate(
  birthDate?: string,
  referenceDate = new Date(),
): ClubAgeCategory {
  const age = ageFromBirthDate(birthDate, referenceDate);
  if (age === null) return "Libre";
  if (age <= 10) return "Sub 10";
  if (age <= 12) return "Sub 12";
  if (age <= 14) return "Sub 14";
  if (age <= 16) return "Sub 16";
  if (age <= 18) return "Sub 18";
  return "Libre";
}
