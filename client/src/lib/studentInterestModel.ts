export type StudentNeed = "quiet" | "study" | "team";
export type StudentWindow = "short" | "day" | "recurring";

const needLabels: Record<StudentNeed, string> = {
  quiet: "مكان هادئ",
  study: "جلسة تعلم",
  team: "عمل جماعي",
};

const windowLabels: Record<StudentWindow, string> = {
  short: "قصيرة",
  day: "جزء من يوم",
  recurring: "متكررة",
};

export function summarizeStudentInterest(need: StudentNeed, timeWindow: StudentWindow) {
  return `احتياجك المبدئي: ${needLabels[need]} لمدة ${windowLabels[timeWindow]}.`;
}

export function isStudentNeed(value: string): value is StudentNeed {
  return value === "quiet" || value === "study" || value === "team";
}

export function isStudentWindow(value: string): value is StudentWindow {
  return value === "short" || value === "day" || value === "recurring";
}

export const studentInterestPrivacyNotice = "نموذج اهتمام تمهيدي: لا يطلب اسمًا أو رقمًا أو عنوانًا أو موقعًا، ولا يعني وجود شاغر أو موافقة.";
