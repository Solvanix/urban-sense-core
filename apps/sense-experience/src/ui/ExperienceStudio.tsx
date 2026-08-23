import { useMemo, useState } from "react";
import { accessNeedTypes, createExperienceDraft, projectVisitorExperienceCard, type ExperienceDraft } from "../onboarding/experienceCard.js";

const storageKey = "sense-experience-card-draft-v1";

const emptyDraft: ExperienceDraft = {
  title: "",
  category: "",
  publicArea: "",
  guestGoal: "",
  stages: ["", "", ""],
  accessNeeds: [],
  accessOperationalNote: "",
  privateOperationalNotes: "",
  publicListingConsent: false
};

const accessLabels: Record<(typeof accessNeedTypes)[number], string> = {
  step_free: "مسار بلا درجات — يحتاج تحققًا",
  seating: "استراحة أو مقاعد — يحتاج تحققًا",
  quiet_space: "خيار حسّي أهدأ — يحتاج تحققًا",
  easy_read: "معلومات سهلة القراءة — يحتاج تحققًا",
  support_person: "دعم مرافق أو مساعدة — يحتاج تحققًا"
};

function loadDraft() {
  try { return { ...emptyDraft, ...JSON.parse(window.localStorage.getItem(storageKey) ?? "null") } as ExperienceDraft; } catch { return emptyDraft; }
}

