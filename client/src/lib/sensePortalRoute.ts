export const sensePortalHref = "/?view=sense";

export function isSensePortalSearch(search: string) {
  return new URLSearchParams(search).get("view") === "sense";
}
