import { describe, expect, it } from "vitest";
import { domainReadinessHref, ecosystemExplorerHref, getRootView, isSensePortalSearch, municipalOperationsHref, progressDashboardHref, sensePortalHref, urbanSenseHref } from "./sensePortalRoute";

describe("SENSE portal public entry", () => {
  it("uses a root URL query that survives hosts without SPA subpath fallback", () => {
    expect(sensePortalHref).toBe("/?view=sense");
    expect(urbanSenseHref).toBe("/?view=urban");
    expect(municipalOperationsHref).toBe("/?view=operations");
    expect(ecosystemExplorerHref).toBe("/?view=explore");
    expect(domainReadinessHref).toBe("/?view=domain");
    expect(progressDashboardHref).toBe("/?view=progress");
    expect(isSensePortalSearch("?view=sense")).toBe(true);
    expect(isSensePortalSearch("?v=release&view=sense")).toBe(true);
    expect(isSensePortalSearch("?view=other")).toBe(false);
  });

  it("routes the municipal admin entry through the served root without making it a public dashboard", () => {
    expect(getRootView("?view=urban")).toBe("urban");
    expect(getRootView("?view=operations")).toBe("operations");
    expect(getRootView("?view=sense")).toBe("sense");
    expect(getRootView("?view=explore")).toBe("explore");
    expect(getRootView("?view=domain")).toBe("domain");
    expect(getRootView("?view=progress")).toBe("progress");
    expect(getRootView("?view=provider")).toBeNull();
  });
});
