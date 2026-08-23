import { describe, expect, it } from "vitest";
import { appRouter } from "../server/router.js";
import { createMemoryClaimRegistryStore } from "../server/claimRegistryService.js";
import { createMemoryProviderInterestStore, decideProviderInterest, submitProviderInterest } from "../server/providerInterestService.js";
import { createMemoryReviewerIdentityStore } from "../server/reviewerIdentityService.js";

async function setupInvitedProvider() {
  const store = createMemoryProviderInterestStore();
  const receipt = await submitProviderInterest(store, {
    brandName: "رحلة اختبارية", providerType: "guide", area: "منطقة عامة", contactName: "اسم خاص", contactChannel: "private@example.com",
    shortDescription: "وصف خاص كافٍ لطلب المشاركة في برنامج التجربة.", reviewConsent: true
  });
  const interest = await store.findByReference(receipt.reference);
  if (!interest) throw new Error("Missing test interest.");
  await decideProviderInterest(store, interest.id, { id: "reviewer-1", role: "reviewer" }, "invited_to_onboard", "يتوافق الطلب مع نطاق التجربة التجريبية.");
  return { store, receipt };
}

describe("claim registry tRPC", () => {
  it("keeps evidence out of unauthorised review access and requires a reviewer decision", async () => {
    const { store, receipt } = await setupInvitedProvider();
    const claimStore = createMemoryClaimRegistryStore();
    const reviewerStore = createMemoryReviewerIdentityStore();
    const providerCaller = appRouter.createCaller({ store, claimStore, reviewerStore, reviewer: null });
    const claim = await providerCaller.providerClaims.submit({ reference: receipt.reference, accessCode: receipt.accessCode, type: "accessibility", statement: "يوجد مسار بلا درجات عند المدخل الرئيسي وفق وصف المزوّد." });
    await providerCaller.providerClaims.addEvidence({ reference: receipt.reference, accessCode: receipt.accessCode, claimId: claim.id, kind: "document_reference", evidenceReference: "private-evidence-ref-001", summary: "مرجع داخلي خاص بمراجعة دليل المسار." });

    await expect(providerCaller.providerClaims.listForReview()).rejects.toMatchObject({ code: "FORBIDDEN" });

    const reviewerCaller = appRouter.createCaller({ store, claimStore, reviewerStore, reviewer: { id: "reviewer-1", role: "reviewer" } });
    const detail = await reviewerCaller.providerClaims.reviewDetail({ claimId: claim.id });
    expect(detail.evidence[0]?.reference).toBe("private-evidence-ref-001");
    await expect(reviewerCaller.providerClaims.decide({ claimId: claim.id, outcome: "verified", reason: "short" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    const decision = await reviewerCaller.providerClaims.decide({ claimId: claim.id, outcome: "verified", reason: "راجع المراجع الدليل الداخلي وملاءمته للادعاء المقدم." });
    expect(decision.outcome).toBe("verified");
  });
});
