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

  it("represents the municipal clearance campaign as a time-bounded limited signal", () => {
    const campaign = demoVisitSignals.find((signal) => signal.id === "municipal-clearance-campaign");
    expect(campaign?.sourceKind).toBe("official");
    expect(campaign?.status).toBe("limited");
    expect(campaign?.note).toContain("28/09/2026");
  });

  it("keeps the caves seminar as a partner announcement requiring confirmation", () => {
    const seminar = demoVisitSignals.find((signal) => signal.id === "palestine-caves-seminar");
    expect(seminar?.sourceKind).toBe("partner");
    expect(seminar?.status).toBe("needs_confirmation");
    expect(seminar?.note).toContain("منتدى الخبرات");
  });

  it("keeps Beitunia heritage content outside the Al-Eizariya experience scope", () => {
    const story = demoVisitSignals.find((signal) => signal.id === "beitunia-bayt-onya-heritage-story");
    expect(story?.sourceKind).toBe("official");
    expect(story?.sourceUrl).toBe("https://www.facebook.com/share/p/1CGU8veYoC/");
    expect(story?.status).toBe("needs_confirmation");
    expect(story?.note).toContain("خارج نطاق تجربة العيزرية");
  });

  it("treats an expired signal as not fresh", () => {
    expect(isSignalFresh({ ...demoVisitSignals[0], validUntil: "2026-09-23T12:00:00Z" }, now)).toBe(false);
  });

  it("freezes live collection semantics in paused and emergency modes", () => {
    expect(summarizeVisitStatus(demoVisitSignals, "paused", now).publishable).toBe(false);
    expect(summarizeVisitStatus(demoVisitSignals, "emergency", now).headline).toContain("الطوارئ");
  });
});
