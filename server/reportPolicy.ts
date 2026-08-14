import { TRPCError } from "@trpc/server";

export const municipalRoleValues = [
  "citizen",
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

export type MunicipalRole = (typeof municipalRoleValues)[number];
export type ReportStatus = (typeof reportStatusValues)[number];

const legalTransitions: Record<ReportStatus, ReportStatus[]> = {
  pending: ["under_review", "rejected", "cancelled"],
  under_review: ["assigned", "rejected", "cancelled"],
  assigned: ["in_progress", "cancelled"],
  in_progress: ["awaiting_verification", "cancelled"],
  awaiting_verification: ["resolved", "in_progress"],
  resolved: ["reopened"],
  rejected: [],
  cancelled: [],
  reopened: ["under_review", "assigned"],
};

const allowedRolesForTransition: Partial<Record<`${ReportStatus}:${ReportStatus}`, MunicipalRole[]>> = {
  "pending:under_review": ["service_officer", "municipality_admin", "supervisor", "platform_admin"],
  "pending:rejected": ["service_officer", "municipality_admin", "supervisor", "platform_admin"],
  "pending:cancelled": ["service_officer", "municipality_admin", "platform_admin"],
  "under_review:assigned": ["service_officer", "municipality_admin", "platform_admin"],
  "under_review:rejected": ["service_officer", "municipality_admin", "supervisor", "platform_admin"],
  "under_review:cancelled": ["service_officer", "municipality_admin", "platform_admin"],
  "assigned:in_progress": ["field_worker"],
  "assigned:cancelled": ["service_officer", "municipality_admin", "platform_admin"],
  "in_progress:awaiting_verification": ["field_worker"],
  "in_progress:cancelled": ["service_officer", "municipality_admin", "platform_admin"],
  "awaiting_verification:resolved": ["supervisor", "municipality_admin", "platform_admin"],
  "awaiting_verification:in_progress": ["supervisor", "municipality_admin", "platform_admin"],
  "resolved:reopened": ["citizen", "service_officer", "supervisor", "municipality_admin", "platform_admin"],
  "reopened:under_review": ["service_officer", "municipality_admin", "supervisor", "platform_admin"],
  "reopened:assigned": ["service_officer", "municipality_admin", "platform_admin"],
};

export function assertRole(role: MunicipalRole, allowedRoles: MunicipalRole[]) {
  if (!allowedRoles.includes(role)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "لا تملك الصلاحية اللازمة لتنفيذ هذا الإجراء.",
    });
  }
}

export function assertReportTransition(role: MunicipalRole, from: ReportStatus, to: ReportStatus) {
  if (!legalTransitions[from].includes(to)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "انتقال حالة البلاغ المطلوب غير مسموح.",
    });
  }

  const key = `${from}:${to}` as const;
  const allowedRoles = allowedRolesForTransition[key];
  if (!allowedRoles || !allowedRoles.includes(role)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "لا يسمح دورك بتغيير البلاغ إلى هذه الحالة.",
    });
  }
}

export function isStaffRole(role: MunicipalRole) {
  return role !== "citizen";
}
