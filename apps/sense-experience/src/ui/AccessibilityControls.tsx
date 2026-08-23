import { useEffect, useState } from "react";
import {
  applyAccessibilityPreferences,
  defaultAccessibilityPreferences,
  normalizeAccessibilityPreferences,
  type AccessibilityPreferences,
  type FontScale
} from "../accessibility/preferences.js";

const storageKey = "sense-experience-accessibility-preferences-v1";

function loadPreferences(): AccessibilityPreferences {
  try {
    return normalizeAccessibilityPreferences(JSON.parse(window.localStorage.getItem(storageKey) ?? "null"));
  } catch {
    return defaultAccessibilityPreferences;
  }
}

export function AccessibilityControls() {
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(loadPreferences);

  useEffect(() => {
    applyAccessibilityPreferences(preferences);
    window.localStorage.setItem(storageKey, JSON.stringify(preferences));
  }, [preferences]);

  function change<K extends keyof AccessibilityPreferences>(field: K, value: AccessibilityPreferences[K]) {
    setPreferences((current) => ({ ...current, [field]: value }));
  }

  function reset() {
    setPreferences(defaultAccessibilityPreferences);
  }

  return (
    <aside className="accessibility-controls" aria-label="إعدادات الوصول">
      <button className="accessibility-trigger" type="button" aria-expanded={open} aria-controls="sense-accessibility-panel" onClick={() => setOpen((current) => !current)}>
        <span aria-hidden="true">◌</span> خيارات الوصول
      </button>
      {open && <section className="accessibility-panel" id="sense-accessibility-panel" aria-live="polite">
        <header><p className="eyebrow">وصول شخصي</p><h2>عدّل العرض على جهازك</h2></header>
        <fieldset>
          <legend>حجم النص</legend>
          <div className="accessibility-choice-row">
            {(["normal", "large", "xlarge"] as FontScale[]).map((scale) => <button type="button" key={scale} className={preferences.fontScale === scale ? "selected" : ""} onClick={() => change("fontScale", scale)}>{scale === "normal" ? "عادي" : scale === "large" ? "كبير" : "كبير جدًا"}</button>)}
          </div>
        </fieldset>
        <label><input type="checkbox" checked={preferences.highContrast} onChange={(event) => change("highContrast", event.target.checked)} />تباين أعلى</label>
        <label><input type="checkbox" checked={preferences.reduceMotion} onChange={(event) => change("reduceMotion", event.target.checked)} />تقليل الحركة</label>
        <label><input type="checkbox" checked={preferences.readingMode} onChange={(event) => change("readingMode", event.target.checked)} />وضع قراءة أبسط</label>
        <p>هذه التفضيلات محفوظة محليًا على جهازك، ولا تُرسل إلى المزوّد أو المراجع.</p>
        <button className="accessibility-reset" type="button" onClick={reset}>استعادة الإعدادات</button>
      </section>}
    </aside>
  );
}
