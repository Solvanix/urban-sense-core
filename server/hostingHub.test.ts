import { describe, expect, it } from "vitest";
import { getRootView, hostingHubHref } from "../client/src/lib/sensePortalRoute";

describe("SENSE hosting hub", () => {
  it("resolves the public hosting route", () => {
    expect(hostingHubHref).toBe("/?view=hosting");
    expect(getRootView("?view=hosting")).toBe("hosting");
  });

  it("keeps unknown views out of the public route map", () => {
    expect(getRootView("?view=booking")).toBeNull();
  });
});
