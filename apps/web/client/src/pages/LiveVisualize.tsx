import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Activity, AlertTriangle, BarChart3, CheckCircle2, Clock3, Loader2, RefreshCw, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const statusLabels: Record<string, string> = {
  pending: "جديد", under_review: "قيد المراجعة", assigned: "مسند", in_progress: "قيد التنفيذ",
  awaiting_verification: "بانتظار التحقق", resolved: "مغلق", rejected: "مرفوض", cancelled: "ملغى", reopened: "معاد فتحه",
};
const statusTone: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800", under_review: "bg-orange-50 text-orange-800", assigned: "bg-cyan-50 text-cyan-800",
  in_progress: "bg-blue-50 text-blue-800", awaiting_verification: "bg-violet-50 text-violet-800", resolved: "bg-emerald-50 text-emerald-800",
  rejected: "bg-rose-50 text-rose-800", cancelled: "bg-slate-100 text-slate-700", reopened: "bg-pink-50 text-pink-800",
};

function formatDate(value: Date | string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function LiveVisualize() {
  const { user } = useAuth();
  const municipalities = trpc.reports.municipalities.listPublic.useQuery();
  const [municipalityId, setMunicipalityId] = useState("");
  useEffect(() => { if (!municipalityId && municipalities.data?.[0]) setMunicipalityId(String(municipalities.data[0].id)); }, [municipalityId, municipalities.data]);
  const query = trpc.analytics.overview.useQuery({ municipalityId: Number(municipalityId) }, { enabled: Boolean(municipalityId), refetchInterval: 60_000, retry: false });
  const data = query.data;
  const maxCategory = Math.max(...(data?.byCategory ?? []).map(item => item.value), 1);
  const maxStatus = Math.max(...(data?.byStatus ?? []).map(item => item.value), 1);
  const headline = useMemo(() => {
    if (!data) return [];
    return [
      { label: "إجمالي البلاغات", value: data.cards.total, icon: BarChart3, tone: "bg-teal-50 text-teal-700" },
      { label: "بلاغات مفتوحة", value: data.cards.open, icon: Activity, tone: "bg-blue-50 text-blue-700" },
      { label: "بانتظار التحقق", value: data.cards.awaitingVerification, icon: ShieldCheck, tone: "bg-violet-50 text-violet-700" },
      { label: "حرجة", value: data.cards.critical, icon: AlertTriangle, tone: "bg-rose-50 text-rose-700" },
      { label: "متوسط الإغلاق بالساعات", value: data.cards.avgClosureHours ?? "—", icon: Clock3, tone: "bg-amber-50 text-amber-700" },
    ];
  }, [data]);

  return <DashboardLayout><main className="min-h-full bg-[#f5f8f7] p-5 lg:p-8"><div className="mx-auto max-w-7xl space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm font-extrabold text-[#0f5b5b]">SENSE Visualize · تشغيل حقيقي</p><h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#143534]">لوحة القرار المبنية على قاعدة البيانات</h1><p className="mt-2 max-w-2xl leading-7 text-slate-600">هذه ليست أرقاماً نموذجية: المؤشرات تُستخرج من البلاغات المسجلة في قاعدة بيانات Urban‑Sense ضمن نطاق البلدية وصلاحيتك.</p></div><div className="flex w-full gap-2 sm:w-auto"><Select value={municipalityId} onValueChange={setMunicipalityId}><SelectTrigger className="w-full bg-white sm:w-56"><SelectValue placeholder="اختر البلدية" /></SelectTrigger><SelectContent>{municipalities.data?.map(item => <SelectItem key={item.id} value={String(item.id)}>{item.nameAr}</SelectItem>)}</SelectContent></Select><button className="inline-flex h-10 items-center gap-2 rounded-md bg-[#0f5b5b] px-4 text-sm font-bold text-white disabled:opacity-50" disabled={query.isFetching} onClick={() => query.refetch()}><RefreshCw size={16} className={query.isFetching ? "animate-spin" : ""} />تحديث</button></div></header>
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-teal-100 bg-white px-5 py-4 text-sm"><span className="font-bold text-slate-700">{data ? `نطاق: ${data.municipality.nameAr}` : "اختر نطاقاً لبدء التحليل"}</span><span className="text-slate-500">{data ? `آخر قراءة: ${formatDate(data.generatedAt)}` : "تُحجب التحليلات حتى التحقق من الصلاحية"}</span></div>
    {query.isLoading && <div className="flex items-center justify-center gap-3 rounded-2xl bg-white p-16 text-slate-500"><Loader2 className="animate-spin" />جاري قراءة قاعدة البيانات...</div>}
    {query.error && <Card className="border-amber-200 bg-amber-50"><CardContent className="p-6"><h2 className="font-extrabold text-amber-950">تعذر تحميل التحليلات</h2><p className="mt-2 leading-7 text-amber-900">{query.error.message}</p></CardContent></Card>}
    {data && <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{headline.map(item => <Card key={item.label} className="border-slate-100 shadow-sm"><CardContent className="flex items-center gap-3 p-5"><span className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.tone}`}><item.icon size={20} /></span><div><p className="text-xs font-bold text-slate-500">{item.label}</p><p className="mt-1 text-2xl font-extrabold text-slate-900">{item.value}</p></div></CardContent></Card>)}</section>
      <section className="grid gap-5 lg:grid-cols-2"><Card className="border-slate-200 shadow-sm"><CardHeader><CardTitle className="text-lg font-extrabold">توزيع الحالات الفعلي</CardTitle></CardHeader><CardContent className="space-y-4">{data.byStatus.length === 0 ? <p className="text-sm text-slate-500">لا توجد بيانات بعد.</p> : data.byStatus.map(item => <div key={item.status}><div className="mb-1 flex justify-between text-sm"><span>{statusLabels[item.status] ?? item.status}</span><strong>{item.value}</strong></div><div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#0f8b8d] transition-all" style={{ width: `${Math.max(6, item.value / maxStatus * 100)}%` }} /></div></div>)}</CardContent></Card>
      <Card className="border-slate-200 shadow-sm"><CardHeader><CardTitle className="text-lg font-extrabold">ضغط البلاغات حسب التصنيف</CardTitle></CardHeader><CardContent className="space-y-4">{data.byCategory.length === 0 ? <p className="text-sm text-slate-500">لا توجد تصنيفات مرتبطة بعد.</p> : data.byCategory.map(item => <div key={item.category}><div className="mb-1 flex justify-between text-sm"><span>{item.category}</span><strong>{item.value}</strong></div><div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#d97850] transition-all" style={{ width: `${Math.max(6, item.value / maxCategory * 100)}%` }} /></div></div>)}</CardContent></Card></section>
      <section className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]"><Card className="border-slate-200 shadow-sm"><CardHeader><CardTitle className="text-lg font-extrabold">آخر البلاغات المسجلة</CardTitle></CardHeader><CardContent className="p-0"><div className="divide-y divide-slate-100">{data.recent.map(item => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"><div><div className="flex items-center gap-2"><span className="font-mono text-xs text-slate-400">{item.reference}</span><Badge className={`border-0 ${statusTone[item.status] ?? "bg-slate-100 text-slate-700"}`}>{statusLabels[item.status] ?? item.status}</Badge></div><p className="mt-1 font-bold text-slate-800">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.category ?? "غير مصنف"}</p></div><time className="text-xs text-slate-500">{formatDate(item.updatedAt)}</time></div>)}</div></CardContent></Card>
      <Card className="border-emerald-100 bg-emerald-50/50 shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2 text-lg font-extrabold text-emerald-950"><CheckCircle2 size={19} />حدود القراءة</CardTitle></CardHeader><CardContent className="space-y-3 text-sm leading-7 text-emerald-900"><p>تُعرض أرقام مجمعة ضمن نطاق البلدية فقط.</p><p>لا تظهر أسماء المواطنين أو أوصافهم الخاصة في هذه اللوحة.</p><p>متوسط الإغلاق محسوب فقط للبلاغات التي تحتوي على وقت إغلاق.</p><p>زمن التحديث: تلقائي كل دقيقة، ويمكن التحديث يدوياً.</p><p className="font-bold">المستخدم الحالي: {user?.name ?? user?.email ?? "حساب مصادق"}</p></CardContent></Card></section>
    </>}
    <footer className="border-t border-slate-200 pt-5 text-xs text-slate-500">المصدر: جداول Urban‑Sense `reports`, `report_status_history`, `service_categories` · لا تستخدم هذه اللوحة لإثبات أثر ميداني خارج البيانات المسجلة.</footer>
  </div></main></DashboardLayout>;
}
