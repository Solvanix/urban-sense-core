import { desc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { auditEvents, earnedPointEvents, users } from "../../drizzle/schema";
import { buildAuditEventHash } from "../auditLedger";
import { assertNonCashPoints, assertReviewTransition, type EarnedPointEventStatus } from "../earnedPointsPolicy";
import { getDb } from "../db";
import { adminProcedure, router } from "../_core/trpc";

type Db = NonNullable<Awaited<ReturnType<typeof getDb>>>;

async function requireDb() {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "قاعدة البيانات غير متاحة حاليًا." });
  return db;
}

async function addEarnedPointsAudit(db: Db, input: { actorUserId: number; eventId: number; action: string; previousValue?: unknown; nextValue?: unknown; reason: string }) {
  const [previousEvent] = await db.select({ eventHash: auditEvents.eventHash }).from(auditEvents).orderBy(desc(auditEvents.id)).limit(1);
  const createdAt = new Date();
  const payload = { municipalityId: null, actorUserId: input.actorUserId, entityType: "earned_point_event", entityId: String(input.eventId), action: input.action, previousValue: input.previousValue ?? null, nextValue: input.nextValue ?? null, reason: input.reason, previousHash: previousEvent?.eventHash ?? null, createdAt: createdAt.toISOString() };
  await db.insert(auditEvents).values({
    municipalityId: null,
    actorUserId: input.actorUserId,
    entityType: payload.entityType,
    entityId: payload.entityId,
    action: payload.action,
    previousValue: payload.previousValue === null ? null : JSON.stringify(payload.previousValue),
    nextValue: payload.nextValue === null ? null : JSON.stringify(payload.nextValue),
    reason: payload.reason,
    previousHash: payload.previousHash,
    eventHash: buildAuditEventHash(payload),
    createdAt,
  });
}

export const earnedPointsRouter = router({
  list: adminProcedure.query(async () => {
    const db = await requireDb();
    return db.select({
      id: earnedPointEvents.id,
      publicReference: earnedPointEvents.publicReference,
      beneficiaryUserId: earnedPointEvents.beneficiaryUserId,
      beneficiaryName: users.name,
      points: earnedPointEvents.points,
      status: earnedPointEvents.status,
      reason: earnedPointEvents.reason,
      evidenceReference: earnedPointEvents.evidenceReference,
      reviewReason: earnedPointEvents.reviewReason,
      createdAt: earnedPointEvents.createdAt,
      reviewedAt: earnedPointEvents.reviewedAt,
    }).from(earnedPointEvents).innerJoin(users, eq(earnedPointEvents.beneficiaryUserId, users.id)).orderBy(desc(earnedPointEvents.createdAt));
  }),

  createPending: adminProcedure.input(z.object({
    beneficiaryUserId: z.number().int().positive(),
    points: z.number().int(),
    reason: z.string().trim().min(12).max(500),
    evidenceReference: z.string().trim().min(4).max(500),
  })).mutation(async ({ ctx, input }) => {
    const db = await requireDb();
    const points = assertNonCashPoints(input.points);
    const [beneficiary] = await db.select({ id: users.id, isActive: users.isActive }).from(users).where(eq(users.id, input.beneficiaryUserId)).limit(1);
    if (!beneficiary || !beneficiary.isActive) throw new TRPCError({ code: "NOT_FOUND", message: "المستفيد غير موجود أو غير مفعّل." });
    const publicReference = `SEP-${randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`;
    const result = await db.insert(earnedPointEvents).values({ publicReference, beneficiaryUserId: input.beneficiaryUserId, points, status: "pending_review", reason: input.reason, evidenceReference: input.evidenceReference, createdByUserId: ctx.user.id });
    const eventId = Number(result[0].insertId);
    await addEarnedPointsAudit(db, { actorUserId: ctx.user.id, eventId, action: "earned_points.pending_created", nextValue: { publicReference, beneficiaryUserId: input.beneficiaryUserId, points, status: "pending_review" }, reason: input.reason });
    return { id: eventId, publicReference, status: "pending_review" as const };
  }),

  review: adminProcedure.input(z.object({
    eventId: z.number().int().positive(),
    decision: z.enum(["approved", "voided"]),
    reason: z.string().trim().min(12).max(500),
  })).mutation(async ({ ctx, input }) => {
    const db = await requireDb();
    const [event] = await db.select().from(earnedPointEvents).where(eq(earnedPointEvents.id, input.eventId)).limit(1);
    if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "حدث النقاط غير موجود." });
    const nextStatus = assertReviewTransition(event.status as EarnedPointEventStatus, input.decision);
    const reviewedAt = new Date();
    await db.update(earnedPointEvents).set({ status: nextStatus, reviewedByUserId: ctx.user.id, reviewReason: input.reason, reviewedAt }).where(eq(earnedPointEvents.id, event.id));
    await addEarnedPointsAudit(db, { actorUserId: ctx.user.id, eventId: event.id, action: `earned_points.${nextStatus}`, previousValue: { status: event.status }, nextValue: { status: nextStatus }, reason: input.reason });
    return { id: event.id, status: nextStatus };
  }),
});
