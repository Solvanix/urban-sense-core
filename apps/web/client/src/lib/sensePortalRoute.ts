export const sensePortalHref = "/?view=sense";
export const urbanSenseHref = "/?view=urban";
export const municipalOperationsHref = "/?view=operations";
export const ecosystemExplorerHref = "/?view=explore";
export const domainReadinessHref = "/?view=domain";
export const progressDashboardHref = "/?view=progress";
export const accessManagementHref = "/?view=access";
export const citizenStartHref = "/?view=citizen";
export const growthJourneyHref = "/?view=growth";
export const loyaltyExplainerHref = "/?view=loyalty";
export const experienceHubHref = "/?view=experience";
export const experienceStudioHref = "/?view=experience-studio";
export const experienceAccessHref = "/?view=experience-access";
export const experienceClaimsHref = "/?view=experience-claims";

export type RootView = "urban" | "sense" | "operations" | "explore" | "domain" | "progress" | "access" | "citizen" | "growth" | "loyalty" | "experience" | "experience-studio" | "experience-access" | "experience-claims" | null;

export function getRootView(search: string): RootView {
  const view = new URLSearchParams(search).get("view");
  return view === "urban" || view === "sense" || view === "operations" || view === "explore" || view === "domain" || view === "progress" || view === "access" || view === "citizen" || view === "growth" || view === "loyalty" || view === "experience" || view === "experience-studio" || view === "experience-access" || view === "experience-claims" ? view : null;
}

export function isSensePortalSearch(search: string) {
  return getRootView(search) === "sense";
}
