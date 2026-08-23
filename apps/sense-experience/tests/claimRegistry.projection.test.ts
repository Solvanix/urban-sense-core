import { describe, expect, it } from "vitest";
import { projectPublicVerifiedClaim, type ClaimEvidence, type ClaimReviewDecision, type ProviderClaimRecord } from "../src/onboarding/claimRegistry.js";

const claim: ProviderClaimRecord = {
  id: "claim-1", interestId: "interest-1", type: "accessibility", statement: "يوجد مسار بلا درجات عند المدخل الرئيسي.",
  state: "verified", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-02T00:00:00.000Z"
};

const decision: ClaimReviewDecision = {
  id: "decision-1", claimId: claim.id, reviewerId: "reviewer-private-id", outcome: "verified", reason: "راجع المراجع الدليل الداخلي بعناية.", decidedAt: "2026-01-02T00:00:00.000Z"
};

const privateEvidence: ClaimEvidence = {
  id: "evidence-1", claimId: claim.id, kind: "document_reference", reference: "private-file-reference", summary: "ملخص خاص للمراجع.", createdAt: "2026-01-01T00:00:00.000Z"
};

describe("public claim projection", () => {
  it("does not publish a verified claim without public-listing consent", () => {
    expect(projectPublicVerifiedClaim(claim, [decision], false)).toBeUndefined();
  });

  it("uses a strict public whitelist that excludes evidence and reviewer fields", () => {
    const projection = projectPublicVerifiedClaim(claim, [decision], true);
    expect(projection).toEqual({ type: "accessibility", value: claim.statement, verificationStatus: "verified" });
    expect(JSON.stringify(projection)).not.toContain(privateEvidence.reference);
    expect(JSON.stringify(projection)).not.toContain(decision.reviewerId);
    expect(JSON.stringify(projection)).not.toContain(decision.reason);
  });
});
