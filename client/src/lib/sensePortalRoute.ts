export const sensePortalHref = "/?view=sense";
export const municipalOperationsHref = "/?view=operations";

export type RootView = "sense" | "operations" | null;

export function getRootView(search: string): RootView {
  const view = new URLSearchParams(search).get("view");
  return view === "sense" || view === "operations" ? view : null;
}

export function isSensePortalSearch(search: string) {
  return getRootView(search) === "sense";
}
