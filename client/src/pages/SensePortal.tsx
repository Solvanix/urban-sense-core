import { cn } from "@/lib/utils";
import { ecosystemExplorerHref, growthJourneyHref, municipalOperationsHref, urbanSenseHref } from "@/lib/sensePortalRoute";
import { Accessibility, ArrowLeft, Bot, Building2, BriefcaseBusiness, ChevronLeft, CircleDollarSign, ClipboardList, Code2, Compass, Database, Eye, Gauge, Layers3, LockKeyhole, Map, MessageCircle, Radio, Route, ShieldCheck, Store, UserRoundCheck, UsersRound, Wrench } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

type Readiness = "منشور" | "نواة مستقلة" | "مقترح";
type PortalTone = "teal" | "blue" | "amber" | "slate";
type PortalIcon = typeof Building2;

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
  icon: PortalIcon;
  tone: PortalTone;
};

type EcosystemAccessGate = {
  id: string;
  label: string;
  status: string;
  description: string;
  action: string;
  href?: string;
  internal?: boolean;
  icon: PortalIcon;
  tone: PortalTone;
};

export const ecosystemRoutes: EcosystemRoute[] = [
  { id: "urban-sense", label: "Urban‑Sense", eyebrow: "البلاغات البلدية", readiness: "منشور", description: "منصة بلاغات بلدية عربية: تقديم، مراجعة، إسناد، أدلة، تحقق وإغلاق.", detail: "له قاعدة بيانات وهوية وصلاحيات خاصة به. لا يحتوي سياحة أو متجرًا.", actionLabel: "افتح المنصة البلدية", href: urbanSenseHref, internal: true, icon: Building2, tone: "teal" },
  { id: "experience", label: "SENSE Experience", eyebrow: "مكان · مسار · أثر", readiness: "نواة مستقلة", description: "واجهة عربية مستقلة لمسار مزودي الخدمات والتجارب والمراجعة البشرية.", detail: "الكود والحدود جاهزة للمراجعة، لكنه لا يقبل بيانات مزودين حقيقية ولا يملك رابط إنتاج مستقل بعد.", actionLabel: "استعرض النواة في المصدر", href: "https://github.com/Solvanix/urban-sense-core/tree/main/apps/sense-experience", icon: Map, tone: "blue" },
  { id: "growth", label: "النمو والتعلم", eyebrow: "فرد · مخرج · تعاون اختياري", readiness: "منشور", description: "رحلة تفاعلية تساعد الشخص على تحويل هدفه إلى مخرج صغير قبل التفكير في فريق أو دورة.", detail: "لا تسجل بيانات ولا تعلن دورات أو شهادات أو شراكة؛ باب الفريق يظهر فقط عند احتياج حقيقي إلى أدوار متكاملة.", actionLabel: "ابدأ رحلة فردية", href: growthJourneyHref, internal: true, icon: Compass, tone: "teal" },
  { id: "commerce", label: "السوق والمتجر", eyebrow: "تجارة متعددة المشاريع", readiness: "مقترح", description: "مسار منفصل مستقبلًا لكتالوج حقيقي وطلبات ومدفوعات وسياسة إرجاع.", detail: "لا كتالوج حي، ولا طلبات، ولا شحن، ولا بوابة دفع، ولا دفتر مبيعات داخل المنظومة الآن.", actionLabel: "يعتمد على قرار الكيان والتجارة", icon: Store, tone: "amber" },
  { id: "maker", label: "التمكين والتصنيع", eyebrow: "من الفكرة إلى نموذج", readiness: "مقترح", description: "تجربة مستقبلية محدودة لربط التصميم والنمذجة والتوثيق وفرص السوق.", detail: "ليست مركزًا قائمًا أو معدات مملوكة أو شراكة نافذة؛ تبدأ فقط بعد قرار قانوني وخدمة تجريبية حقيقية.", actionLabel: "راجع بوابات القرار", href: "https://github.com/Solvanix/urban-sense-core/blob/main/docs/research/SENSE-DIGITAL-MANUFACTURING-CENTER-EVIDENCE-ANALYSIS-2026-08-20.md", icon: Wrench, tone: "slate" },
];

