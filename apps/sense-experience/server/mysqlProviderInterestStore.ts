import { desc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { sxAuditEvent, sxInterestReviewDecision, sxProviderInterest } from "../drizzle/schema.js";
import type { ProviderInterest } from "../src/onboarding/contracts.js";
import type { ProviderInterestStore } from "./providerInterestService.js";
import { getSenseExperienceDb } from "./db.js";

function toInterest(row: typeof sxProviderInterest.$inferSelect, decision?: typeof sxInterestReviewDecision.$inferSelect): ProviderInterest {
  return {
    id: row.id,
    reference: row.publicReference,
    statusAccessHash: row.statusAccessHash,
    brandName: row.brandName,
    providerType: row.providerType as ProviderInterest["providerType"],
    area: row.area,
    contactName: row.contactName,
    contactChannel: row.contactChannel,
    shortDescription: row.shortDescription,
    reviewConsent: true as const,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    reviewDecision: decision ? {
      reviewerId: decision.reviewerId,
      outcome: decision.outcome,
      reason: decision.reason,
      decidedAt: decision.decidedAt.toISOString()
    } : undefined
  };
}

export function createMysqlProviderInterestStore(): ProviderInterestStore {
  return {
    async listForReview() {
      const db = getSenseExperienceDb();
      const rows = await db.select().from(sxProviderInterest).orderBy(desc(sxProviderInterest.createdAt));
      const decisions = await db.select().from(sxInterestReviewDecision);
      const byInterestId = new Map(decisions.map((decision) => [decision.interestId, decision]));
      return rows.map((row) => toInterest(row, byInterestId.get(row.id)));
    },
    async findById(id) {
      const db = getSenseExperienceDb();
      const [row] = await db.select().from(sxProviderInterest).where(eq(sxProviderInterest.id, id)).limit(1);
      if (!row) return undefined;
      const [decision] = await db.select().from(sxInterestReviewDecision).where(eq(sxInterestReviewDecision.interestId, id)).limit(1);
      return toInterest(row, decision);
    },
    async findByReference(reference) {
      const db = getSenseExperienceDb();
      const [row] = await db.select().from(sxProviderInterest).where(eq(sxProviderInterest.publicReference, reference)).limit(1);
      if (!row) return undefined;
      const [decision] = await db.select().from(sxInterestReviewDecision).where(eq(sxInterestReviewDecision.interestId, row.id)).limit(1);
      return toInterest(row, decision);
    },
    async insert(interest) {
      const db = getSenseExperienceDb();
      await db.transaction(async (transaction) => {
        await transaction.insert(sxProviderInterest).values({
          id: interest.id,
          publicReference: interest.reference,
          statusAccessHash: interest.statusAccessHash,
          brandName: interest.brandName,
          providerType: interest.providerType,
          area: interest.area,
          contactName: interest.contactName,
          contactChannel: interest.contactChannel,
          shortDescription: interest.shortDescription,
          reviewConsent: "granted",
          status: interest.status,
          createdAt: new Date(interest.createdAt),
          updatedAt: new Date(interest.createdAt)
        });
        await transaction.insert(sxAuditEvent).values({
          id: randomUUID(),
          eventType: "interest_submitted",
          interestId: interest.id,
          actorId: null,
          occurredAt: new Date(interest.createdAt)
        });
      });
    },
    async replace(interest) {
      const db = getSenseExperienceDb();
      if (!interest.reviewDecision) throw new Error("A persisted interest decision is required for replacement.");
      await db.transaction(async (transaction) => {
        await transaction.update(sxProviderInterest).set({ status: interest.status, updatedAt: new Date(interest.reviewDecision!.decidedAt) }).where(eq(sxProviderInterest.id, interest.id));
        await transaction.insert(sxInterestReviewDecision).values({
          id: randomUUID(),
          interestId: interest.id,
          reviewerId: interest.reviewDecision!.reviewerId,
          outcome: interest.reviewDecision!.outcome,
          reason: interest.reviewDecision!.reason,
          decidedAt: new Date(interest.reviewDecision!.decidedAt)
        });
        await transaction.insert(sxAuditEvent).values({
          id: randomUUID(),
          eventType: "interest_decided",
          interestId: interest.id,
          actorId: interest.reviewDecision!.reviewerId,
          occurredAt: new Date(interest.reviewDecision!.decidedAt)
        });
      });
    }
  };
}
