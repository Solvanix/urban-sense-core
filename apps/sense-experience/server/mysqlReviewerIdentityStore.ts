import { and, eq } from "drizzle-orm";
import { sxReviewerIdentity, sxReviewerRoleAssignment } from "../drizzle/schema.js";
import type { ReviewerIdentityStore, StoredReviewerIdentity, StoredReviewerRoleAssignment, ValidatedReviewerSubject } from "./reviewerIdentityService.js";
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
    }
  };
}
