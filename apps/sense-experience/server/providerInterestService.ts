import type { InterestReviewDecision, ProviderInterest, ProviderInterestInput, ReviewerActor } from "../src/onboarding/contracts.js";
import { createProviderInterest } from "../src/onboarding/interest.js";
import { recordInterestReview } from "../src/onboarding/review.js";

export interface ProviderInterestStore {
  listForReview(): Promise<ProviderInterest[]>;
  findById(id: string): Promise<ProviderInterest | undefined>;
  insert(interest: ProviderInterest): Promise<void>;
  replace(interest: ProviderInterest): Promise<void>;
}

export async function submitProviderInterest(store: ProviderInterestStore, input: ProviderInterestInput, now = new Date()): Promise<ProviderInterest> {
  const interest = createProviderInterest(input, now);
  await store.insert(interest);
  return interest;
}

export async function decideProviderInterest(
  store: ProviderInterestStore,
  interestId: string,
  actor: ReviewerActor,
  outcome: InterestReviewDecision["outcome"],
  reason: string,
  now = new Date()
): Promise<ProviderInterest> {
  const interest = await store.findById(interestId);
  if (!interest) throw new Error("Interest record not found.");

  const { interest: decidedInterest } = recordInterestReview(interest, actor, outcome, reason, now);
  await store.replace(decidedInterest);
  return decidedInterest;
}

function copyInterest(interest: ProviderInterest): ProviderInterest {
  return { ...interest, reviewDecision: interest.reviewDecision ? { ...interest.reviewDecision } : undefined };
}

export function createMemoryProviderInterestStore(initial: ProviderInterest[] = []): ProviderInterestStore {
  let records = initial.map(copyInterest);
  return {
    async listForReview() {
      return records.map(copyInterest).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async findById(id) {
      const record = records.find((item) => item.id === id);
      return record ? copyInterest(record) : undefined;
    },
    async insert(interest) {
      if (records.some((item) => item.id === interest.id)) throw new Error("Interest record already exists.");
      records = [...records, copyInterest(interest)];
    },
    async replace(interest) {
      if (!records.some((item) => item.id === interest.id)) throw new Error("Interest record not found.");
      records = records.map((item) => item.id === interest.id ? copyInterest(interest) : item);
    }
  };
}
