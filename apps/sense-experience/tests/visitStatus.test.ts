import { describe, expect, it } from "vitest";
import { demoVisitSignals, isSignalFresh, summarizeVisitStatus } from "../src/live/visitStatus.js";

describe("SENSE Live visit status", () => {
  const now = new Date("2026-09-24T12:00:00Z");

  it("never presents the demo route as confirmed while signals need confirmation", () => {
    const summary = summarizeVisitStatus(demoVisitSignals, "normal", now);
    expect(summary.tone).toBe("caution");
    expect(summary.publishable).toBe(false);
    expect(summary.headline).toContain("تحتاج");
  });

  it("treats an expired signal as not fresh", () => {
    expect(isSignalFresh({ ...demoVisitSignals[0], validUntil: "2026-09-23T12:00:00Z" }, now)).toBe(false);
  });

  it("freezes live collection semantics in paused and emergency modes", () => {
    expect(summarizeVisitStatus(demoVisitSignals, "paused", now).publishable).toBe(false);
    expect(summarizeVisitStatus(demoVisitSignals, "emergency", now).headline).toContain("الطوارئ");
  });
});
