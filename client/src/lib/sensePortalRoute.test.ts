import { describe, expect, it } from "vitest";
import { getRootView, isSensePortalSearch, municipalOperationsHref, sensePortalHref } from "./sensePortalRoute";

describe("SENSE portal public entry", () => {
  it("uses a root URL query that survives hosts without SPA subpath fallback", () => {
    expect(sensePortalHref).toBe("/?view=sense");
    expect(municipalOperationsHref).toBe("/?view=operations");
    expect(isSensePortalSearch("?view=sense")).toBe(true);
    expect(isSensePortalSearch("?v=release&view=sense")).toBe(true);
    expect(isSensePortalSearch("?view=other")).toBe(false);
  });

  it("routes the municipal admin entry through the served root without making it a public dashboard", () => {
    expect(getRootView("?view=operations")).toBe("operations");
    expect(getRootView("?view=sense")).toBe("sense");
    expect(getRootView("?view=provider")).toBeNull();
  });
});
