import { and, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { sxAuditEvent, sxReviewerIdentity, sxReviewerRoleAssignment } from "../drizzle/schema.js";
import type { ReviewerIdentityStore, ReviewerRoleAssignmentInput, ReviewerRoleAssignmentResult, StoredReviewerIdentity, StoredReviewerRoleAssignment, ValidatedReviewerSubject } from "./reviewerIdentityService.js";
import { getSenseExperienceDb } from "./db.js";

export function createMysqlReviewerIdentityStore(): ReviewerIdentityStore {
  return {
    async findIdentity(subject: ValidatedReviewerSubject): Promise<StoredReviewerIdentity | undefined> {
      const db = getSenseExperienceDb();
      const [identity] = await db.select().from(sxReviewerIdentity)
        .where(and(eq(sxReviewerIdentity.provider, subject.provider), eq(sxReviewerIdentity.subject, subject.subject)))
        .limit(1);
      return identity ? {
        id: identity.id,
        provider: identity.provider,
        subject: identity.subject,
        state: identity.state
      } : undefined;
    },
    async findActiveRole(identityId: string): Promise<StoredReviewerRoleAssignment | undefined> {
      const db = getSenseExperienceDb();
      const [assignment] = await db.select().from(sxReviewerRoleAssignment)
        .where(and(eq(sxReviewerRoleAssignment.reviewerIdentityId, identityId), eq(sxReviewerRoleAssignment.state, "active")))
        .limit(1);
      return assignment ? {
        reviewerIdentityId: assignment.reviewerIdentityId,
        role: assignment.role,
        state: assignment.state
      } : undefined;
    },
    async hasActiveReviewer(): Promise<boolean> {
      const db = getSenseExperienceDb();
      const [record] = await db.select({ identityId: sxReviewerIdentity.id })
        .from(sxReviewerIdentity)
        .innerJoin(sxReviewerRoleAssignment, eq(sxReviewerRoleAssignment.reviewerIdentityId, sxReviewerIdentity.id))
        .where(and(eq(sxReviewerIdentity.state, "active"), eq(sxReviewerRoleAssignment.state, "active")))
        .limit(1);
      return Boolean(record);
    },
    async assignActiveRole(input: ReviewerRoleAssignmentInput): Promise<ReviewerRoleAssignmentResult> {
      const db = getSenseExperienceDb();
      return db.transaction(async (transaction) => {
        const [found] = await transaction.select().from(sxReviewerIdentity)
          .where(and(eq(sxReviewerIdentity.provider, input.provider), eq(sxReviewerIdentity.subject, input.subject)))
          .limit(1);
        if (found?.state === "revoked") throw new Error("Reviewer identity is revoked.");
        const identityId = found?.id ?? randomUUID();
        const assignedAt = new Date(input.assignedAt);
        if (!found) {
          await transaction.insert(sxReviewerIdentity).values({
            id: identityId,
            provider: input.provider,
            subject: input.subject,
            displayName: input.displayName?.trim() || null,
            state: "active",
            createdAt: assignedAt,
            updatedAt: assignedAt
          });
        }
        const [existingAssignment] = await transaction.select({ id: sxReviewerRoleAssignment.id }).from(sxReviewerRoleAssignment)
          .where(and(eq(sxReviewerRoleAssignment.reviewerIdentityId, identityId), eq(sxReviewerRoleAssignment.state, "active")))
          .limit(1);
        if (existingAssignment) throw new Error("Reviewer identity already has an active role.");
        await transaction.insert(sxReviewerRoleAssignment).values({
          id: randomUUID(),
          reviewerIdentityId: identityId,
          role: input.role,
          state: "active",
          activeKey: identityId,
          assignedByIdentityId: input.assignedByIdentityId,
          reason: input.reason,
          assignedAt,
          revokedAt: null
        });
        await transaction.insert(sxAuditEvent).values({
          id: randomUUID(),
          eventType: "reviewer_role_assigned",
          interestId: null,
          reviewerIdentityId: identityId,
          actorId: input.assignedByIdentityId,
          occurredAt: assignedAt
        });
        return { reviewerIdentityId: identityId, role: input.role, eventType: "reviewer_role_assigned", occurredAt: assignedAt.toISOString() };
      });
    }
  };
}
