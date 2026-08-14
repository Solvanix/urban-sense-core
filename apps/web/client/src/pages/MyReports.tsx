import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, PlusCircle, ReceiptText } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { formatDate, statusLabels, statusStyles } from "@/lib/report-ui";

export default function MyReports() {
  const { isAuthenticated, loading } = useAuth();
  const reportsQuery = trpc.reports.listMine.useQuery(undefined, { enabled: isAuthenticated });

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="animate-spin text-[#0f5b5b]" /></div>;
  if (!isAuthenticated) return <main className="grid min-h-screen place-items-center p-6 text-center"><Card className="max-w-md"><CardContent className="p-8"><ReceiptText className="mx-auto mb-4 text-[#0f5b5b]" size={40} /><h1 className="text-2xl font-extrabold">سجّل الدخول لمتابعة بلاغاتك</h1><p className="mt-3 text-slate-600">يحمي تسجيل الدخول خصوصية البلاغات وحالة المعالجة.</p><Button onClick={() => startLogin()} className="mt-6 bg-[#0f5b5b] font-bold">تسجيل الدخول</Button></CardContent></Card></main>;

  return <main className="min-h-screen bg-[#f6f8f7] px-5 py-8 lg:px-10"><div className="mx-auto max-w-5xl"><div className="flex flex-wrap items-end justify-between gap-4"><div><Link href="/" className="text-sm font-bold text-[#0f5b5b]">الرئيسية</Link><h1 className="mt-2 text-3xl font-extrabold text-[#143534]">بلاغاتي</h1><p className="mt-2 text-slate-600">تابع حالة كل بلاغ وتاريخ الإجراءات المرتبطة به.</p></div><Link href="/بلاغ-جديد"><Button className="h-11 gap-2 rounded-xl bg-[#0f5b5b] font-bold"><PlusCircle size={18} />بلاغ جديد</Button></Link></div>
  <section className="mt-8 space-y-3">{reportsQuery.isLoading && <Card><CardContent className="flex items-center gap-3 p-6 text-slate-500"><Loader2 className="animate-spin" size={18} />جارٍ تحميل البلاغات...</CardContent></Card>}{reportsQuery.error && <Card className="border-rose-200"><CardContent className="p-6 text-rose-700">تعذر تحميل البلاغات: {reportsQuery.error.message}</CardContent></Card>}{reportsQuery.data?.length === 0 && <Card><CardContent className="p-10 text-center"><ReceiptText className="mx-auto mb-4 text-slate-300" size={45} /><h2 className="text-xl font-extrabold">لا توجد بلاغات حتى الآن</h2><p className="mt-2 text-slate-600">عند ظهور مشكلة في الخدمات البلدية، أرسل بلاغًا موثقًا لنبدأ المتابعة.</p></CardContent></Card>}{reportsQuery.data?.map(report => <Link key={report.id} href={`/بلاغاتي/${report.id}`}><Card className="cursor-pointer border-slate-200 transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"><CardContent className="flex flex-wrap items-center justify-between gap-4 p-5"><div><div className="flex items-center gap-3"><span className="font-mono text-xs text-slate-500">{report.publicReference}</span><Badge className={`border-0 ring-1 ${statusStyles[report.status]}`}>{statusLabels[report.status]}</Badge></div><h2 className="mt-2 text-lg font-extrabold text-slate-900">{report.title}</h2><p className="mt-1 text-sm text-slate-500">{report.locationDescription}</p></div><p className="text-sm text-slate-500">آخر تحديث: {formatDate(report.updatedAt)}</p></CardContent></Card></Link>)}</section></div></main>;
}
