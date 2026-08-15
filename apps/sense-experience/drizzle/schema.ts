import { index, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const providerInterestStatus = ["interest_submitted", "invited_to_onboard", "not_in_current_pilot"] as const;
export const interestDecisionOutcome = ["invited_to_onboard", "not_in_current_pilot"] as const;
export const auditEventType = ["interest_submitted", "interest_decided", "reviewer_role_assigned", "reviewer_role_revoked"] as const;
export const reviewerIdentityProvider = ["manus_oauth", "external_oidc"] as const;
export const reviewerIdentityState = ["active", "revoked"] as const;
export const reviewerRole = ["reviewer", "administrator"] as const;
export const reviewerRoleAssignmentState = ["active", "revoked"] as const;

export const sxProviderInterest = mysqlTable("sx_provider_interest", {
  id: varchar("id", { length: 64 }).primaryKey(),
  brandName: varchar("brand_name", { length: 120 }).notNull(),
  providerType: varchar("provider_type", { length: 64 }).notNull(),
  area: varchar("area", { length: 120 }).notNull(),
  contactName: varchar("contact_name", { length: 120 }).notNull(),
  contactChannel: varchar("contact_channel", { length: 160 }).notNull(),
  shortDescription: text("short_description").notNull(),
  reviewConsent: mysqlEnum("review_consent", ["granted"]).notNull(),
  status: mysqlEnum("status", providerInterestStatus).notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull()
}, (table) => [index("sx_provider_interest_status_created_idx").on(table.status, table.createdAt)]);

export const sxInterestReviewDecision = mysqlTable("sx_interest_review_decision", {
  id: varchar("id", { length: 64 }).primaryKey(),
  interestId: varchar("interest_id", { length: 64 }).notNull().references(() => sxProviderInterest.id, { onDelete: "restrict", onUpdate: "cascade" }),
  reviewerId: varchar("reviewer_id", { length: 128 }).notNull(),
  outcome: mysqlEnum("outcome", interestDecisionOutcome).notNull(),
  reason: text("reason").notNull(),
  decidedAt: timestamp("decided_at").notNull()
}, (table) => [index("sx_interest_review_decision_interest_idx").on(table.interestId), uniqueIndex("sx_interest_review_decision_one_per_interest").on(table.interestId)]);

export const sxAuditEvent = mysqlTable("sx_audit_event", {
  id: varchar("id", { length: 64 }).primaryKey(),
  eventType: mysqlEnum("event_type", auditEventType).notNull(),
  interestId: varchar("interest_id", { length: 64 }).references(() => sxProviderInterest.id, { onDelete: "restrict", onUpdate: "cascade" }),
  reviewerIdentityId: varchar("reviewer_identity_id", { length: 64 }),
  actorId: varchar("actor_id", { length: 128 }),
  occurredAt: timestamp("occurred_at").notNull()
}, (table) => [index("sx_audit_event_interest_idx").on(table.interestId)]);

export const sxReviewerIdentity = mysqlTable("sx_reviewer_identity", {
  id: varchar("id", { length: 64 }).primaryKey(),
  provider: mysqlEnum("provider", reviewerIdentityProvider).notNull(),
  subject: varchar("subject", { length: 191 }).notNull(),
  displayName: varchar("display_name", { length: 160 }),
  state: mysqlEnum("state", reviewerIdentityState).notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull()
}, (table) => [uniqueIndex("sx_reviewer_identity_provider_subject_unique").on(table.provider, table.subject)]);

export const sxReviewerRoleAssignment = mysqlTable("sx_reviewer_role_assignment", {
  id: varchar("id", { length: 64 }).primaryKey(),
  reviewerIdentityId: varchar("reviewer_identity_id", { length: 64 }).notNull().references(() => sxReviewerIdentity.id, { onDelete: "restrict", onUpdate: "cascade" }),
  role: mysqlEnum("role", reviewerRole).notNull(),
  state: mysqlEnum("state", reviewerRoleAssignmentState).notNull(),
  activeKey: varchar("active_key", { length: 64 }).unique(),
  assignedByIdentityId: varchar("assigned_by_identity_id", { length: 64 }),
  reason: text("reason").notNull(),
  assignedAt: timestamp("assigned_at").notNull(),
  revokedAt: timestamp("revoked_at")
}, (table) => [index("sx_reviewer_role_assignment_identity_state_idx").on(table.reviewerIdentityId, table.state)]);
