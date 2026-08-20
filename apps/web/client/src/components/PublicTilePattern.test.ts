import { describe, expect, it } from "vitest";
import { tileCopy } from "./PublicTilePattern";

describe("PublicTilePattern content", () => {
  it("keeps distinct editorial tiles for the citizen, process, and municipal pages", () => {
    expect(tileCopy.home.tiles).toHaveLength(3);
    expect(tileCopy.process.tiles).toHaveLength(3);
    expect(tileCopy.municipal.tiles).toHaveLength(3);
    expect(tileCopy.home.tiles.map((tile) => tile.title)).toContain("بلاغ مفهوم");
    expect(tileCopy.process.tiles.map((tile) => tile.title)).toContain("انتقال");
    expect(tileCopy.municipal.tiles.map((tile) => tile.title)).toContain("ما الذي يثبت؟");
  });
});
