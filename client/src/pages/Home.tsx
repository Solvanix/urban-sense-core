import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import PublicFooter from "@/components/PublicFooter";
import PublicHeader from "@/components/PublicHeader";
import PublicTilePattern from "@/components/PublicTilePattern";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BadgeCheck, ClipboardCheck, FileText, MapPin, ShieldCheck, UsersRound } from "lucide-react";
import { Link } from "wouter";

const steps = [
  { icon: FileText, title: "أرسل بلاغك", text: "اكتب وصف المشكلة وحدد موقعها ضمن البلدية المشاركة." },
  { icon: ClipboardCheck, title: "تابع المعالجة", text: "اطلع على انتقالات البلاغ من المراجعة حتى التحقق." },
  { icon: ShieldCheck, title: "قيّم التجربة", text: "بعد الإغلاق المعتمد فقط، يظهر تقييم اختياري لصاحب البلاغ." },
];

const principles = [
  { icon: UsersRound, title: "لكل دور حدوده", text: "لا يرى أو ينفذ كل شخص ما لا يدخل في مسؤوليته أو نطاق بلديته." },
  { icon: BadgeCheck, title: "إغلاق موثق", text: "لا يكتمل الإغلاق التشغيلي قبل التحقق الذي يحدده مسار العمل." },
  { icon: ShieldCheck, title: "أثر قابل للمراجعة", text: "تُربط الأحداث بسجل تدقيق تقني يحفظ تسلسل العمل." },
];

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f8f7]" dir="rtl">
      <PublicHeader />
      <section className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-10 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:pb-28 lg:pt-20">
        <div className="absolute right-8 top-0 h-72 w-72 rounded-full bg-teal-100/40 blur-3xl" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white px-4 py-2 text-sm font-bold text-[#0f5b5b] shadow-sm"><span className="h-2 w-2 rounded-full bg-[#e3a238]" />منصة بلاغات بلدية رقمية</span>
          <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-[1.28] tracking-tight text-[#143534] sm:text-5xl lg:text-6xl">من بلاغ واضح إلى متابعة يمكن فهمها.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Urban‑Sense منصة عربية لتنظيم البلاغات الخدمية البلدية: من التقديم والمراجعة إلى العمل الميداني والتحقق، قبل إتاحة التقييم لصاحب البلاغ.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            {isAuthenticated ? <Link href="/بلاغ-جديد"><Button className="h-12 gap-2 rounded-xl bg-[#e3a238] px-6 text-base font-extrabold text-[#372308] hover:bg-[#d19126]">ابدأ بلاغًا جديدًا <ArrowLeft size={18} /></Button></Link> : <Button disabled={loading} onClick={() => startLogin()} className="h-12 gap-2 rounded-xl bg-[#e3a238] px-6 text-base font-extrabold text-[#372308] hover:bg-[#d19126]">ابدأ المشاركة <ArrowLeft size={18} /></Button>}
            <Link href="/كيف-تعمل" className="inline-flex h-12 items-center rounded-xl border border-slate-300 bg-white px-6 font-bold text-slate-700 transition-colors hover:bg-slate-50">كيف تعمل المنصة؟</Link>
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-500"><ShieldCheck size={17} className="text-[#0f5b5b]" />ليست قناة طوارئ، وتعتمد المشاركة على البلدية التي فعّلت التجربة.</p>
        </div>
        <div className="relative rounded-[2rem] bg-[#0f5b5b] p-6 shadow-2xl shadow-teal-950/20 sm:p-8">
          <div className="absolute left-5 top-5 h-28 w-28 rounded-full bg-[#e3a238]/20 blur-2xl" />
          <div className="relative rounded-2xl bg-white p-5 shadow-xl"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-slate-500">مثال توضيحي لمسار المنصة</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">بلاغ خدمة يحتاج إلى معالجة</h2></div><span className="shrink-0 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">قيد المراجعة</span></div><div className="mt-5 border-r-2 border-dashed border-teal-200 pr-5"><div className="relative pb-5"><span className="absolute -right-[1.75rem] top-0 h-4 w-4 rounded-full border-4 border-white bg-[#0f5b5b]" /><p className="font-bold text-slate-800">تم استلام البلاغ</p><p className="mt-1 text-sm text-slate-500">تسجيل الإرسال والموقع</p></div><div className="relative pb-5"><span className="absolute -right-[1.75rem] top-0 h-4 w-4 rounded-full border-4 border-white bg-[#e3a238]" /><p className="font-bold text-slate-800">مراجعة وتصنيف</p><p className="mt-1 text-sm text-slate-500">تحديد الجهة والفريق المناسب</p></div><div className="relative"><span className="absolute -right-[1.75rem] top-0 h-4 w-4 rounded-full border-4 border-white bg-slate-200" /><p className="font-bold text-slate-400">تنفيذ واعتماد</p><p className="mt-1 text-sm text-slate-400">أدلة ميدانية ثم تقييم اختياري</p></div></div></div>
          <div className="relative mt-5 flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-white"><MapPin className="text-[#f6c76d]" /><p className="text-sm font-bold leading-6">كل بلاغ يرتبط ببلدية وموقع ومسار معالجة واضح.</p></div>
        </div>
      </section>
      <PublicTilePattern variant="home" />
      <section className="border-y border-slate-200 bg-white py-16"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div className="max-w-xl"><p className="font-bold text-[#0f5b5b]">كيف تعمل الخدمة؟</p><h2 className="mt-2 text-3xl font-extrabold text-[#143534] sm:text-4xl">مسار واضح، لا خطوات غامضة.</h2></div><Link href="/كيف-تعمل" className="font-bold text-[#0f5b5b] transition-colors hover:text-[#0a4848]">التفاصيل الكاملة ←</Link></div><div className="grid gap-5 md:grid-cols-3">{steps.map(({ icon: Icon, title, text }, index) => <article key={title} className="rounded-2xl border border-slate-100 bg-[#fbfcfb] p-6"><span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-[#0f5b5b]"><Icon size={21} /></span><span className="block text-xs font-extrabold text-[#e3a238]">0{index + 1}</span><h3 className="mt-1 text-xl font-extrabold text-slate-900">{title}</h3><p className="mt-2 leading-7 text-slate-600">{text}</p></article>)}</div></div></section>
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-[.85fr_1.15fr] lg:px-8"><div className="rounded-3xl bg-[#143b3a] p-7 text-white sm:p-9"><p className="font-extrabold text-[#f6c76d]">مصممة لتكون قابلة للمساءلة</p><h2 className="mt-3 text-3xl font-extrabold leading-[1.35]">وضوح للمواطن، ومسار منضبط لفريق البلدية.</h2><p className="mt-5 leading-8 text-teal-50/80">ليست الفكرة جمع البلاغات فقط؛ بل إبقاء العمل المرتبط بها ضمن أدوار معروفة وأحداث موثقة يمكن مراجعتها.</p><Link href="/للبلديات" className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 font-bold text-[#143534] transition-colors hover:bg-teal-50">استكشف بوابة البلديات <ArrowLeft size={17} /></Link></div><div className="grid gap-4 sm:grid-cols-3">{principles.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-3xl border border-slate-200 bg-white p-6"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-[#bd7820]"><Icon size={21} /></span><h3 className="mt-5 text-lg font-extrabold text-slate-900">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{text}</p></article>)}</div></section>
      <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8"><div className="rounded-[2rem] border border-teal-100 bg-white p-7 sm:p-10"><div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"><div><p className="font-extrabold text-[#0f5b5b]">تجربة محدودة ومسؤولة</p><h2 className="mt-2 text-3xl font-extrabold text-[#143534]">هل تريد المشاركة في التجربة؟</h2><p className="mt-3 max-w-3xl leading-8 text-slate-600">اقرأ شروط المشاركة وحدودها أولًا، ثم أرسل بلاغًا حقيقيًا غير عاجل ضمن نطاق البلدية التي فعّلت التجربة.</p></div><Link href="/التجربة" className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-[#0f5b5b] px-6 font-bold text-white transition-colors hover:bg-[#0a4848]">اذهب إلى التجربة <ArrowLeft size={18} /></Link></div></div></section>
      <PublicFooter />
    </main>
  );
}
