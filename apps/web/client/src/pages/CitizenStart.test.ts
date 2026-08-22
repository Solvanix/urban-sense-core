import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("CitizenStart", () => {
  it("guides citizens into the existing report and follow-up routes without collecting data on the entry page", () => {
    const source = readFileSync(new URL("./CitizenStart.tsx", import.meta.url), "utf8");
    expect(source).toContain('href="/بلاغ-جديد"');
    expect(source).toContain('href="/بلاغاتي"');
    expect(source).toContain("لا نطلب منك بيانات في هذه الصفحة");
    expect(source).toContain("هذه ليست قناة طوارئ");
  });
});
