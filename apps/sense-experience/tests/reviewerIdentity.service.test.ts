import { describe, expect, it } from "vitest";
import {
  createMemoryReviewerIdentityStore,
  createRejectingReviewerSubjectResolver,
  resolveReviewerActor,
  type ReviewerSubjectResolver
} from "../server/reviewerIdentityService.js";
import { createSignedReviewerSessionResolver, issueReviewerSession, reviewerSessionCookieName } from "../server/reviewerSession.js";
import { createMemoryProviderInterestStore } from "../server/providerInterestService.js";
import { createSenseContext } from "../server/context.js";

const request = { headers: { "x-sense-reviewer-role": "administrator" } };
const sessionSecret = "this-is-a-test-only-secret-with-at-least-thirty-two-characters";

describe("reviewer identity resolution", () => {
  it("rejects all client-provided headers until a server-side identity adapter is installed", async () => {
    const store = createMemoryReviewerIdentityStore();
    const actor = await resolveReviewerActor(request, createRejectingReviewerSubjectResolver(), store);
    expect(actor).toBeNull();

    const context = await createSenseContext(
      request,
      createMemoryProviderInterestStore(),
      createRejectingReviewerSubjectResolver<typeof request>(),
      store
    );
    expect(context.reviewer).toBeNull();
  });

  it("returns a role only for an active validated identity with an active assignment", async () => {
    const resolver: ReviewerSubjectResolver<typeof request> = {
      resolve: async () => ({ provider: "external_oidc", subject: "reviewer-subject" })
    };
    const store = createMemoryReviewerIdentityStore(
      [{ id: "reviewer-1", provider: "external_oidc", subject: "reviewer-subject", state: "active" }],
      [{ reviewerIdentityId: "reviewer-1", role: "reviewer", state: "active" }]
    );

    await expect(resolveReviewerActor(request, resolver, store)).resolves.toEqual({ id: "reviewer-1", role: "reviewer" });
  });

  it("rejects a validated subject when its assigned reviewer identity has been revoked", async () => {
    const resolver: ReviewerSubjectResolver<typeof request> = {
      resolve: async () => ({ provider: "manus_oauth", subject: "revoked-subject" })
    };
    const store = createMemoryReviewerIdentityStore(
      [{ id: "reviewer-2", provider: "manus_oauth", subject: "revoked-subject", state: "revoked" }],
      [{ reviewerIdentityId: "reviewer-2", role: "administrator", state: "active" }]
    );

    await expect(resolveReviewerActor(request, resolver, store)).resolves.toBeNull();
  });

  it("reports readiness only when an active independent identity has an active assigned role", async () => {
    const missingRole = createMemoryReviewerIdentityStore([{ id: "identity-1", provider: "external_oidc", subject: "no-role", state: "active" }]);
    const revokedRole = createMemoryReviewerIdentityStore(
      [{ id: "identity-2", provider: "external_oidc", subject: "revoked-role", state: "active" }],
      [{ reviewerIdentityId: "identity-2", role: "reviewer", state: "revoked" }]
    );
    const ready = createMemoryReviewerIdentityStore(
      [{ id: "identity-3", provider: "external_oidc", subject: "ready-reviewer", state: "active" }],
      [{ reviewerIdentityId: "identity-3", role: "administrator", state: "active" }]
    );

    await expect(missingRole.hasActiveReviewer()).resolves.toBe(false);
    await expect(revokedRole.hasActiveReviewer()).resolves.toBe(false);
    await expect(ready.hasActiveReviewer()).resolves.toBe(true);
  });

  it("resolves a signed independent session cookie but still requires an active role assignment", async () => {
    const session = await issueReviewerSession({ provider: "external_oidc", subject: "independent-reviewer" }, sessionSecret);
    const signedRequest = { headers: { cookie: `${reviewerSessionCookieName()}=${encodeURIComponent(session.token)}`, "x-sense-reviewer-role": "administrator" } };
    const resolver = createSignedReviewerSessionResolver<typeof signedRequest>(sessionSecret);
    const store = createMemoryReviewerIdentityStore(
      [{ id: "reviewer-3", provider: "external_oidc", subject: "independent-reviewer", state: "active" }],
      [{ reviewerIdentityId: "reviewer-3", role: "reviewer", state: "active" }]
    );

    await expect(resolveReviewerActor(signedRequest, resolver, store)).resolves.toEqual({ id: "reviewer-3", role: "reviewer" });
  });

  it("rejects a forged or expired reviewer session cookie", async () => {
    const session = await issueReviewerSession({ provider: "external_oidc", subject: "reviewer-subject" }, sessionSecret, new Date("2026-08-20T00:00:00.000Z"), 1);
    const forgedRequest = { headers: { cookie: `${reviewerSessionCookieName()}=${encodeURIComponent(`${session.token}forged`)}` } };
    const expiredRequest = { headers: { cookie: `${reviewerSessionCookieName()}=${encodeURIComponent(session.token)}` } };
    const resolver = createSignedReviewerSessionResolver<typeof forgedRequest>(sessionSecret, () => new Date("2026-08-20T00:00:02.000Z"));
    const store = createMemoryReviewerIdentityStore(
      [{ id: "reviewer-4", provider: "external_oidc", subject: "reviewer-subject", state: "active" }],
      [{ reviewerIdentityId: "reviewer-4", role: "administrator", state: "active" }]
    );

    await expect(resolveReviewerActor(forgedRequest, resolver, store)).resolves.toBeNull();
    await expect(resolveReviewerActor(expiredRequest, resolver, store)).resolves.toBeNull();
  });
});
