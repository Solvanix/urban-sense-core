import { useMemo, useState } from "react";

type LaunchpadPageProps = { onNavigate: (href: string) => void };

type Project = {
  name: string;
  location: string;
  host: string;
  audience: string;
  story: string;
  readiness: string;
  safety: string;
  permission: string;
  localBenefit: string;
};

const questions = [
  "ماذا سيعيش الزائر خلال ساعتين؟",
  "من سيستقبله ويشرح له المكان؟",
  "هل الوصول آمن ومسموح؟",
  "ما الذي يحتاج إلى تحقق قبل النشر؟",
  "كيف يستفيد أهل المكان من التجربة؟",
];

const starter: Project = {
  name: "طريق الزيتونة والمغارة",
  location: "منطقة ريفية قيد التحقق",
  host: "مرشد أو مضيف محلي",
  audience: "زائر يحب القصص والطبيعة",
  story: "مسار يبدأ من شجرة زيتون، يمر بين الطريق والقرية، وينتهي عند مغارة لا تُفتح قبل حمايتها.",
  readiness: "قيد التطوير",
  safety: "نحتاج فحصًا ميدانيًا",
  permission: "نحتاج تأكيد حق الوصول",
  localBenefit: "منتج محلي ومرشد من المنطقة",
};

export function TourismLaunchpadPage({ onNavigate }: LaunchpadPageProps) {
  const [project, setProject] = useState<Project>(starter);
  const [step, setStep] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    let value = 35;
    if (project.name.trim()) value += 10;
    if (project.story.trim().length > 40) value += 15;
    if (project.host.trim()) value += 10;
    if (project.localBenefit.trim()) value += 10;
    if (project.safety.includes("جاهز")) value += 10;
    if (project.permission.includes("مؤكد")) value += 10;
    return Math.min(value, 100);
  }, [project]);

  function update<K extends keyof Project>(key: K, value: Project[K]) {
    setProject((current) => ({ ...current, [key]: value }));
  }

  return <main id="main-content" className="launchpad-page" dir="rtl">
    <header className="launchpad-nav"><button className="launchpad-brand" onClick={() => onNavigate("/")}>س <span>SENSE <small>LAUNCHPAD</small></span></button><button className="launchpad-back" onClick={() => onNavigate("/للشركاء")}>العودة إلى الشركاء ↗</button></header>
    <section className="launchpad-hero"><div><span className="sense-section-label">مسار أصحاب المشاريع السياحية</span><h1>قبل أن تستقبل<br /><em>الزائر، اختبر تجربتك.</em></h1><p>Launchpad يحول فكرتك أو نشاطك المحلي إلى جواز مشروع واضح: قصة، جاهزية، أسئلة تحقق، وخطوة تالية قابلة للتنفيذ.</p><div className="launchpad-steps"><span className={step === 1 ? "active" : ""}>01 <b>مراجعة المشروع</b></span><i /> <span className={step === 2 ? "active" : ""}>02 <b>محاكاة الجاهزية</b></span></div></div><div className="launchpad-score-card"><span>مؤشر اكتمال البطاقة</span><strong>{score}%</strong><small>مؤشر توجيهي، وليس اعتمادًا</small><div className="launchpad-meter"><i style={{ width: `${score}%` }} /></div></div></section>

    {step === 1 ? <section className="launchpad-workspace"><div className="launchpad-form"><div className="launchpad-section-head"><span>الخطوة الأولى / 01</span><h2>ابنِ بطاقة مشروعك</h2><p>لا نبحث عن صياغة مثالية. نريد أن نفهم ما تفعله فعلًا، وما يحتاج إلى تحقق قبل أن يراه الزائر.</p></div><label>اسم التجربة أو المشروع<input value={project.name} onChange={(e) => update("name", e.target.value)} /></label><div className="launchpad-grid"><label>الموقع العام<input value={project.location} onChange={(e) => update("location", e.target.value)} /></label><label>من يستقبل الزائر؟<input value={project.host} onChange={(e) => update("host", e.target.value)} /></label></div><label>لمن هذه التجربة؟<input value={project.audience} onChange={(e) => update("audience", e.target.value)} /></label><label>احكِ التجربة في جملة أو جملتين<textarea rows={4} value={project.story} onChange={(e) => update("story", e.target.value)} /></label><div className="launchpad-grid"><label>السلامة<select value={project.safety} onChange={(e) => update("safety", e.target.value)}><option>نحتاج فحصًا ميدانيًا</option><option>جاهز مبدئيًا</option></select></label><label>حق الوصول<select value={project.permission} onChange={(e) => update("permission", e.target.value)}><option>نحتاج تأكيد حق الوصول</option><option>مؤكد مع المالك</option></select></label></div><label>كيف يستفيد أهل المكان؟<input value={project.localBenefit} onChange={(e) => update("localBenefit", e.target.value)} /></label><button className="launchpad-primary" onClick={() => setStep(2)}>راجع جاهزية التجربة ←</button><small className="launchpad-privacy">المعلومات هنا مسودة تطويرية. لا ننشر مشروعك دون موافقة صريحة ومراجعة بشرية.</small></div><aside className="launchpad-preview"><span className="sense-section-label">معاينة الجواز</span><div className="passport-stamp">SENSE<br /><small>PROJECT PASSPORT</small></div><h3>{project.name}</h3><p>{project.story}</p><div className="launchpad-preview-list"><span><b>المضيف</b>{project.host}</span><span><b>الحالة</b>{project.readiness}</span><span><b>الأثر المحلي</b>{project.localBenefit}</span></div><div className="launchpad-boundary"><strong>نقطة التحقق التالية</strong><p>{project.safety} · {project.permission}</p></div></aside></section> : <section className="launchpad-interview"><div className="launchpad-interview-intro"><span className="sense-section-label">الخطوة الثانية / 02</span><h2>محاكاة الجاهزية</h2><p>أجب عن هذه الأسئلة كما لو أنك تقدّم تجربتك لشريك أو زائر. لا توجد إجابات مثالية؛ توجد إجابات تحتاج وضوحًا أو دليلًا.</p><div className="launchpad-final-score"><strong>{score}%</strong><span>اكتمال البطاقة<br /><small>{score >= 75 ? "يمكن الانتقال إلى مراجعة بشرية؛ لا يعني ذلك اعتماد التجربة" : "ما زالت لديك نقاط تحتاج إلى تطوير"}</small></span></div></div><div className="launchpad-question-list">{questions.map((question, index) => <article key={question}><span>0{index + 1}</span><div><h3>{question}</h3><textarea rows={3} placeholder="اكتب إجابتك هنا..." /></div></article>)}<button className="launchpad-primary" onClick={() => setSubmitted(true)}>{submitted ? "تم حفظ مسودة التقييم ✓" : "احفظ مسودة الجاهزية"}</button><button className="launchpad-text" onClick={() => setStep(1)}>← عدّل بطاقة المشروع</button></div></section>}

    <footer className="launchpad-footer"><span>SENSE Experience</span><p>من القصة إلى التجربة، ومن الفكرة إلى تحقّق مسؤول.</p><button onClick={() => onNavigate("/دليل-الميزات")}>شاهد دليل الميزات ↗</button></footer>
  </main>;
}

export default TourismLaunchpadPage;
