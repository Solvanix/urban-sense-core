export type StudentOpportunityStatus = "not-open" | "needs-host" | "needs-review";

export type StudentOpportunity = {
  id: string;
  title: string;
  description: string;
  status: StudentOpportunityStatus;
  statusLabel: string;
};

export const studentOpportunities: StudentOpportunity[] = [
  {
    id: "quiet-space",
    title: "مساحة هادئة لمهمة قصيرة",
    description: "إطار أولي لمكان مؤقت لإنجاز مهمة أو مراجعة، لا إعلان شاغر.",
    status: "needs-host",
    statusLabel: "تحتاج إلى مضيف",
  },
  {
    id: "learning-seat",
    title: "مقعد تعلم أو جلسة مراجعة",
    description: "صيغة قابلة للدراسة عندما تتحدد الجهة المضيفة وآلية الإشراف.",
    status: "needs-review",
    statusLabel: "قيد التحقق",
  },
  {
    id: "goodness-housing",
    title: "مساكن الخير",
    description: "مبادرة مستقبلية تحتاج معايير حماية وصلاحيات وإحالة قبل أي استقبال.",
    status: "not-open",
    statusLabel: "غير مفتوحة حاليًا",
  },
];

export function getStudentOpportunityStatusTone(status: StudentOpportunityStatus) {
  if (status === "needs-host") return "border-[#e7cf99]/40 bg-[#f8f0df] text-[#765617]";
  if (status === "needs-review") return "border-[#b9d6d0] bg-[#e9f0f3] text-[#315a59]";
  return "border-[#cfd9cf] bg-[#eef2e9] text-[#58716a]";
}
