export type LiveMode = "normal" | "paused" | "emergency";
export type SignalStatus = "clear" | "limited" | "closed" | "needs_confirmation" | "unknown";
export type SignalSourceKind = "official" | "partner" | "field_review" | "automated";

export type VisitSignal = {
  id: string;
  label: string;
  status: SignalStatus;
  statusLabel: string;
  sourceLabel: string;
  sourceKind: SignalSourceKind;
  observedAt: string;
  validUntil: string;
  note: string;
};

export type VisitStatusSummary = {
  mode: LiveMode;
  headline: string;
  detail: string;
  tone: "positive" | "caution" | "blocked";
  publishable: boolean;
};

export const demoVisitSignals: VisitSignal[] = [
  {
    id: "destination-opening",
    label: "حالة الوجهة",
    status: "needs_confirmation",
    statusLabel: "تحتاج تأكيدًا قبل الزيارة",
    sourceLabel: "مراجعة تشغيلية محلية",
    sourceKind: "field_review",
    observedAt: "2026-09-20T09:00:00Z",
    validUntil: "2026-09-27T09:00:00Z",
    note: "لا نعرض المكان كوجهة مفتوحة دائمًا قبل تأكيد ساعات العمل وحق الوصول.",
  },
  {
    id: "route-access",
    label: "الوصول والطريق",
    status: "unknown",
    statusLabel: "لا توجد إشارة موثقة الآن",
    sourceLabel: "مصدر نقل معتمد — غير مهيأ",
    sourceKind: "automated",
    observedAt: "2026-09-20T09:00:00Z",
    validUntil: "2026-09-20T09:00:00Z",
    note: "لن نخمن حالة المرور أو الازدحام قبل اعتماد مصدر خرائط أو شريك تشغيل.",
  },
  {
    id: "municipal-clearance-campaign",
    label: "تنظيم الشوارع والأرصفة",
    status: "limited",
    statusLabel: "احتمال تأخير أو تغيير مؤقت يوم الحملة",
    sourceLabel: "إعلان بلدية العيزرية — 24/09/2026",
    sourceKind: "official",
    observedAt: "2026-09-24T20:00:00Z",
    validUntil: "2026-09-28T23:59:59Z",
    note: "أعلنت البلدية حملة ميدانية بالتنسيق مع الشرطة الفلسطينية لإزالة المعيقات يوم الاثنين 28/09/2026. لا يعني الإعلان إغلاق كل الطرق؛ تحقق من المسار قبل الزيارة.",
  },
  {
    id: "palestine-caves-seminar",
    label: "ندوة محلية",
    status: "needs_confirmation",
    statusLabel: "موعد معلن — تحقق من المكان قبل الحضور",
    sourceLabel: "إعلان منتدى الخبرات — منقول في 24/09/2026",
    sourceKind: "partner",
    observedAt: "2026-09-24T20:30:00Z",
    validUntil: "2026-09-26T20:00:00Z",
    note: "ندوة «استغوار كهوف فلسطين تحت الأرض… عالمٌ لم يُكتشف بعد» يقدمها الباحث البيئي خالد أبو علي ويديرها د. صافي صافي، السبت 26/09/2026 الساعة 17:00 في منتدى الخبرات.",
  },
  {
    id: "accessibility",
    label: "الوصولية",
    status: "needs_confirmation",
    statusLabel: "تحتاج تحققًا ميدانيًا",
    sourceLabel: "قائمة تحقق الوصولية",
    sourceKind: "field_review",
    observedAt: "2026-09-20T09:00:00Z",
    validUntil: "2026-09-27T09:00:00Z",
    note: "المعلومة الترويجية لا تكفي لتسمية المكان مهيأً أو مناسبًا للجميع.",
  },
];

export function isSignalFresh(signal: VisitSignal, now = new Date()): boolean {
  return new Date(signal.validUntil).getTime() >= now.getTime();
}

export function summarizeVisitStatus(signals: VisitSignal[], mode: LiveMode = "normal", now = new Date()): VisitStatusSummary {
  if (mode === "emergency") return { mode, headline: "المراقبة في وضع الطوارئ", detail: "نجمّد الإشارات الجديدة ونحافظ على آخر حالة موثقة حتى انتهاء المراجعة.", tone: "blocked", publishable: false };
  if (mode === "paused") return { mode, headline: "المراقبة متوقفة مؤقتًا", detail: "لا نعرض أي ادعاء حي جديد. تحقّق من المصدر قبل تغيير خطة الزيارة.", tone: "caution", publishable: false };
  const fresh = signals.filter((signal) => isSignalFresh(signal, now));
  const hasBlocked = fresh.some((signal) => signal.status === "closed");
  const needsConfirmation = fresh.some((signal) => ["needs_confirmation", "unknown", "limited"].includes(signal.status));
  if (hasBlocked) return { mode, headline: "الوصول محدود أو مغلق", detail: "تحقق من البديل ووقت الزيارة قبل التوجه.", tone: "blocked", publishable: false };
  if (needsConfirmation || fresh.length !== signals.length) return { mode, headline: "الزيارة ممكنة مبدئيًا — تحتاج تأكيدًا", detail: "بعض الإشارات غير مكتملة أو منتهية الصلاحية؛ لا يوجد توافر حي مؤكد بعد.", tone: "caution", publishable: false };
  return { mode, headline: "الإشارات الموثقة تبدو مستقرة", detail: "هذه خلاصة إشارات حديثة من مصادر محددة، وليست ضمانًا للحجز أو الوصول.", tone: "positive", publishable: true };
}
