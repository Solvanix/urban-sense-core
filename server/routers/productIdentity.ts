import { and, desc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { productEvents, productIdentities, recoveryCases } from "../../drizzle/schema";
import { getDb } from "../db";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

const productInput = z.object({
  productType: z.string().trim().min(2).max(80),
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().min(10).max(4000),
  provenance: z.string().trim().min(4).max(4000),
  municipalityId: z.number().int().positive().optional(),
  publicContactEnabled: z.boolean().default(true),
});

async function requireDb() {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "قاعدة البيانات غير متاحة حاليًا." });
  return db;
}

function makeReference(prefix: string) {
  return `${prefix}-${randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase()}`;
}

export const productIdentityRouter = router({
  scan: publicProcedure.input(z.object({ tagToken: z.string().trim().min(16).max(96) })).query(async ({ input }) => {
    const db = await requireDb();
    const [product] = await db.select({
      publicReference: productIdentities.publicReference,
      tagToken: productIdentities.tagToken,
      productType: productIdentities.productType,
      title: productIdentities.title,
      description: productIdentities.description,
      provenance: productIdentities.provenance,
      status: productIdentities.status,
      recoveryStatus: productIdentities.recoveryStatus,
      publicContactEnabled: productIdentities.publicContactEnabled,
    }).from(productIdentities).where(and(eq(productIdentities.tagToken, input.tagToken), eq(productIdentities.status, "active"))).limit(1);
    if (!product) throw new TRPCError({ code: "NOT_FOUND", message: "هوية المنتج غير موجودة أو غير متاحة." });
    return product;
  }),

  create: protectedProcedure.input(productInput).mutation(async ({ ctx, input }) => {
    const db = await requireDb();
    const publicReference = makeReference("SENSE-P");
    const tagToken = randomUUID().replaceAll("-", "");
    const [created] = await db.insert(productIdentities).values({
      publicReference,
      tagToken,
      providerUserId: ctx.user.id,
      municipalityId: input.municipalityId,
      productType: input.productType,
      title: input.title,
      description: input.description,
      provenance: input.provenance,
      publicContactEnabled: input.publicContactEnabled,
    });
    const productId = Number(created.insertId);
    await db.insert(productEvents).values({ productId, eventType: "issued", actorUserId: ctx.user.id, municipalityId: input.municipalityId, publicNote: "تم إصدار هوية المنتج." });
    return { publicReference, tagToken, scanPath: `/?view=recovery&tag=${tagToken}` };
  }),

  reportFound: publicProcedure.input(z.object({ tagToken: z.string().trim().min(16).max(96), finderMessage: z.string().trim().min(8).max(700), municipalityId: z.number().int().positive().optional() })).mutation(async ({ input }) => {
    const db = await requireDb();
    const [product] = await db.select({ id: productIdentities.id, publicContactEnabled: productIdentities.publicContactEnabled }).from(productIdentities).where(and(eq(productIdentities.tagToken, input.tagToken), eq(productIdentities.status, "active"))).limit(1);
    if (!product) throw new TRPCError({ code: "NOT_FOUND", message: "هوية المنتج غير موجودة أو غير متاحة." });
    const publicReference = makeReference("SENSE-R");
    const [created] = await db.insert(recoveryCases).values({ publicReference, productId: product.id, municipalityId: input.municipalityId, status: "found", finderMessage: input.finderMessage });
    await db.update(productIdentities).set({ recoveryStatus: "found" }).where(eq(productIdentities.id, product.id));
    await db.insert(productEvents).values({ productId: product.id, eventType: "found", municipalityId: input.municipalityId, publicNote: "تم فتح بلاغ العثور دون كشف هوية المبلّغ." });
    return { publicReference, caseId: Number(created.insertId), contactRelayEnabled: product.publicContactEnabled };
  }),

  listMunicipalQueue: protectedProcedure.input(z.object({ municipalityId: z.number().int().positive() })).query(async ({ ctx, input }) => {
    if (!["service_officer", "supervisor", "municipality_admin", "platform_admin"].includes(ctx.user.role)) throw new TRPCError({ code: "FORBIDDEN", message: "هذا المسار مخصص لموظفي التشغيل البلدي." });
    const db = await requireDb();
    return db.select({ publicReference: recoveryCases.publicReference, status: recoveryCases.status, finderMessage: recoveryCases.finderMessage, createdAt: recoveryCases.createdAt, productReference: productIdentities.publicReference, productTitle: productIdentities.title }).from(recoveryCases).innerJoin(productIdentities, eq(recoveryCases.productId, productIdentities.id)).where(and(eq(recoveryCases.municipalityId, input.municipalityId), eq(recoveryCases.status, "found"))).orderBy(desc(recoveryCases.createdAt));
  }),
});
