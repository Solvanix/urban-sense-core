import { z } from "zod";
import { providerInterestInputSchema } from "../src/onboarding/contracts.js";
import { decideProviderInterest, submitProviderInterest } from "./providerInterestService.js";
import { administratorProcedure, publicProcedure, reviewerProcedure, router } from "./trpc.js";

const interestDecisionInput = z.object({
  interestId: z.string().min(1).max(80),
  outcome: z.enum(["invited_to_onboard", "not_in_current_pilot"]),
  reason: z.string().trim().min(8).max(1200)
});

const reviewerRoleAssignmentInput = z.object({
  provider: z.enum(["external_oidc", "manus_oauth"]),
  subject: z.string().trim().min(1).max(191),
  displayName: z.string().trim().min(1).max(160).optional(),
  role: z.enum(["reviewer", "administrator"]),
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
  }),
  reviewerAdministration: router({
    assignRole: administratorProcedure.input(reviewerRoleAssignmentInput).mutation(async ({ ctx, input }) =>
      ctx.reviewerStore.assignActiveRole({ ...input, assignedByIdentityId: ctx.reviewer!.id, assignedAt: new Date().toISOString() })
    )
  })
});

export type AppRouter = typeof appRouter;
