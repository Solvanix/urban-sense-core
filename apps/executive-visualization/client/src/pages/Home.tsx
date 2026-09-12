import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  CircleAlert,
  FileText,
  Headphones,
  MapPinned,
  Mic2,
  Radio,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Timer,
  Video,
} from "lucide-react";

type StoryType = "خبر" | "قصة" | "تقرير" | "تحقيق" | "بورتريه";

type Story = {
  id: string;
  type: StoryType;
  title: string;
  place: string;
  summary: string;
  signal: string;
  color: string;
  format: string;
};

const stories: Story[] = [
  {
    id: "azariya",
    type: "قصة",
    title: "العيزرية ليست محطة عبور",
    place: "العيزرية · القدس",
    summary: "تجربة سياحية يقودها أهل المكان، تعيد للزائر فرصة أن يرى المجتمع لا الطريق فقط.",
    signal: "شخصية محلية + مسار قابل للتصوير",
    color: "gold",
    format: "فيديو 5 دقائق + خريطة سردية",
  },
  {
    id: "women",
    type: "تقرير",
    title: "من أطراف القدس إلى رفّ في رام الله",
    place: "ضواحي القدس · رام الله",
    summary: "رحلة منتج امرأة من مكان مهمش إلى السوق، مع تتبع العائد والقرار لا الاكتفاء بصورة النجاح.",
    signal: "منتج واحد + حساب عائد موثق",
    color: "teal",
    format: "تقرير + إنفوغراف رحلة السعر",
  },
  {
    id: "digital-rights",
    type: "تحقيق",
    title: "من يملك زر الظهور؟",
    place: "فلسطين الرقمية",
    summary: "حالة موثقة عن حذف أو تقييد محتوى، تشرح الحقوق الرقمية ومسار الاعتراض دون إطلاق ادعاءات عامة.",
    signal: "لقطات شاشة + رد منصة + مصدر مستقل",
    color: "blue",
    format: "تحقيق تفاعلي + بودكاست",
  },
  {
    id: "nermin",
    type: "بورتريه",
    title: "من رام الله إلى بيرزيت",
    place: "رام الله · بيرزيت",
    summary: "نارمين تعمل وتتعلم وتغني، وتحاول تحويل الطريق اليومي إلى مساحة حركة ومشروع رقمي صغير.",
    signal: "يوم كامل + اختبار جمهور",
    color: "coral",
    format: "Storytelling 99 ثانية",
  },
  {
    id: "breaking",
    type: "خبر",
    title: "ثلاث إصابات بين صِردا وبيرزيت",
    place: "صِردا · بيرزيت",
    summary: "محاكاة تحريرية: الخبر نفسه في News Bar وموجز SMS وخبر إذاعي، دون إضافة مصدر غير متوفر.",
    signal: "المكان + الأثر + أقل كلمات",
    color: "slate",
    format: "News Bar + SMS Media",
  },
];

const typeMeta: Record<string, { icon: typeof FileText; label: string }> = {
  خبر: { icon: Radio, label: "خبر سريع" },
  قصة: { icon: MapPinned, label: "قصة مكان" },
  تقرير: { icon: FileText, label: "تقرير ميداني" },
  تحقيق: { icon: ShieldCheck, label: "تحقيق" },
  بورتريه: { icon: Mic2, label: "بورتريه" },
};

const pipeline = [
  { n: "01", title: "التقاط", copy: "شخص، مكان، حدث أو رسالة تصل من الميدان." },
  { n: "02", title: "تثبيت", copy: "ماذا حدث؟ أين؟ متى؟ من المصدر؟ ما الذي لا نعرفه؟" },
  { n: "03", title: "صياغة", copy: "News Bar، SMS، قصة، تقرير، فيديو أو إنفوغراف." },
  { n: "04", title: "توزيع", copy: "قناة مناسبة، جمهور محدد، وقياس لما حدث بعد النشر." },
];

