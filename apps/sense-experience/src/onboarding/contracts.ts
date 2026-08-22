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
export const interestStatuses = ["interest_submitted", "invited_to_onboard", "not_in_current_pilot"] as const;

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

export type ReviewerActor = {
  id: string;
  role: string;
};

export type ReviewDecision = {
  reviewerId: string;
  outcome: "needs_completion" | "approved" | "rejected";
  reason: string;
  decidedAt: string;
};

export const providerInterestInputSchema = z.object({
  brandName: z.string().trim().min(2).max(120),
  providerType: z.enum(providerTypes),
  area: z.string().trim().min(2).max(120),
  contactName: z.string().trim().min(2).max(120),
  contactChannel: z.string().trim().min(3).max(160),
  shortDescription: z.string().trim().min(20).max(600),
  reviewConsent: z.literal(true)
});

export type ProviderInterestInput = z.infer<typeof providerInterestInputSchema>;

export type InterestReviewDecision = {
  reviewerId: string;
  outcome: "invited_to_onboard" | "not_in_current_pilot";
  reason: string;
  decidedAt: string;
};

export type ProviderInterest = ProviderInterestInput & {
  id: string;
  reference: string;
  statusAccessHash: string;
  status: (typeof interestStatuses)[number];
  createdAt: string;
  reviewDecision?: InterestReviewDecision;
};

export const providerInterestStatusLookupSchema = z.object({
  reference: z.string().trim().regex(/^SX-[A-Z0-9]{10}$/),
  accessCode: z.string().trim().regex(/^[A-Za-z0-9_-]{20,128}$/)
});

export type ProviderInterestStatusLookup = z.infer<typeof providerInterestStatusLookupSchema>;

export type ProviderInterestSubmissionReceipt = {
  reference: string;
  accessCode: string;
  status: (typeof interestStatuses)[number];
  createdAt: string;
};

export type ProviderInterestStatusView = {
  reference: string;
  status: (typeof interestStatuses)[number];
  createdAt: string;
  decision?: Pick<InterestReviewDecision, "outcome" | "reason" | "decidedAt">;
};
