import { z } from "zod";
import { providerInterestInputSchema } from "../src/onboarding/contracts.js";
import { decideProviderInterest, submitProviderInterest } from "./providerInterestService.js";
import { publicProcedure, reviewerProcedure, router } from "./trpc.js";

const interestDecisionInput = z.object({
  interestId: z.string().min(1).max(80),
  outcome: z.enum(["invited_to_onboard", "not_in_current_pilot"]),
  reason: z.string().trim().min(8).max(1200)
});

export const appRouter = router({
  providerInterest: router({
    submit: publicProcedure.input(providerInterestInputSchema).mutation(async ({ ctx, input }) => {
      const interest = await submitProviderInterest(ctx.store, input);
      return { id: interest.id, status: interest.status, createdAt: interest.createdAt };
    }),
    listForReview: reviewerProcedure.query(async ({ ctx }) => ctx.store.listForReview()),
    decide: reviewerProcedure.input(interestDecisionInput).mutation(async ({ ctx, input }) =>
      decideProviderInterest(ctx.store, input.interestId, ctx.reviewer!, input.outcome, input.reason)
    )
  })
});

export type AppRouter = typeof appRouter;
