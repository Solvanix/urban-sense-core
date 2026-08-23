export type RuntimeReadinessInput = {
  databaseUrl?: string;
  realDataApproved: boolean;
  reviewerOidcConfigured: boolean;
  hasActiveReviewer: boolean;
};

export type RuntimeReadiness = {
  acceptsProviderData: boolean;
  reason: string | null;
};

/**
 * Public pages may be served before launch, but provider data stays closed until
 * all independent operating boundaries are present.
 */
export function resolveRuntimeReadiness(input: RuntimeReadinessInput): RuntimeReadiness {
  if (!input.databaseUrl?.trim()) {
    return { acceptsProviderData: false, reason: "قاعدة بيانات SENSE Experience المستقلة غير مهيأة." };
  }
  if (!input.realDataApproved) {
    return { acceptsProviderData: false, reason: "استقبال بيانات المزودين غير مفعّل بعد." };
  }
  if (!input.reviewerOidcConfigured) {
    return { acceptsProviderData: false, reason: "هوية المراجعين المستقلة غير مهيأة." };
  }
  if (!input.hasActiveReviewer) {
    return { acceptsProviderData: false, reason: "لا يوجد مراجع مستقل مفعّل بعد." };
  }
  return { acceptsProviderData: true, reason: null };
}
