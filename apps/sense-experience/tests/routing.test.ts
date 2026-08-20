import { describe, expect, it } from "vitest";
import { normalizePathname, resolveSenseRoute } from "../src/routing.js";

describe("SENSE Experience Arabic routing", () => {
  it("normalizes encoded Arabic paths before choosing a screen", () => {
    expect(normalizePathname("/%D8%A7%D9%86%D8%B6%D9%85")).toBe("/انضم");
    expect(resolveSenseRoute("/%D8%A7%D9%86%D8%B6%D9%85")).toBe("provider-onboarding");
  });

  it("routes an encoded reviewer return URL to the constrained reviewer screen", () => {
    expect(resolveSenseRoute("/%D9%85%D8%B1%D8%A7%D8%AC%D8%B9%D8%A9")).toBe("reviewer-queue");
  });
});
