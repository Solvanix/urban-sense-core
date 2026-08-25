import { describe, expect, it } from "vitest";
import {
  citizenStartHref,
  ecosystemExplorerHref,
  getRootView,
  growthJourneyHref,
  isSensePortalSearch,
  loyaltyExplainerHref,
  municipalOperationsHref,
  nationalContinuityHref,
  refugeeContextHref,
  sensePortalHref,
  urbanSenseHref,
  workCompassHref,
} from "./sensePortalRoute";

describe("SENSE portal public entry", () => {
  it("uses served-root query links for the published experiences", () => {
    expect(sensePortalHref).toBe("/?view=sense");
    expect(urbanSenseHref).toBe("/?view=urban");
    expect(municipalOperationsHref).toBe("/?view=operations");
    expect(citizenStartHref).toBe("/?view=citizen");
    expect(ecosystemExplorerHref).toBe("/?view=explore");
    expect(growthJourneyHref).toBe("/?view=growth");
    expect(loyaltyExplainerHref).toBe("/?view=loyalty");
    expect(refugeeContextHref).toBe("/?view=refugees");
    expect(workCompassHref).toBe("/?view=work-compass");
    expect(nationalContinuityHref).toBe("/?view=continuity");
    expect(isSensePortalSearch("?v=release&view=sense")).toBe(true);
    expect(isSensePortalSearch("?view=other")).toBe(false);
  });

  it("recognizes the live routes and rejects unknown views", () => {
    expect(getRootView("?view=work-compass")).toBe("work-compass");
    expect(getRootView("?view=continuity")).toBe("continuity");
    expect(getRootView("?view=refugees")).toBe("refugees");
    expect(getRootView("?view=operations")).toBe("operations");
    expect(getRootView("?view=provider")).toBeNull();
  });
});
