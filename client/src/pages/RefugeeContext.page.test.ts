import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import RefugeeContext from "./RefugeeContext";

describe("RefugeeContext public route safeguards", () => {
  it("renders sources and guard text, not beneficiary intake or transaction controls", () => {
    const html = renderToStaticMarkup(createElement(RefugeeContext));

    expect(html).toContain("لا تسجيل ولا طلب مساعدة");
    expect(html).toContain("لا نوزع مساعدات");
    expect(html).not.toMatch(/<form\b|<input\b|<textarea\b|type=\"submit\"/);
    expect(html).not.toMatch(/payment|checkout|donate|beneficiar|aid-application/i);
  });

  it("renders links only to the SENSE portal, official UNRWA information, and central-source documents", () => {
    const html = renderToStaticMarkup(createElement(RefugeeContext));
    const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);

    expect(hrefs).toContain("/?view=sense");
    expect(hrefs.some((href) => href.startsWith("https://www.unrwa.org/"))).toBe(true);
    expect(hrefs.filter((href) => href.startsWith("https://github.com/"))).toHaveLength(2);
    expect(hrefs.every((href) => href === "/?view=sense" || href.startsWith("https://www.unrwa.org/") || href.startsWith("https://github.com/Solvanix/urban-sense-core/"))).toBe(true);
  });
});
