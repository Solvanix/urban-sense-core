import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import {
  municipalities,
  municipalityMemberships,
  reports,
  reportStatusHistory,
  serviceCategories,
} from "../../drizzle/schema";
import { getDb } from "../db";
import { protectedProcedure, router } from "../_core/trpc";
import type { MunicipalRole } from "../reportPolicy";

const analyticsRoles: MunicipalRole[] = ["service_officer", "field_worker", "supervisor", "municipality_admin", "platform_admin"];

async function requireDb() {
  const db = await getDb();
  if (!db) {
    throw new TRPCError({ code: "PRECONDITION_FAILED", message: "قاعدة البيانات غير متاحة حاليًا. أعد المحاولة لاحقًا." });
  }
  return db;
}

async function requireMunicipalityAccess(user: { id: number; role: string }, municipalityId: number) {
  const db = await requireDb();
  const [municipality] = await db.select({ id: municipalities.id, nameAr: municipalities.nameAr, code: municipalities.code })
    .from(municipalities)
    .where(and(eq(municipalities.id, municipalityId), eq(municipalities.isActive, true)))
    .limit(1);
  if (!municipality) throw new TRPCError({ code: "NOT_FOUND", message: "نطاق البلدية غير موجود أو غير نشط." });
  if (user.role !== "platform_admin") {
    const [membership] = await db.select({ role: municipalityMemberships.role })
      .from(municipalityMemberships)
      .where(and(
        eq(municipalityMemberships.municipalityId, municipalityId),
        eq(municipalityMemberships.userId, user.id),
        eq(municipalityMemberships.isActive, true),
      ))
      .limit(1);
    if (!membership || !analyticsRoles.includes(membership.role as MunicipalRole)) {
      throw new TRPCError({ code: "FORBIDDEN", message: "ليست لديك صلاحية عرض تحليلات هذا النطاق." });
    }
  }
  return { db, municipality };
}

const toNumber = (value: unknown) => Number(value ?? 0);

export const analyticsRouter = router({
  overview: protectedProcedure
    .input(z.object({ municipalityId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const { db, municipality } = await requireMunicipalityAccess(ctx.user, input.municipalityId);
      const [totals] = await db.select({
        total: sql<number>`count(*)`,
        open: sql<number>`sum(case when ${reports.status} not in ('resolved','rejected','cancelled') then 1 else 0 end)`,
        resolved: sql<number>`sum(case when ${reports.status} = 'resolved' then 1 else 0 end)`,
        awaitingVerification: sql<number>`sum(case when ${reports.status} = 'awaiting_verification' then 1 else 0 end)`,
        critical: sql<number>`sum(case when ${reports.priority} = 'critical' then 1 else 0 end)`,
        avgClosureHours: sql<number>`avg(case when ${reports.closedAt} is not null then timestampdiff(hour, ${reports.createdAt}, ${reports.closedAt}) end)`,
      }).from(reports).where(eq(reports.municipalityId, input.municipalityId));

      const statusRows = await db.select({
        status: reports.status,
        value: sql<number>`count(*)`,
      }).from(reports).where(eq(reports.municipalityId, input.municipalityId)).groupBy(reports.status).orderBy(desc(sql`count(*)`));

      const categoryRows = await db.select({
        category: serviceCategories.nameAr,
        value: sql<number>`count(${reports.id})`,
      }).from(reports)
        .leftJoin(serviceCategories, eq(reports.categoryId, serviceCategories.id))
        .where(eq(reports.municipalityId, input.municipalityId))
        .groupBy(serviceCategories.nameAr)
        .orderBy(desc(sql`count(${reports.id})`));

      const recentRows = await db.select({
        id: reports.id,
        reference: reports.publicReference,
        title: reports.title,
        status: reports.status,
        priority: reports.priority,
        createdAt: reports.createdAt,
        updatedAt: reports.updatedAt,
        category: serviceCategories.nameAr,
      }).from(reports)
        .leftJoin(serviceCategories, eq(reports.categoryId, serviceCategories.id))
        .where(eq(reports.municipalityId, input.municipalityId))
        .orderBy(desc(reports.updatedAt))
        .limit(12);

      const historyRows = await db.select({
        toStatus: reportStatusHistory.toStatus,
        value: sql<number>`count(*)`,
      }).from(reportStatusHistory)
        .innerJoin(reports, eq(reportStatusHistory.reportId, reports.id))
        .where(eq(reports.municipalityId, input.municipalityId))
        .groupBy(reportStatusHistory.toStatus)
        .orderBy(asc(reportStatusHistory.toStatus));

      return {
        municipality,
        generatedAt: new Date(),
        cards: {
          total: toNumber(totals?.total),
          open: toNumber(totals?.open),
          resolved: toNumber(totals?.resolved),
          awaitingVerification: toNumber(totals?.awaitingVerification),
          critical: toNumber(totals?.critical),
          avgClosureHours: totals?.avgClosureHours == null ? null : Math.round(toNumber(totals.avgClosureHours) * 10) / 10,
        },
        byStatus: statusRows.map(row => ({ status: row.status, value: toNumber(row.value) })),
        byCategory: categoryRows.map(row => ({ category: row.category || "غير مصنف", value: toNumber(row.value) })),
        lifecycle: historyRows.map(row => ({ status: row.toStatus, value: toNumber(row.value) })),
        recent: recentRows,
      };
    }),
});

export type AnalyticsRouter = typeof analyticsRouter;

export function isAnalyticsRole(role: string): role is MunicipalRole {
  return analyticsRoles.includes(role as MunicipalRole);
}
