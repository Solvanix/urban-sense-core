import { describe, expect, it } from "vitest";
import { ecosystemRoutes } from "./SensePortal";

describe("SENSE ecosystem portal route inventory", () => {
  it("labels the only public application as published and keeps the other routes honest", () => {
    expect(ecosystemRoutes.find((route) => route.id === "urban-sense")).toMatchObject({ readiness: "منشور", internal: true, href: "/" });
    expect(ecosystemRoutes.find((route) => route.id === "experience")).toMatchObject({ readiness: "نواة مستقلة" });
    expect(ecosystemRoutes.filter((route) => route.readiness === "مقترح").map((route) => route.id)).toEqual(["commerce", "maker"]);
  });

  it("does not point a proposed commerce route to a checkout or payment flow", () => {
    const commerce = ecosystemRoutes.find((route) => route.id === "commerce");
    expect(commerce?.href).toBeUndefined();
    expect(commerce?.detail).toContain("لا كتالوج حي");
  });
});
