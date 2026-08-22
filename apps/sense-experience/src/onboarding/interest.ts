import { type ProviderInterest, type ProviderInterestInput, providerInterestInputSchema } from "./contracts.js";

function createInterestId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `interest-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createProviderInterest(
  input: ProviderInterestInput,
  now = new Date(),
  identity: Pick<ProviderInterest, "id" | "reference" | "statusAccessHash"> = {
    id: createInterestId(),
    reference: `SX-${createInterestId().replace(/[^a-z0-9]/gi, "").slice(0, 10).toUpperCase().padEnd(10, "0")}`,
    statusAccessHash: "not-valid-for-production-lookup"
  }
): ProviderInterest {
  const parsed = providerInterestInputSchema.parse(input);
  return {
    ...parsed,
    ...identity,
    status: "interest_submitted",
    createdAt: now.toISOString()
  };
}
