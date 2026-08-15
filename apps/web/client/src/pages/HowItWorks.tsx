import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import PublicFooter from "@/components/PublicFooter";
import PublicHeader from "@/components/PublicHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BadgeCheck, ClipboardCheck, FileText, HardHat, MapPin, ShieldCheck, TriangleAlert } from "lucide-react";
import { Link } from "wouter";

const lifecycle = [
  { icon: FileText, title: "إرسال البلاغ", detail: "يقدم المواطن وصفًا وموقعًا للطلب ضمن البلدية المشاركة، مع بيانات تكفي لفهم المشكلة." },
  { icon: ClipboardCheck, title: "مراجعة وتصنيف", detail: "يراجع موظف الخدمة البلاغ ويحدد ما إذا كان قابلًا للمعالجة والفريق أو التصنيف الأنسب." },
  { icon: HardHat, title: "إسناد وتنفيذ", detail: "يُسنَد البلاغ إلى فريق ميداني، ويمكن للفريق إرفاق أدلة قبل المعالجة وبعدها عند الحاجة." },
  { icon: BadgeCheck, title: "تحقق وإغلاق", detail: "يتحقق المشرف من اكتمال الأدلة قبل الإغلاق الموثق، ثم تظهر للمواطن إمكانية التقييم الاختياري." },
];

export default function HowItWorks() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f8f7]" dir="rtl">
      <PublicHeader />
      <section className="relative mx-auto max-w-7xl px-5 pb-14 pt-8 lg:px-8 lg:pb-20 lg:pt-14">
        <div className="absolute left-0 top-8 h-64 w-64 rounded-full bg-[#e3a238]/10 blur-3xl" />
        <div className="relative grid gap-8 rounded-[2rem] bg-[#0f5b5b] px-6 py-10 text-white shadow-2xl shadow-teal-950/15 lg:grid-cols-[1.2fr_.8fr] lg:px-12 lg:py-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-[#f6c76d]"><MapPin size={17} />مسار بلاغ مفهوم من البداية</span>
            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.25] sm:text-5xl">كيف تعمل المنصة؟</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-teal-50/85">Urban‑Sense تنظم رحلة البلاغ بين المواطن وفريق البلدية، بحيث تكون مراحل المعالجة واضحة ومقيدة بالصلاحيات وليست مجرد رسالة عابرة.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {isAuthenticated ? <Link href="/بلاغ-جديد"><Button className="h-12 gap-2 bg-[#e3a238] px-6 text-base font-extrabold text-[#372308] hover:bg-[#d19126]">ابدأ بلاغًا <ArrowLeft size={18} /></Button></Link> : <Button disabled={loading} onClick={() => startLogin()} className="h-12 gap-2 bg-[#e3a238] px-6 text-base font-extrabold text-[#372308] hover:bg-[#d19126]">ابدأ المشاركة <ArrowLeft size={18} /></Button>}
              <Link href="/التجربة" className="inline-flex h-12 items-center rounded-xl border border-white/35 px-6 font-bold text-white transition-colors hover:bg-white/10">حدود التجربة</Link>
            </div>
          </div>
          <div className="grid content-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-teal-50/85"><p className="font-extrabold text-[#f6c76d]">ما الذي يراه المواطن؟</p><p>حالة البلاغ، انتقالاته الموثقة، وما يتيحه الدور والصلاحية من معلومات مرتبطة به.</p><p className="border-t border-white/10 pt-3 font-extrabold text-[#f6c76d]">ما الذي لا تعد به المنصة؟</p><p>لا تحدد زمن استجابة، ولا تضمن معالجة ميدانية، ولا تغني عن قنوات الطوارئ.</p></div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8"><div className="max-w-2xl"><p className="font-bold text-[#0f5b5b]">رحلة البلاغ</p><h2 className="mt-2 text-3xl font-extrabold text-[#143534] sm:text-4xl">أربع مراحل يمكن تتبعها.</h2><p className="mt-4 leading-8 text-slate-600">تختلف التفاصيل بحسب الحالة والصلاحية، لكن المنصة تحافظ على منطق واضح: لا إسناد بلا مراجعة، ولا إغلاق موثق بلا تحقق.</p></div><div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{lifecycle.map(({ icon: Icon, title, detail }, index) => <article key={title} className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><span className="absolute left-5 top-5 text-sm font-extrabold text-[#e3a238]">0{index + 1}</span><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#0f5b5b]"><Icon size={23} /></span><h3 className="mt-6 text-xl font-extrabold text-slate-900">{title}</h3><p className="mt-3 leading-7 text-slate-600">{detail}</p></article>)}</div></section>
      <section className="border-y border-amber-200 bg-amber-50"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-9 sm:flex-row sm:items-start lg:px-8"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-900"><TriangleAlert size={23} /></span><div><h2 className="text-2xl font-extrabold text-amber-950">التجربة ليست خدمة طوارئ</h2><p className="mt-2 max-w-4xl leading-8 text-amber-950/80">لا تستخدم Urban‑Sense للخطر الفوري أو الحالات العاجلة. استخدم قنوات الطوارئ والجهات المختصة محليًا، ولا تدخل معلومات شخصية حساسة أو مواد لا تملك حق مشاركتها.</p></div></div></section>
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8"><div className="rounded-3xl border border-teal-100 bg-white p-7 sm:p-10"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-center"><div><div className="flex items-center gap-2 font-extrabold text-[#0f5b5b]"><ShieldCheck size={21} />بعد الإغلاق، لا قبلَه</div><h2 className="mt-3 text-3xl font-extrabold text-[#143534]">التقييم اختياري ويعكس تجربة حقيقية فقط.</h2><p className="mt-3 max-w-3xl leading-8 text-slate-600">تظهر واجهة التقييم للمواطن صاحب البلاغ بعد الإغلاق المعتمد. لا تستخدم المنصة تقييمات جاهزة أو افتراضية لإظهار نتائج غير موجودة.</p></div><Link href="/التجربة" className="inline-flex h-12 shrink-0 items-center rounded-xl bg-[#0f5b5b] px-6 font-bold text-white transition-colors hover:bg-[#0a4848]">اعرف شروط المشاركة</Link></div></div></section>
      <PublicFooter />
    </main>
  );
}
