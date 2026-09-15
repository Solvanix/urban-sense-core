export type SenseRoute = "provider-onboarding" | "reviewer-queue" | "experience-studio" | "access-planner" | "claim-registry" | "tourism-readiness" | "tourism-launchpad" | "public-site";

export function normalizePathname(pathname: string) {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

export function resolveSenseRoute(pathname: string): SenseRoute {
  const normalized = normalizePathname(pathname);
  if (normalized === "/مراجعة") return "reviewer-queue";
  if (normalized === "/انضم" || normalized === "/providers") return "provider-onboarding";
  if (normalized === "/استديو-التجربة" || normalized === "/experience-studio") return "experience-studio";
  if (normalized === "/خطة-الوصول" || normalized === "/access-plan") return "access-planner";
  if (normalized === "/سجل-الادعاءات" || normalized === "/claims") return "claim-registry";
  if (normalized === "/جواز-المشروع" || normalized === "/tourism-readiness" || normalized === "/passport") return "tourism-readiness";
  if (normalized === "/launchpad" || normalized === "/مسار-الجاهزية" || normalized === "/جواز-مشروعك") return "tourism-launchpad";
  return "public-site";
}
