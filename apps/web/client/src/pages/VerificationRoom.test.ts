import { describe, expect, it } from "vitest";
import { getRootView } from "../lib/sensePortalRoute";
import { isValidClaim, isValidSource, verificationStatusValues } from "./VerificationRoom";

describe("Verification Room", () => {
  it("requires a meaningful claim and a source before creating a draft", () => {
    expect(isValidClaim("قصير")).toBe(false);
    expect(isValidClaim("رُصد توفر خدمة في منطقة محددة")).toBe(true);
    expect(isValidSource(" ")).toBe(false);
    expect(isValidSource("رابط أو مصدر")).toBe(true);
  });

  it("keeps the verification states explicit and bounded", () => {
    expect(verificationStatusValues).toEqual(["draft", "checking", "supported", "conflicted"]);
  });

  it("exposes a discoverable verification root view", () => {
    expect(getRootView("?view=verification")).toBe("verification");
  });
});
