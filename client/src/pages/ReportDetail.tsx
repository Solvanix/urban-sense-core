import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, statusLabels, statusStyles } from "@/lib/report-ui";
import { trpc } from "@/lib/trpc";
import { ArrowRight, CheckCircle2, History, Loader2, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";

export default function ReportDetail() {
  const [, params] = useRoute("/بلاغاتي/:id");
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const reportId = Number(params?.id);
  const reportQuery = trpc.reports.getById.useQuery({ reportId }, { enabled: isAuthenticated && Number.isFinite(reportId) });
  const utils = trpc.useUtils();
  const [score, setScore] = useState("5");
  const [comment, setComment] = useState("");
  const rate = trpc.reports.rate.useMutation({ onSuccess: () => { toast.success("شكرًا لتقييمك للخدمة."); utils.reports.getById.invalidate({ reportId }); } });
  if (reportQuery.isLoading) return <div className="grid min-h-screen place-items-center"><Loader2 className="animate-spin text-[#0f5b5b]" /></div>;
  if (reportQuery.error || !reportQuery.data) return <main className="grid min-h-screen place-items-center p-6"><Card><CardContent className="p-8 text-center"><h1 className="text-xl font-extrabold">تعذر فتح البلاغ</h1><p className="mt-2 text-slate-600">{reportQuery.error?.message ?? "البلاغ غير متاح."}</p><Button onClick={() => setLocation("/بلاغاتي")} className="mt-5">العودة إلى بلاغاتي</Button></CardContent></Card></main>;
  const { report, history, evidence } = reportQuery.data;
  return <main className="min-h-screen bg-[#f6f8f7] px-5 py-8 lg:px-10"><div className="mx-auto max-w-5xl"><Button variant="ghost" onClick={() => setLocation("/بلاغاتي")} className="mb-4 gap-2 font-bold text-[#0f5b5b]"><ArrowRight size={18} />العودة إلى بلاغاتي</Button><div className="grid gap-6 lg:grid-cols-[1.45fr_.75fr]"><section className="space-y-6"><Card><CardHeader className="border-b"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-mono text-sm text-slate-500">{report.publicReference}</p><CardTitle className="mt-1 text-2xl font-extrabold">{report.title}</CardTitle></div><Badge className={`border-0 ring-1 ${statusStyles[report.status]}`}>{statusLabels[report.status]}</Badge></div></CardHeader><CardContent className="space-y-5 p-6"><p className="leading-8 text-slate-700">{report.description}</p><div className="flex gap-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-600"><MapPin size={18} className="mt-0.5 shrink-0 text-[#0f5b5b]" />{report.locationDescription}</div><p className="text-sm text-slate-500">تاريخ الإرسال: {formatDate(report.createdAt)}</p></CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2 text-xl"><History className="text-[#0f5b5b]" size={21} />سجل حالة البلاغ</CardTitle></CardHeader><CardContent className="space-y-5">{history.map((item, index) => <div key={item.id} className="relative pr-8"><span className={`absolute right-0 top-1 h-4 w-4 rounded-full ${index === 0 ? "bg-[#e3a238]" : "bg-[#0f5b5b]"}`} /><p className="font-extrabold text-slate-800">{statusLabels[item.toStatus]}</p><p className="mt-1 text-sm text-slate-600">{item.reason}</p><p className="mt-1 text-xs text-slate-400">{formatDate(item.createdAt)}</p></div>)}</CardContent></Card></section><aside className="space-y-6"><Card><CardHeader><CardTitle className="text-lg">الأدلة الميدانية</CardTitle></CardHeader><CardContent className="space-y-3">{evidence.length === 0 ? <p className="text-sm leading-7 text-slate-500">ستظهر أدلة قبل وبعد هنا عند بدء الفريق الميداني التنفيذ.</p> : evidence.map(item => <a key={item.id} href={item.storageUrl} target="_blank" className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm font-bold text-[#0f5b5b]" rel="noreferrer"><span>دليل {item.kind === "before" ? "قبل المعالجة" : "بعد المعالجة"}</span><ArrowRight size={16} /></a>)}</CardContent></Card>{report.status === "resolved" && <Card className="border-emerald-100"><CardHeader><CardTitle className="flex items-center gap-2 text-lg text-emerald-800"><CheckCircle2 size={20} />تقييم الخدمة</CardTitle></CardHeader><CardContent><form onSubmit={event => { event.preventDefault(); rate.mutate({ reportId, score: Number(score), comment: comment || undefined }); }} className="space-y-3"><Label>التقييم من 1 إلى 5</Label><Input type="number" min="1" max="5" value={score} onChange={event => setScore(event.target.value)} /><Textarea value={comment} onChange={event => setComment(event.target.value)} placeholder="ملاحظتك اختيارية" maxLength={500} /><Button disabled={rate.isPending} className="w-full gap-2 bg-[#e3a238] font-extrabold text-[#372308] hover:bg-[#d19126]"><Star size={17} />إرسال التقييم</Button></form></CardContent></Card>}</aside></div></div></main>;
}
