import { useMemo, useState } from "react";
import { ArrowLeft, ArrowUpLeft, Check, CircleDashed, Eye, Gauge, Layers3, LockKeyhole, MapPinned, Route, Sparkles, Target, UsersRound } from "lucide-react";

type Lane = "live" | "built" | "decision";

type PortfolioItem = {
  id: string;
  lane: Lane;
  name: string;
  eyebrow: string;
  value: string;
  signal: string;
  action: string;
};

const laneMeta: Record<Lane, { label: string; short: string; color: string; icon: typeof Check }> = {
  live: { label: "قيمة مرئية", short: "منشور", color: "emerald", icon: Check },
  built: { label: "قيمة قابلة للتجهيز", short: "نواة مقيدة", color: "sky", icon: CircleDashed },
  decision: { label: "قيمة مؤجلة بصدق", short: "قرار مطلوب", color: "amber", icon: LockKeyhole },
};

const portfolio: PortfolioItem[] = [
  { id: "urban", lane: "live", name: "Urban‑Sense", eyebrow: "بلاغات بلدية", value: "تحويل الحاجة المدنية إلى حالة قابلة للمتابعة.", signal: "هوية + صلاحيات + دورة بلاغ", action: "افتح المسار" },
  { id: "verify", lane: "live", name: "غرفة التحقق", eyebrow: "معلومة · مصدر · دليل", value: "خفض ضوضاء النشر قبل أن تصبح المعلومة ادعاءً.", signal: "بطاقة مراجعة محلية", action: "افتح الغرفة" },
  { id: "experience", lane: "built", name: "SENSE Experience", eyebrow: "مكان · مسار · أثر", value: "تحويل التجربة المحلية إلى ملف قابل للمراجعة.", signal: "نواة مستقلة بلا تسجيل مفتوح", action: "راجع النواة" },
  { id: "growth", lane: "built", name: "النمو والتعلم", eyebrow: "فرد · مخرج · تعاون", value: "جعل أول مخرج أصغر من الوعد وأقرب إلى الاختبار.", signal: "رحلة فردية بلا شهادات مصطنعة", action: "شاهد الرحلة" },
  { id: "commerce", lane: "decision", name: "السوق والمتجر", eyebrow: "كتالوج · طلب · تسوية", value: "لم تُفتح القيمة التجارية قبل وجود كيان ومزودين وسياسات.", signal: "قرار قانوني + تشغيل فعلي", action: "ما زال مقيدًا" },
  { id: "identity", lane: "decision", name: "الهوية المؤسسية", eyebrow: "اسم · نطاق · بريد", value: "ترسيخ الثقة يحتاج قرار مالك قبل شراء أي بنية.", signal: "اختيار الاسم ثم DNS والبريد", action: "يحتاج قرارًا" },
];

const journey = [
  { number: "01", title: "حاجة موثقة", detail: "بلاغ أو سؤال أو تجربة محلية", tone: "gold" },
  { number: "02", title: "مخرج صغير", detail: "بطاقة أو مسار أو دليل قابل للمراجعة", tone: "teal" },
  { number: "03", title: "مراجعة بشرية", detail: "مصدر ودور ونطاق وسبب قرار", tone: "blue" },
  { number: "04", title: "شراكة تشغيلية", detail: "بلدية أو مزود أو كيان بعقد واضح", tone: "slate" },
];

const metrics = [
  { value: "02", label: "مسارات مرئية", caption: "يمكن زيارتها الآن", icon: Eye, color: "text-emerald-300" },
  { value: "02", label: "نوى قابلة للتجهيز", caption: "مبنية لكن الوصول مقيد", icon: Layers3, color: "text-sky-300" },
  { value: "02", label: "قرارات حاكمة", caption: "لا تُحل بالتصميم وحده", icon: Target, color: "text-amber-300" },
];

