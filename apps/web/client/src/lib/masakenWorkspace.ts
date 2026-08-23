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
export const pilotControlStorageKey = "sense.masaken.pilot-control.v1";

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

export type ActionPlanItem = { id: string; week: string; title: string; owner: string; deliverable: string; gate: string };

export const masakenActionPlan: ActionPlanItem[] = [
  { id: "scope", week: "الأسبوع 01", title: "تحديد نطاق التجربة", owner: "عمر الفاروق + فريق الحوكمة", deliverable: "مدينة واحدة، فئة واحدة، شريك إحالة واحد.", gate: "لا دعوة ملاك قبل اعتماد النطاق كتابةً." },
  { id: "listening", week: "الأسبوع 02", title: "جلسات استماع مع الملاك", owner: "مسؤول العلاقة", deliverable: "10–15 مقابلة لفهم المخاطر والشروط دون جمع عروض عامة.", gate: "لا وعد بتمويل أو تعويض أثناء اللقاء." },
  { id: "policy", week: "الأسبوع 03", title: "ميثاق المالك والسياسات", owner: "شريك قانوني + مسؤول بيانات", deliverable: "سياسة خصوصية، معايير إحالة، قائمة تحقق، ومسار تظلم.", gate: "لا عقد أو أهلية أو تسعير قبل مراجعة محلية." },
  { id: "pilot", week: "الأسبوع 04", title: "دعوة تجريبية خاصة", owner: "الجهة المشغلة", deliverable: "تجربة داخلية لمسار الاهتمام والفحص دون قوائم عامة.", gate: "لا تحصيل إيجار أو وديعة أو توقيع بالنيابة." },
];

export type TeamDecision = { id: string; title: string; question: string; owner: string; dependency: string };

export const teamDecisions: TeamDecision[] = [
  { id: "area", title: "النطاق الأول", question: "ما المدينة أو المنطقة العامة التي ستبدأ منها التجربة؟", owner: "عمر الفاروق", dependency: "قرار جهة المبادرة" },
  { id: "beneficiary", title: "الفئة الأولى", question: "هل تبدأ التجربة مع طلاب/متدربين موثقين أم فئة أخرى؟", owner: "شريك الإحالة", dependency: "قدرة دعم وإحالة فعلية" },
  { id: "operator", title: "الجهة المشغلة", question: "من يستقبل الشكاوى ويملك حق التصعيد؟", owner: "مجلس الحوكمة", dependency: "كيان أو شريك مسمى" },
  { id: "funding", title: "التمويل والمخاطر", question: "هل يوجد تمويل فعلي لأي ضمان أو صندوق مخاطر؟", owner: "مالك المبادرة", dependency: "ميزانية مكتوبة أو تصريح صريح بغيابها" },
];

export type PilotControlDraft = {
  pilotArea: string;
  beneficiaryGroup: string;
  referralPartner: string;
  operatingEntity: string;
  fundingPosition: "" | "funded" | "no-guarantee";
  decisionNote: string;
};

export const pilotControlDefaults: PilotControlDraft = {
  pilotArea: "",
  beneficiaryGroup: "",
  referralPartner: "",
  operatingEntity: "",
  fundingPosition: "",
  decisionNote: "",
};

export function normalizePilotControlDraft(input: PilotControlDraft): PilotControlDraft {
  return {
    pilotArea: input.pilotArea.trim(),
    beneficiaryGroup: input.beneficiaryGroup.trim(),
    referralPartner: input.referralPartner.trim(),
    operatingEntity: input.operatingEntity.trim(),
    fundingPosition: input.fundingPosition,
    decisionNote: input.decisionNote.trim(),
  };
}

export function parsePilotControlDraft(raw: string | null): PilotControlDraft {
  if (!raw) return pilotControlDefaults;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return pilotControlDefaults;
    const draft = value as Partial<PilotControlDraft>;
    const fundingPosition = draft.fundingPosition === "funded" || draft.fundingPosition === "no-guarantee" ? draft.fundingPosition : "";
    return normalizePilotControlDraft({
      pilotArea: typeof draft.pilotArea === "string" ? draft.pilotArea : "",
      beneficiaryGroup: typeof draft.beneficiaryGroup === "string" ? draft.beneficiaryGroup : "",
      referralPartner: typeof draft.referralPartner === "string" ? draft.referralPartner : "",
      operatingEntity: typeof draft.operatingEntity === "string" ? draft.operatingEntity : "",
      fundingPosition,
      decisionNote: typeof draft.decisionNote === "string" ? draft.decisionNote : "",
    });
  } catch {
    return pilotControlDefaults;
  }
}

export type PilotGate = { id: keyof PilotControlDraft; label: string; isComplete: boolean };

export function getPilotReadinessGates(draft: PilotControlDraft): PilotGate[] {
  return [
    { id: "pilotArea", label: "منطقة تجربة عامة", isComplete: Boolean(draft.pilotArea.trim()) },
    { id: "beneficiaryGroup", label: "فئة مستفيد واحدة", isComplete: Boolean(draft.beneficiaryGroup.trim()) },
    { id: "referralPartner", label: "شريك إحالة مسمى", isComplete: Boolean(draft.referralPartner.trim()) },
    { id: "operatingEntity", label: "جهة مشغلة أو مسار اعتماد", isComplete: Boolean(draft.operatingEntity.trim()) },
    { id: "fundingPosition", label: "موقف تمويل معلن", isComplete: draft.fundingPosition === "funded" || draft.fundingPosition === "no-guarantee" },
  ];
}

export function isPilotReadyForLocalReview(draft: PilotControlDraft): boolean {
  return getPilotReadinessGates(draft).every((gate) => gate.isComplete);
}

export function parseReviewedActionIds(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) && value.every((id) => typeof id === "string") ? value : [];
  } catch {
    return [];
  }
}
