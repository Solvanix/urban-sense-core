import { index, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const providerInterestStatus = ["interest_submitted", "invited_to_onboard", "not_in_current_pilot"] as const;
export const interestDecisionOutcome = ["invited_to_onboard", "not_in_current_pilot"] as const;
export const auditEventType = ["interest_submitted", "interest_decided"] as const;

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
  interestId: varchar("interest_id", { length: 64 }).notNull().references(() => sxProviderInterest.id, { onDelete: "restrict", onUpdate: "cascade" }),
  actorId: varchar("actor_id", { length: 128 }),
  occurredAt: timestamp("occurred_at").notNull()
}, (table) => [index("sx_audit_event_interest_idx").on(table.interestId)]);