function LaneIcon({ lane }: { lane: Lane }) {
  const Icon = laneMeta[lane].icon;
  return <Icon size={18} aria-hidden="true" />;
}

export default function Home() {
  const [activeLane, setActiveLane] = useState<Lane | "all">("all");
  const [selectedId, setSelectedId] = useState("urban");
  const [menuOpen, setMenuOpen] = useState(false);
  const selected = portfolio.find((item) => item.id === selectedId) ?? portfolio[0]!;
  const visiblePortfolio = useMemo(() => activeLane === "all" ? portfolio : portfolio.filter((item) => item.lane === activeLane), [activeLane]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return <main dir="rtl" className="min-h-screen overflow-hidden bg-[#071216] text-[#f7f8f1]">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#071216]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 lg:px-8">
        <button onClick={() => scrollTo("top")} className="flex items-center gap-3 text-right"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e3a238] text-[#142729] shadow-[0_0_24px_rgba(227,162,56,.2)]"><Layers3 size={20} /></span><span><strong className="block text-sm font-extrabold tracking-tight">SENSE</strong><span className="block text-[10px] font-bold text-white/45">غرفة قيادة مدنية</span></span></button>
        <div className="hidden items-center gap-7 text-xs font-extrabold text-white/55 md:flex"><button onClick={() => scrollTo("portfolio")} className="transition hover:text-white">خريطة القيمة</button><button onClick={() => scrollTo("flywheel")} className="transition hover:text-white">دورة الأثر</button><button onClick={() => scrollTo("studio")} className="transition hover:text-white">استوديو القصة</button><button onClick={() => scrollTo("next")} className="transition hover:text-white">القرار التالي</button></div>
        <button onClick={() => setMenuOpen((value) => !value)} className="rounded-xl border border-white/15 px-3 py-2 text-xs font-extrabold text-[#f7cc71] md:hidden" aria-expanded={menuOpen}>القائمة</button>
      </div>
      {menuOpen && <div className="border-t border-white/10 px-5 py-3 md:hidden"><div className="flex gap-4 text-xs font-extrabold text-white/70"><button onClick={() => scrollTo("portfolio")}>خريطة القيمة</button><button onClick={() => scrollTo("flywheel")}>دورة الأثر</button><button onClick={() => scrollTo("studio")}>استوديو القصة</button><button onClick={() => scrollTo("next")}>القرار التالي</button></div></div>}
    </nav>

    <div id="top" className="relative mx-auto max-w-7xl px-5 pb-24 pt-16 lg:px-8 lg:pt-24">
      <section className="grid items-end gap-12 lg:grid-cols-[1.08fr_.92fr]">
        <div className="reveal"><p className="eyebrow"><Sparkles size={14} /> نظام بصري لفهم أين تتولد القيمة</p><h1 className="display mt-6 max-w-4xl">من الفكرة إلى <em>قرار يمكن مساءلته.</em></h1><p className="mt-7 max-w-2xl text-lg leading-9 text-white/60">لوحة قيادة تنفيذية تُظهر ما يستطيع الشخص أو البلدية فعله الآن، ما بُني لكنه محكوم، وما لا يجوز فتحه قبل وجود صاحب قرار وتشغيل حقيقي.</p><div className="mt-8 flex flex-wrap gap-3"><button onClick={() => scrollTo("portfolio")} className="primary-action">استكشف خريطة القيمة <ArrowLeft size={17} /></button><button onClick={() => scrollTo("next")} className="secondary-action">ما القرار التالي؟ <ArrowUpLeft size={16} /></button></div><div className="mt-8 flex flex-wrap gap-5 text-xs font-bold text-white/45"><span className="inline-flex items-center gap-2"><Eye size={15} className="text-emerald-300" />بيانات الحالة من بنية المنتج</span><span className="inline-flex items-center gap-2"><Target size={15} className="text-[#f7cc71]" />لا أرقام مختلقة</span></div></div>
        <div className="relative reveal reveal-delay-2"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="signal-card"><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-xs font-extrabold text-[#f7cc71]"><Gauge size={16} /> قراءة صادقة</div><span className="live-dot"><span /> الآن</span></div><div className="mt-12"><p className="text-xs font-bold text-white/40">الاختناق التنفيذي الحالي</p><h2 className="mt-3 text-3xl font-extrabold leading-tight">الانتقال من النواة إلى شريك تشغيل</h2><p className="mt-4 text-sm leading-7 text-white/55">الخطوة التالية ليست صفحة جديدة. إنها اختيار نطاق تجربة ومالك قرار ومسار قياس يمكن الدفاع عنه.</p></div><div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-5 text-xs font-extrabold text-white/55"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f7cc71] text-[#16252a]"><Route size={17} /></span> لا نعتبر النية أثرًا</div></div></div>
      </section>

      <section className="mt-20 grid gap-3 sm:grid-cols-3">{metrics.map((metric, index) => <article key={metric.label} className={`metric-card reveal reveal-delay-${index + 1}`}><metric.icon size={19} className={metric.color} /><p className="mt-5 text-xs font-bold text-white/45">{metric.label}</p><div className={`mt-2 text-4xl font-extrabold tracking-tight ${metric.color}`}>{metric.value}</div><p className="mt-2 text-[11px] font-bold text-white/32">{metric.caption}</p></article>)}</section>

      <section id="portfolio" className="scroll-mt-24 pt-28"><div className="section-heading"><div><p className="eyebrow text-sky-300">Portfolio / Value Map</p><h2 className="section-title">خريطة المحفظة</h2><p className="section-copy">اختر طبقة لتشاهد أين تقف القيمة وأين تتطلب حوكمة.</p></div><div className="filter-pills">{(["all", "live", "built", "decision"] as const).map((lane) => <button key={lane} onClick={() => setActiveLane(lane)} className={activeLane === lane ? "active" : ""}>{lane === "all" ? "الكل" : laneMeta[lane].label}</button>)}</div></div><div className="mt-8 grid gap-4 lg:grid-cols-[1.35fr_.65fr]"><div className="grid gap-3 sm:grid-cols-2">{visiblePortfolio.map((item, index) => <button key={item.id} onClick={() => setSelectedId(item.id)} className={`portfolio-card text-right ${selectedId === item.id ? "selected" : ""}`} style={{ animationDelay: `${index * 40}ms` }}><div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-extrabold text-white/40">{item.eyebrow}</p><h3 className="mt-2 text-lg font-extrabold">{item.name}</h3></div><span className={`lane-icon ${item.lane}`}><LaneIcon lane={item.lane} /></span></div><p className="mt-5 text-sm leading-7 text-white/60">{item.value}</p><div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3"><span className="text-[11px] font-bold text-white/35">{item.signal}</span><ArrowUpLeft size={16} className="text-[#f7cc71]" /></div></button>)}</div><aside className="decision-panel"><p className="eyebrow text-[#f7cc71]">Decision lens</p><div className={`mt-7 lane-icon large ${selected.lane}`}><LaneIcon lane={selected.lane} /></div><p className="mt-6 text-xs font-extrabold text-white/40">{laneMeta[selected.lane].label}</p><h3 className="mt-2 text-3xl font-extrabold">{selected.name}</h3><p className="mt-4 text-sm leading-7 text-white/65">{selected.value} هذه بطاقة قيادة، وليست إعلانًا بأن المسار أصبح خدمة عامة.</p><div className="mt-7 rounded-2xl border border-white/10 bg-black/15 p-4"><p className="text-[10px] font-extrabold text-white/35">إشارة الجاهزية</p><p className="mt-2 text-sm font-extrabold text-[#f7cc71]">{selected.signal}</p></div><span className="mt-6 inline-flex items-center gap-2 text-xs font-extrabold text-white/55">{selected.action} <ArrowLeft size={15} /></span></aside></div></section>

      <section id="flywheel" className="scroll-mt-24 pt-28"><div className="section-heading"><div><p className="eyebrow text-sky-300">Value Flywheel</p><h2 className="section-title">دورة تحويل الحاجة إلى أثر</h2></div><p className="section-copy max-w-sm">كل انتقال يحتاج دليلًا أو صاحب قرار. لا نعتبر النية أثرًا.</p></div><div className="mt-8 grid gap-3 md:grid-cols-4">{journey.map((step, index) => <article key={step.title} className={`journey-card ${step.tone}`}><div className="flex items-center justify-between"><span className="step-number">{step.number}</span>{index < journey.length - 1 && <ArrowLeft className="hidden text-[#f7cc71]/55 md:block" size={18} />}</div><h3 className="mt-7 text-lg font-extrabold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-white/52">{step.detail}</p></article>)}</div></section>

      <section id="studio" className="scroll-mt-24 pt-28"><div className="section-heading"><div><p className="eyebrow text-sky-300"><Sparkles size={14} /> تطبيق الإعلام الرقمي</p><h2 className="section-title">استوديو القصة المدنية</h2><p className="section-copy">ليس دبلومًا ولا مسارًا تعليميًا؛ إنه خط إنتاج يطبق مهارات الإعلام الرقمي على قضية أو مكان أو تجربة حقيقية.</p></div><span className="studio-tag">من الالتقاط إلى الفعل</span></div><div className="studio-board mt-8"><div className="studio-screen"><div className="screen-icons"><span>▶</span><span>◎</span><span>✦</span><span>↗</span></div><p className="screen-kicker">MEDIA / FIELD NOTE 01</p><h3>قصة محلية<br /><strong>تفتح طريقًا</strong></h3><p className="screen-caption">صورة · صوت · سياق · مصدر · دعوة مسؤولة للفعل</p></div><div className="studio-steps">{[{ n: "01", t: "التقاط", d: "صورة أو مقابلة أو ملاحظة من الميدان" }, { n: "02", t: "تحرير", d: "رسالة قصيرة تحفظ السياق ولا تبيع الوهم" }, { n: "03", t: "تحقق", d: "مصدر، موافقة، إتاحة، وحدود النشر" }, { n: "04", t: "توزيع وقياس", d: "قناة مناسبة ثم فعل يمكن رصده" }].map((step) => <div key={step.n} className="studio-step"><span>{step.n}</span><div><h4>{step.t}</h4><p>{step.d}</p></div></div>)}</div></div></section>

      <section id="next" className="scroll-mt-24 pt-28"><div className="next-decision"><div><p className="eyebrow text-[#f7cc71]"><MapPinned size={14} /> القرار الذي يفتح المرحلة التالية</p><h2 className="mt-5 max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl">اختيار نطاق تجربة حقيقي، لا إضافة صفحة جديدة.</h2><p className="mt-5 max-w-2xl text-base leading-8 text-white/58">نحتاج جهة مالكة، منطقة واحدة، خدمة واحدة، مسؤول تشغيل، ومؤشرات زمن الاستجابة والإسناد والإغلاق المدعوم بالدليل. عندها فقط تتحول العدادات البنيوية إلى بيانات تشغيلية مؤرخة.</p></div><div className="decision-checklist"><p className="text-xs font-extrabold text-white/42">بوابة التوسع</p>{["مالك قرار واضح", "نطاق تجريبي محدود", "حدود بيانات معلنة", "مسار قياس قابل للدفاع"].map((item) => <div key={item} className="check-row"><span><Check size={13} /></span>{item}</div>)}</div></div></section>

      <footer className="mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs font-bold text-white/35"><span className="inline-flex items-center gap-2"><UsersRound size={14} /> SENSE / غرفة قيادة مدنية</span><span>واجهة قرار، لا وعد تشغيل</span></footer>
    </div>
  </main>;
}
