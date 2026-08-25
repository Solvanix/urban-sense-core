import { boolean, index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const municipalRoleValues = [
  "citizen",
  "developer",
  "service_officer",
  "field_worker",
  "supervisor",
  "municipality_admin",
  "platform_admin",
] as const;

export const reportStatusValues = [
  "pending",
  "under_review",
  "assigned",
  "in_progress",
  "awaiting_verification",
  "resolved",
  "rejected",
  "cancelled",
  "reopened",
] as const;

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", municipalRoleValues).default("citizen").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const municipalities = mysqlTable("municipalities", {
  id: int("id").autoincrement().primaryKey(),
  nameAr: varchar("nameAr", { length: 160 }).notNull(),
  code: varchar("code", { length: 40 }).notNull().unique(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const municipalityMemberships = mysqlTable(
  "municipality_memberships",
  {
    id: int("id").autoincrement().primaryKey(),
    municipalityId: int("municipalityId").notNull().references(() => municipalities.id, { onDelete: "cascade" }),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    role: mysqlEnum("role", municipalRoleValues).notNull(),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("municipality_membership_unique").on(table.municipalityId, table.userId),
    index("municipality_membership_user_idx").on(table.userId),
  ],
);

export const serviceCategories = mysqlTable(
  "service_categories",
  {
    id: int("id").autoincrement().primaryKey(),
    municipalityId: int("municipalityId").notNull().references(() => municipalities.id, { onDelete: "cascade" }),
    nameAr: varchar("nameAr", { length: 120 }).notNull(),
    code: varchar("code", { length: 48 }).notNull(),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [uniqueIndex("service_category_code_unique").on(table.municipalityId, table.code)],
);

export const reports = mysqlTable(
  "reports",
  {
    id: int("id").autoincrement().primaryKey(),
    publicReference: varchar("publicReference", { length: 32 }).notNull().unique(),
    municipalityId: int("municipalityId").notNull().references(() => municipalities.id, { onDelete: "restrict" }),
    citizenId: int("citizenId").notNull().references(() => users.id, { onDelete: "restrict" }),
    categoryId: int("categoryId").references(() => serviceCategories.id, { onDelete: "set null" }),
    title: varchar("title", { length: 140 }).notNull(),
    description: text("description").notNull(),
    locationDescription: varchar("locationDescription", { length: 500 }).notNull(),
    status: mysqlEnum("status", reportStatusValues).default("pending").notNull(),
    priority: mysqlEnum("priority", ["normal", "high", "critical"]).default("normal").notNull(),
    closedAt: timestamp("closedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    index("reports_municipality_status_idx").on(table.municipalityId, table.status),
    index("reports_citizen_idx").on(table.citizenId),
  ],
);

export const reportReviews = mysqlTable("report_reviews", {
  id: int("id").autoincrement().primaryKey(),
  reportId: int("reportId").notNull().references(() => reports.id, { onDelete: "cascade" }),
  reviewerUserId: int("reviewerUserId").notNull().references(() => users.id, { onDelete: "restrict" }),
  categoryId: int("categoryId").references(() => serviceCategories.id, { onDelete: "set null" }),
  decision: mysqlEnum("decision", ["accepted", "rejected"]).notNull(),
  notes: text("notes").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const fieldAssignments = mysqlTable(
  "field_assignments",
  {
    id: int("id").autoincrement().primaryKey(),
    reportId: int("reportId").notNull().references(() => reports.id, { onDelete: "cascade" }),
    assignedToUserId: int("assignedToUserId").notNull().references(() => users.id, { onDelete: "restrict" }),
    assignedByUserId: int("assignedByUserId").notNull().references(() => users.id, { onDelete: "restrict" }),
    dueAt: timestamp("dueAt"),
    status: mysqlEnum("status", ["assigned", "in_progress", "completed", "cancelled"]).default("assigned").notNull(),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [index("field_assignment_worker_idx").on(table.assignedToUserId, table.status)],
);

export const reportEvidence = mysqlTable(
  "report_evidence",
  {
    id: int("id").autoincrement().primaryKey(),
    reportId: int("reportId").notNull().references(() => reports.id, { onDelete: "cascade" }),
    assignmentId: int("assignmentId").references(() => fieldAssignments.id, { onDelete: "set null" }),
    uploadedByUserId: int("uploadedByUserId").notNull().references(() => users.id, { onDelete: "restrict" }),
    kind: mysqlEnum("kind", ["before", "after"]).notNull(),
    storageKey: varchar("storageKey", { length: 520 }).notNull().unique(),
    storageUrl: varchar("storageUrl", { length: 520 }).notNull(),
    originalFileName: varchar("originalFileName", { length: 255 }).notNull(),
    mimeType: varchar("mimeType", { length: 100 }).notNull(),
    sizeBytes: int("sizeBytes").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [index("report_evidence_report_idx").on(table.reportId)],
);

export const reportStatusHistory = mysqlTable(
  "report_status_history",
  {
    id: int("id").autoincrement().primaryKey(),
    reportId: int("reportId").notNull().references(() => reports.id, { onDelete: "cascade" }),
    fromStatus: varchar("fromStatus", { length: 32 }),
    toStatus: mysqlEnum("toStatus", reportStatusValues).notNull(),
    actorUserId: int("actorUserId").notNull().references(() => users.id, { onDelete: "restrict" }),
    reason: text("reason").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [index("report_status_history_report_idx").on(table.reportId, table.createdAt)],
);

export const reportRatings = mysqlTable(
  "report_ratings",
  {
    id: int("id").autoincrement().primaryKey(),
    reportId: int("reportId").notNull().references(() => reports.id, { onDelete: "cascade" }),
    citizenId: int("citizenId").notNull().references(() => users.id, { onDelete: "restrict" }),
    score: int("score").notNull(),
    comment: varchar("comment", { length: 500 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("report_rating_once_per_report").on(table.reportId)],
);

export const auditEvents = mysqlTable(
  "audit_events",
  {
    id: int("id").autoincrement().primaryKey(),
    municipalityId: int("municipalityId").references(() => municipalities.id, { onDelete: "set null" }),
    actorUserId: int("actorUserId").references(() => users.id, { onDelete: "set null" }),
    entityType: varchar("entityType", { length: 80 }).notNull(),
    entityId: varchar("entityId", { length: 80 }).notNull(),
    action: varchar("action", { length: 120 }).notNull(),
    previousValue: text("previousValue"),
    nextValue: text("nextValue"),
    reason: text("reason"),
    previousHash: varchar("previousHash", { length: 64 }),
    eventHash: varchar("eventHash", { length: 64 }).notNull().unique(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [index("audit_events_entity_idx").on(table.entityType, table.entityId, table.createdAt)],
);

export const earnedPointEvents = mysqlTable(
  "earned_point_events",
  {
    id: int("id").autoincrement().primaryKey(),
    publicReference: varchar("publicReference", { length: 40 }).notNull().unique(),
    beneficiaryUserId: int("beneficiaryUserId").notNull().references(() => users.id, { onDelete: "restrict" }),
    points: int("points").notNull(),
    status: mysqlEnum("status", ["pending_review", "approved", "voided"]).default("pending_review").notNull(),
    reason: varchar("reason", { length: 500 }).notNull(),
    evidenceReference: varchar("evidenceReference", { length: 500 }).notNull(),
    createdByUserId: int("createdByUserId").notNull().references(() => users.id, { onDelete: "restrict" }),
    reviewedByUserId: int("reviewedByUserId").references(() => users.id, { onDelete: "restrict" }),
    reviewReason: varchar("reviewReason", { length: 500 }),
    reviewedAt: timestamp("reviewedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    index("earned_point_events_beneficiary_idx").on(table.beneficiaryUserId, table.status),
    index("earned_point_events_status_idx").on(table.status, table.createdAt),
  ],
);

export type Municipality = typeof municipalities.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type EarnedPointEvent = typeof earnedPointEvents.$inferSelect;
