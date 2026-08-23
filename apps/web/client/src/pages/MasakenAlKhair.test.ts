import { describe, expect, it } from "vitest";
import { masakenStandards } from "./MasakenAlKhair";
import { getPilotReadinessGates, isPilotReadyForLocalReview, normalizeOwnerInterestDraft, normalizePilotControlDraft, ownerInterestDefaults, parsePilotControlDraft, parseReviewedActionIds, pilotControlDefaults } from "@/lib/masakenWorkspace";

describe("Masaken Al-Khair standards board", () => {
  it("keeps the initiative limited to a reviewable standards board", () => {
    expect(masakenStandards).toHaveLength(7);
    expect(masakenStandards.find((standard) => standard.id === "governance")).toMatchObject({ state: "غير متاح الآن" });
    expect(masakenStandards.find((standard) => standard.id === "unit")?.boundary).toContain("عنوان دقيق");
  });

  it("does not define a funded guarantee, automated eligibility, or accessibility certification", () => {
    const boundaries = masakenStandards.map((standard) => standard.boundary).join(" ");
    expect(boundaries).toContain("ضمان إيجار");
    expect(boundaries).toContain("خوارزمية");
    expect(boundaries).toContain("تحقق ميداني تشاركي");
  });

  it("keeps the owner interest draft local, general, and free of exact-address fields", () => {
    const draft = normalizeOwnerInterestDraft({ ...ownerInterestDefaults, unitType: "  غرفة  ", generalArea: "  منطقة عامة  " });
    expect(draft).toMatchObject({ unitType: "غرفة", generalArea: "منطقة عامة" });
    expect(Object.keys(draft)).not.toContain("exactAddress");
    expect(Object.keys(draft)).not.toContain("phone");
  });

  it("tolerates malformed local action-plan state without claiming progress", () => {
    expect(parseReviewedActionIds("not-json")).toEqual([]);
    expect(parseReviewedActionIds('["scope", "pilot"]')).toEqual(["scope", "pilot"]);
  });

  it("keeps the landlord-invitation gate locked until every pilot decision is present", () => {
    expect(isPilotReadyForLocalReview(pilotControlDefaults)).toBe(false);
    const complete = normalizePilotControlDraft({ pilotArea: " مدينة عامة ", beneficiaryGroup: " طلاب موثقون ", referralPartner: " جهة إحالة ", operatingEntity: " لجنة تشغيل ", fundingPosition: "no-guarantee", decisionNote: " قرار أولي " });
    expect(getPilotReadinessGates(complete).every((gate) => gate.isComplete)).toBe(true);
    expect(isPilotReadyForLocalReview(complete)).toBe(true);
  });

  it("parses local pilot decisions defensively without treating malformed input as readiness", () => {
    expect(parsePilotControlDraft("not-json")).toEqual(pilotControlDefaults);
    expect(parsePilotControlDraft('{"pilotArea":"منطقة عامة","fundingPosition":"funded"}')).toMatchObject({ pilotArea: "منطقة عامة", fundingPosition: "funded", referralPartner: "" });
  });
});
