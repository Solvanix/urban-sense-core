import { describe, expect, it } from "vitest";
import { allowsExternalDelivery, earnedValueRules, needsPhoneCollection } from "./loyaltyModel";

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
});
