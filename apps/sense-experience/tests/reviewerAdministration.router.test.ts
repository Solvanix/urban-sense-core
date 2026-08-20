import { describe, expect, it } from "vitest";
import { createMemoryProviderInterestStore } from "../server/providerInterestService.js";
import { createMemoryReviewerIdentityStore } from "../server/reviewerIdentityService.js";
import { appRouter } from "../server/router.js";

describe("reviewer administration API contract", () => {
  it("blocks a normal reviewer from assigning roles", async () => {
    const reviewerStore = createMemoryReviewerIdentityStore();
    const caller = appRouter.createCaller({ store: createMemoryProviderInterestStore(), reviewerStore, reviewer: { id: "reviewer-1", role: "reviewer" } });

    await expect(caller.reviewerAdministration.assignRole({
      provider: "external_oidc",
      subject: "new-reviewer",
      role: "reviewer",
      reason: "توسيع فريق المراجعة ضمن التجربة المحدودة."
    })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("lets an administrator assign one active reviewer role and records an audit event", async () => {
    const reviewerStore = createMemoryReviewerIdentityStore(
      [{ id: "admin-1", provider: "external_oidc", subject: "admin-subject", state: "active" }],
      [{ reviewerIdentityId: "admin-1", role: "administrator", state: "active" }]
    );
    const caller = appRouter.createCaller({ store: createMemoryProviderInterestStore(), reviewerStore, reviewer: { id: "admin-1", role: "administrator" } });

    const result = await caller.reviewerAdministration.assignRole({
      provider: "external_oidc",
      subject: "independent-reviewer",
      displayName: "مراجع مستقل",
      role: "reviewer",
      reason: "إسناد مراجعة ملفات التجربة وفق قرار إداري موثق."
    });

    expect(result).toMatchObject({ role: "reviewer", eventType: "reviewer_role_assigned" });
    expect(reviewerStore.listAuditEvents()).toHaveLength(1);
    await expect(reviewerStore.findActiveRole(result.reviewerIdentityId)).resolves.toMatchObject({ role: "reviewer", state: "active" });
  });
});
