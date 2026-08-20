import type { InterestReviewDecision, ProviderInterest, ProviderInterestInput, ReviewerActor } from "./contracts.js";
import { createProviderInterest } from "./interest.js";
import { recordInterestReview } from "./review.js";

/**
 * Test-only in-memory adapter for domain tests. Production interest records
 * are written through the independent SENSE Experience API; this module has
 * no browser, cookie, or local-storage implementation.
 */
export interface MemoryInterestRepository {
  list(): ProviderInterest[];
  submit(input: ProviderInterestInput, now?: Date): ProviderInterest;
  decide(
    interestId: string,
    actor: ReviewerActor,
    outcome: InterestReviewDecision["outcome"],
    reason: string,
    now?: Date
  ): ProviderInterest;
}

function copyInterest(interest: ProviderInterest): ProviderInterest {
  return { ...interest, reviewDecision: interest.reviewDecision ? { ...interest.reviewDecision } : undefined };
}

export function createMemoryInterestRepository(initial: ProviderInterest[] = []): MemoryInterestRepository {
  let records = initial.map(copyInterest);
  return {
    list() {
      return records.map(copyInterest);
    },
    submit(input, now = new Date()) {
      const interest = createProviderInterest(input, now);
      records = [...records, copyInterest(interest)];
      return copyInterest(interest);
    },
    decide(interestId, actor, outcome, reason, now = new Date()) {
      const interest = records.find((record) => record.id === interestId);
      if (!interest) throw new Error("Interest record not found.");
      const result = recordInterestReview(interest, actor, outcome, reason, now);
      records = records.map((record) => record.id === interestId ? copyInterest(result.interest) : record);
      return copyInterest(result.interest);
    }
  };
}
