import { describe, expect, it } from "vitest";
import { getStudentOpportunityStatusTone, studentOpportunities } from "./studentOpportunityModel";

describe("student opportunity model", () => {
  it("keeps a non-open opportunity set explicit", () => {
    expect(studentOpportunities).toHaveLength(3);
    expect(studentOpportunities.find((item) => item.id === "goodness-housing")?.status).toBe("not-open");
    expect(studentOpportunities.some((item) => item.statusLabel.includes("مفتوحة"))).toBe(true);
  });

  it("represents readiness as a status rather than availability", () => {
    expect(studentOpportunities.every((item) => item.description.includes("لا") || item.status !== "not-open")).toBe(true);
    expect(getStudentOpportunityStatusTone("needs-host")).toContain("f8f0df");
    expect(getStudentOpportunityStatusTone("needs-review")).toContain("e9f0f3");
  });
});