export default function Home() {
  const [activeType, setActiveType] = useState("الكل");
  const [selectedId, setSelectedId] = useState("azariya");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBrief, setShowBrief] = useState(false);
  const [briefStep, setBriefStep] = useState(0);
  const [briefTitle, setBriefTitle] = useState("");
  const [briefPlace, setBriefPlace] = useState("");
  const [briefProof, setBriefProof] = useState("");
  const selected = stories.find((story) => story.id === selectedId) ?? stories[0];
  const visibleStories = useMemo(
    () => (activeType === "الكل" ? stories : stories.filter((story) => story.type === activeType)),
    [activeType],
  );
  const SelectedIcon = typeMeta[selected.type]?.icon ?? FileText;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-[#071216] text-[#f7f8f1]">
      <div className="editorial-glow editorial-glow-one" />
      <div className="editorial-glow editorial-glow-two" />
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#071216]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 lg:px-8">
          <button onClick={() => scrollTo("top")} className="flex items-center gap-3 text-right">
            <span className="brand-mark"><Sparkles size={19} /></span>
            <span><strong className="block text-sm font-black tracking-tight">SENSE</strong><span className="block text-[10px] font-bold text-white/45">مختبر القصص السياحية</span></span>
          </button>
          <div className="hidden items-center gap-7 text-xs font-black text-white/55 md:flex">
            <button onClick={() => scrollTo("desk")} className="transition hover:text-white">غرفة الأخبار</button>
            <button onClick={() => scrollTo("stories")} className="transition hover:text-white">القصص</button>
            <button onClick={() => scrollTo("formats")} className="transition hover:text-white">الأشكال</button>
            <button onClick={() => scrollTo("brief")} className="transition hover:text-white">بطاقة التغطية</button>
          </div>
          <button onClick={() => setMenuOpen((value) => !value)} className="rounded-xl border border-white/15 px-3 py-2 text-xs font-black text-[#f7cc71] md:hidden" aria-expanded={menuOpen}>القائمة</button>
        </div>
        {menuOpen && <div className="border-t border-white/10 px-5 py-3 md:hidden"><div className="flex flex-wrap gap-4 text-xs font-black text-white/70"><button onClick={() => scrollTo("desk")}>غرفة الأخبار</button><button onClick={() => scrollTo("stories")}>القصص</button><button onClick={() => scrollTo("formats")}>الأشكال</button><button onClick={() => scrollTo("brief")}>بطاقة التغطية</button></div></div>}
      </nav>

      <div id="top" className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 lg:px-8 lg:pt-24">
        <section className="grid items-end gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div className="reveal">
            <p className="eyebrow"><Sparkles size={14} /> من المكان إلى الجمهور</p>
            <h1 className="display mt-6 max-w-4xl">نصنع من <em>المكان قصة</em>، ومن القصة أثرًا.</h1>
            <p className="mt-7 max-w-2xl text-lg leading-9 text-white/60">منصة سياحية فلسطينية تقودها الصحافة: خبر قصير، قصة إنسانية، تقرير موثق، صوت، صورة، خريطة، ثم متابعة تسأل ماذا تغيّر بعد النشر.</p>
            <div className="mt-8 flex flex-wrap gap-3"><button onClick={() => scrollTo("stories")} className="primary-action">استكشف غرفة القصص <ArrowLeft size={17} /></button><button onClick={() => setShowBrief(true)} className="secondary-action">ابدأ بطاقة تغطية <Send size={16} /></button></div>
            <div className="mt-8 flex flex-wrap gap-5 text-xs font-bold text-white/45"><span className="inline-flex items-center gap-2"><ShieldCheck size={15} className="text-emerald-300" />تحقق قبل النشر</span><span className="inline-flex items-center gap-2"><Timer size={15} className="text-[#f7cc71]" />99 ثانية تكفي لبدء القصة</span></div>
          </div>
          <div className="relative reveal reveal-delay-2"><div className="editorial-card"><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-xs font-black text-[#f7cc71]"><Radio size={16} /> LIVE EDITORIAL DESK</div><span className="live-dot"><span /> مفتوح</span></div><div className="mt-12"><p className="text-xs font-bold text-white/40">الخبر الجاري تحويله</p><h2 className="mt-3 text-3xl font-black leading-tight">ثلاث إصابات في حادث سير بين صِردا وبيرزيت</h2><p className="mt-4 text-sm leading-7 text-white/55">من الكلام العامي إلى News Bar، ثم موجز SMS، دون مصدر مختلق أو مكان غامض.</p></div><div className="mt-8 grid grid-cols-3 gap-2 border-t border-white/10 pt-5 text-center text-[10px] font-black text-white/45"><span><b className="block text-xl text-white">03</b>إصابات</span><span><b className="block text-xl text-white">02</b>مقطع طريق</span><span><b className="block text-xl text-white">01</b>خبر</span></div></div></div>
        </section>

        <section id="desk" className="scroll-mt-24 pt-24"><div className="section-heading"><div><p className="eyebrow text-sky-300">Editorial Desk / 01</p><h2 className="section-title">غرفة الأخبار السياحية</h2><p className="section-copy">كل مادة تبدأ بسؤال، وتنتهي بصيغة يختارها الجمهور: خبر، قصة، تقرير، توثيق أو تجربة.</p></div><span className="studio-tag">لا ننشر ما لا نفهمه</span></div><div className="mt-8 grid gap-3 md:grid-cols-4">{pipeline.map((step) => <article key={step.n} className="pipeline-card"><span className="step-number">{step.n}</span><h3 className="mt-6 text-lg font-black">{step.title}</h3><p className="mt-2 text-sm leading-7 text-white/52">{step.copy}</p></article>)}</div></section>

        <section id="stories" className="scroll-mt-24 pt-24"><div className="section-heading"><div><p className="eyebrow text-sky-300">Story Room / 02</p><h2 className="section-title">خريطة القصص</h2><p className="section-copy">قصص تبدأ من العيزرية وضواحي القدس، لكنها لا تتوقف عند صورة المكان.</p></div><div className="filter-pills">{["الكل", "خبر", "قصة", "تقرير", "تحقيق", "بورتريه"].map((type) => <button key={type} onClick={() => setActiveType(type)} className={activeType === type ? "active" : ""}>{type}</button>)}</div></div><div className="mt-8 grid gap-4 lg:grid-cols-[1.32fr_.68fr]"><div className="grid gap-3 sm:grid-cols-2">{visibleStories.map((story) => { const Icon = typeMeta[story.type]?.icon ?? FileText; return <button key={story.id} onClick={() => setSelectedId(story.id)} className={`story-card ${selectedId === story.id ? "selected" : ""}`}><div className="flex items-start justify-between gap-4"><div><span className={`story-type ${story.color}`}>{typeMeta[story.type]?.label ?? story.type}</span><h3 className="mt-3 text-lg font-black leading-tight">{story.title}</h3></div><Icon size={19} className="mt-1 text-[#f7cc71]" /></div><p className="mt-4 text-xs font-black text-white/40">{story.place}</p><p className="mt-4 text-sm leading-7 text-white/60">{story.summary}</p><div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3"><span className="text-[11px] font-bold text-white/35">{story.signal}</span><ArrowLeft size={15} className="text-[#f7cc71]" /></div></button>; })}</div><aside className="decision-panel"><div className="flex items-center justify-between"><span className={`story-type ${selected.color}`}>{selected.type}</span><SelectedIcon size={21} className="text-[#f7cc71]" /></div><h3 className="mt-6 text-3xl font-black leading-tight">{selected.title}</h3><p className="mt-3 text-xs font-black text-white/40">{selected.place}</p><p className="mt-5 text-sm leading-8 text-white/65">{selected.summary}</p><div className="mt-6 rounded-2xl border border-white/10 bg-black/15 p-4"><p className="text-[10px] font-black text-white/35">قالب الإنتاج</p><p className="mt-2 text-sm font-black text-[#f7cc71]">{selected.format}</p></div><div className="mt-5 flex items-center gap-2 text-xs font-black text-emerald-200"><Check size={15} /> {selected.signal}</div></aside></div></section>

        <section id="formats" className="scroll-mt-24 pt-24"><div className="section-heading"><div><p className="eyebrow text-sky-300">Formats / 03</p><h2 className="section-title">القصة نفسها، أشكال متعددة</h2><p className="section-copy">لا نضع كل شيء في شكل واحد. نختار القالب الذي يخدم السؤال والجمهور.</p></div></div><div className="mt-8 grid gap-3 md:grid-cols-4"><article className="format-card"><Radio size={20} /><h3>News Bar / SMS</h3><p>أهم معلومة بأقل كلمات، مع المكان والمصدر عندما يلزم.</p><code>ثلاث إصابات بين صِردا وبيرزيت</code></article><article className="format-card"><Video size={20} /><h3>فيديو 99 ثانية</h3><p>شخص واحد، لحظة واحدة، وجملة تبقى بعد انتهاء الفيديو.</p><code>قصة نارمين تبدأ من الطريق</code></article><article className="format-card"><Headphones size={20} /><h3>بودكاست</h3><p>الصوت الطبيعي، اللهجة، الصمت، وما لا تظهره الصورة.</p><code>من يملك رواية المكان؟</code></article><article className="format-card"><FileText size={20} /><h3>إنفوغراف</h3><p>تحويل الأرقام والمسارات والعائد إلى شيء يمكن رؤيته.</p><code>رحلة المنتج من اليد إلى السوق</code></article></div></section>

        <section id="brief" className="scroll-mt-24 pt-24"><div className="next-decision"><div><p className="eyebrow text-[#f7cc71]"><MapPinned size={14} /> بطاقة التغطية</p><h2 className="mt-5 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">قبل الكاميرا، نعرف ماذا نريد أن نثبت.</h2><p className="mt-5 max-w-2xl text-base leading-8 text-white/58">بطاقة صغيرة تمنع القصة من التحول إلى إعلان: من الشخصية؟ ما الفعل؟ أين؟ ما المصدر؟ ما الذي لا نعرفه؟ وما الشكل الذي يخدم الجمهور؟</p></div><div className="decision-checklist"><p className="text-xs font-black text-white/42">بوابة النشر</p>{["شخصية أو مكان محدد", "واقعة قابلة للتحقق", "موافقة وحقوق واضحة", "صيغة مناسبة للجمهور"].map((item) => <div key={item} className="check-row"><span><Check size={13} /></span>{item}</div>)}<button onClick={() => setShowBrief(true)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#f7cc71] px-4 py-3 text-xs font-black text-[#16252a] transition hover:brightness-105">أنشئ بطاقة تغطية <ChevronDown size={15} /></button></div></div></section>

        <footer className="mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs font-bold text-white/35"><span>SENSE / منصة سياحية تقودها الصحافة</span><span>مستقل · موثق · قابل للمتابعة</span></footer>
      </div>

      {showBrief && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="بطاقة تغطية"><div className="coverage-modal"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow text-[#f7cc71]">Coverage Brief / {briefStep + 1} من 4</p><h2 className="mt-3 text-2xl font-black">منهجية بناء القصة</h2></div><button onClick={() => setShowBrief(false)} className="text-2xl text-white/45" aria-label="إغلاق">×</button></div><div className="mt-5 grid grid-cols-4 gap-2">{["التقاط", "تثبيت", "صياغة", "توزيع"].map((step, index) => <button key={step} onClick={() => setBriefStep(index)} className={`rounded-lg px-2 py-2 text-[10px] font-black ${briefStep === index ? "bg-[#f7cc71] text-[#16252a]" : "bg-white/5 text-white/45"}`}>{index + 1}. {step}</button>)}</div>{briefStep === 0 && <div className="mt-6 grid gap-3"><label>العنوان أو الفكرة<input value={briefTitle} onChange={(event) => setBriefTitle(event.target.value)} placeholder="مثال: امرأة تعرف العيزرية ولا تظهر على الخريطة" /></label><label>المكان<input value={briefPlace} onChange={(event) => setBriefPlace(event.target.value)} placeholder="العيزرية، ضواحي القدس..." /></label></div>}{briefStep === 1 && <div className="mt-6 grid gap-3"><div className="method-question"><b>ماذا حدث؟</b><span>{briefTitle || "لم يُحدد بعد"}</span></div><div className="method-question"><b>أين حدث؟</b><span>{briefPlace || "لم يُحدد بعد"}</span></div><label>ما الدليل أو المصدر الأولي؟<textarea value={briefProof} onChange={(event) => setBriefProof(event.target.value)} rows={3} placeholder="مقابلة، وثيقة، صورة، سجل، مشاهدة ميدانية..." /></label></div>}{briefStep === 2 && <div className="mt-6 grid gap-3"><p className="text-xs leading-7 text-white/55">اختر الشكل الذي يخدم السؤال، لا الشكل الأكثر لمعانًا.</p>{["خبر / News Bar: أهم معلومة بأقل كلمات", "قصة: شخصية وفعل وتحول", "تقرير: سياق وشهادات وأثر", "إنفوغراف: رقم أو مسار يمكن رؤيته"].map((format) => <button key={format} onClick={() => setBriefStep(3)} className="method-option">{format}<ArrowLeft size={14} /></button>)}</div>}{briefStep === 3 && <div className="mt-6 grid gap-3"><div className="method-question"><b>بوابة النشر</b><span>موافقة واضحة · مصدر قابل للمراجعة · حقوق الصورة · قناة مناسبة</span></div><div className="rounded-xl bg-[#f7cc71]/10 p-4 text-sm leading-7 text-[#f7cc71]">{briefTitle || "القصة"} جاهزة كمسودة فقط. لا تصبح خبرًا منشورًا قبل المراجعة البشرية.</div></div>}<div className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-300/10 p-3 text-xs font-bold text-emerald-200"><CircleAlert size={15} /> المنصة تنظّم القرار؛ لا تستبدل المراسل أو التحقق.</div><div className="mt-6 flex gap-2">{briefStep > 0 && <button onClick={() => setBriefStep((step) => step - 1)} className="secondary-action flex-1 justify-center">السابق</button>}{briefStep < 3 ? <button onClick={() => setBriefStep((step) => step + 1)} className="primary-action flex-1 justify-center">التالي <ArrowLeft size={16} /></button> : <button onClick={() => setShowBrief(false)} className="primary-action flex-1 justify-center">حفظ كمسودة محلية <Check size={16} /></button>}</div></div></div>}
    </main>
  );
}
