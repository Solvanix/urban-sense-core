export type OwnerInterestDraft = {
  unitType: string;
  generalArea: string;
  availability: string;
  proposedRange: string;
  hostingPreference: string;
  note: string;
};

export const ownerInterestStorageKey = "sense.masaken.owner-interest.v1";
export const actionPlanStorageKey = "sense.masaken.action-plan.v1";

export const ownerInterestDefaults: OwnerInterestDraft = {
  unitType: "",
  generalArea: "",
  availability: "",
  proposedRange: "",
  hostingPreference: "",
  note: "",
};

export function normalizeOwnerInterestDraft(input: OwnerInterestDraft): OwnerInterestDraft {
  return {
    unitType: input.unitType.trim(),
    generalArea: input.generalArea.trim(),
    availability: input.availability.trim(),
    proposedRange: input.proposedRange.trim(),
    hostingPreference: input.hostingPreference.trim(),
    note: input.note.trim(),
  };
}

export type ActionPlanItem = {
  id: string;
  week: string;
  title: string;
  owner: string;
  deliverable: string;
  gate: string;
};

export const masakenActionPlan: ActionPlanItem[] = [
  { id: "scope", week: "الأسبوع 01", title: "تحديد نطاق التجربة", owner: "عمر الفاروق + فريق الحوكمة", deliverable: "مدينة واحدة، فئة واحدة، شريك إحالة واحد.", gate: "لا دعوة ملاك قبل اعتماد النطاق كتابةً." },
  { id: "listening", week: "الأسبوع 02", title: "جلسات استماع مع الملاك", owner: "مسؤول العلاقة", deliverable: "10–15 مقابلة لفهم المخاطر والشروط دون جمع عروض عامة.", gate: "لا وعد بتمويل أو تعويض أثناء اللقاء." },
  { id: "policy", week: "الأسبوع 03", title: "ميثاق المالك والسياسات", owner: "شريك قانوني + مسؤول بيانات", deliverable: "سياسة خصوصية، معايير إحالة، قائمة تحقق، ومسار تظلم.", gate: "لا عقد أو أهلية أو تسعير قبل مراجعة محلية." },
  { id: "pilot", week: "الأسبوع 04", title: "دعوة تجريبية خاصة", owner: "الجهة المشغلة", deliverable: "تجربة داخلية لمسار الاهتمام والفحص دون قوائم عامة.", gate: "لا تحصيل إيجار أو وديعة أو توقيع بالنيابة." },
];

export type TeamDecision = {
  id: string;
  title: string;
  question: string;
  owner: string;
  dependency: string;
};

export const teamDecisions: TeamDecision[] = [
  { id: "area", title: "النطاق الأول", question: "ما المدينة أو المنطقة العامة التي ستبدأ منها التجربة؟", owner: "عمر الفاروق", dependency: "قرار جهة المبادرة" },
  { id: "beneficiary", title: "الفئة الأولى", question: "هل تبدأ التجربة مع طلاب/متدربين موثقين أم فئة أخرى؟", owner: "شريك الإحالة", dependency: "قدرة دعم وإحالة فعلية" },
  { id: "operator", title: "الجهة المشغلة", question: "من يستقبل الشكاوى ويملك حق التصعيد؟", owner: "مجلس الحوكمة", dependency: "كيان أو شريك مسمى" },
  { id: "funding", title: "التمويل والمخاطر", question: "هل يوجد تمويل فعلي لأي ضمان أو صندوق مخاطر؟", owner: "مالك المبادرة", dependency: "ميزانية مكتوبة أو تصريح صريح بغيابها" },
];

export function parseReviewedActionIds(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) && value.every((id) => typeof id === "string") ? value : [];
  } catch {
    return [];
  }
}
