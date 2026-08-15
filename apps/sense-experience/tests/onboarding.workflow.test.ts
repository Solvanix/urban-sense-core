import { describe, expect, it } from "vitest";
import { recordReviewDecision, verifyClaim } from "../src/onboarding/review.js";
import { addClaim, approveForPublication, createProviderApplication, requestCompletion, toPublicProfile } from "../src/onboarding/workflow.js";

const input = {
  providerType: "restaurant" as const,
  brandName: "مطبخ التلال",
  area: "رام الله",
  privateContact: {
    contactName: "مسؤول الملف",
    preferredChannel: "email" as const,
    contactValue: "provider@example.test"
  },
  consents: {
    dataProcessing: true as const,
    humanReview: true as const,
    publicListing: true
  },
  firstOffer: {
    category: "تجربة طعام محلية",
    guestJourney: "يحجز الضيف استفسارًا، ويتلقى تأكيدًا من المزود، ثم يزور المكان في الموعد المتفق عليه.",
    languages: ["ar" as const],
    inquiryMethod: "contact_request" as const
  }
};

describe("provider onboarding workflow", () => {
  it("creates a submitted application only with required private consent", () => {
    const application = createProviderApplication(input, new Date("2026-08-15T00:00:00.000Z"));
    expect(application.status).toBe("submitted");
    expect(application.createdAt).toBe("2026-08-15T00:00:00.000Z");
  });

  it("blocks approval when the provider did not consent to public listing", () => {
    const application = createProviderApplication({ ...input, consents: { ...input.consents, publicListing: false } });
    expect(() => approveForPublication(application)).toThrow("Public-listing consent");
  });

  it("keeps provider-stated claims out of the public profile", () => {
    const withClaim = addClaim(createProviderApplication(input), {
      type: "accessibility",
      value: "مدخل مناسب"
    });
    const publicProfile = toPublicProfile(approveForPublication(withClaim));
    expect(publicProfile.verifiedClaims).toEqual([]);
    expect(publicProfile).not.toHaveProperty("privateContact");
  });

  it("does not allow a completion request to be approved directly", () => {
    const needsCompletion = requestCompletion(createProviderApplication(input));
    expect(() => approveForPublication(needsCompletion)).toThrow("Only submitted applications");
  });

  it("allows only reviewers to verify a provider-stated claim", () => {
    const withClaim = addClaim(createProviderApplication(input), { type: "sustainability", value: "نستخدم موردين محليين" });
    expect(() => verifyClaim(withClaim, { id: "provider-1", role: "provider" }, 0)).toThrow("Only a reviewer");
    const verified = verifyClaim(withClaim, { id: "reviewer-1", role: "reviewer" }, 0);
    expect(verified.claims[0]?.verificationStatus).toBe("verified");
  });

  it("records a reviewer decision with a reason and no hidden approval", () => {
    const result = recordReviewDecision(
      createProviderApplication(input),
      { id: "reviewer-1", role: "reviewer" },
      "needs_completion",
      "يرجى توضيح طريقة الاستفسار للزائر.",
      new Date("2026-08-15T09:00:00.000Z")
    );
    expect(result.application.status).toBe("needs_completion");
    expect(result.decision).toMatchObject({ reviewerId: "reviewer-1", outcome: "needs_completion" });
    expect(result.decision.decidedAt).toBe("2026-08-15T09:00:00.000Z");
  });
});
