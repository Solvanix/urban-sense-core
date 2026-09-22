import { useMemo, useState } from "react";
import { CommunityValidationPage } from "./CommunityValidationPage.js";
import { SurveyFeatureGuidePage } from "./SurveyFeatureGuidePage.js";

type PublicPage = "home" | "discover" | "booking" | "partners" | "vision" | "readiness" | "survey-guide" | "community";
type Category = "الكل" | "تراث" | "طعام" | "طبيعة" | "حرفة";

type Experience = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  category: Exclude<Category, "الكل">;
  duration: string;
  level: string;
  image: string;
  status: string;
  accent: string;
};

const experiences: Experience[] = [
  {
    id: "stone-stories",
    title: "حين تتكلم الحجارة",
    eyebrow: "مسار تراثي · مقترح",
    description: "مشي هادئ بين العتبات والحجر والظلال؛ يفتح لك تاريخ المكان عبر تفاصيل صغيرة لا تراها من نافذة السيارة.",
    category: "تراث",
    duration: "90 دقيقة",
    level: "سهل",
    image: "/media/hero.jpg",
    status: "قيد التحقق المحلي",
    accent: "gold",
  },
  {
    id: "olive-table",
    title: "مائدة من الحكايات",
    eyebrow: "طعام وذاكرة · مقترح",
    description: "جلسة تذوق محلية يتبع كل طبق فيها سؤال عن البيت والموسم والذاكرة، مع احترام خصوصية المضيف.",
    category: "طعام",
    duration: "ساعتان",
    level: "للجميع",
    image: "/media/stone.jpg",
    status: "نبحث عن مضيفين",
    accent: "terracotta",
  },
  {
    id: "human-map",
    title: "ارسم خريطتك الإنسانية",
    eyebrow: "تعلم ومشاركة · مقترح",
    description: "ورشة قصيرة للطلبة والباحثين تحوّل معرفة السكان إلى أسئلة تحترم المصدر وتترك أثرًا قابلًا للتعلم.",
    category: "حرفة",
    duration: "60 دقيقة",
    level: "متوسط",
    image: "/media/map.jpg",
    status: "نسخة تجريبية",
    accent: "teal",
  },
  {
    id: "morning-light",
    title: "قبل أن تستيقظ المدينة",
    eyebrow: "شروق وإطلالة · مقترح",
    description: "مسار فجر بطيء للضوء والهواء. نقطة التجمع والظروف التشغيلية تحتاج اعتمادًا ميدانيًا قبل الإعلان.",
    category: "طبيعة",
    duration: "75 دقيقة",
    level: "متوسط",
    image: "/media/hero.jpg",
    status: "بانتظار اعتماد المسار",
    accent: "sage",
  },
];

const categories: Category[] = ["الكل", "تراث", "طعام", "طبيعة", "حرفة"];
const planKey = "sense-experience-plan-v2";

export function getPublicPage(pathname: string): PublicPage {
  const decodedPath = decodeURIComponent(pathname);
  if (["/اكتشف", "/discover", "/المسارات", "/trails"].includes(decodedPath)) return "discover";
  if (["/حجزي", "/booking", "/احجز"].includes(decodedPath)) return "booking";
  if (["/للشركاء", "/partners"].includes(decodedPath)) return "partners";
  if (["/رؤية-مسؤولة", "/responsible-vision"].includes(decodedPath)) return "vision";
  if (["/جاهزية-المزود", "/provider-readiness"].includes(decodedPath)) return "readiness";
  if (["/دليل-الميزات", "/feature-guide"].includes(decodedPath)) return "survey-guide";
  if (["/تحقق-مجتمعي", "/community-validation"].includes(decodedPath)) return "community";
  return "home";
}

const publicLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/اكتشف", label: "اكتشف" },
  { href: "/حجزي", label: "خطة يومي" },
  { href: "/للشركاء", label: "للشركاء" },
  { href: "/تحقق-مجتمعي", label: "نختبر معًا" },
];

