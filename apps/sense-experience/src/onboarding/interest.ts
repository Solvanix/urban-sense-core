import { randomUUID } from "node:crypto";
import { type ProviderInterest, type ProviderInterestInput, providerInterestInputSchema } from "./contracts.js";

export function createProviderInterest(input: ProviderInterestInput, now = new Date()): ProviderInterest {
  const parsed = providerInterestInputSchema.parse(input);
  return {
    ...parsed,
    id: randomUUID(),
    status: "interest_submitted",
    createdAt: now.toISOString()
  };
}
