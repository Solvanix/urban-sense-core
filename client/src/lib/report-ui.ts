export const statusLabels: Record<string, string> = {
  pending: "بانتظار المراجعة",
  under_review: "قيد المراجعة",
  assigned: "تم الإسناد",
  in_progress: "قيد التنفيذ الميداني",
  awaiting_verification: "بانتظار اعتماد المشرف",
  resolved: "مغلق ومُعتمد",
  rejected: "مرفوض",
  cancelled: "ملغى",
  reopened: "أعيد فتحه",
};

export const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800 ring-amber-200",
  under_review: "bg-blue-50 text-blue-800 ring-blue-200",
  assigned: "bg-violet-50 text-violet-800 ring-violet-200",
  in_progress: "bg-cyan-50 text-cyan-800 ring-cyan-200",
  awaiting_verification: "bg-orange-50 text-orange-800 ring-orange-200",
  resolved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  rejected: "bg-rose-50 text-rose-800 ring-rose-200",
  cancelled: "bg-slate-100 text-slate-700 ring-slate-200",
  reopened: "bg-fuchsia-50 text-fuchsia-800 ring-fuchsia-200",
};

export function formatDate(date: Date | string | number | null | undefined) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("ar-PS", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date));
}
