export type FontScale = "normal" | "large" | "xlarge";

export type AccessibilityPreferences = {
  fontScale: FontScale;
  highContrast: boolean;
  reduceMotion: boolean;
  readingMode: boolean;
};

export const defaultAccessibilityPreferences: AccessibilityPreferences = {
  fontScale: "normal",
  highContrast: false,
  reduceMotion: false,
  readingMode: false
};

export function normalizeAccessibilityPreferences(value: Partial<AccessibilityPreferences> | null | undefined): AccessibilityPreferences {
  return {
    fontScale: value?.fontScale === "large" || value?.fontScale === "xlarge" ? value.fontScale : "normal",
    highContrast: Boolean(value?.highContrast),
    reduceMotion: Boolean(value?.reduceMotion),
    readingMode: Boolean(value?.readingMode)
  };
}

export function applyAccessibilityPreferences(preferences: AccessibilityPreferences) {
  const root = document.documentElement;
  root.dataset.senseFontScale = preferences.fontScale;
  root.dataset.senseContrast = preferences.highContrast ? "high" : "default";
  root.dataset.senseMotion = preferences.reduceMotion ? "reduced" : "default";
  root.dataset.senseReading = preferences.readingMode ? "simple" : "default";
}
