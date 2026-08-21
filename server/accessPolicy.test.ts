import { describe, expect, it } from "vitest";
import { assertAccountAccessChange } from "./accessPolicy";

describe("account access policy", () => {
  it("preserves the owner account as active platform admin", () => {
    expect(() => assertAccountAccessChange({ isOwnerAccount: true, isActingOnSelf: false, nextRole: "developer", nextIsActive: true })).toThrow("مالك المنصة");
    expect(() => assertAccountAccessChange({ isOwnerAccount: true, isActingOnSelf: false, nextRole: "platform_admin", nextIsActive: false })).toThrow("مالك المنصة");
  });

  it("prevents an administrator from locking out their own session", () => {
    expect(() => assertAccountAccessChange({ isOwnerAccount: false, isActingOnSelf: true, nextRole: "citizen", nextIsActive: true })).toThrow("نفسك");
  });

  it("allows a platform administrator to manage a different individual account", () => {
    expect(() => assertAccountAccessChange({ isOwnerAccount: false, isActingOnSelf: false, nextRole: "developer", nextIsActive: true })).not.toThrow();
  });
});
