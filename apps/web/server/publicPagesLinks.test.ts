import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("GitHub Pages public index", () => {
  it("links static visitors to the live SENSE routes rather than unsupported local query routes", () => {
    const indexHtml = readFileSync(new URL("../../../public-index/index.html", import.meta.url), "utf8");

    expect(indexHtml).toContain('href="https://urbansense-dzfbcdz5.manus.space/?view=urban"');
    expect(indexHtml).toContain('href="https://urbansense-dzfbcdz5.manus.space/?view=explore"');
    expect(indexHtml).toContain('href="https://urbansense-dzfbcdz5.manus.space/%D9%84%D9%84%D8%A8%D9%84%D8%AF%D9%8A%D8%A7%D8%AA"');
    expect(indexHtml).toContain("ماذا تريد أن <span>تزور</span> اليوم؟");
    expect(indexHtml).toContain("زيارة منصة البلاغات");
    expect(indexHtml).toContain("زيارة صفحة البلديات");
    expect(indexHtml).not.toContain("نبض السوق");
    expect(indexHtml).not.toMatch(/href="\/\?view=/);
  });
});