export const ecosystemAccessGates: EcosystemAccessGate[] = [
  { id: "public", label: "زائر أو مواطن", status: "متاح بلا حساب", description: "تعرف على المنتجات العامة أو ابدأ بلاغًا ضمن نطاق البلدية المشاركة.", action: "افتح Urban‑Sense", href: urbanSenseHref, internal: true, icon: UsersRound, tone: "teal" },
  { id: "municipality", label: "بلدية أو راعٍ تجريبي", status: "دخول محمي", description: "تدخل جهة البلدية إلى العمليات فقط عبر حساب ودور ونطاق بلدي فعّال.", action: "دخول العمليات", href: municipalOperationsHref, internal: true, icon: Building2, tone: "blue" },
  { id: "provider", label: "مزود تجربة أو خدمة", status: "ينتظر النشر المستقل", description: "مسار جاهزية وتعلم قصير ثم مراجعة بشرية؛ لا تسجيل مزودين أو نشر ملفات حقيقية الآن.", action: "لا يوجد تسجيل مفتوح", icon: UserRoundCheck, tone: "amber" },
  { id: "learner", label: "فرد يريد التطور", status: "تجربة عامة بلا تسجيل", description: "يبدأ بهدف ومخرج صغير، ثم يختار إن كان يحتاج تعاونًا. لا يفترض وجود فريق أو دورة متاحة.", action: "ابدأ رحلة فردية", href: growthJourneyHref, internal: true, icon: Compass, tone: "teal" },
  { id: "sponsor", label: "شريك أو راعٍ", status: "مسار حوار", description: "نقاش نطاق تجربة أو دعم أو شراكة مقترحة، من دون وعود أثر أو وصول إلى بيانات تشغيلية.", action: "ليس حسابًا ذاتيًا", icon: BriefcaseBusiness, tone: "slate" },
  { id: "technical", label: "الفريق التقني", status: "GitHub حسب الدور", description: "الوصول إلى المستودع يحدد بالقراءة أو الكتابة أو الإدارة، ولا يمنح صلاحيات إنتاج تلقائيًا.", action: "افتح المستودع", href: "https://github.com/Solvanix/urban-sense-core", icon: Code2, tone: "slate" },
];

const readinessClass: Record<Readiness, string> = {
  "منشور": "bg-emerald-400/15 text-emerald-100 ring-1 ring-emerald-300/30",
  "نواة مستقلة": "bg-sky-400/15 text-sky-100 ring-1 ring-sky-300/30",
  "مقترح": "bg-amber-300/15 text-amber-100 ring-1 ring-amber-200/30",
};

const toneClass: Record<PortalTone, string> = {
  teal: "from-[#0f5b5b] via-[#144b4a] to-[#0c2428]",
  blue: "from-[#163d6a] via-[#1e4f88] to-[#102743]",
  amber: "from-[#74501f] via-[#6a421a] to-[#281c12]",
  slate: "from-[#33434a] via-[#283438] to-[#141f24]",
};

