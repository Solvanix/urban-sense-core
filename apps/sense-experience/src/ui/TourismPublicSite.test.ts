import { describe, expect, it } from "vitest";
import { getPublicPage } from "./TourismPublicSite.js";

describe("getPublicPage", () => {
  it("routes the responsible-vision Arabic and Latin URLs to the public vision page", () => {
    expect(getPublicPage("/رؤية-مسؤولة")).toBe("vision");
    expect(getPublicPage("/responsible-vision")).toBe("vision");
  });

  it("routes provider-readiness URLs to a public learning boundary, not provider onboarding", () => {
    expect(getPublicPage("/جاهزية-المزود")).toBe("readiness");
    expect(getPublicPage("/provider-readiness")).toBe("readiness");
  });

  it("keeps existing public page routing unchanged", () => {
    expect(getPublicPage("/اكتشف")).toBe("discover");
    expect(getPublicPage("/للشركاء")).toBe("partners");
    expect(getPublicPage("/")).toBe("home");
  });
});
