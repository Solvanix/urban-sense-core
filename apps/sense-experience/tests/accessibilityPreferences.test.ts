import { describe, expect, it } from "vitest";
import { defaultAccessibilityPreferences, normalizeAccessibilityPreferences } from "../src/accessibility/preferences.js";

describe("accessibility preferences", () => {
  it("uses safe defaults for missing or invalid preference values", () => {
    expect(normalizeAccessibilityPreferences(null)).toEqual(defaultAccessibilityPreferences);
    expect(normalizeAccessibilityPreferences({ fontScale: "unsupported" as "normal", highContrast: 1 as unknown as boolean })).toEqual({ fontScale: "normal", highContrast: true, reduceMotion: false, readingMode: false });
  });

  it("retains supported visual preferences", () => {
    expect(normalizeAccessibilityPreferences({ fontScale: "xlarge", highContrast: true, reduceMotion: true, readingMode: true })).toEqual({ fontScale: "xlarge", highContrast: true, reduceMotion: true, readingMode: true });
  });
});
