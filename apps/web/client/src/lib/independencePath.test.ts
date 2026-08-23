import { describe, expect, it } from "vitest";
import { createIndependencePlan, normalizeIndependencePlan, planProgress, planSummary, switchIndependenceGoal } from "./independencePath";

describe("مسار الاستقلال", () => {
  it("ينشئ خطة حركة بلا بيانات تشخيص أو اتصال", () => {
    const plan = createIndependencePlan("mobility");
    expect(plan.goalId).toBe("mobility");
    expect(plan.steps).toHaveLength(4);
    expect(JSON.stringify(plan)).not.toContain("diagnosis");
    expect(JSON.stringify(plan)).not.toContain("phone");
    expect(JSON.stringify(plan)).not.toContain("address");
  });

  it("يبدّل المسار ويعيد خطواته المقترحة بدل نقل سياق شخصي بين أهداف مختلفة", () => {
    const initial = createIndependencePlan("mobility");
    const next = switchIndependenceGoal({ ...initial, steps: [{ ...initial.steps[0]!, done: true }] }, "work");
    expect(next.goalId).toBe("work");
    expect(next.steps).toHaveLength(4);
    expect(next.steps.every((step) => !step.done)).toBe(true);
    expect(next.steps.map((step) => step.label).join(" ")).toContain("الدور");
  });

  it("يطبع ملخصًا يثبت أنه خطة محلية لا خدمة إحالة أو أهلية", () => {
    const plan = createIndependencePlan("housing");
    const summary = planSummary(plan);
    expect(summary).toContain("خطة شخصية محلية");
    expect(summary).toContain("لا تمثل خدمة حجز أو إحالة أو قرار أهلية");
  });

  it("يطبع تقدمًا آمنًا ويتعامل مع بيانات محلية تالفة", () => {
    const plan = createIndependencePlan();
    expect(planProgress(plan)).toEqual({ total: 4, completed: 0, percent: 0 });
    expect(normalizeIndependencePlan({ goalId: "unknown", planName: 42, steps: "bad" }).goalId).toBe("mobility");
  });
});
