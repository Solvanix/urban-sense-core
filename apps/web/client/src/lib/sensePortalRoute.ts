export const sensePortalHref = "/?view=sense";
export const municipalOperationsHref = "/?view=operations";
export const ecosystemExplorerHref = "/?view=explore";
export const domainReadinessHref = "/?view=domain";

export type RootView = "sense" | "operations" | "explore" | "domain" | null;

export function getRootView(search: string): RootView {
  const view = new URLSearchParams(search).get("view");
  return view === "sense" || view === "operations" || view === "explore" || view === "domain" ? view : null;
}

export function isSensePortalSearch(search: string) {
  return getRootView(search) === "sense";
}
