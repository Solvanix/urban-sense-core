import { randomUUID } from "node:crypto";
import type { ProviderInterestStatusLookup, ReviewerActor } from "../src/onboarding/contracts.js";
import {
  claimDecisionOutcomes,
  claimStates,
  claimTypes,
  evidenceKinds,
  type ClaimEvidence,
  type ClaimReviewDecision,
  type ProviderClaimRecord
} from "../src/onboarding/claimRegistry.js";
import { assertReviewer } from "../src/onboarding/review.js";
import { findProviderInterestWithAccess, type ProviderInterestStore } from "./providerInterestService.js";

export type ClaimSubmissionInput = ProviderInterestStatusLookup & {
  type: (typeof claimTypes)[number];
  statement: string;
};

export type ClaimEvidenceInput = ProviderInterestStatusLookup & {
  claimId: string;
  kind: (typeof evidenceKinds)[number];
  evidenceReference: string;
  summary: string;
};

export type ClaimDecisionInput = {
  claimId: string;
  outcome: (typeof claimDecisionOutcomes)[number];
  reason: string;
};

export interface ClaimRegistryStore {
  insertClaim(claim: ProviderClaimRecord): Promise<void>;
  findClaimById(id: string): Promise<ProviderClaimRecord | undefined>;
  listClaimsForInterest(interestId: string): Promise<ProviderClaimRecord[]>;
  listClaimsForReview(): Promise<ProviderClaimRecord[]>;
  updateClaimState(claimId: string, state: ProviderClaimRecord["state"], updatedAt: string): Promise<void>;
  insertEvidence(evidence: ClaimEvidence): Promise<void>;
  listEvidence(claimId: string): Promise<ClaimEvidence[]>;
  insertDecision(decision: ClaimReviewDecision): Promise<void>;
  listDecisions(claimId: string): Promise<ClaimReviewDecision[]>;
}

function assertInvited(status: string) {
  if (status !== "invited_to_onboard") throw new Error("Only invited providers can submit claims.");
}

export async function submitProviderClaim(interestStore: ProviderInterestStore, claimStore: ClaimRegistryStore, input: ClaimSubmissionInput, now = new Date()) {
  const interest = await findProviderInterestWithAccess(interestStore, input);
  if (!interest) throw new Error("Provider access could not be verified.");
  assertInvited(interest.status);

  const claim: ProviderClaimRecord = {
    id: randomUUID(),
    interestId: interest.id,
    type: input.type,
    statement: input.statement.trim(),
    state: "provider_stated",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  };
  await claimStore.insertClaim(claim);
  return claim;
}

export async function addClaimEvidence(interestStore: ProviderInterestStore, claimStore: ClaimRegistryStore, input: ClaimEvidenceInput, now = new Date()) {
  const interest = await findProviderInterestWithAccess(interestStore, input);
  if (!interest) throw new Error("Provider access could not be verified.");
  const claim = await claimStore.findClaimById(input.claimId);
  if (!claim || claim.interestId !== interest.id) throw new Error("Claim was not found for this provider.");
  if (claim.state === "verified" || claim.state === "rejected") throw new Error("Evidence cannot be added after a final decision.");

  const evidence: ClaimEvidence = {
    id: randomUUID(),
    claimId: claim.id,
    kind: input.kind,
    reference: input.evidenceReference.trim(),
    summary: input.summary.trim(),
    createdAt: now.toISOString()
  };
  await claimStore.insertEvidence(evidence);
  await claimStore.updateClaimState(claim.id, "needs_evidence", now.toISOString());
  return evidence;
}

export async function decideProviderClaim(claimStore: ClaimRegistryStore, actor: ReviewerActor, input: ClaimDecisionInput, now = new Date()) {
  assertReviewer(actor);
  const claim = await claimStore.findClaimById(input.claimId);
  if (!claim) throw new Error("Claim not found.");
  if (claim.state === "verified" || claim.state === "rejected") throw new Error("Claim already has a final decision.");
  if (input.reason.trim().length < 8) throw new Error("A clear review reason is required.");

  const decision: ClaimReviewDecision = {
    id: randomUUID(),
    claimId: claim.id,
    reviewerId: actor.id,
    outcome: input.outcome,
    reason: input.reason.trim(),
    decidedAt: now.toISOString()
  };
  await claimStore.insertDecision(decision);
  await claimStore.updateClaimState(claim.id, input.outcome === "verified" ? "verified" : input.outcome, now.toISOString());
  return decision;
}

export function createMemoryClaimRegistryStore(initial?: { claims?: ProviderClaimRecord[]; evidence?: ClaimEvidence[]; decisions?: ClaimReviewDecision[] }): ClaimRegistryStore {
  let claims = [...(initial?.claims ?? [])];
  let evidence = [...(initial?.evidence ?? [])];
  let decisions = [...(initial?.decisions ?? [])];
  return {
    async insertClaim(claim) { claims = [...claims, { ...claim }]; },
    async findClaimById(id) { const claim = claims.find((item) => item.id === id); return claim ? { ...claim } : undefined; },
    async listClaimsForInterest(interestId) { return claims.filter((item) => item.interestId === interestId).map((item) => ({ ...item })); },
    async listClaimsForReview() { return claims.map((item) => ({ ...item })); },
    async updateClaimState(claimId, state, updatedAt) { claims = claims.map((item) => item.id === claimId ? { ...item, state, updatedAt } : item); },
    async insertEvidence(item) { evidence = [...evidence, { ...item }]; },
    async listEvidence(claimId) { return evidence.filter((item) => item.claimId === claimId).map((item) => ({ ...item })); },
    async insertDecision(decision) { decisions = [...decisions, { ...decision }]; },
    async listDecisions(claimId) { return decisions.filter((item) => item.claimId === claimId).map((item) => ({ ...item })); }
  };
}
