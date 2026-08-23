import { describe, expect, it } from "vitest";
import { getGrowthOutcome, needsTeamRoute } from "./growthJourney";

describe("growth journey decisions", () => {
  it("keeps individual development primary when a learner chooses an immediate team", () => {
    const outcome = getGrowthOutcome("skill", "team-first");
    expect(outcome.kind).toBe("repair");
    expect(outcome.recommendedRoute).toBe("individual");
  });

  it("rewards a testable small output without presenting it as enrollment or certification", () => {
    const outcome = getGrowthOutcome("offer", "small-output");
    expect(outcome.kind).toBe("ready");
    expect(outcome.recommendedRoute).toBe("individual");
    expect(outcome.explanation).toContain("لا يمنح قبولًا أو شهادة");
  });

  it("opens team formation only after the learner identifies a real need", () => {
    expect(needsTeamRoute("not-yet")).toBe("individual");
    expect(needsTeamRoute("yes")).toBe("team");
  });
});
