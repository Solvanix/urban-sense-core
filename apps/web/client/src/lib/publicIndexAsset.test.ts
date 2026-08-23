import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("public INDEX.html", () => {
  it("is a standalone public entry index with only public ecosystem links", () => {
    const indexHtml = readFileSync(new URL("../../public/INDEX.html", import.meta.url), "utf8");

    expect(indexHtml).toContain("INDEX.html — فهرس عام من جذر المنظومة");
    expect(indexHtml).toContain('href="/?view=urban"');
    expect(indexHtml).toContain('href="/?view=explore"');
    expect(indexHtml).toContain('href="/?view=independence"');
    expect(indexHtml).toContain("مسار الاستقلال");
    expect(indexHtml).not.toContain("github.com/Solvanix/urban-sense-core");
  });
});
