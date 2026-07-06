import type { ChessPlayer, ChessTournament, TournamentSexCategory } from "./types";

/**
 * Helpers de categorías de torneo (edad + sexo). Puros y sin estado, usados
 * tanto en el admin (avisos al inscribir) como en el público (badges del evento).
 *
 * Cada categoría es un torneo independiente; estos helpers solo describen y
 * validan de forma SUAVE (no bloquean) a partir de los metadatos del blob.
 */

export const SEX_CATEGORY_LABELS: Record<TournamentSexCategory, string> = {
  open: "Abierta",
  female: "Femenina",
  male: "Masculina",
};

/** Etiqueta legible de la categoría por sexo. Ausente = "Abierta". */
export function describeSexCategory(
  sexCategory?: TournamentSexCategory,
): string {
  return SEX_CATEGORY_LABELS[sexCategory ?? "open"];
}

/**
 * Rango de edad legible: "Sub-12" (solo ageMax), "35+" (solo ageMin),
 * "12–14 años" (ambos), "Libre" (ninguno).
 */
export function formatAgeRange(
  t: Pick<ChessTournament, "ageMin" | "ageMax">,
): string {
  const { ageMin, ageMax } = t;
  if (ageMin != null && ageMax != null) return `${ageMin}–${ageMax} años`;
  if (ageMax != null) return `Sub-${ageMax}`;
  if (ageMin != null) return `${ageMin}+`;
  return "Libre";
}

/** ¿El torneo tiene alguna restricción de categoría (edad o sexo)? */
export function hasCategoryConstraints(
  t: Pick<ChessTournament, "ageMin" | "ageMax" | "sexCategory">,
): boolean {
  return (
    t.ageMin != null ||
    t.ageMax != null ||
    (t.sexCategory != null && t.sexCategory !== "open")
  );
}

/** Nombre visible de la categoría: usa categoryLabel o cae al título del torneo. */
export function categoryDisplayName(
  t: Pick<ChessTournament, "categoryLabel" | "title">,
): string {
  return t.categoryLabel?.trim() || t.title;
}

/**
 * Edad en años a la fecha de referencia. birthDate y reference en YYYY-MM-DD
 * (reference también acepta Date). Devuelve null si la fecha no es válida.
 */
export function computeAge(
  birthDate?: string,
  reference?: string | Date,
): number | null {
  if (!birthDate) return null;
  const birth = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return null;

  const ref =
    reference == null
      ? new Date()
      : reference instanceof Date
        ? reference
        : new Date(
            /\d{4}-\d{2}-\d{2}/.test(reference)
              ? `${reference.slice(0, 10)}T00:00:00`
              : reference,
          );
  if (Number.isNaN(ref.getTime())) return null;

  let age = ref.getFullYear() - birth.getFullYear();
  const monthDiff = ref.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && ref.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}

/**
 * Avisos SUAVES (no bloquean) al inscribir un jugador en una categoría:
 * edad fuera de rango o sexo que no coincide con la categoría. La edad se
 * calcula respecto a la fecha de inicio del torneo (fallback: hoy).
 */
export function checkPlayerCategory(
  player: Pick<ChessPlayer, "name" | "sex" | "birthDate">,
  tournament: Pick<
    ChessTournament,
    "ageMin" | "ageMax" | "sexCategory" | "startsAt"
  >,
): string[] {
  const warnings: string[] = [];
  const { ageMin, ageMax, sexCategory } = tournament;

  if (ageMin != null || ageMax != null) {
    const age = computeAge(player.birthDate, tournament.startsAt);
    if (age == null) {
      warnings.push("Sin fecha de nacimiento: no se puede verificar la edad.");
    } else if (ageMax != null && age > ageMax) {
      warnings.push(`Tiene ${age} años: supera el máximo de la categoría (${ageMax}).`);
    } else if (ageMin != null && age < ageMin) {
      warnings.push(`Tiene ${age} años: por debajo del mínimo de la categoría (${ageMin}).`);
    }
  }

  if (sexCategory === "female" && player.sex !== "F") {
    warnings.push("La categoría es femenina y el jugador no está marcado como F.");
  } else if (sexCategory === "male" && player.sex !== "M") {
    warnings.push("La categoría es masculina y el jugador no está marcado como M.");
  }

  return warnings;
}

/**
 * IDs de torneos vinculados a un evento, en orden. Usa `linkedTournamentIds`
 * si tiene elementos; si no, cae al `linkedTournamentId` único (compatibilidad
 * con eventos creados antes de soportar múltiples categorías).
 */
export function getEventTournamentIds(event: {
  linkedTournamentId?: string | null;
  linkedTournamentIds?: string[] | null;
}): string[] {
  const many = (event.linkedTournamentIds ?? []).filter(Boolean);
  if (many.length > 0) return many;
  return event.linkedTournamentId ? [event.linkedTournamentId] : [];
}
