import { TRPCError, initTRPC } from "@trpc/server";
import type { ReviewerActor } from "../src/onboarding/contracts.js";
import type { ProviderInterestStore } from "./providerInterestService.js";

export type SenseContext = {
  store: ProviderInterestStore;
  reviewer: ReviewerActor | null;
};

const t = initTRPC.context<SenseContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const reviewerProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.reviewer || (ctx.reviewer.role !== "reviewer" && ctx.reviewer.role !== "administrator")) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Reviewer role is required." });
  }
  return next({ ctx: { ...ctx, reviewer: ctx.reviewer } });
});