export function ExperienceStudio({ onNavigate }: { onNavigate: (href: string) => void }) {
  const [draft, setDraft] = useState<ExperienceDraft>(loadDraft);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  const publicPreview = useMemo(() => {
    try { return draft.publicListingConsent ? projectVisitorExperienceCard({ ...draft, stages: draft.stages.filter(Boolean) }, []) : null; } catch { return null; }
  }, [draft]);

  function setField<K extends keyof ExperienceDraft>(field: K, value: ExperienceDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function setStage(index: number, value: string) {
    setDraft((current) => ({ ...current, stages: current.stages.map((stage, currentIndex) => currentIndex === index ? value : stage) }));
  }

  function toggleAccessNeed(need: (typeof accessNeedTypes)[number]) {
    setDraft((current) => ({ ...current, accessNeeds: current.accessNeeds.includes(need) ? current.accessNeeds.filter((item) => item !== need) : [...current.accessNeeds, need] }));
  }

  function save() {
    try {
      const valid = createExperienceDraft({ ...draft, stages: draft.stages.filter(Boolean) });
      window.localStorage.setItem(storageKey, JSON.stringify(valid));
      setSaved(true);
      setMessage("حُفظت بطاقة التجربة على هذا الجهاز كمسودة خاصة. لا تُنشر ولا تُرسل للمراجعة من هذه الشاشة.");
    } catch {
      setSaved(false);
      setMessage("أكمل عنوان التجربة، المنطقة العامة، هدف الضيف، وثلاث مراحل مفهومة قبل الحفظ.");
    }
  }

  return <main id="main-content" tabIndex={-1} className="studio-shell" dir="rtl">
    <header className="studio-header"><div><p className="eyebrow">SENSE EXPERIENCE STUDIO</p><h1>صمّم تجربة قابلة للتنفيذ، لا وصفًا دعائيًا.</h1><p>بطاقة خاصة تساعد المزوّد والمراجع على فهم ما يعيشه الضيف، وما يحتاج تحققًا، وما لا يجوز نشره تلقائيًا.</p></div><button className="secondary" onClick={() => onNavigate("/")}>العودة للبوابة</button></header>
    <section className="studio-boundary" role="note"><b>حد التشغيل الحالي:</b> تحفظ هذه الصفحة مسودة محلية على جهازك. لا تُنشئ قائمة عامة، ولا تؤكد الوصول أو السلامة، ولا ترسل بيانات حقيقية إلى خادم.</section>
    <div className="studio-grid">
      <section className="studio-form" aria-label="بطاقة التجربة الخاصة">
        <p className="eyebrow">المسودة الخاصة</p><h2>من الضيف إلى أثر التجربة</h2>
        <div className="studio-fields">
          <label><span>اسم التجربة</span><input value={draft.title} onChange={(event) => setField("title", event.target.value)} placeholder="مثال: صباح خبز وحكاية محلية" /></label>
          <label><span>الفئة</span><input value={draft.category} onChange={(event) => setField("category", event.target.value)} placeholder="طعام، حرفة، ثقافة، ريف…" /></label>
          <label><span>المنطقة العامة</span><input value={draft.publicArea} onChange={(event) => setField("publicArea", event.target.value)} placeholder="مدينة أو منطقة عامة — بلا عنوان دقيق" /></label>
          <label className="studio-full"><span>ما الذي يريد الضيف أن يكتسبه أو يعيشه؟</span><textarea value={draft.guestGoal} onChange={(event) => setField("guestGoal", event.target.value)} rows={3} placeholder="اكتب نتيجة واقعية للضيف، لا وعدًا عامًا." /></label>
        </div>
        <fieldset className="journey-fieldset"><legend>رحلة الضيف: ثلاث لحظات أساسية</legend>{draft.stages.map((stage, index) => <label key={index}><span>{index === 0 ? "قبل الوصول" : index === 1 ? "اللحظة الأساسية" : "بعد التجربة"}</span><input value={stage} onChange={(event) => setStage(index, event.target.value)} placeholder="ماذا يحدث فعليًا؟" /></label>)}</fieldset>
        <fieldset className="access-fieldset"><legend>معلومات الوصول المصرّح بها من المزوّد</legend><p>هذه إشارة داخلية لا تظهر للزائر ولا تتحول إلى ادعاء وصول قبل تحقق مستقل.</p><div>{accessNeedTypes.map((need) => <label key={need}><input type="checkbox" checked={draft.accessNeeds.includes(need)} onChange={() => toggleAccessNeed(need)} />{accessLabels[need]}</label>)}</div><label><span>ملاحظة تشغيلية خاصة حول الوصول</span><textarea value={draft.accessOperationalNote} onChange={(event) => setField("accessOperationalNote", event.target.value)} rows={3} placeholder="ما الذي يحتاج معاينة أو مراجعة قبل أن نخبر الزائر به؟" /></label></fieldset>
        <label className="studio-notes"><span>ملاحظات تشغيلية خاصة</span><textarea value={draft.privateOperationalNotes} onChange={(event) => setField("privateOperationalNotes", event.target.value)} rows={4} placeholder="احتياجات تشغيل، شركاء، أو فجوات لا تظهر في النسخة العامة." /></label>
        <label className="studio-consent"><input type="checkbox" checked={draft.publicListingConsent} onChange={(event) => setField("publicListingConsent", event.target.checked)} />أوافق فقط على إنشاء معاينة ملخص زائر من الحقول العامة أعلاه، على أن يظل أي نشر لاحق مرهونًا بالمراجعة.</label>
        <div className="studio-actions"><button className="primary" onClick={save}>{saved ? "حُفظت المسودة" : "حفظ مسودة خاصة"}</button><button className="quiet" onClick={() => { window.localStorage.removeItem(storageKey); setDraft(emptyDraft); setMessage("حُذفت المسودة المحلية من هذا الجهاز."); }}>حذف المسودة المحلية</button></div>
        {message && <p className="studio-message" role="status">{message}</p>}
      </section>
      <aside className="studio-preview" aria-label="معاينة ملخص الزائر">
        <p className="eyebrow">إسقاط زائر بالقائمة البيضاء</p><h2>ما الذي يمكن أن يراه الزائر؟</h2>
        {publicPreview ? <article><span>تجربة قيد المراجعة</span><h3>{publicPreview.title}</h3><p>{publicPreview.category} · {publicPreview.publicArea}</p><b>هدف التجربة</b><p>{publicPreview.guestGoal}</p><ol>{publicPreview.stages.map((stage) => <li key={stage}>{stage}</li>)}</ol><div className="preview-warning">لا توجد معلومات وصول «مؤكدة» بعد؛ ستظهر فقط ادعاءات وصول تم التحقق منها لاحقًا.</div></article> : <article className="preview-empty"><h3>لا توجد معاينة عامة بعد</h3><p>أكمل الحقول الأساسية ووافق على معاينة الملخص. تبقى الملاحظات التشغيلية وخيارات الوصول الخاصة خارج هذه البطاقة.</p></article>}
        <button className="secondary" onClick={() => onNavigate("/خطة-الوصول")}>افتح خطة الوصول الشخصية</button>
      </aside>
    </div>
  </main>;
}
