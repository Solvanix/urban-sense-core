import { describe, expect, it } from "vitest";
import { citizenStartHref, experienceAccessHref, experienceClaimsHref, experienceHubHref, experienceStudioHref, getRootView, independencePathHref, isSensePortalSearch, masakenAlKhairHref, masakenOwnerHref, masakenPlanHref, masakenTeamHref, municipalOperationsHref, sensePortalHref, urbanSenseHref } from "./sensePortalRoute";

describe("SENSE portal public entry", () => {
  it("uses a root URL query that survives hosts without SPA subpath fallback", () => {
    expect(sensePortalHref).toBe("/?view=sense");
    expect(urbanSenseHref).toBe("/?view=urban");
    expect(municipalOperationsHref).toBe("/?view=operations");
    expect(citizenStartHref).toBe("/?view=citizen");
    expect(experienceHubHref).toBe("/?view=experience");
    expect(experienceStudioHref).toBe("/?view=experience-studio");
    expect(experienceAccessHref).toBe("/?view=experience-access");
    expect(experienceClaimsHref).toBe("/?view=experience-claims");
    expect(masakenAlKhairHref).toBe("/?view=masaken");
    expect(masakenOwnerHref).toBe("/?view=masaken-owner");
    expect(masakenPlanHref).toBe("/?view=masaken-plan");
    expect(masakenTeamHref).toBe("/?view=masaken-team");
    expect(independencePathHref).toBe("/?view=independence");
    expect(isSensePortalSearch("?view=sense")).toBe(true);
    expect(isSensePortalSearch("?v=release&view=sense")).toBe(true);
    expect(isSensePortalSearch("?view=other")).toBe(false);
  });

  it("routes the municipal admin entry through the served root without making it a public dashboard", () => {
    expect(getRootView("?view=urban")).toBe("urban");
    expect(getRootView("?view=operations")).toBe("operations");
    expect(getRootView("?view=sense")).toBe("sense");
    expect(getRootView("?view=access")).toBe("access");
    expect(getRootView("?view=citizen")).toBe("citizen");
    expect(getRootView("?view=experience")).toBe("experience");
    expect(getRootView("?view=experience-studio")).toBe("experience-studio");
    expect(getRootView("?view=experience-access")).toBe("experience-access");
    expect(getRootView("?view=experience-claims")).toBe("experience-claims");
    expect(getRootView("?view=masaken")).toBe("masaken");
    expect(getRootView("?view=masaken-owner")).toBe("masaken-owner");
    expect(getRootView("?view=masaken-plan")).toBe("masaken-plan");
    expect(getRootView("?view=masaken-team")).toBe("masaken-team");
    expect(getRootView("?view=independence")).toBe("independence");
    expect(getRootView("?view=provider")).toBeNull();
  });
});
