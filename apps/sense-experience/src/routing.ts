export type SenseRoute = "provider-onboarding" | "reviewer-queue" | "public-site";

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
  return "public-site";
}
