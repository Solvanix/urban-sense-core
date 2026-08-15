import { describe, expect, it } from "vitest";
import {
  createMemoryReviewerIdentityStore,
  createRejectingReviewerSubjectResolver,
  resolveReviewerActor,
  type ReviewerSubjectResolver
} from "../server/reviewerIdentityService.js";
import { createMemoryProviderInterestStore } from "../server/providerInterestService.js";
import { createSenseContext } from "../server/context.js";

const request = { headers: { "x-sense-reviewer-role": "administrator" } };

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
});
