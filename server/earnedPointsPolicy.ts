import { TRPCError } from "@trpc/server";

export type EarnedPointEventStatus = "pending_review" | "approved" | "voided";

export function assertReviewTransition(current: EarnedPointEventStatus, next: "approved" | "voided") {
  if (current !== "pending_review") {
    throw new TRPCError({ code: "CONFLICT", message: "لا يمكن مراجعة هذا الحدث مرة أخرى بعد اتخاذ القرار." });
  }
  return next;
}

export function assertNonCashPoints(points: number) {
  if (!Number.isInteger(points) || points < 1 || points > 100_000) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "عدد النقاط يجب أن يكون عددًا صحيحًا بين 1 و100000." });
  }
  return points;
}
