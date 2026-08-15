import { randomUUID } from "node:crypto";
import {
  type ProviderApplication,
  type ProviderApplicationInput,
  type ProviderClaim,
  type PublicProviderProfile,
  providerApplicationInputSchema
} from "./contracts.js";

export function createProviderApplication(input: ProviderApplicationInput, now = new Date()): ProviderApplication {
  const parsed = providerApplicationInputSchema.parse(input);

  return {
    ...parsed,
    id: randomUUID(),
    status: "submitted",
    createdAt: now.toISOString(),
    claims: []
  };
}

export function addClaim(application: ProviderApplication, claim: Omit<ProviderClaim, "verificationStatus">): ProviderApplication {
  return {
    ...application,
    claims: [...application.claims, { ...claim, verificationStatus: "provider_stated" }]
  };
}

export function requestCompletion(application: ProviderApplication): ProviderApplication {
  if (application.status !== "submitted") throw new Error("Only submitted applications can request completion.");
  return { ...application, status: "needs_completion" };
}

export function approveForPublication(application: ProviderApplication): ProviderApplication {
  if (!application.consents.publicListing) throw new Error("Public-listing consent is required before approval.");
  if (application.status !== "submitted") throw new Error("Only submitted applications can be approved.");
  return { ...application, status: "approved" };
}

export function toPublicProfile(application: ProviderApplication): PublicProviderProfile {
  if (application.status !== "approved") throw new Error("Only approved applications can become public profiles.");
  if (!application.consents.publicListing) throw new Error("Public-listing consent is required.");

  return {
    id: application.id,
    brandName: application.brandName,
    providerType: application.providerType,
    area: application.area,
    firstOffer: application.firstOffer,
    verifiedClaims: application.claims.filter((claim) => claim.verificationStatus === "verified")
  };
}
