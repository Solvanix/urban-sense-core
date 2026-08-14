import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "../_core/context";
import { assertReportTransition, type MunicipalRole } from "../reportPolicy";

const { getDbMock } = vi.hoisted(() => ({ getDbMock: vi.fn() }));

vi.mock("../db", () => ({ getDb: getDbMock }));

import { reportsRouter } from "./reports";

const unauthenticatedContext = {
  user: null,
  req: {},
  res: {},
} as unknown as TrpcContext;

function authenticatedContext(role: MunicipalRole, id = 22): TrpcContext {
  return {
    user: {
      id,
      openId: `user-${id}`,
      email: `user-${id}@example.test`,
      name: "مستخدم اختبار",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function queryResult(rows: unknown[]) {
  return {
    from: () => ({
      where: () => ({
        limit: async () => rows,
      }),
    }),
  };
}

function useDbRows(...rowSets: unknown[][]) {
  const select = vi.fn();
  rowSets.forEach(rows => select.mockReturnValueOnce(queryResult(rows)));
  getDbMock.mockResolvedValue({ select } as never);
}

beforeEach(() => {
  getDbMock.mockReset();
});

describe("reports security boundaries", () => {
  it("rejects report creation without an authenticated actor", async () => {
    const caller = reportsRouter.createCaller(unauthenticatedContext);
    await expect(caller.create({
      municipalityId: 1,
      title: "بلاغ إنارة متعطلة في الشارع الرئيسي",
      description: "يوجد عمود إنارة متعطل بالقرب من المدرسة ويحتاج إلى معالجة عاجلة.",
      locationDescription: "الشارع الرئيسي، قرب المدرسة",
      priority: "normal",
    })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects private report reads without an authenticated actor", async () => {
    const caller = reportsRouter.createCaller(unauthenticatedContext);
    await expect(caller.getById({ reportId: 1 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects report review or modification without an authenticated actor", async () => {
    const caller = reportsRouter.createCaller(unauthenticatedContext);
    await expect(caller.review({ reportId: 1, decision: "accepted", notes: "تمت المراجعة والتصنيف." })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects municipality role changes without an authenticated actor", async () => {
    const caller = reportsRouter.createCaller(unauthenticatedContext);
    await expect(caller.municipalities.setMemberRole({ municipalityId: 1, userId: 22, role: "field_worker", isActive: true })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("allows a platform administrator to update an existing membership role and active scope", async () => {
    const select = vi.fn()
      .mockReturnValueOnce(queryResult([{ id: 31 }]))
      .mockReturnValueOnce(queryResult([{ id: 8, municipalityId: 1, userId: 31, role: "field_worker", isActive: true }]))
      .mockReturnValueOnce({ from: () => ({ orderBy: () => ({ limit: async () => [] }) }) });
    const where = vi.fn(async () => ({ affectedRows: 1 }));
    const update = vi.fn(() => ({ set: () => ({ where }) }));
    const insert = vi.fn(() => ({ values: () => ({}) }));
    getDbMock.mockResolvedValue({ select, update, insert } as never);

    const caller = reportsRouter.createCaller(authenticatedContext("platform_admin", 1));
    await expect(caller.municipalities.setMemberRole({ municipalityId: 1, userId: 31, role: "field_worker", isActive: false })).resolves.toEqual({ success: true });
    expect(update).toHaveBeenCalledTimes(1);
    expect(where).toHaveBeenCalledTimes(1);
    expect(insert).toHaveBeenCalledTimes(1);
  });

  it("allows a municipality administrator to reactivate an existing member within the same scope", async () => {
    const select = vi.fn()
      .mockReturnValueOnce(queryResult([{ municipalityId: 1, userId: 20, role: "municipality_admin", isActive: true }]))
      .mockReturnValueOnce(queryResult([{ id: 31 }]))
      .mockReturnValueOnce(queryResult([{ id: 8, municipalityId: 1, userId: 31, role: "field_worker", isActive: false }]))
      .mockReturnValueOnce({ from: () => ({ orderBy: () => ({ limit: async () => [] }) }) });
    const where = vi.fn(async () => ({ affectedRows: 1 }));
    const update = vi.fn(() => ({ set: () => ({ where }) }));
    const insert = vi.fn(() => ({ values: () => ({}) }));
    getDbMock.mockResolvedValue({ select, update, insert } as never);

    const caller = reportsRouter.createCaller(authenticatedContext("municipality_admin", 20));
    await expect(caller.municipalities.setMemberRole({ municipalityId: 1, userId: 31, role: "field_worker", isActive: true })).resolves.toEqual({ success: true });
    expect(update).toHaveBeenCalledTimes(1);
    expect(insert).toHaveBeenCalledTimes(1);
  });

  it("allows a platform administrator to create a new membership within a municipality", async () => {
    const select = vi.fn()
      .mockReturnValueOnce(queryResult([{ id: 44 }]))
      .mockReturnValueOnce(queryResult([]))
      .mockReturnValueOnce({ from: () => ({ orderBy: () => ({ limit: async () => [] }) }) });
    const values = vi.fn(() => ({}));
    const insert = vi.fn(() => ({ values }));
    getDbMock.mockResolvedValue({ select, insert, update: vi.fn() } as never);

    const caller = reportsRouter.createCaller(authenticatedContext("platform_admin", 1));
    await expect(caller.municipalities.setMemberRole({ municipalityId: 1, userId: 44, role: "supervisor", isActive: true })).resolves.toEqual({ success: true });
    expect(insert).toHaveBeenCalledTimes(2);
    expect(values).toHaveBeenCalledTimes(2);
  });

  it("limits a field worker to the legal field transition", () => {
    expect(() => assertReportTransition("field_worker", "assigned", "in_progress")).not.toThrow();
    expect(() => assertReportTransition("field_worker", "awaiting_verification", "resolved")).toThrow();
  });

  it("prevents citizens from assigning a report to field staff", () => {
    expect(() => assertReportTransition("citizen", "under_review", "assigned")).toThrow();
  });

  it("rejects an authenticated citizen trying to view operational reports", async () => {
    useDbRows([{ municipalityId: 1, userId: 22, role: "citizen", isActive: true }]);
    const caller = reportsRouter.createCaller(authenticatedContext("citizen"));
    await expect(caller.listOperations({ municipalityId: 1 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects an authenticated citizen trying to review a report", async () => {
    useDbRows(
      [{ id: 9, municipalityId: 1, citizenId: 77, status: "pending" }],
      [{ municipalityId: 1, userId: 22, role: "citizen", isActive: true }],
    );
    const caller = reportsRouter.createCaller(authenticatedContext("citizen"));
    await expect(caller.review({ reportId: 9, decision: "accepted", notes: "محاولة غير مصرح بها للمراجعة." })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects a citizen reading another citizen's private report", async () => {
    useDbRows(
      [{ id: 9, municipalityId: 1, citizenId: 77, status: "pending" }],
      [{ municipalityId: 1, userId: 22, role: "citizen", isActive: true }],
    );
    const caller = reportsRouter.createCaller(authenticatedContext("citizen"));
    await expect(caller.getById({ reportId: 9 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects a staff user outside the report municipality", async () => {
    useDbRows(
      [{ id: 9, municipalityId: 1, citizenId: 77, status: "pending" }],
      [],
    );
    const caller = reportsRouter.createCaller(authenticatedContext("service_officer"));
    await expect(caller.getById({ reportId: 9 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
