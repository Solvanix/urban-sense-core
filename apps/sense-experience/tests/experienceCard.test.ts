import { describe, expect, it } from "vitest";
import { createExperienceDraft, projectVisitorExperienceCard } from "../src/onboarding/experienceCard.js";

const draft = {
  title: "صباح خبز وحكاية محلية",
  category: "تجربة طعام",
  publicArea: "منطقة عامة",
  guestGoal: "التعرف إلى صناعة خبز محلي وتناول وجبة ضمن تجربة مجتمعية.",
  stages: ["يتفق الضيف على الوقت قبل الوصول", "يشارك في إعداد الخبز", "يتلقى ملخصًا لما حدث"],
  accessNeeds: ["step_free" as const],
  accessOperationalNote: "يلزم التحقق الميداني من المنحدر.",
  privateOperationalNotes: "لا تنشر ترتيب فريق التشغيل.",
  publicListingConsent: true
};

describe("experience card projection", () => {
  it("does not copy private operational or provider-stated access details into the visitor card", () => {
    const publicCard = projectVisitorExperienceCard(createExperienceDraft(draft), [{ type: "accessibility", value: "مسار بلا درجات", verificationStatus: "provider_stated" }]);
    const serialised = JSON.stringify(publicCard);
    expect(serialised).not.toContain("التحقق الميداني");
    expect(serialised).not.toContain("ترتيب فريق التشغيل");
    expect(publicCard.verifiedAccessibilityClaims).toEqual([]);
  });

  it("exposes only verified accessibility claims", () => {
    const publicCard = projectVisitorExperienceCard(createExperienceDraft(draft), [{ type: "accessibility", value: "مسار بلا درجات", verificationStatus: "verified" }]);
    expect(publicCard.verifiedAccessibilityClaims).toHaveLength(1);
  });

  it("requires public-listing consent before a visitor card can be created", () => {
    expect(() => projectVisitorExperienceCard(createExperienceDraft({ ...draft, publicListingConsent: false }), [])).toThrow("Public-listing consent");
  });
});
