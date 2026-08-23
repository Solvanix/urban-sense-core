export const claimTypes = ["accessibility", "safety", "availability", "sustainability", "certification", "membership"] as const;
export const claimStates = ["provider_stated", "needs_evidence", "verified", "rejected"] as const;
export const evidenceKinds = ["provider_note", "external_url", "document_reference"] as const;
export const claimDecisionOutcomes = ["needs_evidence", "verified", "rejected"] as const;

export type ClaimType = (typeof claimTypes)[number];
export type ClaimState = (typeof claimStates)[number];
export type EvidenceKind = (typeof evidenceKinds)[number];
export type ClaimDecisionOutcome = (typeof claimDecisionOutcomes)[number];

export type ProviderClaimRecord = {
  id: string;
  interestId: string;
  type: ClaimType;
  statement: string;
  state: ClaimState;
  createdAt: string;
  updatedAt: string;
};

export type ClaimEvidence = {
  id: string;
  claimId: string;
  kind: EvidenceKind;
  reference: string;
  summary: string;
  createdAt: string;
};

export type ClaimReviewDecision = {
  id: string;
  claimId: string;
  reviewerId: string;
  outcome: ClaimDecisionOutcome;
  reason: string;
  decidedAt: string;
};

export function projectPublicVerifiedClaim(claim: ProviderClaimRecord, decisions: ClaimReviewDecision[], publicListingConsent: boolean) {
  if (!publicListingConsent) return undefined;
  const latest = [...decisions].sort((a, b) => b.decidedAt.localeCompare(a.decidedAt))[0];
  if (claim.state !== "verified" || latest?.outcome !== "verified") return undefined;
  return { type: claim.type, value: claim.statement, verificationStatus: "verified" as const };
}
