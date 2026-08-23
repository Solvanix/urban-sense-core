export type EarnedValueKind = "points" | "voucher" | "money";

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

export function allowsExternalDelivery(kind: EarnedValueKind) {
  return false;
}

export function needsPhoneCollection(kind: EarnedValueKind) {
  return false;
}