export const regionalCurrencyReferences = [
  { label: "اليورو / الدولار", value: "1 EUR = 1.1681 USD", date: "20 أغسطس 2026", source: "البنك المركزي الأوروبي", href: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html" },
  { label: "اليورو / الشيكل", value: "1 EUR = 3.4950 ILS", date: "20 أغسطس 2026", source: "البنك المركزي الأوروبي", href: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html" },
  { label: "الدولار / الدينار", value: "1 USD = 0.708–0.710 JOD", date: "19 أغسطس 2026", source: "البنك المركزي الأردني", href: "https://www.cbj.gov.jo/en/Pages/foreignexchangerates" },
  { label: "اليورو / الدينار", value: "1 EUR = 0.81901–0.82445 JOD", date: "19 أغسطس 2026", source: "البنك المركزي الأردني", href: "https://www.cbj.gov.jo/en/Pages/foreignexchangerates" },
] as const;

function PortalLink({ route }: { route: EcosystemRoute }) {
  const className = "mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-extrabold text-[#10292d] transition-transform duration-150 hover:bg-[#fff8e9] active:scale-[.97]";
  if (!route.href) return <span className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-extrabold text-white/70">{route.actionLabel}<LockKeyhole size={16} /></span>;
  if (route.internal) return <Link href={route.href} className={className}>{route.actionLabel}<ArrowLeft size={16} /></Link>;
  return <a href={route.href} target="_blank" rel="noreferrer" className={className}>{route.actionLabel}<ArrowLeft size={16} /></a>;
}

function AccessLink({ gate }: { gate: EcosystemAccessGate }) {
  const className = "mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/20 px-3 py-2 text-sm font-extrabold text-white transition-transform duration-150 hover:border-[#f7cc71] active:scale-[.97]";
  if (!gate.href) return <span className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-extrabold text-white/55">{gate.action}<LockKeyhole size={15} /></span>;
  if (gate.internal) return <Link href={gate.href} className={className}>{gate.action}<ArrowLeft size={15} /></Link>;
  return <a href={gate.href} target="_blank" rel="noreferrer" className={className}>{gate.action}<ArrowLeft size={15} /></a>;
}

export default function SensePortal() {
  const [activeRouteId, setActiveRouteId] = useState("urban-sense");
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const activeRoute = ecosystemRoutes.find((route) => route.id === activeRouteId) ?? ecosystemRoutes[0]!;
  const ActiveIcon = activeRoute.icon;

  return <main dir="rtl" className={cn("min-h-screen bg-[#091419] text-[#f7f8f1] selection:bg-[#e3a238] selection:text-[#152225]", highContrast && "bg-black text-white")} data-reduced-motion={reducedMotion ? "true" : "false"}>
    <div className="mx-auto max-w-7xl px-5 pb-16 pt-5 lg:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e3a238] text-[#142729]"><Layers3 size={22} /></span><div><p className="text-lg font-extrabold tracking-tight">SENSE</p><p className="text-xs font-bold text-white/55">صفحة رئيسية لمسارات مستقلة</p></div></div>
        <div className="flex flex-wrap items-center gap-2" aria-label="تفضيلات العرض"><Link href={ecosystemExplorerHref} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 text-sm font-bold text-white/80 hover:border-white/35"><Compass size={16} />خريطة الوصول</Link><button aria-pressed={highContrast} onClick={() => setHighContrast((value) => !value)} className={cn("inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 text-sm font-bold", highContrast ? "border-[#e3a238] bg-[#e3a238] text-[#17272a]" : "border-white/15 bg-white/5 text-white/80")}><Eye size={16} />تباين أعلى</button><button aria-pressed={reducedMotion} onClick={() => setReducedMotion((value) => !value)} className={cn("inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 text-sm font-bold", reducedMotion ? "border-[#e3a238] bg-[#e3a238] text-[#17272a]" : "border-white/15 bg-white/5 text-white/80")}><Accessibility size={16} />تقليل الحركة</button></div>
      </header>

      <section className="grid gap-8 py-10 lg:grid-cols-[.83fr_1.17fr] lg:items-end lg:py-16">
        <div><p className="inline-flex items-center gap-2 rounded-full border border-[#e3a238]/35 bg-[#e3a238]/10 px-3 py-1.5 text-xs font-extrabold text-[#ffd881]"><Radio size={14} />فهرس منظومة لا حساب موحّد</p><h1 className="mt-5 max-w-xl text-4xl font-extrabold leading-[1.17] tracking-tight sm:text-5xl">كل دور له <span className="text-[#e3a238]">بابه</span> وحدوده.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">هذه صفحة رئيسية للمنظومة: تُظهر المنتج أو المسار المناسب، ثم تشرح من يحتاج حسابًا ومن يحتاج دعوة أو تشغيلًا مستقلاً. لا تجمع هويات البلديات والمزودين والفريق في لوحة واحدة.</p><div className="mt-8 flex flex-wrap gap-3 text-sm font-bold text-white/70"><span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />متاح</span><span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-sky-300" />دخول محمي</span><span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-300" />ينتظر تشغيلًا</span></div></div>
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(140deg,#142c31_0%,#0b171b_65%)] p-5 sm:p-7" aria-label="وحدة المسار النشط"><div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(90deg,transparent,rgba(227,162,56,.16),transparent)]" /><div className="relative flex items-start justify-between gap-4 border-b border-white/10 pb-5"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-[#f4c86d]"><ActiveIcon size={22} /></span><div><p className="text-xs font-bold text-white/50">المسار النشط</p><h2 className="text-xl font-extrabold">{activeRoute.label}</h2></div></div><span className={cn("rounded-full px-3 py-1 text-xs font-extrabold", readinessClass[activeRoute.readiness])}>{activeRoute.readiness}</span></div><div className="relative grid gap-4 pt-6 sm:grid-cols-[1fr_auto] sm:items-end"><div><p className="text-xl font-extrabold leading-8">{activeRoute.description}</p><p className="mt-3 max-w-xl leading-7 text-white/60">{activeRoute.detail}</p></div><PortalLink route={activeRoute} /></div><div className="relative mt-7 flex items-center gap-3 text-xs font-bold text-white/45"><span className="h-px flex-1 bg-white/10" /><Route size={15} /><span>حدد بطاقة لمسار مختلف</span><span className="h-px flex-1 bg-white/10" /></div></section>
      </section>

      <section className="pb-14" aria-labelledby="routes-title"><div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-sm font-extrabold text-[#e3a238]">محطات المنظومة</p><h2 id="routes-title" className="mt-1 text-2xl font-extrabold">اختر المسار، لا تتوه في الوعود.</h2></div><p className="hidden max-w-md text-left text-sm leading-6 text-white/50 md:block">التدرج مستلهم من محطات العرض في المرجع: بطاقة نشطة أمامية، ومحطات مجاورة، من دون نسخ الشكل أو وظائف السيارة.</p></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{ecosystemRoutes.map((route, index) => { const Icon = route.icon; const active = route.id === activeRouteId; return <button key={route.id} onClick={() => setActiveRouteId(route.id)} aria-pressed={active} className={cn("group min-h-56 rounded-[1.65rem] border p-5 text-right motion-safe:transition-all motion-safe:duration-200", active ? cn("border-white/45 shadow-2xl", !reducedMotion && "-translate-y-2 scale-[1.015]", `bg-gradient-to-br ${toneClass[route.tone]}`) : "border-white/10 bg-white/[.045] hover:border-white/30 hover:bg-white/[.08]")}><div className="flex items-start justify-between gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white"><Icon size={20} /></span><span className={cn("rounded-full px-2.5 py-1 text-[11px] font-extrabold", readinessClass[route.readiness])}>{route.readiness}</span></div><p className="mt-7 text-xs font-bold text-white/55">0{index + 1} · {route.eyebrow}</p><h3 className="mt-1 text-xl font-extrabold">{route.label}</h3><p className="mt-3 text-sm leading-6 text-white/60">{route.description}</p><span className="mt-5 inline-flex items-center gap-1 text-sm font-extrabold text-[#f7cc71]">عرض الحالة <ChevronLeft size={16} /></span></button>; })}</div></section>

      <section className="border-y border-white/10 py-12" aria-labelledby="access-title"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-extrabold text-[#e3a238]">مفاتيح الدخول</p><h2 id="access-title" className="mt-1 text-2xl font-extrabold">ابدأ من دورك، لا من صلاحية واسعة.</h2></div><p className="max-w-lg text-sm leading-6 text-white/55">كل باب يوضح ما يتيحه الآن وما لا يتيحه. «دخول العمليات» يبقى محميًا حتى إن وصل إليه الرابط، ولا يعني منح وصول إلى المستودع أو المنتجات الأخرى.</p></div><div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{ecosystemAccessGates.map((gate) => { const Icon = gate.icon; return <article key={gate.id} className={cn("min-h-60 rounded-[1.5rem] border border-white/10 bg-gradient-to-br p-5", toneClass[gate.tone])}><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10"><Icon size={20} /></span><p className="mt-5 text-xs font-extrabold text-[#f7cc71]">{gate.status}</p><h3 className="mt-1 text-lg font-extrabold">{gate.label}</h3><p className="mt-3 text-sm leading-6 text-white/65">{gate.description}</p><AccessLink gate={gate} /></article>; })}</div></section>

      <section className="grid gap-5 border-b border-white/10 py-12 lg:grid-cols-[1.05fr_.95fr]"><div className="rounded-[1.7rem] border border-white/10 bg-white/[.04] p-6 sm:p-7"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e3a238]/15 text-[#f6ca6e]"><Database size={21} /></span><div><p className="text-sm font-extrabold">بيانات وهوية منفصلة</p><p className="text-sm text-white/50">ليست «قاعدة بيانات SENSE واحدة».</p></div></div><div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-black/15 p-4"><p className="font-extrabold">Urban‑Sense</p><p className="mt-2 text-sm leading-6 text-white/60">بلاغات بلدية، موظفون، أدلة وسجل تدقيق داخل نطاقه فقط.</p></div><div className="rounded-2xl border border-white/10 bg-black/15 p-4"><p className="font-extrabold">SENSE Experience</p><p className="mt-2 text-sm leading-6 text-white/60">مزودون ومراجعون في خدمة وهوية وقاعدة مستقلة عند تشغيلها.</p></div></div></div><div className="rounded-[1.7rem] border border-white/10 bg-[#102126] p-6 sm:p-7"><p className="text-sm font-extrabold text-[#e3a238]">لم نربط هذه الأشياء بعد</p><ul className="mt-4 space-y-3 text-sm leading-6 text-white/70"><li className="flex gap-3"><CircleDollarSign className="mt-0.5 shrink-0 text-white/45" size={18} />محاسبة، فواتير، دفعات أو ربط دفع حي.</li><li className="flex gap-3"><Bot className="mt-0.5 shrink-0 text-white/45" size={18} />مساعد ذكي أو دعم عملاء متصل يجيب أو يحتفظ بمحادثات.</li><li className="flex gap-3"><Gauge className="mt-0.5 shrink-0 text-white/45" size={18} />لوحة أثر شاملة؛ توجد مؤشرات Urban‑Sense التشغيلية فقط كإطار جزئي.</li></ul></div></section>

      <section className="border-b border-white/10 py-12" aria-labelledby="currency-reference-title"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-extrabold text-[#e3a238]">مؤشرات عملات مرجعية</p><h2 id="currency-reference-title" className="mt-1 text-2xl font-extrabold">الدولار، اليورو، الشيكل، والدينار الأردني.</h2></div><p className="max-w-xl text-sm leading-6 text-white/55">لقطة مرجعية مؤرخة من مصادر نقدية رسمية. ليست سعر تنفيذ، ولا توصية شراء أو بيع، وقد تختلف أسعار البنوك والصرافة والعمولات.</p></div><div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{regionalCurrencyReferences.map(reference => <a key={reference.label} href={reference.href} target="_blank" rel="noreferrer" className="rounded-[1.5rem] border border-white/10 bg-white/[.04] p-5 hover:border-[#e3a238]/50"><p className="text-sm font-extrabold text-[#f7cc71]">{reference.label}</p><p dir="ltr" className="mt-4 text-left text-xl font-extrabold text-white">{reference.value}</p><p className="mt-4 text-xs leading-5 text-white/50">كما في {reference.date}<br />المصدر: {reference.source}</p></a>)}</div></section>

      <section className="grid gap-4 py-12 md:grid-cols-3"><article className="rounded-[1.55rem] border border-white/10 bg-white/[.035] p-6"><MessageCircle className="text-[#e3a238]" size={22} /><h2 className="mt-5 text-xl font-extrabold">الدعم والمساعد</h2><p className="mt-3 leading-7 text-white/60">يوجد مكوّن واجهة للمحادثة في القالب، لكنه غير موصول بخدمة دعم أو نموذج ذكاء اصطناعي. لن يوهمك هذا المدخل بأن هناك شخصًا أو مساعدًا يرد الآن.</p><span className="mt-5 inline-flex text-sm font-extrabold text-amber-200">غير مشغّل</span></article><article className="rounded-[1.55rem] border border-white/10 bg-white/[.035] p-6"><ClipboardList className="text-[#e3a238]" size={22} /><h2 className="mt-5 text-xl font-extrabold">المؤشرات والأثر</h2><p className="mt-3 leading-7 text-white/60">مسار البلاغات يسجل حالات وأدلة وقرارات. أما قياس الأثر الاقتصادي أو السياحي فيحتاج خط أساس وموافقات ومصادر حقيقية.</p><span className="mt-5 inline-flex text-sm font-extrabold text-sky-200">جزئي ومقيد بالمصدر</span></article><article className="rounded-[1.55rem] border border-white/10 bg-white/[.035] p-6"><ShieldCheck className="text-[#e3a238]" size={22} /><h2 className="mt-5 text-xl font-extrabold">الخطوة الصحيحة التالية</h2><p className="mt-3 leading-7 text-white/60">تشغيل SENSE Experience مستقلًا وبهوية مراجعين حقيقية، أو اختيار كيان ودفتر مالي قبل فتح المتجر أو تحصيل أي أموال.</p><a className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#f7cc71]" href="https://github.com/Solvanix/urban-sense-core/blob/main/docs/OPERATING-PRODUCT-BLUEPRINT.md" target="_blank" rel="noreferrer">افتح خارطة التشغيل <ArrowLeft size={16} /></a></article></section>
      <footer className="flex flex-col justify-between gap-4 border-t border-white/10 pt-7 text-sm text-white/50 sm:flex-row sm:items-center"><p>البوابة توجّه إلى مسارات مستقلة؛ لا تنقل بيانات مواطن أو مزود أو مال بين التطبيقات.</p><Link href="/" className="inline-flex items-center gap-2 font-extrabold text-[#f7cc71]">العودة إلى بوابة SENSE <ArrowLeft size={16} /></Link></footer>
    </div>
  </main>;
}
