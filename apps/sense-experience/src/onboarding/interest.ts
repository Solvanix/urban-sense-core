import { type ProviderInterest, type ProviderInterestInput, providerInterestInputSchema } from "./contracts.js";

function createInterestId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `interest-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createProviderInterest(input: ProviderInterestInput, now = new Date()): ProviderInterest {
  const parsed = providerInterestInputSchema.parse(input);
  return {
    ...parsed,
    id: createInterestId(),
    status: "interest_submitted",
    createdAt: now.toISOString()
  };
}
