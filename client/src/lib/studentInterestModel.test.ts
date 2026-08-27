import { describe, expect, it } from "vitest";
import {
  isStudentNeed,
  isStudentWindow,
  studentInterestPrivacyNotice,
  summarizeStudentInterest,
} from "./studentInterestModel";

describe("student interest model", () => {
  it("summarizes a non-sensitive student request", () => {
    expect(summarizeStudentInterest("study", "day")).toBe("احتياجك المبدئي: جلسة تعلم لمدة جزء من يوم.");
  });

  it("accepts only supported need and time-window values", () => {
    expect(isStudentNeed("quiet")).toBe(true);
    expect(isStudentNeed("address")).toBe(false);
    expect(isStudentWindow("recurring")).toBe(true);
    expect(isStudentWindow("gps")).toBe(false);
  });

  it("states that the preview does not request identity or location data", () => {
    expect(studentInterestPrivacyNotice).toContain("لا يطلب اسمًا");
    expect(studentInterestPrivacyNotice).toContain("موقعًا");
  });
});
