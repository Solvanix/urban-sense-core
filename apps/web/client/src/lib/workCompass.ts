export type WorkCompassNeed = "service" | "skill" | "place" | "local-project";
export type WorkCompassAiRole = "research" | "alternatives" | "prototype";
export type WorkCompassVerification = "source" | "review" | "trial";

export const workCompassNeeds: Array<{ id: WorkCompassNeed; label: string; prompt: string; outcome: string }> = [
  { id: "service", label: "خدمة أو نظام محلي", prompt: "أريد تحسين خدمة يواجه الناس فيها تأخيرًا أو غموضًا.", outcome: "بطاقة خدمة أو رحلة استخدام قابلة للمراجعة" },
  { id: "skill", label: "مهارة أو مسار تعلم", prompt: "أريد تحويل معرفة أو حاجة مهنية إلى مخرج تعلم ملموس.", outcome: "مخرج مهارة أو دليل ممارسة قصير" },
  { id: "place", label: "مكان أو ذاكرة", prompt: "أريد توثيق معنى مكان أو معرفة مرتبطة به بطريقة تحترم المصدر.", outcome: "بطاقة ذاكرة أو سجل مصدر قابل للتحقق" },
  { id: "local-project", label: "مشروع محلي", prompt: "أريد اختبار فكرة تربط كفاءة محلية بحل أو فرصة واضحة.", outcome: "نموذج أولي ونطاق تجربة محدود" },
];

export const workCompassAiRoles: Array<{ id: WorkCompassAiRole; label: string; detail: string }> = [
  { id: "research", label: "أبحث وأرتب المعرفة", detail: "تجميع أسئلة ومصادر وفرضيات أولية قبل اتخاذ قرار." },
  { id: "alternatives", label: "أبني بدائل قابلة للمقارنة", detail: "صياغة أكثر من مسار أو وصف أو تصميم ثم المقارنة بينها." },
  { id: "prototype", label: "أصنع مخرجًا أوليًا", detail: "مسودة أو نموذج أو بطاقة عمل يراجعها شخص حقيقي." },
];

export const workCompassVerifications: Array<{ id: WorkCompassVerification; label: string; detail: string }> = [
  { id: "source", label: "مصدر ودليل", detail: "أراجع المصدر والتاريخ والنطاق قبل اعتماد أي معلومة." },
  { id: "review", label: "مراجعة اختصاصية", detail: "أعرض المخرج على شخص يملك معرفة أو صلاحية مرتبطة به." },
  { id: "trial", label: "تجربة استخدام", detail: "أختبر المخرج مع مستخدم أو سياق محدود ثم أصلحه." },
];

export function getWorkCompassOutput(input: { need: WorkCompassNeed; aiRole: WorkCompassAiRole; verification: WorkCompassVerification }) {
  const need = workCompassNeeds.find((item) => item.id === input.need)!;
  const aiRole = workCompassAiRoles.find((item) => item.id === input.aiRole)!;
  const verification = workCompassVerifications.find((item) => item.id === input.verification)!;
  return {
    title: `بطاقة عمل: ${need.label}`,
    outcome: need.outcome,
    nextStep: `استخدم الذكاء الاصطناعي كي ${aiRole.label}، ثم اعتمد ${verification.label} قبل مشاركة المخرج أو توسيعه.`,
    checklist: ["صياغة الحاجة والغاية في جملة واحدة", `إنتاج ${need.outcome}`, verification.label, "تسجيل ما تعلّمه الفرد أو الفريق"],
  };
}
