import { describe, expect, it } from "vitest";
import { isSensePortalSearch, sensePortalHref } from "./sensePortalRoute";

describe("SENSE portal public entry", () => {
  it("uses a root URL query that survives hosts without SPA subpath fallback", () => {
    expect(sensePortalHref).toBe("/?view=sense");
    expect(isSensePortalSearch("?view=sense")).toBe(true);
    expect(isSensePortalSearch("?v=release&view=sense")).toBe(true);
    expect(isSensePortalSearch("?view=other")).toBe(false);
  });
});
