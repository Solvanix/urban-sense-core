import { z } from "zod";

export const providerTypes = [
  "restaurant",
  "accommodation",
  "guide",
  "cultural_center",
  "artisan",
  "activity_operator",
  "institution"
] as const;

export const reviewStatuses = ["draft", "submitted", "needs_completion", "approved", "rejected"] as const;
export const verificationStatuses = ["provider_stated", "verified", "needs_verification"] as const;
export const consentKinds = ["data_processing", "human_review", "public_listing"] as const;

export const providerApplicationInputSchema = z.object({
  providerType: z.enum(providerTypes),
  brandName: z.string().trim().min(2).max(120),
  area: z.string().trim().min(2).max(120),
  privateContact: z.object({
    contactName: z.string().trim().min(2).max(120),
    preferredChannel: z.enum(["email", "phone", "whatsapp"]),
    contactValue: z.string().trim().min(3).max(160)
  }),
  consents: z.object({
    dataProcessing: z.literal(true),
    humanReview: z.literal(true),
    publicListing: z.boolean()
  }),
  firstOffer: z.object({
    category: z.string().trim().min(2).max(80),
    guestJourney: z.string().trim().min(20).max(1800),
    languages: z.array(z.enum(["ar", "en"])).min(1).max(2),
    inquiryMethod: z.enum(["contact_request", "website", "booking_link"]),
    availabilityNote: z.string().trim().max(300).optional()
  })
});

export type ProviderApplicationInput = z.infer<typeof providerApplicationInputSchema>;

export type ProviderClaim = {
  type: "accessibility" | "safety" | "availability" | "sustainability" | "price" | "certification";
  value: string;
  verificationStatus: (typeof verificationStatuses)[number];
};

export type ProviderApplication = ProviderApplicationInput & {
  id: string;
  status: (typeof reviewStatuses)[number];
  createdAt: string;
  claims: ProviderClaim[];
};

export type PublicProviderProfile = {
  id: string;
  brandName: string;
  providerType: (typeof providerTypes)[number];
  area: string;
  firstOffer: Pick<ProviderApplicationInput["firstOffer"], "category" | "guestJourney" | "languages" | "inquiryMethod" | "availabilityNote">;
  verifiedClaims: ProviderClaim[];
};
