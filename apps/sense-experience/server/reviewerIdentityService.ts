import type { ReviewerActor } from "../src/onboarding/contracts.js";

export type ValidatedReviewerSubject = {
  provider: "manus_oauth" | "external_oidc";
  subject: string;
};

export type StoredReviewerIdentity = {
  id: string;
  provider: ValidatedReviewerSubject["provider"];
  subject: string;
  state: "active" | "revoked";
};

export type StoredReviewerRoleAssignment = {
  reviewerIdentityId: string;
  role: ReviewerActor["role"];
  state: "active" | "revoked";
};

export type ReviewerRoleAssignmentInput = {
  provider: ValidatedReviewerSubject["provider"];
  subject: string;
  displayName?: string;
  role: "reviewer" | "administrator";
  reason: string;
  assignedByIdentityId: string;
  assignedAt: string;
};

export type ReviewerRoleAssignmentResult = {
  reviewerIdentityId: string;
  role: "reviewer" | "administrator";
  eventType: "reviewer_role_assigned";
  occurredAt: string;
};

export interface ReviewerIdentityStore {
  findIdentity(subject: ValidatedReviewerSubject): Promise<StoredReviewerIdentity | undefined>;
  findActiveRole(identityId: string): Promise<StoredReviewerRoleAssignment | undefined>;
  hasActiveReviewer(): Promise<boolean>;
  assignActiveRole(input: ReviewerRoleAssignmentInput): Promise<ReviewerRoleAssignmentResult>;
}

export interface ReviewerSubjectResolver<Request> {
  resolve(request: Request): Promise<ValidatedReviewerSubject | null>;
}

/**
 * Safe default until a separately configured OAuth/OIDC adapter validates a server-side session.
 * It ignores every header, cookie, and query value so callers cannot self-assign reviewer power.
 */
export function createRejectingReviewerSubjectResolver<Request>(): ReviewerSubjectResolver<Request> {
  return { resolve: async () => null };
}

export async function resolveReviewerActor<Request>(
  request: Request,
  resolver: ReviewerSubjectResolver<Request>,
  store: ReviewerIdentityStore
): Promise<ReviewerActor | null> {
  const subject = await resolver.resolve(request);
  if (!subject) return null;

  const identity = await store.findIdentity(subject);
  if (!identity || identity.state !== "active") return null;

  const assignment = await store.findActiveRole(identity.id);
  if (!assignment || assignment.state !== "active") return null;

  return { id: identity.id, role: assignment.role };
}

export function createMemoryReviewerIdentityStore(
  identities: StoredReviewerIdentity[] = [],
  assignments: StoredReviewerRoleAssignment[] = []
): ReviewerIdentityStore & { listAuditEvents(): ReviewerRoleAssignmentResult[] } {
  let records = identities.map((identity) => ({ ...identity }));
  let roleAssignments = assignments.map((assignment) => ({ ...assignment }));
  let auditEvents: ReviewerRoleAssignmentResult[] = [];
  return {
    async findIdentity(subject) {
      const identity = records.find((record) => record.provider === subject.provider && record.subject === subject.subject);
      return identity ? { ...identity } : undefined;
    },
    async findActiveRole(identityId) {
      const assignment = roleAssignments.find((record) => record.reviewerIdentityId === identityId && record.state === "active");
      return assignment ? { ...assignment } : undefined;
    },
    async hasActiveReviewer() {
      return records.some((identity) => identity.state === "active" && roleAssignments.some((assignment) => assignment.reviewerIdentityId === identity.id && assignment.state === "active"));
    },
    async assignActiveRole(input) {
      const existing = records.find((identity) => identity.provider === input.provider && identity.subject === input.subject);
      if (existing?.state === "revoked") throw new Error("Reviewer identity is revoked.");
      const identity = existing ?? { id: `memory-reviewer-${records.length + 1}`, provider: input.provider, subject: input.subject, state: "active" as const };
      if (!existing) records = [...records, identity];
      if (roleAssignments.some((assignment) => assignment.reviewerIdentityId === identity.id && assignment.state === "active")) {
        throw new Error("Reviewer identity already has an active role.");
      }
      roleAssignments = [...roleAssignments, { reviewerIdentityId: identity.id, role: input.role, state: "active" }];
      const event: ReviewerRoleAssignmentResult = { reviewerIdentityId: identity.id, role: input.role, eventType: "reviewer_role_assigned", occurredAt: input.assignedAt };
      auditEvents = [...auditEvents, event];
      return { ...event };
    },
    listAuditEvents() {
      return auditEvents.map((event) => ({ ...event }));
    }
  };
}
