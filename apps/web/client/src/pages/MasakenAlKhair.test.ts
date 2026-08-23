import { describe, expect, it } from "vitest";
import { masakenStandards } from "./MasakenAlKhair";

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
});
