import { describe, expect, it } from "vitest";
import { addClaimEvidence, createMemoryClaimRegistryStore, decideProviderClaim, submitProviderClaim } from "../server/claimRegistryService.js";
import { createMemoryProviderInterestStore } from "../server/providerInterestService.js";

const interest = {
  id: "interest-1", reference: "SX-ABCDEFGHIJ", statusAccessHash: "", brandName: "Test", providerType: "guide" as const,
  area: "Area", contactName: "Private", contactChannel: "email@example.com", shortDescription: "A valid provider interest description.",
  reviewConsent: true as const, status: "invited_to_onboard" as const, createdAt: "2026-01-01T00:00:00.000Z"
};

describe("claim registry", () => {
  it("does not permit a claim without verified provider access", async () => {
    const interests = createMemoryProviderInterestStore([interest]);
    const claims = createMemoryClaimRegistryStore();
    await expect(submitProviderClaim(interests, claims, { reference: interest.reference, accessCode: "wrong", type: "accessibility", statement: "A claim with enough detail." })).rejects.toThrow("Provider access");
  });

  it("requires reviewer authority and a reason for a final claim decision", async () => {
    const claims = createMemoryClaimRegistryStore({ claims: [{ id: "claim-1", interestId: interest.id, type: "accessibility", statement: "Step-free entrance.", state: "needs_evidence", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" }] });
    await expect(decideProviderClaim(claims, { id: "viewer", role: "user" }, { claimId: "claim-1", outcome: "verified", reason: "Evidence reviewed." })).rejects.toThrow("Only a reviewer");
    await expect(decideProviderClaim(claims, { id: "reviewer", role: "reviewer" }, { claimId: "claim-1", outcome: "verified", reason: "short" })).rejects.toThrow("clear review reason");
  });

  it("keeps evidence private and only moves a claim to verified through a reviewer decision", async () => {
    const claims = createMemoryClaimRegistryStore({ claims: [{ id: "claim-1", interestId: interest.id, type: "accessibility", statement: "Step-free entrance.", state: "needs_evidence", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" }] });
    const decision = await decideProviderClaim(claims, { id: "reviewer", role: "reviewer" }, { claimId: "claim-1", outcome: "verified", reason: "Reviewed against current evidence." });
    expect(decision.outcome).toBe("verified");
    expect((await claims.findClaimById("claim-1"))?.state).toBe("verified");
  });
});
