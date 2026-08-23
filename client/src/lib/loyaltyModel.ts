export type EarnedValueKind = "points" | "voucher" | "money";
export type DestinationId = "sense-points" | "bank-of-palestine" | "arab-bank" | "national-bank" | "other-approved-partner";

export const earnedValueDestinations = [
  { id: "sense-points", label: "نقاط SENSE غير النقدية", status: "متاح داخل النموذج" as const, requiresAgreement: false },
  { id: "bank-of-palestine", label: "بنك فلسطين أو iBURAQ", status: "ينتظر عقدًا وواجهة مزود" as const, requiresAgreement: true },
  { id: "arab-bank", label: "البنك العربي أو Reflect", status: "ينتظر عقدًا وواجهة مزود" as const, requiresAgreement: true },
  { id: "national-bank", label: "البنك الوطني", status: "ينتظر عقدًا وواجهة مزود" as const, requiresAgreement: true },
  { id: "other-approved-partner", label: "بطاقة أو محفظة شريك معتمد لاحقًا", status: "ينتظر تعريف الشريك" as const, requiresAgreement: true },
] as const;

export type DestinationPreference = {
  defaultDestinationId: DestinationId;
  askEachRedemption: boolean;
};

export function saveDefaultDestination(preference: DestinationPreference, requestedDestinationId: DestinationId) {
  const requested = earnedValueDestinations.find((destination) => destination.id === requestedDestinationId)!;
  return requested.requiresAgreement
    ? { preference, saved: false, pendingApproval: true }
    : { preference: { ...preference, defaultDestinationId: requestedDestinationId }, saved: true, pendingApproval: false };
}

export function resolveDestination(preference: DestinationPreference, temporaryDestinationId?: DestinationId) {
  const requestedDestinationId = temporaryDestinationId ?? preference.defaultDestinationId;
  const requested = earnedValueDestinations.find((destination) => destination.id === requestedDestinationId)!;
  return {
    defaultDestinationId: preference.defaultDestinationId,
    requestedDestinationId,
    effectiveDestinationId: requested.requiresAgreement ? "sense-points" as const : requested.id,
    pendingApproval: requested.requiresAgreement,
    temporaryChoiceDoesNotOverwriteDefault: Boolean(temporaryDestinationId),
  };
}

export const earnedValueRules = {
  points: {
    title: "نقاط SENSE غير النقدية",
    availability: "يمكن تصميمها بعد اعتماد قواعد الاستحقاق والمراجعة.",
    allowed: ["تسجيل أهلية", "منح بعد دليل أو قرار", "عرض الرصيد غير النقدي"],
    blocked: ["السحب النقدي", "التحويل بين الأشخاص", "وعد بقيمة عملة"],
  },
  voucher: {
    title: "قسيمة ممولة من تاجر",
    availability: "تحتاج تاجرًا متعاقدًا ورمزًا فريدًا وشروط استرداد وتسوية.",
    allowed: ["عرض أهلية لقسيمة", "إصدار رمز بعد عقد تاجر", "إثبات الاسترداد"],
    blocked: ["قسائم مصطنعة", "استرداد تلقائي", "تمويل القسيمة من SENSE"],
  },
  money: {
    title: "قيمة مالية أو رصيد محفظة",
    availability: "مغلق حتى عقد مع مزود منظم وموافقة وهوية وتشغيل تسوية.",
    allowed: ["دراسة خيار مزود منظم", "تحقق رقم لاحقًا بعد اعتماد المسار"],
    blocked: ["إدخال رقم هاتف الآن", "إرسال رصيد", "تحويل أو سحب", "تخزين بيانات محفظة"],
  },
} as const;

export function allowsExternalDelivery(_kind: EarnedValueKind) {
  return false;
}

export function needsPhoneCollection(_kind: EarnedValueKind) {
  return false;
}
