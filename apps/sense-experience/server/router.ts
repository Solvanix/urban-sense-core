import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { providerInterestInputSchema, providerInterestStatusLookupSchema } from "../src/onboarding/contracts.js";
import { addClaimEvidence, decideProviderClaim, submitProviderClaim } from "./claimRegistryService.js";
import type { ClaimRegistryStore } from "./claimRegistryService.js";
import { decideProviderInterest, findProviderInterestWithAccess, lookupProviderInterestStatus, submitProviderInterest } from "./providerInterestService.js";
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

const providerClaimInput = providerInterestStatusLookupSchema.extend({
  type: z.enum(["accessibility", "safety", "availability", "sustainability", "certification", "membership"]),
  statement: z.string().trim().min(12).max(1800)
});

const providerEvidenceInput = providerInterestStatusLookupSchema.extend({
  claimId: z.string().uuid(),
  kind: z.enum(["provider_note", "external_url", "document_reference"]),
  evidenceReference: z.string().trim().min(3).max(1600),
  summary: z.string().trim().min(12).max(1800)
});

const claimDecisionInput = z.object({
  claimId: z.string().uuid(),
  outcome: z.enum(["needs_evidence", "verified", "rejected"]),
  reason: z.string().trim().min(8).max(1200)
});

const claimIdInput = z.object({ claimId: z.string().uuid() });

function requireClaimStore(claimStore: ClaimRegistryStore | undefined): ClaimRegistryStore {
  if (!claimStore) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "سجل الادعاءات غير مهيأ في هذه البيئة." });
  return claimStore;
}

export const appRouter = router({
  providerInterest: router({
    submit: publicProcedure.input(providerInterestInputSchema).mutation(async ({ ctx, input }) => {
      return submitProviderInterest(ctx.store, input);
    }),
    lookupStatus: publicProcedure.input(providerInterestStatusLookupSchema).query(async ({ ctx, input }) => {
      const status = await lookupProviderInterestStatus(ctx.store, input);
      if (!status) throw new TRPCError({ code: "NOT_FOUND", message: "لم نجد طلبًا بهذه بيانات المتابعة." });
      return status;
    }),
    listForReview: reviewerProcedure.query(async ({ ctx }) => ctx.store.listForReview()),
    decide: reviewerProcedure.input(interestDecisionInput).mutation(async ({ ctx, input }) =>
      decideProviderInterest(ctx.store, input.interestId, ctx.reviewer!, input.outcome, input.reason)
    )
  }),
  providerClaims: router({
    submit: publicProcedure.input(providerClaimInput).mutation(async ({ ctx, input }) =>
      submitProviderClaim(ctx.store, requireClaimStore(ctx.claimStore), input)
    ),
    listMine: publicProcedure.input(providerInterestStatusLookupSchema).query(async ({ ctx, input }) => {
      const interest = await findProviderInterestWithAccess(ctx.store, input);
      if (!interest) throw new TRPCError({ code: "NOT_FOUND", message: "لم نجد طلبًا بهذه بيانات المتابعة." });
      const claimStore = requireClaimStore(ctx.claimStore);
      const claims = await claimStore.listClaimsForInterest(interest.id);
      return Promise.all(claims.map(async (claim) => ({
        claim,
        evidence: await claimStore.listEvidence(claim.id),
        decisions: await claimStore.listDecisions(claim.id)
      })));
    }),
    addEvidence: publicProcedure.input(providerEvidenceInput).mutation(async ({ ctx, input }) =>
      addClaimEvidence(ctx.store, requireClaimStore(ctx.claimStore), input)
    ),
    listForReview: reviewerProcedure.query(async ({ ctx }) => requireClaimStore(ctx.claimStore).listClaimsForReview()),
    reviewDetail: reviewerProcedure.input(claimIdInput).query(async ({ ctx, input }) => {
      const claimStore = requireClaimStore(ctx.claimStore);
      const claim = await claimStore.findClaimById(input.claimId);
      if (!claim) throw new TRPCError({ code: "NOT_FOUND", message: "لم نجد الادعاء." });
      return { claim, evidence: await claimStore.listEvidence(claim.id), decisions: await claimStore.listDecisions(claim.id) };
    }),
    decide: reviewerProcedure.input(claimDecisionInput).mutation(async ({ ctx, input }) =>
      decideProviderClaim(requireClaimStore(ctx.claimStore), ctx.reviewer!, input)
    )
  }),
  reviewerAdministration: router({
    assignRole: administratorProcedure.input(reviewerRoleAssignmentInput).mutation(async ({ ctx, input }) =>
      ctx.reviewerStore.assignActiveRole({ ...input, assignedByIdentityId: ctx.reviewer!.id, assignedAt: new Date().toISOString() })
    )
  })
});

export type AppRouter = typeof appRouter;
