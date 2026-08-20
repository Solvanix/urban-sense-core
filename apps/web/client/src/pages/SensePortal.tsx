import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Accessibility,
  ArrowLeft,
  Bot,
  Building2,
  ChevronLeft,
  CircleDollarSign,
  ClipboardList,
  Database,
  Eye,
  Gauge,
  Layers3,
  LockKeyhole,
  Map,
  MessageCircle,
  Radio,
  Route,
  ShieldCheck,
  Sparkles,
  Store,
  UsersRound,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

type Readiness = "منشور" | "نواة مستقلة" | "مقترح";

export type EcosystemRoute = {
  id: string;
  label: string;
  eyebrow: string;
  readiness: Readiness;
  description: string;
  detail: string;
  actionLabel: string;
  href?: string;
  internal?: boolean;
  icon: typeof Building2;
  tone: "teal" | "blue" | "amber" | "slate";
};

export const ecosystemRoutes: EcosystemRoute[] = [
  {
    id: "urban-sense",
    label: "Urban‑Sense",
    eyebrow: "البلاغات البلدية",
    readiness: "منشور",
    description: "منصة بلاغات بلدية عربية: تقديم، مراجعة، إسناد، أدلة، تحقق وإغلاق.",
    detail: "له قاعدة بيانات وهوية وصلاحيات خاصة به. لا يحتوي سياحة أو متجرًا.",
    actionLabel: "افتح المنصة البلدية",
    href: "/",
    internal: true,
    icon: Building2,
    tone: "teal",
  },
  {
    id: "experience",
    label: "SENSE Experience",
    eyebrow: "مكان · مسار · أثر",
    readiness: "نواة مستقلة",
    description: "واجهة عربية مستقلة لمسار مزودي الخدمات والتجارب والمراجعة البشرية.",
    detail: "الكود والحدود جاهزة للمراجعة، لكنه لا يقبل بيانات مزودين حقيقية ولا يملك رابط إنتاج مستقل بعد.",
    actionLabel: "استعرض النواة في المصدر",
    href: "https://github.com/Solvanix/urban-sense-core/tree/main/apps/sense-experience",
    icon: Map,
    tone: "blue",
  },
  {
    id: "commerce",
    label: "السوق والمتجر",
    eyebrow: "تجارة متعددة المشاريع",
    readiness: "مقترح",
    description: "مسار منفصل مستقبلًا لكتالوج حقيقي وطلبات ومدفوعات وسياسة إرجاع.",
    detail: "لا كتالوج حي، ولا طلبات، ولا شحن، ولا بوابة دفع، ولا دفتر مبيعات داخل المنظومة الآن.",
    actionLabel: "يعتمد على قرار الكيان والتجارة",
    icon: Store,
    tone: "amber",
  },
  {
    id: "maker",
    label: "التمكين والتصنيع",
    eyebrow: "من الفكرة إلى نموذج",
    readiness: "مقترح",
    description: "تجربة مستقبلية محدودة لربط التصميم والنمذجة والتوثيق وفرص السوق.",
    detail: "ليست مركزًا قائمًا أو معدات مملوكة أو شراكة نافذة؛ تبدأ فقط بعد قرار قانوني وخدمة تجريبية حقيقية.",
    actionLabel: "راجع بوابات القرار",
    href: "https://github.com/Solvanix/urban-sense-core/blob/main/docs/research/SENSE-DIGITAL-MANUFACTURING-CENTER-EVIDENCE-ANALYSIS-2026-08-20.md",
    icon: Wrench,
    tone: "slate",
  },
];

const readinessClass: Record<Readiness, string> = {
  "منشور": "bg-emerald-400/15 text-emerald-100 ring-1 ring-emerald-300/30",
  "نواة مستقلة": "bg-sky-400/15 text-sky-100 ring-1 ring-sky-300/30",
  "مقترح": "bg-amber-300/15 text-amber-100 ring-1 ring-amber-200/30",
};

const toneClass: Record<EcosystemRoute["tone"], string> = {
  teal: "from-[#0f5b5b] via-[#144b4a] to-[#0c2428]",
  blue: "from-[#163d6a] via-[#1e4f88] to-[#102743]",
  amber: "from-[#74501f] via-[#6a421a] to-[#281c12]",
  slate: "from-[#33434a] via-[#283438] to-[#141f24]",
};

function PortalLink({ route }: { route: EcosystemRoute }) {
  const className = "mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-extrabold text-[#10292d] transition-transform duration-150 hover:bg-[#fff8e9] active:scale-[.97]";
  if (!route.href) return <span className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-extrabold text-white/70">{route.actionLabel}<LockKeyhole size={16} /></span>;
  if (route.internal) return <Link href={route.href} className={className}>{route.actionLabel}<ArrowLeft size={16} /></Link>;
  return <a href={route.href} target="_blank" rel="noreferrer" className={className}>{route.actionLabel}<ArrowLeft size={16} /></a>;
}

