import { desc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { sxAuditEvent, sxClaimEvidence, sxClaimReviewDecision, sxProviderClaim } from "../drizzle/schema.js";
import type { ClaimRegistryStore } from "./claimRegistryService.js";
import { getSenseExperienceDb } from "./db.js";

function toClaim(row: typeof sxProviderClaim.$inferSelect) {
  return {
    id: row.id,
    interestId: row.interestId,
    type: row.type,
    statement: row.statement,
    state: row.state,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString()
  } as const;
}

function toEvidence(row: typeof sxClaimEvidence.$inferSelect) {
  return { id: row.id, claimId: row.claimId, kind: row.kind, reference: row.reference, summary: row.summary, createdAt: row.createdAt.toISOString() } as const;
}

function toDecision(row: typeof sxClaimReviewDecision.$inferSelect) {
  return { id: row.id, claimId: row.claimId, reviewerId: row.reviewerId, outcome: row.outcome, reason: row.reason, decidedAt: row.decidedAt.toISOString() } as const;
}

export function createMysqlClaimRegistryStore(): ClaimRegistryStore {
  return {
    async insertClaim(claim) {
      const db = getSenseExperienceDb();
      await db.transaction(async (transaction) => {
        await transaction.insert(sxProviderClaim).values({
          id: claim.id, interestId: claim.interestId, type: claim.type, statement: claim.statement, state: claim.state,
          createdAt: new Date(claim.createdAt), updatedAt: new Date(claim.updatedAt)
        });
        await transaction.insert(sxAuditEvent).values({ id: randomUUID(), eventType: "claim_submitted", interestId: claim.interestId, claimId: claim.id, actorId: null, occurredAt: new Date(claim.createdAt) });
      });
    },
    async findClaimById(id) {
      const db = getSenseExperienceDb();
      const [row] = await db.select().from(sxProviderClaim).where(eq(sxProviderClaim.id, id)).limit(1);
      return row ? toClaim(row) : undefined;
    },
    async listClaimsForInterest(interestId) {
      const db = getSenseExperienceDb();
      return (await db.select().from(sxProviderClaim).where(eq(sxProviderClaim.interestId, interestId)).orderBy(desc(sxProviderClaim.createdAt))).map(toClaim);
    },
    async listClaimsForReview() {
      const db = getSenseExperienceDb();
      return (await db.select().from(sxProviderClaim).orderBy(desc(sxProviderClaim.updatedAt))).map(toClaim);
    },
    async updateClaimState(claimId, state, updatedAt) {
      const db = getSenseExperienceDb();
      await db.update(sxProviderClaim).set({ state, updatedAt: new Date(updatedAt) }).where(eq(sxProviderClaim.id, claimId));
    },
    async insertEvidence(evidence) {
      const db = getSenseExperienceDb();
      const claim = await this.findClaimById(evidence.claimId);
      if (!claim) throw new Error("Claim not found for evidence audit.");
      await db.transaction(async (transaction) => {
        await transaction.insert(sxClaimEvidence).values({ id: evidence.id, claimId: evidence.claimId, kind: evidence.kind, reference: evidence.reference, summary: evidence.summary, createdAt: new Date(evidence.createdAt) });
        await transaction.insert(sxAuditEvent).values({ id: randomUUID(), eventType: "claim_evidence_added", interestId: claim.interestId, claimId: evidence.claimId, actorId: null, occurredAt: new Date(evidence.createdAt) });
      });
    },
    async listEvidence(claimId) {
      const db = getSenseExperienceDb();
      return (await db.select().from(sxClaimEvidence).where(eq(sxClaimEvidence.claimId, claimId)).orderBy(desc(sxClaimEvidence.createdAt))).map(toEvidence);
    },
    async insertDecision(decision) {
      const db = getSenseExperienceDb();
      const claim = await this.findClaimById(decision.claimId);
      if (!claim) throw new Error("Claim not found for decision audit.");
      await db.transaction(async (transaction) => {
        await transaction.insert(sxClaimReviewDecision).values({ id: decision.id, claimId: decision.claimId, reviewerId: decision.reviewerId, outcome: decision.outcome, reason: decision.reason, decidedAt: new Date(decision.decidedAt) });
        await transaction.insert(sxAuditEvent).values({ id: randomUUID(), eventType: "claim_decided", interestId: claim.interestId, claimId: claim.id, actorId: decision.reviewerId, occurredAt: new Date(decision.decidedAt) });
      });
    },
    async listDecisions(claimId) {
      const db = getSenseExperienceDb();
      return (await db.select().from(sxClaimReviewDecision).where(eq(sxClaimReviewDecision.claimId, claimId)).orderBy(desc(sxClaimReviewDecision.decidedAt))).map(toDecision);
    }
  };
}
