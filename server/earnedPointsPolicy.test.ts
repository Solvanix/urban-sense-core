import { describe, expect, it } from "vitest";
import { assertNonCashPoints, assertReviewTransition } from "./earnedPointsPolicy";

describe("earned points policy", () => {
  it("accepts a bounded non-cash point amount", () => {
    expect(assertNonCashPoints(125)).toBe(125);
  });

  it("rejects negative, fractional, and excessive point amounts", () => {
    expect(() => assertNonCashPoints(-1)).toThrow("عدد النقاط");
    expect(() => assertNonCashPoints(1.5)).toThrow("عدد النقاط");
    expect(() => assertNonCashPoints(100_001)).toThrow("عدد النقاط");
  });

  it("allows a pending event to be decided exactly once", () => {
    expect(assertReviewTransition("pending_review", "approved")).toBe("approved");
    expect(() => assertReviewTransition("approved", "voided")).toThrow("مرة أخرى");
  });
});
