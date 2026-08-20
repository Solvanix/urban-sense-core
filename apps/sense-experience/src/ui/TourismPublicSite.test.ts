import { describe, expect, it } from "vitest";
import { getPublicPage } from "./TourismPublicSite.js";

describe("getPublicPage", () => {
  it("routes the responsible-vision Arabic and Latin URLs to the public vision page", () => {
    expect(getPublicPage("/رؤية-مسؤولة")).toBe("vision");
    expect(getPublicPage("/responsible-vision")).toBe("vision");
  });

  it("keeps existing public page routing unchanged", () => {
    expect(getPublicPage("/اكتشف")).toBe("discover");
    expect(getPublicPage("/للشركاء")).toBe("partners");
    expect(getPublicPage("/")).toBe("home");
  });
});
