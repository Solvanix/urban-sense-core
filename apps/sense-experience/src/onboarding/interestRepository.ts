import type { InterestReviewDecision, ProviderInterest, ProviderInterestInput, ReviewerActor } from "./contracts.js";
import { createProviderInterest } from "./interest.js";
import { recordInterestReview } from "./review.js";

export const interestRepositoryKey = "sense-experience-provider-interest-v1";

export interface ProviderInterestRepository {
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

type KeyValueStore = Pick<Storage, "getItem" | "setItem">;

function normalizeStoredInterests(value: string | null): ProviderInterest[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed as ProviderInterest[] : [];
  } catch {
    return [];
  }
}

function createRepository(read: () => ProviderInterest[], write: (items: ProviderInterest[]) => void): ProviderInterestRepository {
  return {
    list: () => read().sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    submit(input, now = new Date()) {
      const interest = createProviderInterest(input, now);
      write([...read(), interest]);
      return interest;
    },
    decide(interestId, actor, outcome, reason, now = new Date()) {
      const current = read();
      const existing = current.find((item) => item.id === interestId);
      if (!existing) throw new Error("Interest record not found.");

      const { interest } = recordInterestReview(existing, actor, outcome, reason, now);
      write(current.map((item) => item.id === interestId ? interest : item));
      return interest;
    }
  };
}

export function createBrowserInterestRepository(storage: KeyValueStore): ProviderInterestRepository {
  return createRepository(
    () => normalizeStoredInterests(storage.getItem(interestRepositoryKey)),
    (items) => storage.setItem(interestRepositoryKey, JSON.stringify(items))
  );
}

export function createMemoryInterestRepository(initial: ProviderInterest[] = []): ProviderInterestRepository {
  let records = [...initial];
  return createRepository(
    () => [...records],
    (items) => { records = [...items]; }
  );
}
