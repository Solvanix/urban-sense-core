import { describe, expect, it } from "vitest";
import { resolveRuntimeReadiness } from "../server/runtimeReadiness.js";

describe("resolveRuntimeReadiness", () => {
  it("keeps provider data closed until every independent launch boundary is ready", () => {
    expect(resolveRuntimeReadiness({
      databaseUrl: "mysql://sense:password@db:3306/sense_experience",
      realDataApproved: true,
      reviewerOidcConfigured: true,
      hasActiveReviewer: false
    })).toEqual({ acceptsProviderData: false, reason: "لا يوجد مراجع مستقل مفعّل بعد." });
  });

  it("opens the API only after database, approval, identity, and reviewer conditions are all met", () => {
    expect(resolveRuntimeReadiness({
      databaseUrl: "mysql://sense:password@db:3306/sense_experience",
      realDataApproved: true,
      reviewerOidcConfigured: true,
      hasActiveReviewer: true
    })).toEqual({ acceptsProviderData: true, reason: null });
  });
});
