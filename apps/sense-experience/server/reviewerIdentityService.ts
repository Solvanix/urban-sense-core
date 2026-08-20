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

export interface ReviewerIdentityStore {
  findIdentity(subject: ValidatedReviewerSubject): Promise<StoredReviewerIdentity | undefined>;
  findActiveRole(identityId: string): Promise<StoredReviewerRoleAssignment | undefined>;
  hasActiveReviewer(): Promise<boolean>;
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
): ReviewerIdentityStore {
  return {
    async findIdentity(subject) {
      return identities.find((identity) => identity.provider === subject.provider && identity.subject === subject.subject);
    },
    async findActiveRole(identityId) {
      return assignments.find((assignment) => assignment.reviewerIdentityId === identityId && assignment.state === "active");
    },
    async hasActiveReviewer() {
      return identities.some((identity) => identity.state === "active" && assignments.some((assignment) => assignment.reviewerIdentityId === identity.id && assignment.state === "active"));
    }
  };
}
