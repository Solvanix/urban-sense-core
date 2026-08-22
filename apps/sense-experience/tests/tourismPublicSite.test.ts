import { describe, expect, it } from "vitest";
import { getPublicPage } from "../src/ui/TourismPublicSite.js";

describe("SENSE Experience public navigation", () => {
  it("maps declared public routes to their page model", () => {
    expect(getPublicPage("/")).toBe("home");
    expect(getPublicPage("/اكتشف")).toBe("discover");
    expect(getPublicPage("/discover")).toBe("discover");
    expect(getPublicPage("/للشركاء")).toBe("partners");
    expect(getPublicPage("/دليل-الميزات")).toBe("survey-guide");
    expect(getPublicPage("/feature-guide")).toBe("survey-guide");
  });

  it("keeps unknown paths on the public gateway rather than inventing a listing", () => {
    expect(getPublicPage("/ramallah-provider-123")).toBe("home");
  });
});