export function TourismPublicSite({ pathname, onNavigate }: { pathname: string; onNavigate: (href: string) => void }) {
  const page = getPublicPage(pathname);
  const [plan, setPlan] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(planKey) || "[]") as string[]; } catch { return []; }
  });

  function updatePlan(next: string[]) {
    setPlan(next);
    localStorage.setItem(planKey, JSON.stringify(next));
  }

  return (
    <main id="main-content" tabIndex={-1} className="sense-platform" dir="rtl">
      <header className="sense-nav">
        <button className="sense-brand" onClick={() => onNavigate("/")} aria-label="العودة إلى SENSE">
          <span className="sense-brand-mark">س</span>
          <span><b>SENSE</b><small>AL-EIZARIYA / EXPERIENCE</small></span>
        </button>
        <nav aria-label="التنقل الرئيسي">
          {publicLinks.map((link) => <a key={link.href} href={link.href} className={getPublicPage(link.href) === page ? "active" : ""} onClick={(event) => { event.preventDefault(); onNavigate(link.href); }}>{link.label}</a>)}
        </nav>
        <button className="sense-nav-provider" onClick={() => onNavigate("/launchpad")}>جواز مشروعك <span>↗</span></button>
      </header>

      {page === "home" && <HomePage onNavigate={onNavigate} plan={plan} updatePlan={updatePlan} />}
      {page === "discover" && <DiscoverPage onNavigate={onNavigate} plan={plan} updatePlan={updatePlan} />}
      {page === "booking" && <BookingPage onNavigate={onNavigate} plan={plan} />}
      {page === "partners" && <PartnersPage onNavigate={onNavigate} />}
      {page === "vision" && <VisionPage onNavigate={onNavigate} />}
      {page === "readiness" && <ReadinessPage onNavigate={onNavigate} />}
      {page === "survey-guide" && <SurveyFeatureGuidePage onNavigate={onNavigate} />}
      {page === "community" && <CommunityValidationPage onNavigate={onNavigate} />}

      <footer className="sense-footer">
        <div><span className="sense-footer-mark">س</span><div><strong>SENSE Experience</strong><p>العيزرية تُعاش، لا تُستهلك.</p></div></div>
        <div className="sense-footer-links"><a href="/رؤية-مسؤولة" onClick={(event) => { event.preventDefault(); onNavigate("/رؤية-مسؤولة"); }}>رؤية مسؤولة</a><a href="/جاهزية-المزود" onClick={(event) => { event.preventDefault(); onNavigate("/جاهزية-المزود"); }}>دليل الشركاء</a><span>نسخة تجريبية · 2026</span></div>
      </footer>
    </main>
  );
}

