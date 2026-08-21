import { describe, expect, it } from "vitest";
import { ecosystemAccessGates, ecosystemRoutes, regionalCurrencyReferences } from "./SensePortal";

describe("SENSE ecosystem portal route inventory", () => {
  it("labels the only public application as published and keeps the other routes honest", () => {
    expect(ecosystemRoutes.find((route) => route.id === "urban-sense")).toMatchObject({ readiness: "منشور", internal: true, href: "/?view=urban" });
    expect(ecosystemRoutes.find((route) => route.id === "experience")).toMatchObject({ readiness: "نواة مستقلة" });
    expect(ecosystemRoutes.filter((route) => route.readiness === "مقترح").map((route) => route.id)).toEqual(["commerce", "maker"]);
  });

  it("does not point a proposed commerce route to a checkout or payment flow", () => {
    const commerce = ecosystemRoutes.find((route) => route.id === "commerce");
    expect(commerce?.href).toBeUndefined();
    expect(commerce?.detail).toContain("لا كتالوج حي");
  });

  it("keeps provider and sponsor entries non-self-service while leaving technical access repository-scoped", () => {
    expect(ecosystemAccessGates.find((gate) => gate.id === "provider")?.href).toBeUndefined();
    expect(ecosystemAccessGates.find((gate) => gate.id === "sponsor")?.href).toBeUndefined();
    expect(ecosystemAccessGates.find((gate) => gate.id === "technical")?.href).toContain("github.com/Solvanix/urban-sense-core");
  });

  it("keeps the regional currency reference dated, sourced, and non-transactional", () => {
    expect(regionalCurrencyReferences).toHaveLength(4);
    expect(regionalCurrencyReferences.map((reference) => reference.label)).toEqual(["اليورو / الدولار", "اليورو / الشيكل", "الدولار / الدينار", "اليورو / الدينار"]);
    expect(regionalCurrencyReferences.every((reference) => reference.date.includes("2026") && reference.href.startsWith("https://"))).toBe(true);
  });
});
