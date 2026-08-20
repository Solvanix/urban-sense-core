import { describe, expect, it } from "vitest";
import { publicNavigation } from "./publicSite";

describe("public site navigation", () => {
  it("keeps every public destination labeled and unique", () => {
    const hrefs = publicNavigation.map((item) => item.href);

    expect(publicNavigation).toHaveLength(5);
    expect(hrefs).toEqual([...new Set(hrefs)]);
    expect(publicNavigation.every((item) => item.label.trim().length > 0)).toBe(true);
    expect(publicNavigation.map((item) => item.href)).toEqual(["/", "/?view=sense", "/كيف-تعمل", "/للبلديات", "/التجربة"]);
  });
});