function HomePage({ onNavigate, plan, updatePlan }: { onNavigate: (href: string) => void; plan: string[]; updatePlan: (next: string[]) => void }) {
  return <>
    <section className="sense-hero">
      <div className="sense-hero-copy">
        <p className="sense-kicker"><span className="sense-kicker-dot" /> SENSE / العيزرية</p>
        <h1>أنت لا تزور المكان.<br /><em>المكان يزورك.</em></h1>
        <p className="sense-hero-lead">منصة سياحية عربية تبني يومك حول القصص المحلية، المسارات الهادئة، والناس الذين يصنعون معنى المكان — لا حول قائمة مزدحمة من النقاط.</p>
        <div className="sense-hero-actions"><button className="sense-primary" onClick={() => onNavigate("/اكتشف")}>ابدأ من هنا <span>←</span></button><button className="sense-text-button" onClick={() => onNavigate("/رؤية-مسؤولة")}>كيف نبني التجربة؟ <span>↗</span></button></div>
        <div className="sense-hero-proof"><div><strong>4</strong><span>مسارات أولية</span></div><div><strong>1</strong><span>بلدة، طبقات</span></div><div><strong>0</strong><span>وعود مصطنعة</span></div></div>
      </div>
      <div className="sense-hero-media"><img src="/media/hero.jpg" alt="ممر حجري في البلدة القديمة" /><div className="sense-image-note"><span>01</span><strong>المشهد الأول</strong><small>بين الظل والنور تبدأ الحكاية</small></div><div className="sense-image-stamp">AL<br /><b>EIZARIYA</b></div></div>
    </section>

    <section className="sense-statement"><div><span className="sense-section-label">فكرة SENSE</span><h2>كل يوم هنا<br /><em>له إيقاعه.</em></h2></div><p>نرتب لك ما تحتاج معرفته قبل الوصول: قصة قصيرة، وقت واقعي، طريقة تواصل، ونقطة بداية يمكن التحقق منها. إذا كانت المعلومة غير مكتملة، نقول ذلك بوضوح.</p><div className="sense-statement-line" /></section>

    <section className="sense-featured"><div className="sense-section-head"><div><span className="sense-section-label">اختَر مزاج يومك</span><h2>مسارات تترك<br /><em>أثرًا خفيفًا.</em></h2></div><button className="sense-link-button" onClick={() => onNavigate("/اكتشف")}>شاهد كل المسارات <span>←</span></button></div><div className="sense-experience-grid">{experiences.slice(0, 3).map((item, index) => <ExperienceCard key={item.id} item={item} index={index} selected={plan.includes(item.id)} onToggle={() => updatePlan(plan.includes(item.id) ? plan.filter((id) => id !== item.id) : [...plan, item.id])} />)}</div></section>

    <section className="sense-journey-band"><div className="sense-journey-art"><span>02</span><div className="sense-journey-ring" /></div><div><span className="sense-section-label">خطتك، بطريقتك</span><h2>لا تحتاج برنامجًا<br /><em>مزدحمًا.</em></h2><p>أضف ما يعجبك إلى خطة يومك، ثم اطلب من شريك محلي مراجعة التفاصيل قبل أن تصل. لا دفع، لا حجز وهمي، ولا مفاجآت مخفية.</p><button className="sense-light-button" onClick={() => onNavigate("/حجزي")}>{plan.length ? `افتح خطتك (${plan.length})` : "ابنِ خطة يومك"} <span>←</span></button></div></section>

    <section className="sense-trust-strip"><div><span>03</span><strong>القصة قبل البيع</strong><p>لا بطاقة بلا سياق.</p></div><div><span>04</span><strong>المعلومة لها مصدر</strong><p>نعرض ما نعرفه وما لم يُتحقق منه.</p></div><div><span>05</span><strong>المضيف شريك</strong><p>لا نشر دون موافقة ومراجعة.</p></div><button onClick={() => onNavigate("/للشركاء")}>هل لديك تجربة محلية؟ <span>↗</span></button><button onClick={() => onNavigate("/تحقق-مجتمعي")}>ساعدنا على الاختبار <span>↗</span></button></section>
  </>;
}

function DiscoverPage({ onNavigate, plan, updatePlan }: { onNavigate: (href: string) => void; plan: string[]; updatePlan: (next: string[]) => void }) {
  const [category, setCategory] = useState<Category>("الكل");
  const filtered = useMemo(() => category === "الكل" ? experiences : experiences.filter((item) => item.category === category), [category]);
  return <>
    <section className="sense-page-hero"><div><span className="sense-section-label">دليل العيزرية</span><h1>اكتشف ما تريد<br /><em>أن تعيشه.</em></h1></div><p>ليست كل البطاقات حجوزات جاهزة. بعضها مسارات تحريرية قيد التحقق؛ نعرضها كما هي كي تعرف أين تبدأ وأين تحتاج أن تسأل.</p></section>
    <section className="sense-discover-layout"><aside className="sense-filter-panel"><span className="sense-section-label">صفِّ حسب المزاج</span><div className="sense-category-list">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}<span>{item === "الكل" ? experiences.length : experiences.filter((experience) => experience.category === item).length}</span></button>)}</div><div className="sense-discover-note"><strong>ملاحظة مهمة</strong><p>الأوقات والأسعار والسعة تحتاج تأكيدًا من الشريك المحلي قبل الزيارة.</p></div></aside><div className="sense-discover-results"><div className="sense-results-top"><span>{filtered.length} مسارات ظاهرة</span><button onClick={() => onNavigate("/رؤية-مسؤولة")}>كيف نتحقق؟ ↗</button></div><div className="sense-experience-grid sense-discover-grid">{filtered.map((item, index) => <ExperienceCard key={item.id} item={item} index={index} selected={plan.includes(item.id)} onToggle={() => updatePlan(plan.includes(item.id) ? plan.filter((id) => id !== item.id) : [...plan, item.id])} />)}</div></div></section>
  </>;
}

