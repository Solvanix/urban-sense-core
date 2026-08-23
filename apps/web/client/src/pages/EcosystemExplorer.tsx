import { ArrowLeft, ArrowUpLeft, Building2, CheckCircle2, Code2, Compass, ExternalLink, FileText, Globe2, Layers3, LockKeyhole, Map, Route, ShieldCheck, Sparkles, Store, UsersRound, Wrench } from "lucide-react";
import { Link } from "wouter";
import { ecosystemAccessGates, ecosystemRoutes } from "./SensePortal";
import { domainReadinessHref, experienceHubHref, progressDashboardHref, sensePortalHref } from "@/lib/sensePortalRoute";

const liveUrl = "https://urbansense-dzfbcdz5.manus.space";
const repositoryUrl = "https://github.com/Solvanix/urban-sense-core";
const rootIndexUrl = `${repositoryUrl}/blob/main/INDEX.html`;

const readinessTone = {
  "منشور": "border-emerald-300/30 bg-emerald-300/10 text-emerald-50",
  "نواة مستقلة": "border-sky-300/30 bg-sky-300/10 text-sky-50",
  "مقترح": "border-amber-300/30 bg-amber-300/10 text-amber-50",
};

const journeys = [
  { id: "visitor", icon: UsersRound, title: "أريد رؤية ما هو متاح الآن", text: "ابدأ بالبوابة ثم افتح Urban‑Sense؛ لا تحتاج البوابة إلى حساب.", href: sensePortalHref, action: "افتح البوابة" },
  { id: "municipality", icon: Building2, title: "أعمل مع بلدية", text: "راجع المسار العام أولًا، ثم انتقل إلى العمليات فقط بحساب ودور بلدي فعّال.", href: "/?view=operations", action: "دخول العمليات" },
  { id: "provider", icon: Map, title: "أقدّم تجربة أو خدمة", text: "ابدأ بالاستديو أو خطة الوصول أو مسودة الادعاء. لا يوجد تسجيل مزودين أو جمع بيانات عامة الآن.", href: experienceHubHref, action: "افتح المشروع" },
  { id: "technical", icon: Code2, title: "أريد فهم البنية أو المساهمة", text: "ابدأ بفهرس HTML ثم انتقل إلى التطبيق والوثيقة المناسبة وفق صلاحيتك في GitHub.", href: rootIndexUrl, action: "افتح فهرس الجذر" },
];

