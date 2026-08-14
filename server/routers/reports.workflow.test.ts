import { beforeEach, describe, expect, it, vi } from "vitest";

const { getDbMock, storagePutMock } = vi.hoisted(() => ({
  getDbMock: vi.fn(),
  storagePutMock: vi.fn(),
}));

vi.mock("../db", () => ({ getDb: getDbMock }));
vi.mock("../storage", () => ({ storagePut: storagePutMock }));

import {
  auditEvents,
  fieldAssignments,
  municipalities,
  municipalityMemberships,
  reportEvidence,
  reportRatings,
  reportStatusHistory,
  reports,
} from "../../drizzle/schema";
import type { TrpcContext } from "../_core/context";
import { reportsRouter } from "./reports";

type WorkflowState = {
  report: Record<string, any> | null;
  assignments: Record<string, any>[];
  evidence: Record<string, any>[];
  history: Record<string, any>[];
  audits: Record<string, any>[];
  ratings: Record<string, any>[];
  membershipQueue: Record<string, any>[];
  nextId: number;
};

function createContext(role: TrpcContext["user"] extends infer T ? NonNullable<T>["role"] : never, id: number): TrpcContext {
  return {
    user: {
      id,
      openId: `workflow-${id}`,
      name: `مستخدم ${id}`,
      email: `workflow-${id}@example.test`,
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

function query(rows: Record<string, any>[]) {
  const builder: any = {
    where: () => builder,
    orderBy: () => builder,
    limit: async () => rows,
    then: (resolve: (value: Record<string, any>[]) => unknown) => Promise.resolve(rows).then(resolve),
  };
  return builder;
}

function createWorkflowDb(state: WorkflowState) {
  const select = vi.fn(() => ({
    from: (table: unknown) => {
      if (table === municipalities) return query([{ id: 1, nameAr: "بلدية الاختبار", isActive: true }]);
      if (table === reports) return query(state.report ? [state.report] : []);
      if (table === municipalityMemberships) return query([state.membershipQueue.shift() ?? null].filter(Boolean));
      if (table === fieldAssignments) return query(state.assignments);
      if (table === reportEvidence) return query(state.evidence);
      if (table === auditEvents) return query(state.audits.slice(-1));
      if (table === reportRatings) return query(state.ratings);
      return query([]);
    },
  }));

  const insert = vi.fn((table: unknown) => ({
    values: (value: Record<string, any>) => {
      const id = state.nextId++;
      if (table === reports) state.report = { id, ...value, status: value.status ?? "pending", createdAt: new Date(), updatedAt: new Date(), closedAt: null };
      if (table === fieldAssignments) state.assignments.push({ id, ...value, status: value.status ?? "assigned" });
      if (table === reportEvidence) state.evidence.push({ id, ...value });
      if (table === reportStatusHistory) state.history.push({ id, ...value });
      if (table === auditEvents) state.audits.push({ id, ...value });
      if (table === reportRatings) state.ratings.push({ id, ...value });
      const write: any = {
        $returningId: async () => [{ id }],
        then: (resolve: (result: unknown) => unknown) => Promise.resolve({ affectedRows: 1 }).then(resolve),
      };
      return write;
    },
  }));

  const update = vi.fn((table: unknown) => ({
    set: (values: Record<string, any>) => ({
      where: async () => {
        if (table === reports && state.report) Object.assign(state.report, values);
        if (table === fieldAssignments && state.assignments[0]) Object.assign(state.assignments[0], values);
        if (table === reportRatings && state.ratings[0]) Object.assign(state.ratings[0], values);
        return { affectedRows: 1 };
      },
    }),
  }));

  return { select, insert, update };
}

describe("reports workflow integration", () => {
  let state: WorkflowState;

  beforeEach(() => {
    state = { report: null, assignments: [], evidence: [], history: [], audits: [], ratings: [], membershipQueue: [], nextId: 1 };
    getDbMock.mockResolvedValue(createWorkflowDb(state));
    storagePutMock.mockResolvedValue({ key: "reports/1/users/30/evidence.jpg", url: "/manus-storage/reports/1/users/30/evidence.jpg" });
  });

  it("creates, reviews, assigns, evidences, verifies, resolves, rates, and audits one report", async () => {
    state.membershipQueue.push({ municipalityId: 1, userId: 10, role: "citizen", isActive: true });
    const citizen = reportsRouter.createCaller(createContext("citizen", 10));
    const created = await citizen.create({
      municipalityId: 1,
      title: "إنارة معطلة قرب المدرسة الأساسية",
      description: "عمود الإنارة قرب المدرسة الأساسية متعطل منذ يومين ويؤثر على سلامة المشاة مساءً.",
      locationDescription: "الحي الشرقي، بجانب المدرسة الأساسية",
      priority: "high",
    });
    expect(created.id).toBe(1);
    expect(state.report?.status).toBe("pending");

    state.membershipQueue.push({ municipalityId: 1, userId: 20, role: "service_officer", isActive: true });
    await reportsRouter.createCaller(createContext("service_officer", 20)).review({ reportId: 1, decision: "accepted", notes: "تمت مراجعة البلاغ وهو صالح للمعالجة." });
    expect(state.report?.status).toBe("under_review");

    state.membershipQueue.push(
      { municipalityId: 1, userId: 20, role: "service_officer", isActive: true },
      { municipalityId: 1, userId: 1, role: "field_worker", isActive: true },
    );
    await reportsRouter.createCaller(createContext("service_officer", 20)).assign({ reportId: 1, assignedToUserId: 1, notes: "فحص الموقع ورفع الدليل." });
    expect(state.report?.status).toBe("assigned");

    const platformAdmin = reportsRouter.createCaller(createContext("platform_admin", 1));
    await platformAdmin.startWork({ reportId: 1, reason: "بدأ الفريق تنفيذ المعالجة." });
    expect(state.report?.status).toBe("in_progress");

    await platformAdmin.uploadEvidence({ reportId: 1, kind: "before", fileName: "before.jpg", mimeType: "image/jpeg", contentBase64: Buffer.from("before-evidence").toString("base64") });
    await platformAdmin.uploadEvidence({ reportId: 1, kind: "after", fileName: "after.jpg", mimeType: "image/jpeg", contentBase64: Buffer.from("after-evidence").toString("base64") });
    expect(state.evidence.map(item => item.kind)).toEqual(["before", "after"]);

    await platformAdmin.submitForVerification({ reportId: 1, reason: "اكتملت المعالجة وأُرفقت الأدلة." });
    expect(state.report?.status).toBe("awaiting_verification");

    state.membershipQueue.push({ municipalityId: 1, userId: 40, role: "supervisor", isActive: true });
    await reportsRouter.createCaller(createContext("supervisor", 40)).verifyClosure({ reportId: 1, approved: true, reason: "تمت مراجعة الأدلة واعتماد الإغلاق." });
    expect(state.report?.status).toBe("resolved");

    await citizen.rate({ reportId: 1, score: 5, comment: "تمت المعالجة بصورة جيدة." });
    expect(state.ratings).toHaveLength(1);
    expect(state.history.map(item => item.toStatus)).toEqual(["pending", "under_review", "assigned", "in_progress", "awaiting_verification", "resolved"]);
    expect(state.audits.length).toBeGreaterThanOrEqual(8);
    expect(state.audits.every(item => typeof item.eventHash === "string" && item.eventHash.length === 64)).toBe(true);
    expect(state.audits.slice(1).every((item, index) => item.previousHash === state.audits[index]?.eventHash)).toBe(true);
  });
});
