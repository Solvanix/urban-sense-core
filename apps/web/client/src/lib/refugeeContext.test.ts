import { describe, expect, it } from "vitest";
import { refugeeContextGuards, refugeeContextSources } from "./refugeeContext";

describe("refugee context route", () => {
  it("uses dated official-source links for each context", () => {
    expect(refugeeContextSources).toHaveLength(3);
    expect(refugeeContextSources.every((source) => source.href.startsWith("https://www.unrwa.org/"))).toBe(true);
    expect(refugeeContextSources.every((source) => source.updated.length > 10)).toBe(true);
  });
  it("states that the route does not collect beneficiaries, donations, or aid requests", () => {
    const guards = refugeeContextGuards.join(" ");
    expect(guards).toContain("لا توجد هنا استمارة مساعدة");
    expect(guards).toContain("لا توجد تبرعات");
    expect(guards).toContain("لا تمثيل للأونروا");
  });
});