function ExperienceCard({ item, index, selected, onToggle }: { item: Experience; index: number; selected: boolean; onToggle: () => void }) {
  return <article className={`sense-experience-card accent-${item.accent}`}><div className="sense-card-image"><img src={item.image} alt="" /><span className="sense-card-index">0{index + 1}</span><span className="sense-card-status">{item.status}</span></div><div className="sense-card-body"><span className="sense-card-eyebrow">{item.eyebrow}</span><h3>{item.title}</h3><p>{item.description}</p><div className="sense-card-meta"><span>◷ {item.duration}</span><span>◌ {item.level}</span></div><button className={selected ? "selected" : ""} onClick={onToggle}>{selected ? "أضيفت إلى خطة يومي ✓" : "أضف إلى خطة يومي +"}</button></div></article>;
}

function BookingPage({ onNavigate, plan }: { onNavigate: (href: string) => void; plan: string[] }) {
  const chosen = experiences.filter((item) => plan.includes(item.id));
  const [submitted, setSubmitted] = useState(false);
  return <section className="sense-booking-page"><div className="sense-page-hero booking-hero"><div><span className="sense-section-label">خطتك الشخصية</span><h1>يومك يبدأ<br /><em>من سؤال.</em></h1></div><p>حوّل المسارات التي أعجبتك إلى طلب مراجعة محلي. هذه الخطوة لا تطلب دفعًا ولا تنشئ حجزًا نهائيًا.</p></div><div className="sense-booking-layout"><div className="sense-plan-summary"><div className="sense-summary-head"><span className="sense-section-label">المسارات المختارة</span><button onClick={() => onNavigate("/اكتشف")}>+ أضف مسارًا</button></div>{chosen.length ? <ol>{chosen.map((item) => <li key={item.id}><span>0{experiences.indexOf(item) + 1}</span><div><strong>{item.title}</strong><small>{item.duration} · {item.status}</small></div></li>)}</ol> : <div className="sense-empty-plan"><span>✦</span><strong>لم تختر مسارًا بعد</strong><p>ابدأ من دليل المسارات، ثم عُد إلى هنا لترتيب اليوم.</p><button onClick={() => onNavigate("/اكتشف")}>اذهب إلى الاكتشاف ←</button></div>}<div className="sense-boundary-box"><strong>قبل التأكيد</strong><p>سنحتاج مراجعة التوافر والسعر والوصول مع شريك محلي. لن نعرض لك معلومات غير مؤكدة.</p></div></div><form className="sense-request-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><span className="sense-section-label">مسودة طلب مراجعة</span><h2>ساعدنا على فهم يومك.</h2><label>الاسم أو اسم المجموعة<input required placeholder="مثال: عائلة الخطيب" /></label><div className="sense-form-row"><label>تاريخ الزيارة<input required type="date" /></label><label>عدد الأشخاص<input required type="number" min="1" max="20" defaultValue="2" /></label></div><label>طريقة التواصل<input required type="text" placeholder="بريد إلكتروني أو رقم هاتف" /></label><label>ما الذي يهمك؟<textarea rows={3} placeholder="وصول سهل، قصة معينة، طعام محلي..." /></label><button className="sense-primary" disabled={!chosen.length}>{submitted ? "حُفظت المسودة ✓" : "أنشئ مسودة الطلب ↗"}</button><small>المسودة محلية في هذه النسخة التجريبية ولا تُرسل إلى خادم.</small>{submitted && <div className="sense-form-success"><strong>مسودة جاهزة للمراجعة.</strong><p>احتفظ بالتفاصيل وتحقق من الشريك المحلي قبل الدفع أو الوصول.</p></div>}</form></div></section>;
}

function PartnersPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return <><section className="sense-partner-hero"><div><span className="sense-section-label">لأصحاب التجارب</span><h1>خبرتك المحلية<br /><em>تستحق أن تُروى.</em></h1><p>نساعد المرشدين، الحرفيين، المضيفين، وأصحاب المبادرات على بناء بطاقة تجربة واضحة — ثم نترك قرار النشر لمراجعة بشرية وموافقة صريحة.</p><button className="sense-primary" onClick={() => onNavigate("/انضم")}>ابدأ مسار الشراكة ↗</button></div><div className="sense-partner-art"><span>لست قائمة أخرى.</span><strong>أنت<br />جزء من<br /><em>المكان.</em></strong></div></section><section className="sense-partner-steps"><div><span>01</span><h2>قدّم ما تفعله فعلًا</h2><p>وصف واضح للتجربة، جمهورها، مدتها، وما يحتاجه الزائر قبل الوصول.</p></div><div><span>02</span><h2>نراجع معك التفاصيل</h2><p>لا نضيف وعودًا من عندنا. نطلب توضيحًا عندما يلزم ونحافظ على صوتك.</p></div><div><span>03</span><h2>تقرر كيف يظهر ملفك</h2><p>القبول ليس نشرًا تلقائيًا. لك قرار مستقل في الظهور العام وبيانات التواصل.</p></div></section></>;
}

function VisionPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return <section className="sense-editorial-page"><span className="sense-section-label">رؤية مسؤولة</span><h1>المنصة الجيدة<br /><em>تعرف حدودها.</em></h1><div className="sense-editorial-columns"><p>السياحة ليست جمع نقاط على الخريطة. هي علاقة بين زائر ومكان ومضيف، وكل علاقة تحتاج سياقًا وموافقة ومساحة للرفض.</p><div><h2>ما نعد به</h2><ul><li>معلومة مفيدة قبل الوصول.</li><li>مصدر ظاهر أو تنبيه واضح بأن التحقق لم يكتمل.</li><li>احترام خصوصية المضيف وقرار النشر.</li><li>فصل المنصة السياحية عن بيانات Urban‑Sense البلدية.</li></ul></div></div><button className="sense-secondary" onClick={() => onNavigate("/اكتشف")}>عد إلى الدليل ←</button></section>;
}

function ReadinessPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return <section className="sense-readiness-page"><span className="sense-section-label">مسار المزود</span><h1>الجاهزية ليست<br /><em>طلبًا طويلًا.</em></h1><p>قبل أن تسجّل، تعرّف على ما يحتاجه ملف تجربة مسؤول: ما الذي سيعيشه الزائر، ما الذي نعرفه، وما الذي يجب أن يُراجع محليًا.</p><div className="sense-readiness-grid"><article><span>01</span><h2>عرّف التجربة</h2><p>من أنت؟ ماذا يحدث؟ ولمن تصلح التجربة؟</p></article><article><span>02</span><h2>وضّح ما قبل الوصول</h2><p>المكان، الوقت، الوصول، اللغة، والاحتياطات.</p></article><article><span>03</span><h2>شارك في المراجعة</h2><p>المراجع المستقل يسأل قبل أن يقرر.</p></article></div><button className="sense-primary" onClick={() => onNavigate("/انضم")}>افتح نموذج الشراكة ↗</button></section>;
}
