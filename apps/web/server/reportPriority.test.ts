import { describe, expect, it } from "vitest";
import { calculateReportPriority, isAllowedCommunityVote } from "./reportPriority";

describe("report priority", () => {
  it("keeps administrative urgency independent from community support", () => {
    const result = calculateReportPriority({
      administrativePriority: "critical",
      supportCount: 0,
      unsureCount: 0,
      opposeCount: 4,
    });

    expect(result.administrativePriority).toBe("critical");
    expect(result.executionPriority).toBe("urgent");
    expect(result.communitySignal).toBe("contested");
  });

  it("recognizes a supported repeated issue without claiming verification", () => {
    const result = calculateReportPriority({
      administrativePriority: "normal",
      supportCount: 5,
      unsureCount: 1,
      opposeCount: 0,
      duplicateReportCount: 4,
      daysOpen: 3,
    });

    expect(result.communitySignal).toBe("supported");
    expect(result.executionPriority).toBe("elevated");
    expect(result.supportRate).toBeCloseTo(5 / 6);
    expect(result.explanation).toContain("بلاغات مشابهة: 4");
  });

  it("starts as emerging when no one has voted", () => {
    const result = calculateReportPriority({
      administrativePriority: "normal",
      supportCount: 0,
      unsureCount: 0,
      opposeCount: 0,
    });

    expect(result.communitySignal).toBe("emerging");
    expect(result.totalVotes).toBe(0);
    expect(result.supportRate).toBe(0);
  });

  it("accepts only the three public vote signals", () => {
    expect(isAllowedCommunityVote("support")).toBe(true);
    expect(isAllowedCommunityVote("unsure")).toBe(true);
    expect(isAllowedCommunityVote("oppose")).toBe(true);
    expect(isAllowedCommunityVote("approved")).toBe(false);
  });
});
