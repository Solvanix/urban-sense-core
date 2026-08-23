import { describe, expect, it } from "vitest";
import { allowsExternalDelivery, earnedValueDestinations, earnedValueRules, needsPhoneCollection, resolveDestination, saveDefaultDestination } from "./loyaltyModel";

describe("earned value safety model", () => {
  it("does not allow any external credit delivery in the prototype", () => {
    expect(allowsExternalDelivery("points")).toBe(false);
    expect(allowsExternalDelivery("voucher")).toBe(false);
    expect(allowsExternalDelivery("money")).toBe(false);
  });

  it("does not collect phone numbers for points, vouchers, or money", () => {
    expect(needsPhoneCollection("points")).toBe(false);
    expect(needsPhoneCollection("voucher")).toBe(false);
    expect(needsPhoneCollection("money")).toBe(false);
  });

  it("keeps cash-out and transfers explicitly blocked", () => {
    expect(earnedValueRules.points.blocked).toContain("السحب النقدي");
    expect(earnedValueRules.points.blocked).toContain("التحويل بين الأشخاص");
    expect(earnedValueRules.money.blocked).toContain("إرسال رصيد");
  });

  it("keeps a temporary destination from overwriting the default", () => {
    const preference = { defaultDestinationId: "sense-points" as const, askEachRedemption: false };
    const result = resolveDestination(preference, "bank-of-palestine");
    expect(result.temporaryChoiceDoesNotOverwriteDefault).toBe(true);
    expect(result.defaultDestinationId).toBe("sense-points");
    expect(result.pendingApproval).toBe(true);
    expect(result.effectiveDestinationId).toBe("sense-points");
  });

  it("blocks every pending partner from becoming a saved default", () => {
    const preference = { defaultDestinationId: "sense-points" as const, askEachRedemption: false };
    for (const destination of earnedValueDestinations.filter((item) => item.requiresAgreement)) {
      const result = saveDefaultDestination(preference, destination.id);
      expect(result.saved).toBe(false);
      expect(result.pendingApproval).toBe(true);
      expect(result.preference.defaultDestinationId).toBe("sense-points");
    }
  });
});
