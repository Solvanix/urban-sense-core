import { z } from "zod";
import type { ProviderClaim } from "./contracts.js";

export const accessNeedTypes = ["step_free", "seating", "quiet_space", "easy_read", "support_person"] as const;

export const experienceDraftSchema = z.object({
  title: z.string().trim().min(4).max(120),
  category: z.string().trim().min(2).max(80),
  publicArea: z.string().trim().min(2).max(120),
  guestGoal: z.string().trim().min(12).max(300),
  stages: z.array(z.string().trim().min(4).max(220)).min(3).max(5),
  accessNeeds: z.array(z.enum(accessNeedTypes)).max(accessNeedTypes.length),
  accessOperationalNote: z.string().trim().max(500),
  privateOperationalNotes: z.string().trim().max(1200),
  publicListingConsent: z.boolean()
});

export type ExperienceDraft = z.infer<typeof experienceDraftSchema>;

export type VisitorExperienceCard = Pick<ExperienceDraft, "title" | "category" | "publicArea" | "guestGoal" | "stages"> & {
  verifiedAccessibilityClaims: ProviderClaim[];
};

export function createExperienceDraft(input: ExperienceDraft): ExperienceDraft {
  return experienceDraftSchema.parse(input);
}

export function projectVisitorExperienceCard(draft: ExperienceDraft, claims: ProviderClaim[]): VisitorExperienceCard {
  const parsed = experienceDraftSchema.parse(draft);
  if (!parsed.publicListingConsent) throw new Error("Public-listing consent is required before creating a visitor card.");
  return {
    title: parsed.title,
    category: parsed.category,
    publicArea: parsed.publicArea,
    guestGoal: parsed.guestGoal,
    stages: parsed.stages,
    verifiedAccessibilityClaims: claims.filter((claim) => claim.type === "accessibility" && claim.verificationStatus === "verified")
  };
}
