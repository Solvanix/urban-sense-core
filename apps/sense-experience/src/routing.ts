export type SenseRoute = "provider-onboarding" | "reviewer-queue" | "experience-studio" | "access-planner" | "public-site";

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
  return "public-site";
}
