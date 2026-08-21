import { TRPCError } from "@trpc/server";

export const assignablePlatformRoles = ["citizen", "developer", "platform_admin"] as const;
export type AssignablePlatformRole = (typeof assignablePlatformRoles)[number];

export function assertAccountAccessChange(input: {
  isOwnerAccount: boolean;
  isActingOnSelf: boolean;
  nextRole: AssignablePlatformRole;
  nextIsActive: boolean;
}) {
  const removesPlatformAdmin = input.nextRole !== "platform_admin";
  const suspendsAccount = !input.nextIsActive;

  if (input.isOwnerAccount && (removesPlatformAdmin || suspendsAccount)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "لا يمكن خفض دور حساب مالك المنصة أو إيقافه." });
  }

  if (input.isActingOnSelf && (removesPlatformAdmin || suspendsAccount)) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "لا يمكنك خفض دورك الإداري أو إيقاف حسابك بنفسك." });
  }
}
