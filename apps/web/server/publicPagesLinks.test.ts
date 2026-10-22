import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("GitHub Pages public index", () => {
  it("links static visitors to the current GitHub Pages SENSE routes", () => {
    const indexHtml = readFileSync(new URL("../../../public-index/index.html", import.meta.url), "utf8");

    expect(indexHtml).toContain('href="./visualize/experience.html"');
    expect(indexHtml).toContain('href="./visualize/validation.html"');
    expect(indexHtml).toContain('href="./visualize/link-index.html"');
    expect(indexHtml).toContain('href="./visualize/problem-statement-canvas.html"');
    expect(indexHtml).toContain('href="https://sense133.wordpress.com/"');
    expect(indexHtml).toContain('href="https://github.com/Solvanix/urban-sense-core"');
    expect(indexHtml).toContain("ابدأ من<br/><em>المكان.</em>");
    expect(indexHtml).toContain("AL-EIZARIYA / PILOT FIRST");
    expect(indexHtml).toContain("SENSE طبقة تشغيل للوجهة");
    expect(indexHtml).not.toContain("?view=citizen");
    expect(indexHtml).not.toContain("?view=progress");
    expect(indexHtml).not.toMatch(/href="\/\?view=/);
  });
});
