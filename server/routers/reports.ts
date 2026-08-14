import { TRPCError } from "@trpc/server";
import { and, desc, eq, inArray } from "drizzle-orm";
import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";
import {
  auditEvents,
  fieldAssignments,
  municipalities,
  municipalityMemberships,
  reportEvidence,
  reportRatings,
  reportReviews,
  reports,
  reportStatusHistory,
  serviceCategories,
  users,
} from "../../drizzle/schema";
import { getDb } from "../db";
import { assertReportTransition, assertRole, type MunicipalRole, type ReportStatus } from "../reportPolicy";
import { storagePut } from "../storage";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

const staffRoles: MunicipalRole[] = ["service_officer", "field_worker", "supervisor", "municipality_admin", "platform_admin"];
const reviewerRoles: MunicipalRole[] = ["service_officer", "supervisor", "municipality_admin", "platform_admin"];
const assignmentRoles: MunicipalRole[] = ["service_officer", "municipality_admin", "platform_admin"];
const supervisorRoles: MunicipalRole[] = ["supervisor", "municipality_admin", "platform_admin"];
const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"] as const;
const maximumEvidenceBytes = 5 * 1024 * 1024;

type Db = NonNullable<Awaited<ReturnType<typeof getDb>>>;

async function requireDb() {
  const db = await getDb();
  if (!db) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "قاعدة البيانات غير متاحة حاليًا. أعد المحاولة لاحقًا.",
    });
  }
  return db;
}

async function getReportOrThrow(db: Db, reportId: number) {
  const [report] = await db.select().from(reports).where(eq(reports.id, reportId)).limit(1);
  if (!report) {
    throw new TRPCError({ code: "NOT_FOUND", message: "البلاغ غير موجود." });
  }
  return report;
}

async function getMembershipOrThrow(db: Db, userId: number, municipalityId: number, platformRole: string | null | undefined) {
  if (platformRole === "platform_admin") {
    return { municipalityId, role: "platform_admin" as MunicipalRole };
  }

  const [membership] = await db
    .select()
    .from(municipalityMemberships)
    .where(and(
      eq(municipalityMemberships.userId, userId),
      eq(municipalityMemberships.municipalityId, municipalityId),
      eq(municipalityMemberships.isActive, true),
    ))
    .limit(1);

  if (!membership) {
    throw new TRPCError({ code: "FORBIDDEN", message: "ليس لديك نطاق وصول لهذه البلدية." });
  }

  return { municipalityId, role: membership.role as MunicipalRole };
}

async function addAuditEvent(
  db: Db,
  input: {
    municipalityId?: number | null;
    actorUserId?: number | null;
    entityType: string;
    entityId: string;
    action: string;
    previousValue?: unknown;
    nextValue?: unknown;
    reason?: string | null;
  },
) {
  const [previousEvent] = await db
    .select({ eventHash: auditEvents.eventHash })
    .from(auditEvents)
    .orderBy(desc(auditEvents.id))
    .limit(1);
  const createdAt = new Date();
  const payload = {
    municipalityId: input.municipalityId ?? null,
    actorUserId: input.actorUserId ?? null,
    entityType: input.entityType,
    entityId: input.entityId,
    action: input.action,
    previousValue: input.previousValue ?? null,
    nextValue: input.nextValue ?? null,
    reason: input.reason ?? null,
    previousHash: previousEvent?.eventHash ?? null,
    createdAt: createdAt.toISOString(),
  };
  const eventHash = createHash("sha256").update(JSON.stringify(payload)).digest("hex");
  await db.insert(auditEvents).values({
    municipalityId: payload.municipalityId,
    actorUserId: payload.actorUserId,
    entityType: payload.entityType,
    entityId: payload.entityId,
    action: payload.action,
    previousValue: payload.previousValue === null ? null : JSON.stringify(payload.previousValue),
    nextValue: payload.nextValue === null ? null : JSON.stringify(payload.nextValue),
    reason: payload.reason,
    previousHash: payload.previousHash,
    eventHash,
    createdAt,
  });
}

