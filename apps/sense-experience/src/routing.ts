export type SenseRoute = "provider-onboarding" | "reviewer-queue" | "experience-studio" | "access-planner" | "claim-registry" | "public-site";

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
  return "public-site";
}
