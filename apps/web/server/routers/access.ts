import { desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { auditEvents, users } from "../../drizzle/schema";
import { buildAuditEventHash } from "../auditLedger";
import { assertAccountAccessChange, assignablePlatformRoles } from "../accessPolicy";
import { getDb } from "../db";
import { ENV } from "../_core/env";
import { adminProcedure, router } from "../_core/trpc";

async function requireDb() {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "قاعدة البيانات غير متاحة حاليًا." });
  return db;
}

async function addAccessAuditEvent(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, input: {
  actorUserId: number;
  targetUserId: number;
  previousValue: unknown;
  nextValue: unknown;
}) {
  const [previousEvent] = await db.select({ eventHash: auditEvents.eventHash }).from(auditEvents).orderBy(desc(auditEvents.id)).limit(1);
  const createdAt = new Date();
  const payload = {
    municipalityId: null,
    actorUserId: input.actorUserId,
    entityType: "user_access",
    entityId: String(input.targetUserId),
    action: "user_access.updated",
    previousValue: input.previousValue,
    nextValue: input.nextValue,
    reason: "تحديث دور أو حالة حساب عبر إدارة المنصة.",
    previousHash: previousEvent?.eventHash ?? null,
    createdAt: createdAt.toISOString(),
  };
  await db.insert(auditEvents).values({
    municipalityId: payload.municipalityId,
    actorUserId: payload.actorUserId,
    entityType: payload.entityType,
    entityId: payload.entityId,
    action: payload.action,
    previousValue: JSON.stringify(payload.previousValue),
    nextValue: JSON.stringify(payload.nextValue),
    reason: payload.reason,
    previousHash: payload.previousHash,
    eventHash: buildAuditEventHash(payload),
    createdAt,
  });
}

export const accessRouter = router({
  listAccounts: adminProcedure.query(async () => {
    const db = await requireDb();
    return db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      isActive: users.isActive,
      lastSignedIn: users.lastSignedIn,
      createdAt: users.createdAt,
    }).from(users).orderBy(desc(users.lastSignedIn));
  }),

  updateAccount: adminProcedure
    .input(z.object({
      userId: z.number().int().positive(),
      role: z.enum(assignablePlatformRoles),
      isActive: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const [target] = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
      if (!target) throw new TRPCError({ code: "NOT_FOUND", message: "الحساب غير موجود." });

      assertAccountAccessChange({
        isOwnerAccount: target.openId === ENV.ownerOpenId,
        isActingOnSelf: target.id === ctx.user.id,
        nextRole: input.role,
        nextIsActive: input.isActive,
      });

      const previousValue = { role: target.role, isActive: target.isActive };
      const nextValue = { role: input.role, isActive: input.isActive };
      if (previousValue.role === nextValue.role && previousValue.isActive === nextValue.isActive) return { success: true, changed: false };

      await db.update(users).set(nextValue).where(eq(users.id, target.id));
      await addAccessAuditEvent(db, { actorUserId: ctx.user.id, targetUserId: target.id, previousValue, nextValue });
      return { success: true, changed: true };
    }),
});