async function transitionReport(
  db: Db,
  input: {
    report: typeof reports.$inferSelect;
    role: MunicipalRole;
    actorUserId: number;
    nextStatus: ReportStatus;
    reason: string;
  },
) {
  assertReportTransition(input.role, input.report.status as ReportStatus, input.nextStatus);

  await db
    .update(reports)
    .set({
      status: input.nextStatus,
      closedAt: input.nextStatus === "resolved" ? new Date() : input.report.closedAt,
    })
    .where(eq(reports.id, input.report.id));

  await db.insert(reportStatusHistory).values({
    reportId: input.report.id,
    fromStatus: input.report.status,
    toStatus: input.nextStatus,
    actorUserId: input.actorUserId,
    reason: input.reason,
  });

  await addAuditEvent(db, {
    municipalityId: input.report.municipalityId,
    actorUserId: input.actorUserId,
    entityType: "report",
    entityId: String(input.report.id),
    action: "report.status_changed",
    previousValue: { status: input.report.status },
    nextValue: { status: input.nextStatus },
    reason: input.reason,
  });
}

function ensureBase64Image(value: string) {
  if (!/^[A-Za-z0-9+/=\r\n]+$/.test(value)) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "صيغة الملف المرفوع غير صالحة." });
  }
  const buffer = Buffer.from(value, "base64");
  if (buffer.length === 0 || buffer.length > maximumEvidenceBytes) {
    throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "حجم صورة الدليل يجب ألا يتجاوز 5 ميغابايت." });
  }
  return buffer;
}

