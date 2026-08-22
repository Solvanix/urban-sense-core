import { describe, expect, it } from "vitest";
import { createMemoryProviderInterestStore } from "../server/providerInterestService.js";
import { createMemoryReviewerIdentityStore } from "../server/reviewerIdentityService.js";
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
  it("accepts a public interest submission, returns a one-time status receipt, and keeps contact details private", async () => {
    const store = createMemoryProviderInterestStore();
    const caller = appRouter.createCaller({ store, reviewerStore: createMemoryReviewerIdentityStore(), reviewer: null });
    const result = await caller.providerInterest.submit(input);

    expect(result.status).toBe("interest_submitted");
    expect(result.reference).toMatch(/^SX-[A-Z0-9]{10}$/);
    expect(result.accessCode).toMatch(/^[A-Za-z0-9_-]{20,128}$/);
    expect(result).not.toHaveProperty("contactChannel");
    expect((await store.listForReview())[0]?.contactChannel).toBe("test@example.invalid");
  });

  it("returns a provider-safe status view only with the correct reference and one-time access code", async () => {
    const store = createMemoryProviderInterestStore();
    const caller = appRouter.createCaller({ store, reviewerStore: createMemoryReviewerIdentityStore(), reviewer: null });
    const receipt = await caller.providerInterest.submit(input);

    const status = await caller.providerInterest.lookupStatus({ reference: receipt.reference, accessCode: receipt.accessCode });

    expect(status).toMatchObject({ reference: receipt.reference, status: "interest_submitted" });
    expect(status).not.toHaveProperty("brandName");
    expect(status).not.toHaveProperty("contactChannel");
    await expect(caller.providerInterest.lookupStatus({ reference: receipt.reference, accessCode: "wrong-access-code-that-is-long-enough" })).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("blocks reviewer routes without a reviewer context", async () => {
    const store = createMemoryProviderInterestStore();
    const caller = appRouter.createCaller({ store, reviewerStore: createMemoryReviewerIdentityStore(), reviewer: null });
    await expect(caller.providerInterest.listForReview()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("records a reasoned reviewer decision only in a reviewer context", async () => {
    const store = createMemoryProviderInterestStore();
    const reviewerStore = createMemoryReviewerIdentityStore();
    const publicCaller = appRouter.createCaller({ store, reviewerStore, reviewer: null });
    const submitted = await publicCaller.providerInterest.submit(input);
    const reviewerCaller = appRouter.createCaller({ store, reviewerStore, reviewer: { id: "reviewer-test", role: "reviewer" } });

    const persistedInterest = (await store.listForReview())[0];
    if (!persistedInterest) throw new Error("Expected a submitted interest record.");
    const decision = await reviewerCaller.providerInterest.decide({
      interestId: persistedInterest.id,
      outcome: "invited_to_onboard",
      reason: "طلب مناسب لحدود التجربة البرمجية الأولى."
    });

    expect(decision.reviewDecision).toMatchObject({ reviewerId: "reviewer-test", outcome: "invited_to_onboard" });
    expect((await reviewerCaller.providerInterest.listForReview())[0]?.status).toBe("invited_to_onboard");

    const providerStatus = await publicCaller.providerInterest.lookupStatus({ reference: submitted.reference, accessCode: submitted.accessCode });
    expect(providerStatus).toMatchObject({ status: "invited_to_onboard", decision: { outcome: "invited_to_onboard" } });
    expect(providerStatus.decision).not.toHaveProperty("reviewerId");
    expect(providerStatus).not.toHaveProperty("contactChannel");
  });
});
