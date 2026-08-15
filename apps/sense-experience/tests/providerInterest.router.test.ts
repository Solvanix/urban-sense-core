import { describe, expect, it } from "vitest";
import { createMemoryProviderInterestStore } from "../server/providerInterestService.js";
import { appRouter } from "../server/router.js";

const input = {
  brandName: "اختبار محلي غير منشور",
  providerType: "restaurant" as const,
  area: "منطقة اختبار",
  contactName: "مستخدم اختبار",
  contactChannel: "test@example.invalid",
  shortDescription: "سجل اختبار برمجي فقط للتحقق من حدود خدمة المراجعة دون نشر أو تواصل حقيقي.",
  reviewConsent: true as const
};

describe("provider interest API contract", () => {
  it("accepts a public interest submission without returning private contact details", async () => {
    const store = createMemoryProviderInterestStore();
    const caller = appRouter.createCaller({ store, reviewer: null });
    const result = await caller.providerInterest.submit(input);

    expect(result.status).toBe("interest_submitted");
    expect(result).not.toHaveProperty("contactChannel");
    expect((await store.listForReview())[0]?.contactChannel).toBe("test@example.invalid");
  });

  it("blocks reviewer routes without a reviewer context", async () => {
    const store = createMemoryProviderInterestStore();
    const caller = appRouter.createCaller({ store, reviewer: null });
    await expect(caller.providerInterest.listForReview()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("records a reasoned reviewer decision only in a reviewer context", async () => {
    const store = createMemoryProviderInterestStore();
    const publicCaller = appRouter.createCaller({ store, reviewer: null });
    const submitted = await publicCaller.providerInterest.submit(input);
    const reviewerCaller = appRouter.createCaller({ store, reviewer: { id: "reviewer-test", role: "reviewer" } });

    const decision = await reviewerCaller.providerInterest.decide({
      interestId: submitted.id,
      outcome: "invited_to_onboard",
      reason: "طلب مناسب لحدود التجربة البرمجية الأولى."
    });

    expect(decision.reviewDecision).toMatchObject({ reviewerId: "reviewer-test", outcome: "invited_to_onboard" });
    expect((await reviewerCaller.providerInterest.listForReview())[0]?.status).toBe("invited_to_onboard");
  });
});
