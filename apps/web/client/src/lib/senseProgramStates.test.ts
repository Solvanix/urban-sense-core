import { describe, expect, it } from "vitest";
import { learningProgramState, providerReadinessState } from "./senseProgramStates";

describe("public program states", () => {
  it("keeps provider readiness truthful while the independent service is not public", () => {
    expect(providerReadinessState.enrollmentOpen).toBe(false);
    expect(providerReadinessState.status).toContain("التشغيل المستقل");
    expect(providerReadinessState.sourceHref).toContain("TourismPublicSite.tsx");
  });

  it("labels learning as a documented future state rather than a course enrollment", () => {
    expect(learningProgramState.enrollmentOpen).toBe(false);
    expect(learningProgramState.status).toBe("موثقة كحالة مستقبلية");
    expect(learningProgramState.description).toContain("لا توجد دورة");
  });
});
