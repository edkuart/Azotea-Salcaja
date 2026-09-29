import { z } from "zod";

import { CLUB_AVATAR_IDS } from "./avatars";

const optionalText = (max: number) =>
  z
    .union([z.string().trim().max(max), z.null()])
    .transform((value) => value || undefined)
    .optional();

export const clubPlayerInputSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(120),
  rating: z.number().int().min(100).max(3000).optional(),
  fideId: optionalText(40),
  title: optionalText(20),
  sex: z.enum(["M", "F"]).optional(),
  birthDate: optionalText(10),
  photoUrl: optionalText(1000),
  avatarId: z.enum(CLUB_AVATAR_IDS).nullable().optional(),
  notes: optionalText(1000),
  isActive: z.boolean().optional(),
  publicName: optionalText(120),
  memberSince: optionalText(10),
  clubCategory: optionalText(60),
  profileVisibility: z.enum(["private", "initials", "public"]).optional(),
  showPhoto: z.boolean().optional(),
  showAgeBand: z.boolean().optional(),
  showStats: z.boolean().optional(),
  allowSharing: z.boolean().optional(),
  consentRecordedAt: optionalText(10),
});

export const clubPlayerUpdateSchema = clubPlayerInputSchema.partial();
