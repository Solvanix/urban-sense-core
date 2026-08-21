import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("GitHub Pages public index", () => {
  it("links static visitors to the live SENSE routes rather than unsupported local query routes", () => {
    const indexHtml = readFileSync(new URL("../../../public-index/index.html", import.meta.url), "utf8");

    expect(indexHtml).toContain('href="https://urbansense-dzfbcdz5.manus.space/?view=urban"');
    expect(indexHtml).toContain('href="https://urbansense-dzfbcdz5.manus.space/?view=explore"');
    expect(indexHtml).toContain('href="https://urbansense-dzfbcdz5.manus.space/?view=operations"');
    expect(indexHtml).not.toMatch(/href="\/\?view=/);
  });
});