export default function EcosystemExplorer() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#071216] text-[#f7f8f1]">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-5 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <Link href={sensePortalHref} className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e3a238] text-[#122629]"><Layers3 size={22} /></span>
            <div><p className="font-extrabold tracking-tight">SENSE / Explorer</p><p className="text-xs font-bold text-white/50">خريطة مرئية للمستويات والحدود</p></div>
          </Link>
          <div className="flex flex-wrap gap-2 text-sm font-extrabold">
            <a href={rootIndexUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 text-white/80 hover:border-white/35">فهرس HTML في GitHub <ArrowUpLeft size={15} /></a>
            <Link href={progressDashboardHref} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-sky-300/25 bg-sky-300/10 px-3 text-sky-50">لوحة التقدم <Route size={15} /></Link>
            <Link href={domainReadinessHref} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#e3a238] px-3 text-[#15272a]">جاهزية الدومين <Globe2 size={15} /></Link>
          </div>
        </header>

        <section className="grid gap-8 py-12 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#e3a238]/35 bg-[#e3a238]/10 px-3 py-1.5 text-xs font-extrabold text-[#ffd881]"><Compass size={14} />ابدأ بما تريد فعله</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.14] tracking-tight sm:text-6xl">كل ما هو موجود، وكل ما <span className="text-[#e3a238]">لم يصبح خدمة بعد.</span></h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">هذه ليست صفحة تسويقية تُخفي الفجوات. إنها مدخل بصري واحد: يبيّن التطبيق المنشور، الكود المستقل، المسارات المقترحة، والمكان الذي يجب أن يبدأ منه كل دور.</p>
          </div>
          <article className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(227,162,56,.22),transparent_44%),linear-gradient(145deg,#17343a,#0d1b20)] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-extrabold text-[#ffd881]">المدخل المنشور</p><h2 className="mt-1 text-2xl font-extrabold">بوابة SENSE</h2></div><Route className="text-[#e3a238]" size={28} /></div>
            <p className="mt-5 leading-7 text-white/65">البوابة هي نقطة الوصول الحية. لا توحّد الهويات أو البيانات؛ بل توجهك إلى مسار مستقل وتعلن حدوده بوضوح.</p>
            <a href={`${liveUrl}${sensePortalHref}`} className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-extrabold text-[#12272b]">افتح الصفحة الحية <ArrowLeft size={16} /></a>
          </article>
        </section>

        <section className="mb-12 grid gap-4 md:grid-cols-2" aria-label="طريقة استخدام المداخل">
          <article className="rounded-[1.5rem] border border-emerald-300/20 bg-emerald-300/[.06] p-5">
            <p className="text-xs font-extrabold text-emerald-100">للمشاهدة والتجربة</p>
            <h2 className="mt-2 text-xl font-extrabold">استخدم المستكشف الحي.</h2>
            <p className="mt-3 leading-7 text-white/65">هذا العرض التفاعلي هو الصفحة المنشورة فعلًا. منه تنتقل إلى البوابة ومسارات التطبيق، وتعرف ما الذي يمكن زيارته الآن.</p>
            <a href={`${liveUrl}/?view=explore`} className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-emerald-100">افتح المستكشف الحي <ExternalLink size={16} /></a>
          </article>
          <article className="rounded-[1.5rem] border border-sky-300/20 bg-sky-300/[.06] p-5">
            <p className="text-xs font-extrabold text-sky-100">للكود والوثائق</p>
            <h2 className="mt-2 text-xl font-extrabold">استخدم فهرس HTML في GitHub.</h2>
            <p className="mt-3 leading-7 text-white/65">`INDEX.html` ملف فهرسة في جذر المستودع، وليس موقع GitHub Pages مفعّلًا. يفتح زائر المستودع منه مسارات الكود والوثائق بحسب صلاحياته.</p>
            <a href={rootIndexUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-sky-100">افتح ملف الفهرس <ArrowUpLeft size={16} /></a>
          </article>
        </section>

        <section aria-labelledby="journeys" className="pb-14">
          <div className="mb-5"><p className="text-sm font-extrabold text-[#e3a238]">رحلات لا قوائم ملفات</p><h2 id="journeys" className="mt-1 text-2xl font-extrabold">اختر نيتك، ثم انتقل إلى المستوى الصحيح.</h2></div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {journeys.map((journey) => { const Icon = journey.icon; return <article key={journey.id} className="flex min-h-64 flex-col rounded-[1.55rem] border border-white/10 bg-white/[.045] p-5"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-[#f4c86d]"><Icon size={21} /></span><h3 className="mt-6 text-xl font-extrabold">{journey.title}</h3><p className="mt-3 flex-1 text-sm leading-6 text-white/60">{journey.text}</p><a href={journey.href} target={journey.href.startsWith("http") ? "_blank" : undefined} rel={journey.href.startsWith("http") ? "noreferrer" : undefined} className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#f7cc71]">{journey.action}<ArrowLeft size={16} /></a></article>; })}
          </div>
        </section>

        <section className="border-y border-white/10 py-12" aria-labelledby="products">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-extrabold text-[#e3a238]">محطات المنظومة</p><h2 id="products" className="mt-1 text-2xl font-extrabold">ما الذي تستطيع زيارته أو مراجعته الآن؟</h2></div><p className="max-w-xl text-sm leading-6 text-white/55">لكل بطاقة حقيقة واحدة: منشور، نواة في الكود، أو مقترح يحتاج قرارًا. لا توجد خدمات مخفية خلف هذه التصنيفات.</p></div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {ecosystemRoutes.map((route) => { const Icon = route.icon; return <article key={route.id} className="flex min-h-72 flex-col rounded-[1.6rem] border border-white/10 bg-[#102126] p-5"><div className="flex items-start justify-between gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10"><Icon size={20} /></span><span className={`rounded-full border px-2.5 py-1 text-[11px] font-extrabold ${readinessTone[route.readiness]}`}>{route.readiness}</span></div><p className="mt-6 text-xs font-bold text-[#f2c76e]">{route.eyebrow}</p><h3 className="mt-1 text-xl font-extrabold">{route.label}</h3><p className="mt-3 flex-1 text-sm leading-6 text-white/60">{route.description}</p>{route.href ? <a href={route.internal ? route.href : route.href} target={route.internal ? undefined : "_blank"} rel={route.internal ? undefined : "noreferrer"} className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#f7cc71]">{route.actionLabel}<ArrowLeft size={16} /></a> : <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-white/40">{route.actionLabel}<LockKeyhole size={15} /></span>}</article>; })}
          </div>
        </section>

        <section className="grid gap-4 py-12 lg:grid-cols-3">
          <article className="rounded-[1.65rem] border border-emerald-300/20 bg-emerald-300/[.06] p-6"><CheckCircle2 className="text-emerald-200" size={23} /><h2 className="mt-5 text-xl font-extrabold">منشور ومرئي</h2><p className="mt-3 leading-7 text-white/65">Urban‑Sense والبوابة الموحدة يعملان على رابط عام. ما يظهر هناك هو ما يمكنك تجربته الآن ضمن حدود الدور والبلدية.</p><a href={liveUrl} className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-emerald-100">افتح Urban‑Sense <ExternalLink size={16} /></a></article>
          <article className="rounded-[1.65rem] border border-sky-300/20 bg-sky-300/[.06] p-6"><FileText className="text-sky-200" size={23} /><h2 className="mt-5 text-xl font-extrabold">مرئي في المستودع</h2><p className="mt-3 leading-7 text-white/65">الهيكلة والكود ووثائق القرار متاحة بحسب صلاحية GitHub. فهرس HTML وINDEX.md يقودانك عبرها من الجذر.</p><a href={rootIndexUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-sky-100">افتح فهرس HTML <ArrowUpLeft size={16} /></a></article>
          <article className="rounded-[1.65rem] border border-amber-300/20 bg-amber-300/[.06] p-6"><ShieldCheck className="text-amber-200" size={23} /><h2 className="mt-5 text-xl font-extrabold">لا يزال قرارًا</h2><p className="mt-3 leading-7 text-white/65">الدومين والبريد والكيان القانوني والمتجر لا تفتحها الواجهة وحدها. توجد صفحة جاهزية تُظهر الترتيب الصحيح بلا تسجيل أو شراء صامت.</p><Link href={domainReadinessHref} className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-amber-100">افتح جاهزية الدومين <ArrowLeft size={16} /></Link></article>
        </section>

        <footer className="flex flex-col justify-between gap-4 border-t border-white/10 pt-7 text-sm text-white/50 sm:flex-row sm:items-center"><p>الواجهة ترشد إلى مستويات مستقلة؛ لا تمنح صلاحيات أو توحّد بيانات أو تنشئ حسابات.</p><Link href={sensePortalHref} className="inline-flex items-center gap-2 font-extrabold text-[#f7cc71]">العودة إلى بوابة SENSE <ArrowLeft size={16} /></Link></footer>
      </div>
    </main>
  );
}
