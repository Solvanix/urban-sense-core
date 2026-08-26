import { describe, expect, it } from "vitest";
import { getRecoveryStatus, recoveryBoundaries, recoveryModes } from "./lostItemModel";

describe("lost item and product identity model", () => {
  it("exposes product, finder, and municipality entry points", () => {
    expect(recoveryModes.map((mode) => mode.id)).toEqual(["protect", "found", "municipality"]);
  });

  it("keeps the recovery lifecycle ordered and explicit", () => {
    expect(getRecoveryStatus("tag-ready").label).toBe("بطاقة جاهزة");
    expect(getRecoveryStatus("handoff-ready").label).toBe("جاهز للتسليم");
  });

  it("defines privacy boundaries against permanent tracking and owner disclosure", () => {
    expect(recoveryBoundaries.join(" ")).toContain("تتبعًا دائمًا");
    expect(recoveryBoundaries.join(" ")).toContain("أسماء المالكين");
    expect(recoveryBoundaries.join(" ")).toContain("لا تعتبر NFC بديلًا");
  });
});
