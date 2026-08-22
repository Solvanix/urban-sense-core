import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("GitHub Pages public index", () => {
  it("links static visitors to the live SENSE routes rather than unsupported local query routes", () => {
    const indexHtml = readFileSync(new URL("../../../public-index/index.html", import.meta.url), "utf8");

    expect(indexHtml).toContain('href="https://urbansense-dzfbcdz5.manus.space/?view=urban"');
    expect(indexHtml).toContain('href="https://urbansense-dzfbcdz5.manus.space/?view=progress"');
    expect(indexHtml).toContain('href:"https://urbansense-dzfbcdz5.manus.space/%D9%84%D9%84%D8%A8%D9%84%D8%AF%D9%8A%D8%A7%D8%AA"');
    expect(indexHtml).toContain("اختر هدفك.<br /><strong>نفتح لك الطريق.</strong>");
    expect(indexHtml).toContain('data-goal="citizen"');
    expect(indexHtml).toContain('data-goal="municipality"');
    expect(indexHtml).toContain('id="scene-play"');
    expect(indexHtml).toContain("شاهد الرحلة في ثلاث لقطات.");
    expect(indexHtml).toContain("لا نطلب منك بيانات هنا");
    expect(indexHtml).toContain('id="contrast-toggle"');
    expect(indexHtml).toContain('id="motion-toggle"');
    expect(indexHtml).not.toContain("نبض السوق");
    expect(indexHtml).not.toMatch(/href="\/\?view=/);
  });
});
