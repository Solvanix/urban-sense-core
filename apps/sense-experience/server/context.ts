import type { ProviderInterestStore } from "./providerInterestService.js";
import type { ReviewerIdentityStore, ReviewerSubjectResolver } from "./reviewerIdentityService.js";
import { resolveReviewerActor } from "./reviewerIdentityService.js";
import type { SenseContext } from "./trpc.js";

export async function createSenseContext<Request>(
  request: Request,
  store: ProviderInterestStore,
  reviewerResolver: ReviewerSubjectResolver<Request>,
  reviewerStore: ReviewerIdentityStore
): Promise<SenseContext> {
  return {
    store,
    reviewer: await resolveReviewerActor(request, reviewerResolver, reviewerStore)
  };
}