export default function SensePortal() {
  const [activeRouteId, setActiveRouteId] = useState("urban-sense");
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const activeRoute = ecosystemRoutes.find((route) => route.id === activeRouteId) ?? ecosystemRoutes[0]!;
  const ActiveIcon = activeRoute.icon;

  return (
    <main
      dir="rtl"
      className={cn(
        "min-h-screen bg-[#091419] text-[#f7f8f1] selection:bg-[#e3a238] selection:text-[#152225]",
        highContrast && "bg-black text-white"
      )}
      data-reduced-motion={reducedMotion ? "true" : "false"}
    >
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-5 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e3a238] text-[#142729]"><Layers3 size={22} /></span>
            <div>
              <p className="text-lg font-extrabold tracking-tight">SENSE</p>
              <p className="text-xs font-bold text-white/55">بوابة المسارات — نسخة توجيهية</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2" aria-label="تفضيلات العرض">
            <button aria-pressed={highContrast} onClick={() => setHighContrast((value) => !value)} className={cn("inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 text-sm font-bold", highContrast ? "border-[#e3a238] bg-[#e3a238] text-[#17272a]" : "border-white/15 bg-white/5 text-white/80")}><Eye size={16} />تباين أعلى</button>
            <button aria-pressed={reducedMotion} onClick={() => setReducedMotion((value) => !value)} className={cn("inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 text-sm font-bold", reducedMotion ? "border-[#e3a238] bg-[#e3a238] text-[#17272a]" : "border-white/15 bg-white/5 text-white/80")}><Accessibility size={16} />تقليل الحركة</button>
          </div>
        </header>

        <section className="grid gap-8 py-10 lg:grid-cols-[.83fr_1.17fr] lg:items-end lg:py-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#e3a238]/35 bg-[#e3a238]/10 px-3 py-1.5 text-xs font-extrabold text-[#ffd881]"><Radio size={14} />لوحة توجيه لا حساب موحّد</p>
            <h1 className="mt-5 max-w-xl text-4xl font-extrabold leading-[1.17] tracking-tight sm:text-5xl">كل مسار له <span className="text-[#e3a238]">محطته</span> وحدوده.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">هذه ليست صفحة تدّعي أن كل شيء جاهز أو موصول في قاعدة واحدة. إنها مدخل واحد يوضح أين يبدأ كل منتج، وما الذي يعمل الآن، وما الذي ينتظر قرارًا أو تشغيلًا مستقلًا.</p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold text-white/70">
              <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />منشور</span>
              <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-sky-300" />نواة مستقلة</span>
              <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-300" />مقترح</span>
            </div>
          </div>

          <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(140deg,#142c31_0%,#0b171b_65%)] p-5 sm:p-7" aria-label="وحدة المسار النشط">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(90deg,transparent,rgba(227,162,56,.16),transparent)]" />
            <div className="relative flex items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-[#f4c86d]"><ActiveIcon size={22} /></span><div><p className="text-xs font-bold text-white/50">المسار النشط</p><h2 className="text-xl font-extrabold">{activeRoute.label}</h2></div></div>
              <span className={cn("rounded-full px-3 py-1 text-xs font-extrabold", readinessClass[activeRoute.readiness])}>{activeRoute.readiness}</span>
            </div>
            <div className="relative grid gap-4 pt-6 sm:grid-cols-[1fr_auto] sm:items-end"><div><p className="text-xl font-extrabold leading-8">{activeRoute.description}</p><p className="mt-3 max-w-xl leading-7 text-white/60">{activeRoute.detail}</p></div><PortalLink route={activeRoute} /></div>
            <div className="relative mt-7 flex items-center gap-3 text-xs font-bold text-white/45"><span className="h-px flex-1 bg-white/10" /><Route size={15} /><span>حدد بطاقة لمسار مختلف</span><span className="h-px flex-1 bg-white/10" /></div>
          </section>
        </section>

        <section className="pb-14" aria-labelledby="routes-title">
          <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-sm font-extrabold text-[#e3a238]">محطات المنظومة</p><h2 id="routes-title" className="mt-1 text-2xl font-extrabold">اختر المسار، لا تتوه في الوعود.</h2></div><p className="hidden max-w-md text-left text-sm leading-6 text-white/50 md:block">التدرج مستلهم من محطات العرض في المرجع: بطاقة نشطة أمامية، ومحطات مجاورة، من دون نسخ الشكل أو وظائف السيارة.</p></div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {ecosystemRoutes.map((route, index) => {
              const Icon = route.icon;
              const active = route.id === activeRouteId;
              return <button key={route.id} onClick={() => setActiveRouteId(route.id)} aria-pressed={active} className={cn("group min-h-56 rounded-[1.65rem] border p-5 text-right motion-safe:transition-all motion-safe:duration-200", active ? cn("border-white/45 shadow-2xl", !reducedMotion && "-translate-y-2 scale-[1.015]", `bg-gradient-to-br ${toneClass[route.tone]}`) : "border-white/10 bg-white/[.045] hover:border-white/30 hover:bg-white/[.08]")}>
                <div className="flex items-start justify-between gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white"><Icon size={20} /></span><span className={cn("rounded-full px-2.5 py-1 text-[11px] font-extrabold", readinessClass[route.readiness])}>{route.readiness}</span></div>
                <p className="mt-7 text-xs font-bold text-white/55">0{index + 1} · {route.eyebrow}</p><h3 className="mt-1 text-xl font-extrabold">{route.label}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-white/60">{route.description}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-extrabold text-[#f7cc71]">عرض الحالة <ChevronLeft size={16} /></span>
              </button>;
            })}
          </div>
        </section>

        <section className="grid gap-5 border-y border-white/10 py-12 lg:grid-cols-[1.05fr_.95fr]">
          <div className="rounded-[1.7rem] border border-white/10 bg-white/[.04] p-6 sm:p-7"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e3a238]/15 text-[#f6ca6e]"><Database size={21} /></span><div><p className="text-sm font-extrabold">بيانات وهوية منفصلة</p><p className="text-sm text-white/50">ليست «قاعدة بيانات SENSE واحدة».</p></div></div><div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-black/15 p-4"><p className="font-extrabold">Urban‑Sense</p><p className="mt-2 text-sm leading-6 text-white/60">بلاغات بلدية، موظفون، أدلة وسجل تدقيق داخل نطاقه فقط.</p></div><div className="rounded-2xl border border-white/10 bg-black/15 p-4"><p className="font-extrabold">SENSE Experience</p><p className="mt-2 text-sm leading-6 text-white/60">مزودون ومراجعون في خدمة وهوية وقاعدة مستقلة عند تشغيلها.</p></div></div></div>
          <div className="rounded-[1.7rem] border border-white/10 bg-[#102126] p-6 sm:p-7"><p className="text-sm font-extrabold text-[#e3a238]">لم نربط هذه الأشياء بعد</p><ul className="mt-4 space-y-3 text-sm leading-6 text-white/70"><li className="flex gap-3"><CircleDollarSign className="mt-0.5 shrink-0 text-white/45" size={18} />محاسبة، فواتير، دفعات أو ربط دفع حي.</li><li className="flex gap-3"><Bot className="mt-0.5 shrink-0 text-white/45" size={18} />مساعد ذكي أو دعم عملاء متصل يجيب أو يحتفظ بمحادثات.</li><li className="flex gap-3"><Gauge className="mt-0.5 shrink-0 text-white/45" size={18} />لوحة أثر شاملة؛ توجد مؤشرات Urban‑Sense التشغيلية فقط كإطار جزئي.</li></ul></div>
        </section>

        <section className="grid gap-4 py-12 md:grid-cols-3">
          <article className="rounded-[1.55rem] border border-white/10 bg-white/[.035] p-6"><MessageCircle className="text-[#e3a238]" size={22} /><h2 className="mt-5 text-xl font-extrabold">الدعم والمساعد</h2><p className="mt-3 leading-7 text-white/60">يوجد مكوّن واجهة للمحادثة في القالب، لكنه غير موصول بخدمة دعم أو نموذج ذكاء اصطناعي. لن يوهمك هذا المدخل بأن هناك شخصًا أو مساعدًا يرد الآن.</p><span className="mt-5 inline-flex text-sm font-extrabold text-amber-200">غير مشغّل</span></article>
          <article className="rounded-[1.55rem] border border-white/10 bg-white/[.035] p-6"><ClipboardList className="text-[#e3a238]" size={22} /><h2 className="mt-5 text-xl font-extrabold">المؤشرات والأثر</h2><p className="mt-3 leading-7 text-white/60">مسار البلاغات يسجل حالات وأدلة وقرارات. أما قياس الأثر الاقتصادي أو السياحي فيحتاج خط أساس وموافقات ومصادر حقيقية.</p><span className="mt-5 inline-flex text-sm font-extrabold text-sky-200">جزئي ومقيد بالمصدر</span></article>
          <article className="rounded-[1.55rem] border border-white/10 bg-white/[.035] p-6"><ShieldCheck className="text-[#e3a238]" size={22} /><h2 className="mt-5 text-xl font-extrabold">الخطوة الصحيحة التالية</h2><p className="mt-3 leading-7 text-white/60">تشغيل SENSE Experience مستقلًا وبهوية مراجعين حقيقية، أو اختيار كيان ودفتر مالي قبل فتح المتجر أو تحصيل أي أموال.</p><a className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#f7cc71]" href="https://github.com/Solvanix/urban-sense-core/blob/main/docs/OPERATING-PRODUCT-BLUEPRINT.md" target="_blank" rel="noreferrer">افتح خارطة التشغيل <ArrowLeft size={16} /></a></article>
        </section>

        <footer className="flex flex-col justify-between gap-4 border-t border-white/10 pt-7 text-sm text-white/50 sm:flex-row sm:items-center"><p>البوابة توجّه إلى مسارات مستقلة؛ لا تنقل بيانات مواطن أو مزود أو مال بين التطبيقات.</p><Link href="/" className="inline-flex items-center gap-2 font-extrabold text-[#f7cc71]">العودة إلى Urban‑Sense <ArrowLeft size={16} /></Link></footer>
      </div>
    </main>
  );
}
