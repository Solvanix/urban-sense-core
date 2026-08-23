import { describe, expect, it } from "vitest";
import { experienceProjectPaths } from "./ExperienceProjectHub";

describe("SENSE Experience project entry", () => {
  it("keeps all interactive project pages reachable from the root query router", () => {
    expect(experienceProjectPaths).toEqual({
      hub: "/?view=experience",
      studio: "/?view=experience-studio",
      access: "/?view=experience-access",
      claims: "/?view=experience-claims",
    });
  });
});
