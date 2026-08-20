import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../server/router.js";

export function configuredSenseExperienceApiBaseUrl() {
  const baseUrl = import.meta.env.VITE_SENSE_EXPERIENCE_API_URL?.trim().replace(/\/$/, "");
  if (!baseUrl) {
    throw new Error("لم تُفعّل خدمة SENSE Experience المستقلة بعد؛ لا يمكن حفظ بيانات المزود في هذه المعاينة.");
  }
  return baseUrl;
}

/**
 * The public browser has no local fallback for interest records. Requests go
 * only to the separately deployed SENSE Experience API with cookies included
 * for the reviewer-only queue.
 */
export function createProviderInterestApi() {
  return createTRPCProxyClient<AppRouter>({
    links: [httpBatchLink({
      url: `${configuredSenseExperienceApiBaseUrl()}/api/trpc`,
      fetch(url, options) {
        return fetch(url, { ...options, credentials: "include" });
      }
    })]
  });
}
