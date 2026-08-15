import type { InterestReviewDecision, ProviderApplication, ProviderClaim, ProviderInterest, ReviewDecision, ReviewerActor } from "./contracts.js";

export function assertReviewer(actor: ReviewerActor): void {
  if (actor.role !== "reviewer" && actor.role !== "administrator") {
    throw new Error("Only a reviewer or administrator can decide an application.");
  }
}

export function verifyClaim(application: ProviderApplication, actor: ReviewerActor, claimIndex: number): ProviderApplication {
  assertReviewer(actor);
  if (application.status !== "submitted") throw new Error("Claims can only be verified while an application is submitted.");
  const claim = application.claims[claimIndex];
  if (!claim) throw new Error("Claim not found.");

  const claims: ProviderClaim[] = application.claims.map((item, index) =>
    index === claimIndex ? { ...item, verificationStatus: "verified" } : item
  );
  return { ...application, claims };
}

export function recordInterestReview(
  interest: ProviderInterest,
  actor: ReviewerActor,
  outcome: InterestReviewDecision["outcome"],
  reason: string,
  now = new Date()
): { interest: ProviderInterest; decision: InterestReviewDecision } {
  assertReviewer(actor);
  if (interest.status !== "interest_submitted") throw new Error("Only submitted interest can receive a review decision.");
  if (reason.trim().length < 8) throw new Error("A clear interest-review reason is required.");

  return {
    interest: {
      ...interest,
      status: outcome,
      reviewDecision: {
        reviewerId: actor.id,
        outcome,
        reason: reason.trim(),
        decidedAt: now.toISOString()
      }
    },
    decision: {
      reviewerId: actor.id,
      outcome,
      reason: reason.trim(),
      decidedAt: now.toISOString()
    }
  };
}

export function recordReviewDecision(
  application: ProviderApplication,
  actor: ReviewerActor,
  outcome: ReviewDecision["outcome"],
  reason: string,
  now = new Date()
): { application: ProviderApplication; decision: ReviewDecision } {
  assertReviewer(actor);
  if (application.status !== "submitted") throw new Error("Only submitted applications can receive a review decision.");
  if (reason.trim().length < 8) throw new Error("A clear review reason is required.");
  if (outcome === "approved" && !application.consents.publicListing) {
    throw new Error("Public-listing consent is required before approval.");
  }

  return {
    application: { ...application, status: outcome },
    decision: {
      reviewerId: actor.id,
      outcome,
      reason: reason.trim(),
      decidedAt: now.toISOString()
    }
  };
}
