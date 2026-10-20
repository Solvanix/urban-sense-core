import { describe, expect, it } from "vitest";
import { validateSeminarBooking } from "../src/live/seminarBooking.js";

describe("environmental seminar booking", () => {
  it("creates a local reference for a valid seat request", () => {
    const result = validateSeminarBooking({ name: "سارة", contact: "sara@example.com", seats: 2 }, 10);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.seats).toBe(2);
  });

  it("rejects requests above the per-request limit or remaining capacity", () => {
    expect(validateSeminarBooking({ name: "سارة", contact: "0599999999", seats: 7 }, 10).ok).toBe(false);
    expect(validateSeminarBooking({ name: "سارة", contact: "0599999999", seats: 3 }, 2).ok).toBe(false);
  });

  it("requires a name and contact method", () => {
    expect(validateSeminarBooking({ name: "", contact: "0599999999", seats: 1 }, 30).ok).toBe(false);
    expect(validateSeminarBooking({ name: "سارة", contact: "", seats: 1 }, 30).ok).toBe(false);
  });
});
