import { describe, expect, it } from "vitest";
import { buildAuditEventHash } from "./auditLedger";
import { assertReportTransition, type MunicipalRole, type ReportStatus } from "./reportPolicy";

describe("civic report lifecycle", () => {
  it("permits the documented end-to-end lifecycle only for the responsible role", () => {
    const workflow: Array<{ role: MunicipalRole; from: ReportStatus; to: ReportStatus }> = [
      { role: "service_officer", from: "pending", to: "under_review" },
      { role: "service_officer", from: "under_review", to: "assigned" },
      { role: "field_worker", from: "assigned", to: "in_progress" },
      { role: "field_worker", from: "in_progress", to: "awaiting_verification" },
      { role: "supervisor", from: "awaiting_verification", to: "resolved" },
    ];

    workflow.forEach(step => expect(() => assertReportTransition(step.role, step.from, step.to)).not.toThrow());
  });

  it("blocks an attempt to skip verification and close a report directly", () => {
    expect(() => assertReportTransition("service_officer", "under_review", "resolved")).toThrow();
    expect(() => assertReportTransition("field_worker", "in_progress", "resolved")).toThrow();
  });

  it("creates a tamper-evident audit chain for consecutive report events", () => {
    const firstPayload = {
      municipalityId: 1,
      actorUserId: 22,
      entityType: "report",
      entityId: "7",
      action: "report.created",
      previousValue: null,
      nextValue: { status: "pending" },
      reason: "إنشاء بلاغ جديد.",
      previousHash: null,
      createdAt: "2026-08-14T00:00:00.000Z",
    };
    const firstHash = buildAuditEventHash(firstPayload);
    const secondPayload = {
      ...firstPayload,
      action: "report.status_changed",
      previousValue: { status: "pending" },
      nextValue: { status: "under_review" },
      previousHash: firstHash,
      createdAt: "2026-08-14T00:01:00.000Z",
    };
    const secondHash = buildAuditEventHash(secondPayload);

    expect(firstHash).toHaveLength(64);
    expect(secondHash).toHaveLength(64);
    expect(secondHash).not.toBe(firstHash);
    expect(buildAuditEventHash({ ...secondPayload, reason: "سبب معدل" })).not.toBe(secondHash);
  });
});
