export type RecoveryMode = "protect" | "found" | "municipality";

export type RecoveryStatus = "tag-ready" | "finder-message" | "municipal-review" | "handoff-ready";

export const recoveryModes = [
  { id: "protect" as const, label: "أحمي غرضي قبل السفر", eyebrow: "مسافر أو سائح", description: "بطاقة NFC/رابط عام تساعد من يعثر على الغرض أن يبدأ استرداده دون كشف هوية المالك." },
  { id: "found" as const, label: "وجدت غرضًا", eyebrow: "عابر أو مضيف", description: "اقرأ البطاقة أو افتح الرابط، ثم أرسل رسالة وسيطة. لا يظهر لك رقم هاتف المالك أو عنوانه." },
  { id: "municipality" as const, label: "أتابع كبلدية", eyebrow: "تشغيل محلي", description: "مسار فرز واستلام وتسليم بصلاحيات محدودة وسجل تدقيق، لا قاعدة مراقبة للأفراد." },
] as const;

export const recoveryStatuses: Array<{ id: RecoveryStatus; label: string; description: string }> = [
  { id: "tag-ready", label: "بطاقة جاهزة", description: "الرابط العام مهيأ للطباعة أو البرمجة على NFC، من دون حفظ معلومات شخصية في البطاقة." },
  { id: "finder-message", label: "رسالة وسيطة", description: "من عثر على الغرض يرسل موقعًا تقريبيًا ورسالة، بينما تبقى بيانات الطرفين محجوبة." },
  { id: "municipal-review", label: "مراجعة بلدية", description: "تظهر للجهة المشاركة حالة الغرض ونقطة الاستلام فقط، ضمن نطاقها وصلاحيتها." },
  { id: "handoff-ready", label: "جاهز للتسليم", description: "يتم تنسيق التسليم عبر رمز حالة أو نقطة خدمة، مع تسجيل الحد الأدنى من الأدلة." },
];

export const municipalQueue = [
  { id: "SENSE-204", item: "حقيبة سفر زرقاء", area: "نقطة استقبال عامة", status: "بانتظار مطابقة آمنة", age: "منذ 18 دقيقة" },
  { id: "SENSE-198", item: "حافظة بطاقات", area: "محطة زوار", status: "جاهزة للتسليم", age: "منذ ساعتين" },
  { id: "SENSE-191", item: "كاميرا صغيرة", area: "مسار ثقافي", status: "تحتاج صورة تحقق", age: "منذ 4 ساعات" },
] as const;

export const recoveryBoundaries = [
  "لا تتطلب البطاقة تتبعًا دائمًا أو تحديد موقع GPS لحظة بلحظة.",
  "لا تظهر أسماء المالكين أو أرقام هواتفهم لمن يعثر على الغرض.",
  "لا تصبح البلدية مالكة لبيانات المسافر؛ ترى حالة تشغيلية ضمن صلاحيتها فقط.",
  "لا تعتبر NFC بديلًا عن الشرطة أو الطوارئ أو إجراءات الأمان المحلية.",
] as const;

export function getRecoveryStatus(id: RecoveryStatus) {
  return recoveryStatuses.find((status) => status.id === id) ?? recoveryStatuses[0];
}
