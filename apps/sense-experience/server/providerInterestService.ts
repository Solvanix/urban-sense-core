import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import type { InterestReviewDecision, ProviderInterest, ProviderInterestInput, ProviderInterestStatusLookup, ProviderInterestStatusView, ProviderInterestSubmissionReceipt, ReviewerActor } from "../src/onboarding/contracts.js";
import { createProviderInterest } from "../src/onboarding/interest.js";
import { recordInterestReview } from "../src/onboarding/review.js";

export interface ProviderInterestStore {
  listForReview(): Promise<ProviderInterest[]>;
  findById(id: string): Promise<ProviderInterest | undefined>;
  findByReference(reference: string): Promise<ProviderInterest | undefined>;
  insert(interest: ProviderInterest): Promise<void>;
  replace(interest: ProviderInterest): Promise<void>;
}

function createReference() {
  return `SX-${randomBytes(5).toString("hex").toUpperCase()}`;
}

function createAccessCode() {
  return randomBytes(24).toString("base64url");
}

function hashAccessCode(accessCode: string) {
  return createHash("sha256").update(accessCode).digest("hex");
}

function hasMatchingAccessCode(expectedHash: string, accessCode: string) {
  const receivedHash = hashAccessCode(accessCode);
  return expectedHash.length === receivedHash.length && timingSafeEqual(Buffer.from(expectedHash), Buffer.from(receivedHash));
}

function toStatusView(interest: ProviderInterest): ProviderInterestStatusView {
  return {
    reference: interest.reference,
    status: interest.status,
    createdAt: interest.createdAt,
    decision: interest.reviewDecision ? {
      outcome: interest.reviewDecision.outcome,
      reason: interest.reviewDecision.reason,
      decidedAt: interest.reviewDecision.decidedAt
    } : undefined
  };
}

export async function submitProviderInterest(store: ProviderInterestStore, input: ProviderInterestInput, now = new Date()): Promise<ProviderInterestSubmissionReceipt> {
  const accessCode = createAccessCode();
  const interest = createProviderInterest(input, now, {
    id: randomBytes(16).toString("hex"),
    reference: createReference(),
    statusAccessHash: hashAccessCode(accessCode)
  });
  await store.insert(interest);
  return { reference: interest.reference, accessCode, status: interest.status, createdAt: interest.createdAt };
}

export async function findProviderInterestWithAccess(store: ProviderInterestStore, input: ProviderInterestStatusLookup): Promise<ProviderInterest | undefined> {
  const interest = await store.findByReference(input.reference);
  if (!interest || !hasMatchingAccessCode(interest.statusAccessHash, input.accessCode)) return undefined;
  return interest;
}

export async function lookupProviderInterestStatus(store: ProviderInterestStore, input: ProviderInterestStatusLookup): Promise<ProviderInterestStatusView | undefined> {
  const interest = await findProviderInterestWithAccess(store, input);
  if (!interest) return undefined;
  return toStatusView(interest);
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
    async findByReference(reference) {
      const record = records.find((item) => item.reference === reference);
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