export const reportsRouter = router({
  municipalities: router({
    listPublic: publicProcedure.query(async () => {
      const db = await requireDb();
      return db.select().from(municipalities).where(eq(municipalities.isActive, true)).orderBy(municipalities.nameAr);
    }),
    create: protectedProcedure
      .input(z.object({ nameAr: z.string().trim().min(3).max(160), code: z.string().trim().min(3).max(40).regex(/^[a-z0-9-]+$/) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "platform_admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "إنشاء البلديات مخصص لمدير المنصة." });
        }
        const db = await requireDb();
        const [created] = await db.insert(municipalities).values(input).$returningId();
        await db.insert(municipalityMemberships).values({
          municipalityId: created.id,
          userId: ctx.user.id,
          role: "municipality_admin",
        });
        await addAuditEvent(db, {
          actorUserId: ctx.user.id,
          entityType: "municipality",
          entityId: String(created.id),
          action: "municipality.created",
          nextValue: input,
        });
        return created;
      }),
  }),

  staff: router({
    listFieldWorkers: protectedProcedure
      .input(z.object({ municipalityId: z.number().int().positive() }))
      .query(async ({ ctx, input }) => {
        const db = await requireDb();
        const membership = await getMembershipOrThrow(db, ctx.user.id, input.municipalityId, ctx.user.role);
        assertRole(membership.role, staffRoles);
        return db
          .select({ id: users.id, name: users.name, email: users.email })
          .from(municipalityMemberships)
          .innerJoin(users, eq(municipalityMemberships.userId, users.id))
          .where(and(
            eq(municipalityMemberships.municipalityId, input.municipalityId),
            eq(municipalityMemberships.role, "field_worker"),
            eq(municipalityMemberships.isActive, true),
          ));
      }),
  }),

  create: protectedProcedure
    .input(z.object({
      municipalityId: z.number().int().positive(),
      categoryId: z.number().int().positive().optional(),
      title: z.string().trim().min(8).max(140),
      description: z.string().trim().min(20).max(4000),
      locationDescription: z.string().trim().min(5).max(500),
      priority: z.enum(["normal", "high", "critical"]).default("normal"),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const [municipality] = await db
        .select({ id: municipalities.id })
        .from(municipalities)
        .where(and(eq(municipalities.id, input.municipalityId), eq(municipalities.isActive, true)))
        .limit(1);
      if (!municipality) throw new TRPCError({ code: "BAD_REQUEST", message: "البلدية المختارة غير متاحة." });
      const [existingMembership] = await db
        .select()
        .from(municipalityMemberships)
        .where(and(
          eq(municipalityMemberships.userId, ctx.user.id),
          eq(municipalityMemberships.municipalityId, input.municipalityId),
          eq(municipalityMemberships.isActive, true),
        ))
        .limit(1);
      if (!existingMembership && ctx.user.role === "citizen") {
        await db.insert(municipalityMemberships).values({
          municipalityId: input.municipalityId,
          userId: ctx.user.id,
          role: "citizen",
        });
      }
      const membership = ctx.user.role === "platform_admin"
        ? { municipalityId: input.municipalityId, role: "platform_admin" as MunicipalRole }
        : existingMembership
          ? { municipalityId: existingMembership.municipalityId, role: existingMembership.role as MunicipalRole }
          : { municipalityId: input.municipalityId, role: "citizen" as MunicipalRole };
      assertRole(membership.role, ["citizen", "platform_admin"]);

      if (input.categoryId) {
        const [category] = await db
          .select()
          .from(serviceCategories)
          .where(and(eq(serviceCategories.id, input.categoryId), eq(serviceCategories.municipalityId, input.municipalityId), eq(serviceCategories.isActive, true)))
          .limit(1);
        if (!category) throw new TRPCError({ code: "BAD_REQUEST", message: "التصنيف المختار غير متاح لهذه البلدية." });
      }

      const reference = `US-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;
      const [created] = await db.insert(reports).values({
        publicReference: reference,
        municipalityId: input.municipalityId,
        citizenId: ctx.user.id,
        categoryId: input.categoryId ?? null,
        title: input.title,
        description: input.description,
        locationDescription: input.locationDescription,
        priority: input.priority,
      }).$returningId();

      await db.insert(reportStatusHistory).values({
        reportId: created.id,
        fromStatus: null,
        toStatus: "pending",
        actorUserId: ctx.user.id,
        reason: "إنشاء البلاغ بواسطة المواطن.",
      });
      await addAuditEvent(db, {
        municipalityId: input.municipalityId,
        actorUserId: ctx.user.id,
        entityType: "report",
        entityId: String(created.id),
        action: "report.created",
        nextValue: { reference, status: "pending", priority: input.priority },
        reason: "إنشاء بلاغ جديد.",
      });
      return { id: created.id, publicReference: reference };
    }),

  listMine: protectedProcedure.query(async ({ ctx }) => {
    const db = await requireDb();
    return db.select().from(reports).where(eq(reports.citizenId, ctx.user.id)).orderBy(desc(reports.createdAt));
  }),

  listOperations: protectedProcedure
    .input(z.object({ municipalityId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const db = await requireDb();
      const membership = await getMembershipOrThrow(db, ctx.user.id, input.municipalityId, ctx.user.role);
      assertRole(membership.role, staffRoles);
      return db.select().from(reports).where(eq(reports.municipalityId, input.municipalityId)).orderBy(desc(reports.updatedAt));
    }),

  getById: protectedProcedure
    .input(z.object({ reportId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const db = await requireDb();
      const report = await getReportOrThrow(db, input.reportId);
      const membership = await getMembershipOrThrow(db, ctx.user.id, report.municipalityId, ctx.user.role);
      if (membership.role === "citizen" && report.citizenId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "لا يمكنك الاطلاع على بلاغ مواطن آخر." });
      }
      const [history, evidence, assignments] = await Promise.all([
        db.select().from(reportStatusHistory).where(eq(reportStatusHistory.reportId, report.id)).orderBy(desc(reportStatusHistory.createdAt)),
        db.select().from(reportEvidence).where(eq(reportEvidence.reportId, report.id)).orderBy(desc(reportEvidence.createdAt)),
        db.select().from(fieldAssignments).where(eq(fieldAssignments.reportId, report.id)).orderBy(desc(fieldAssignments.createdAt)),
      ]);
      return { report, history, evidence, assignments };
    }),

  review: protectedProcedure
    .input(z.object({
      reportId: z.number().int().positive(),
      categoryId: z.number().int().positive().optional(),
      decision: z.enum(["accepted", "rejected"]),
      notes: z.string().trim().min(5).max(2000),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const report = await getReportOrThrow(db, input.reportId);
      const membership = await getMembershipOrThrow(db, ctx.user.id, report.municipalityId, ctx.user.role);
      assertRole(membership.role, reviewerRoles);
      if (report.status !== "pending") throw new TRPCError({ code: "BAD_REQUEST", message: "لا يمكن مراجعة بلاغ تم التعامل معه سابقًا." });

      await db.insert(reportReviews).values({
        reportId: report.id,
        reviewerUserId: ctx.user.id,
        categoryId: input.categoryId ?? null,
        decision: input.decision,
        notes: input.notes,
      });
      await db.update(reports).set({ categoryId: input.categoryId ?? report.categoryId }).where(eq(reports.id, report.id));
      await transitionReport(db, {
        report,
        role: membership.role,
        actorUserId: ctx.user.id,
        nextStatus: input.decision === "accepted" ? "under_review" : "rejected",
        reason: input.notes,
      });
      return { success: true };
    }),

  assign: protectedProcedure
    .input(z.object({
      reportId: z.number().int().positive(),
      assignedToUserId: z.number().int().positive(),
      dueAt: z.date().optional(),
      notes: z.string().trim().max(1000).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const report = await getReportOrThrow(db, input.reportId);
      const membership = await getMembershipOrThrow(db, ctx.user.id, report.municipalityId, ctx.user.role);
      assertRole(membership.role, assignmentRoles);
      if (report.status !== "under_review" && report.status !== "reopened") throw new TRPCError({ code: "BAD_REQUEST", message: "لا يمكن إسناد هذا البلاغ في حالته الحالية." });

      const [fieldMembership] = await db
        .select()
        .from(municipalityMemberships)
        .where(and(
          eq(municipalityMemberships.userId, input.assignedToUserId),
          eq(municipalityMemberships.municipalityId, report.municipalityId),
          eq(municipalityMemberships.role, "field_worker"),
          eq(municipalityMemberships.isActive, true),
        ))
        .limit(1);
      if (!fieldMembership) throw new TRPCError({ code: "BAD_REQUEST", message: "العامل المحدد غير مفعّل ضمن نطاق هذه البلدية." });

      const [assignment] = await db.insert(fieldAssignments).values({
        reportId: report.id,
        assignedToUserId: input.assignedToUserId,
        assignedByUserId: ctx.user.id,
        dueAt: input.dueAt,
        notes: input.notes ?? null,
      }).$returningId();
      await transitionReport(db, { report, role: membership.role, actorUserId: ctx.user.id, nextStatus: "assigned", reason: input.notes ?? "إسناد البلاغ إلى فريق ميداني." });
      await addAuditEvent(db, {
        municipalityId: report.municipalityId,
        actorUserId: ctx.user.id,
        entityType: "field_assignment",
        entityId: String(assignment.id),
        action: "field_assignment.created",
        nextValue: { reportId: report.id, assignedToUserId: input.assignedToUserId },
        reason: input.notes ?? null,
      });
      return assignment;
    }),

  startWork: protectedProcedure
    .input(z.object({ reportId: z.number().int().positive(), reason: z.string().trim().min(5).max(500) }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const report = await getReportOrThrow(db, input.reportId);
      const membership = await getMembershipOrThrow(db, ctx.user.id, report.municipalityId, ctx.user.role);
      assertRole(membership.role, ["field_worker"]);
      const [assignment] = await db.select().from(fieldAssignments).where(and(eq(fieldAssignments.reportId, report.id), eq(fieldAssignments.assignedToUserId, ctx.user.id), eq(fieldAssignments.status, "assigned"))).limit(1);
      if (!assignment) throw new TRPCError({ code: "FORBIDDEN", message: "ليس لديك إسناد ميداني صالح لهذا البلاغ." });
      await db.update(fieldAssignments).set({ status: "in_progress" }).where(eq(fieldAssignments.id, assignment.id));
      await transitionReport(db, { report, role: membership.role, actorUserId: ctx.user.id, nextStatus: "in_progress", reason: input.reason });
      return { success: true };
    }),

  uploadEvidence: protectedProcedure
    .input(z.object({
      reportId: z.number().int().positive(),
      kind: z.enum(["before", "after"]),
      fileName: z.string().trim().min(1).max(255),
      mimeType: z.enum(acceptedImageTypes),
      contentBase64: z.string().min(8),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const report = await getReportOrThrow(db, input.reportId);
      const membership = await getMembershipOrThrow(db, ctx.user.id, report.municipalityId, ctx.user.role);
      assertRole(membership.role, ["field_worker"]);
      if (report.status !== "in_progress") throw new TRPCError({ code: "BAD_REQUEST", message: "يمكن رفع الأدلة أثناء التنفيذ الميداني فقط." });
      const [assignment] = await db.select().from(fieldAssignments).where(and(eq(fieldAssignments.reportId, report.id), eq(fieldAssignments.assignedToUserId, ctx.user.id), eq(fieldAssignments.status, "in_progress"))).limit(1);
      if (!assignment) throw new TRPCError({ code: "FORBIDDEN", message: "لا تملك إسنادًا ميدانيًا نشطًا لهذا البلاغ." });

      const fileBuffer = ensureBase64Image(input.contentBase64);
      const safeFileName = input.fileName.replace(/[^\w.-]/g, "_").slice(0, 120);
      const storageKey = `reports/${report.id}/users/${ctx.user.id}/${randomUUID()}-${safeFileName}`;
      const stored = await storagePut(storageKey, fileBuffer, input.mimeType);
      const [created] = await db.insert(reportEvidence).values({
        reportId: report.id,
        assignmentId: assignment.id,
        uploadedByUserId: ctx.user.id,
        kind: input.kind,
        storageKey: stored.key,
        storageUrl: stored.url,
        originalFileName: safeFileName,
        mimeType: input.mimeType,
        sizeBytes: fileBuffer.length,
      }).$returningId();
      await addAuditEvent(db, {
        municipalityId: report.municipalityId,
        actorUserId: ctx.user.id,
        entityType: "report_evidence",
        entityId: String(created.id),
        action: "report_evidence.uploaded",
        nextValue: { reportId: report.id, kind: input.kind, mimeType: input.mimeType, sizeBytes: fileBuffer.length },
      });
      return { id: created.id, url: stored.url };
    }),

  submitForVerification: protectedProcedure
    .input(z.object({ reportId: z.number().int().positive(), reason: z.string().trim().min(5).max(1000) }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const report = await getReportOrThrow(db, input.reportId);
      const membership = await getMembershipOrThrow(db, ctx.user.id, report.municipalityId, ctx.user.role);
      assertRole(membership.role, ["field_worker"]);
      const [assignment] = await db.select().from(fieldAssignments).where(and(eq(fieldAssignments.reportId, report.id), eq(fieldAssignments.assignedToUserId, ctx.user.id), eq(fieldAssignments.status, "in_progress"))).limit(1);
      if (!assignment) throw new TRPCError({ code: "FORBIDDEN", message: "لا تملك إسنادًا ميدانيًا نشطًا لهذا البلاغ." });
      const evidence = await db.select({ kind: reportEvidence.kind }).from(reportEvidence).where(eq(reportEvidence.reportId, report.id));
      const evidenceKinds = new Set(evidence.map(item => item.kind));
      if (!evidenceKinds.has("before") || !evidenceKinds.has("after")) {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: "يلزم رفع دليل قبل ودليل بعد قبل طلب التحقق." });
      }
      await db.update(fieldAssignments).set({ status: "completed" }).where(eq(fieldAssignments.id, assignment.id));
      await transitionReport(db, { report, role: membership.role, actorUserId: ctx.user.id, nextStatus: "awaiting_verification", reason: input.reason });
      return { success: true };
    }),

  verifyClosure: protectedProcedure
    .input(z.object({ reportId: z.number().int().positive(), approved: z.boolean(), reason: z.string().trim().min(5).max(1500) }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const report = await getReportOrThrow(db, input.reportId);
      const membership = await getMembershipOrThrow(db, ctx.user.id, report.municipalityId, ctx.user.role);
      assertRole(membership.role, supervisorRoles);
      if (report.status !== "awaiting_verification") throw new TRPCError({ code: "BAD_REQUEST", message: "هذا البلاغ ليس في مرحلة التحقق." });
      if (input.approved) {
        const evidence = await db.select({ kind: reportEvidence.kind }).from(reportEvidence).where(eq(reportEvidence.reportId, report.id));
        const evidenceKinds = new Set(evidence.map(item => item.kind));
        if (!evidenceKinds.has("before") || !evidenceKinds.has("after")) {
          throw new TRPCError({ code: "PRECONDITION_FAILED", message: "لا يمكن الإغلاق من دون أدلة قبل وبعد." });
        }
      }
      await transitionReport(db, {
        report,
        role: membership.role,
        actorUserId: ctx.user.id,
        nextStatus: input.approved ? "resolved" : "in_progress",
        reason: input.reason,
      });
      return { success: true };
    }),

  rate: protectedProcedure
    .input(z.object({ reportId: z.number().int().positive(), score: z.number().int().min(1).max(5), comment: z.string().trim().max(500).optional() }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const report = await getReportOrThrow(db, input.reportId);
      if (report.citizenId !== ctx.user.id || report.status !== "resolved") {
        throw new TRPCError({ code: "FORBIDDEN", message: "لا يمكن تقييم إلا بلاغك المغلق." });
      }
      const [existing] = await db.select().from(reportRatings).where(eq(reportRatings.reportId, report.id)).limit(1);
      if (existing) {
        await db.update(reportRatings).set({ score: input.score, comment: input.comment ?? null }).where(eq(reportRatings.id, existing.id));
      } else {
        await db.insert(reportRatings).values({ reportId: report.id, citizenId: ctx.user.id, score: input.score, comment: input.comment ?? null });
      }
      await addAuditEvent(db, {
        municipalityId: report.municipalityId,
        actorUserId: ctx.user.id,
        entityType: "report",
        entityId: String(report.id),
        action: "report.rated",
        nextValue: { score: input.score },
      });
      return { success: true };
    }),
});
