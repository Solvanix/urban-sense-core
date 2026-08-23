import { describe, expect, it } from "vitest";
import { readReviewerOidcConfig } from "../server/reviewerOidcAuth.js";

describe("independent reviewer OIDC configuration", () => {
  it("keeps the real-data service disabled when no independent OIDC boundary is configured", () => {
    expect(readReviewerOidcConfig({})).toBeNull();
    expect(readReviewerOidcConfig({ SENSE_EXPERIENCE_WEB_ORIGIN: "https://experience.example" })).toBeNull();
  });

  it("rejects partial OIDC configuration rather than silently trusting a local reviewer", () => {
    expect(() => readReviewerOidcConfig({ SENSE_EXPERIENCE_OIDC_ISSUER: "https://identity.example" })).toThrow("SENSE_EXPERIENCE_OIDC_CLIENT_ID");
  });

  it("accepts a complete independent OIDC configuration without reusing Urban-Sense fields", () => {
    const config = readReviewerOidcConfig({
      SENSE_EXPERIENCE_OIDC_ISSUER: "https://identity.example/",
      SENSE_EXPERIENCE_OIDC_CLIENT_ID: "sense-reviewers",
      SENSE_EXPERIENCE_OIDC_CLIENT_SECRET: "independent-secret",
      SENSE_EXPERIENCE_OIDC_REDIRECT_URI: "https://api.example/auth/reviewer/callback",
      SENSE_EXPERIENCE_WEB_ORIGIN: "https://experience.example/",
      SENSE_EXPERIENCE_REVIEWER_SESSION_SECRET: "session-secret-with-at-least-thirty-two-characters"
    });

    expect(config).toMatchObject({ issuer: "https://identity.example", webOrigin: "https://experience.example" });
  });
});
