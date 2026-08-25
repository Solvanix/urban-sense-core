import { describe, expect, it } from "vitest";
import { getWorkCompassOutput } from "./workCompass";

describe("work compass output", () => {
  it("turns a need, AI role, and verification choice into a reviewable outcome", () => {
    const output = getWorkCompassOutput({ need: "place", aiRole: "research", verification: "source" });
    expect(output.title).toContain("مكان أو ذاكرة");
    expect(output.outcome).toContain("سجل مصدر");
    expect(output.nextStep).toContain("مصدر ودليل");
    expect(output.checklist).toContain("تسجيل ما تعلّمه الفرد أو الفريق");
  });
});
