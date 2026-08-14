import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, ClipboardCheck, FileText, LogIn, MapPin, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

const steps = [
  { icon: FileText, title: "أرسل بلاغك", text: "اكتب وصف المشكلة وحدد موقعها بوضوح." },
  { icon: ClipboardCheck, title: "تابع المعالجة", text: "اطلع على كل تحديث من المراجعة حتى التنفيذ." },
  { icon: ShieldCheck, title: "قيّم النتيجة", text: "يُغلق البلاغ فقط بعد الاعتماد والتوثيق." },
];

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f8f7]" dir="rtl">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0f5b5b] text-white shadow-lg shadow-teal-900/15"><Building2 size={23} /></span>
          <span>
            <span className="block text-lg font-extrabold tracking-tight text-[#143534]">Urban‑Sense</span>
            <span className="block text-xs font-semibold text-slate-500">منصة البلاغات البلدية</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link href="/بلاغاتي"><Button variant="ghost" className="font-bold text-slate-700">بلاغاتي</Button></Link>
              <Button variant="outline" onClick={() => logout()} className="font-bold">تسجيل الخروج</Button>
            </>
          ) : (
            <>
              <Link href="/التجربة"><Button variant="ghost" className="font-bold text-slate-700">انضم للتجربة</Button></Link>
              <Button disabled={loading} onClick={() => startLogin()} className="gap-2 rounded-xl bg-[#0f5b5b] px-5 font-bold hover:bg-[#0a4848]"><LogIn size={17} />تسجيل الدخول</Button>
            </>
          )}
        </nav>
      </header>

      <section className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-18 pt-10 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:pb-24 lg:pt-20">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white px-4 py-2 text-sm font-bold text-[#0f5b5b] shadow-sm"><span className="h-2 w-2 rounded-full bg-[#e3a238]" />خدمة بلدية رقمية موثقة</span>
          <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-[1.28] tracking-tight text-[#143534] sm:text-5xl lg:text-6xl">بلاغك يصل إلى الجهة الصحيحة، وتتابع معالجته خطوة بخطوة.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">منصة عربية موحدة لتقديم بلاغات الخدمات البلدية، متابعتها، توثيق العمل الميداني، واعتماد الإغلاق قبل تقييم الخدمة.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={isAuthenticated ? "/بلاغ-جديد" : "/"}>
              <Button onClick={!isAuthenticated ? () => startLogin() : undefined} className="h-12 gap-2 rounded-xl bg-[#e3a238] px-6 text-base font-extrabold text-[#372308] hover:bg-[#d19126]">ابدأ بلاغًا جديدًا <ArrowLeft size={18} /></Button>
            </Link>
            {isAuthenticated && <Link href="/بلاغاتي"><Button variant="outline" className="h-12 rounded-xl border-slate-300 px-6 font-bold">تتبع بلاغاتي</Button></Link>}
            {!isAuthenticated && <Link href="/التجربة"><Button variant="outline" className="h-12 rounded-xl border-slate-300 px-6 font-bold">كيف أشارك في التجربة؟</Button></Link>}
          </div>
        </div>

        <div className="relative rounded-[2rem] bg-[#0f5b5b] p-6 shadow-2xl shadow-teal-950/20 sm:p-8">
          <div className="absolute left-5 top-5 h-28 w-28 rounded-full bg-[#e3a238]/20 blur-2xl" />
          <div className="relative rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between">
              <div><p className="text-sm font-bold text-slate-500">بلاغ خدمات</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">إنارة تحتاج إلى معالجة</h2></div>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">قيد المراجعة</span>
            </div>
            <div className="mt-5 border-r-2 border-dashed border-teal-200 pr-5">
              <div className="relative pb-5"><span className="absolute -right-[1.75rem] top-0 h-4 w-4 rounded-full border-4 border-white bg-[#0f5b5b]" /><p className="font-bold text-slate-800">تم استلام البلاغ</p><p className="mt-1 text-sm text-slate-500">توثيق الإرسال والموقع</p></div>
              <div className="relative pb-5"><span className="absolute -right-[1.75rem] top-0 h-4 w-4 rounded-full border-4 border-white bg-[#e3a238]" /><p className="font-bold text-slate-800">مراجعة وتصنيف</p><p className="mt-1 text-sm text-slate-500">تحديد الجهة والفريق المناسب</p></div>
              <div className="relative"><span className="absolute -right-[1.75rem] top-0 h-4 w-4 rounded-full border-4 border-white bg-slate-200" /><p className="font-bold text-slate-400">تنفيذ واعتماد</p><p className="mt-1 text-sm text-slate-400">أدلة ميدانية ثم تقييم</p></div>
            </div>
          </div>
          <div className="relative mt-5 flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-white"><MapPin className="text-[#f6c76d]" /><p className="text-sm font-bold leading-6">كل بلاغ مرتبط ببلدية وموقع ومسار معالجة واضح.</p></div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="mb-9 max-w-xl"><p className="font-bold text-[#0f5b5b]">كيف تعمل الخدمة؟</p><h2 className="mt-2 text-3xl font-extrabold text-[#143534]">مسار واضح، لا خطوات غامضة.</h2></div><div className="grid gap-5 md:grid-cols-3">{steps.map(({ icon: Icon, title, text }, index) => <article key={title} className="rounded-2xl border border-slate-100 bg-[#fbfcfb] p-6"><span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-[#0f5b5b]"><Icon size={21} /></span><span className="block text-xs font-extrabold text-[#e3a238]">0{index + 1}</span><h3 className="mt-1 text-xl font-extrabold text-slate-900">{title}</h3><p className="mt-2 leading-7 text-slate-600">{text}</p></article>)}</div></div>
      </section>
    </main>
  );
}
