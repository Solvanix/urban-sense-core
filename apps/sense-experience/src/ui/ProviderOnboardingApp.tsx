import { useEffect, useMemo, useState } from "react";
import { ProviderInvitationPage } from "./ProviderInvitationPage.js";

type Draft = {
  dataProcessing: boolean;
  humanReview: boolean;
  publicListing: boolean;
  brandName: string;
  providerType: string;
  area: string;
  contactChannel: string;
  serviceCategory: string;
  guestJourney: string;
  languages: string[];
  availability: string;
};

const emptyDraft: Draft = {
  dataProcessing: false,
  humanReview: false,
  publicListing: false,
  brandName: "",
  providerType: "",
  area: "",
  contactChannel: "",
  serviceCategory: "",
  guestJourney: "",
  languages: ["العربية"],
  availability: ""
};

const steps = ["الموافقة", "العلامة", "الخدمة", "المراجعة"];
const storageKey = "sense-experience-provider-draft-v1";

function updateField<K extends keyof Draft>(draft: Draft, field: K, value: Draft[K]): Draft {
  return { ...draft, [field]: value };
}

export function ProviderOnboardingApp() {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<"provider" | "reviewer">("provider");
  const [screen, setScreen] = useState<"invite" | "onboarding">("invite");
  const [saved, setSaved] = useState(false);
  const [draft, setDraft] = useState<Draft>(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return emptyDraft;
    try {
      return { ...emptyDraft, ...JSON.parse(stored) } as Draft;
    } catch {
      return emptyDraft;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
  }, [draft]);

  const guidance = useMemo(() => {
    const prompts: string[] = [];
    if (!draft.brandName) prompts.push("ابدأ باسم العلامة الذي تريد أن يراه الزائر، لا بالاسم القانوني إن لم ترغب في نشره.");
    if (!draft.serviceCategory) prompts.push("ما نوع التجربة أو الخدمة الأولى التي يستطيع الضيف فهمها خلال ثوانٍ؟");
    if (draft.guestJourney.trim().length < 60) prompts.push("صف رحلة الضيف: كيف يصل، ماذا يحدث، وكيف تنتهي التجربة؟");
    if (!draft.availability) prompts.push("اذكر ملاحظة واقعية عن التوفر أو الحجز، من دون وعد بتوافر حي.");
    if (!draft.publicListing) prompts.push("لن يظهر أي ملف للعامة ما لم توافق صراحة على النشر بعد المراجعة.");
    return prompts.slice(0, 2);
  }, [draft]);

  const canContinue = [
    draft.dataProcessing && draft.humanReview,
    Boolean(draft.brandName.trim() && draft.providerType && draft.area.trim()),
    Boolean(draft.serviceCategory.trim() && draft.guestJourney.trim().length >= 20)
  ][step] ?? true;

  function saveDraft() {
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  function clearDraft() {
    window.localStorage.removeItem(storageKey);
    setDraft(emptyDraft);
    setStep(0);
  }

  return (
    <main className="app-shell">
      <section className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">س</span>
          <div>
            <p className="eyebrow">SENSE EXPERIENCE</p>
            <h1>ملف مزود الخدمة</h1>
          </div>
        </div>
        <div className="mode-control" aria-label="التنقل داخل المعاينة">
          <button className={screen === "invite" ? "active" : ""} onClick={() => setScreen("invite")}>الدعوة</button>
          <button className={screen === "onboarding" ? "active" : ""} onClick={() => setScreen("onboarding")}>مسار الملف</button>
        </div>
      </section>

      <section className="invite-banner" role="status">
        <p><strong>تجربة مزودين محدودة:</strong> هل تقدم خدمة أو تجربة؟ ابدأ بتسجيل اهتمامك، وسنراجع ملاءمة الملف قبل أي نشر.</p>
        <button onClick={() => setScreen("invite")}>أبدِ اهتمامك</button>
      </section>

      {screen === "invite" ? <ProviderInvitationPage onOpenOnboarding={() => setScreen("onboarding")} /> : (
        <>
          <section className="notice" role="note">
            <strong>معاينة محلية للنواة:</strong> لا يوجد نشر عام أو حجز أو دفع في هذه المرحلة. تحفظ المسودة في هذا المتصفح فقط.
          </section>
          <div className="mode-control inline-mode" aria-label="عرض الواجهة">
            <button className={mode === "provider" ? "active" : ""} onClick={() => setMode("provider")}>وضع المزود</button>
            <button className={mode === "reviewer" ? "active" : ""} onClick={() => setMode("reviewer")}>وضع المراجع</button>
          </div>
      {mode === "provider" ? (
        <div className="workspace">
          <section className="form-panel">
            <div className="progress" aria-label={`الخطوة ${step + 1} من ${steps.length}`}>
              {steps.map((label, index) => (
                <button key={label} className={index === step ? "current" : index < step ? "done" : ""} onClick={() => index <= step && setStep(index)}>
                  <span>{index + 1}</span>{label}
                </button>
              ))}
            </div>

            {step === 0 && <ConsentStep draft={draft} setDraft={setDraft} />}
            {step === 1 && <BrandStep draft={draft} setDraft={setDraft} />}
            {step === 2 && <ServiceStep draft={draft} setDraft={setDraft} />}
            {step === 3 && <ReviewStep draft={draft} />}

            <div className="form-actions">
              <button className="quiet" onClick={clearDraft}>بدء مسودة جديدة</button>
              <div>
                {step > 0 && <button className="secondary" onClick={() => setStep(step - 1)}>السابق</button>}
                {step < steps.length - 1 ? (
                  <button className="primary" disabled={!canContinue} onClick={() => setStep(step + 1)}>حفظ ومتابعة</button>
                ) : (
                  <button className="primary" disabled={!draft.publicListing} onClick={saveDraft}>{saved ? "حُفظت المسودة" : "حفظ للمراجعة"}</button>
                )}
              </div>
            </div>
          </section>

          <aside className="guidance-panel">
            <p className="eyebrow">المساعد الإرشادي</p>
            <h2>نساعدك على ألا تفوت معلومة يحتاجها الضيف.</h2>
            <p>لن نضيف مميزات أو أرقامًا من عندنا. ستكون كل عبارة مسودة منك وقابلة للمراجعة.</p>
            <div className="prompt-stack">
              {guidance.map((prompt) => <article key={prompt}><span>سؤال مقترح</span><p>{prompt}</p></article>)}
              {!guidance.length && <article className="ready"><span>الملف متماسك</span><p>أكملت المعلومات الأساسية. راجع ما توافق على نشره ثم أرسله للمراجعة البشرية.</p></article>}
            </div>
            <div className="trust-note"><b>قاعدة الثقة</b><br />سيظهر للمراجع الفرق بين ما أفدت به وما تم التحقق منه.</div>
          </aside>
        </div>
      ) : <ReviewerPreview draft={draft} />}
        </>
      )}
    </main>
  );
}

function ConsentStep({ draft, setDraft }: { draft: Draft; setDraft: (value: Draft) => void }) {
  return <div className="step-content"><p className="eyebrow">01 — موافقة واضحة</p><h2>قبل أن نبدأ، ما الذي توافق عليه؟</h2><p className="lead">تُستخدم بياناتك لتجهيز ملف ومراجعته. لا يظهر شيء للعامة إلا ما توافق عليه لاحقًا.</p><label className="check-row"><input type="checkbox" checked={draft.dataProcessing} onChange={(event) => setDraft(updateField(draft, "dataProcessing", event.target.checked))} />أوافق على معالجة المعلومات اللازمة لإعداد الملف.</label><label className="check-row"><input type="checkbox" checked={draft.humanReview} onChange={(event) => setDraft(updateField(draft, "humanReview", event.target.checked))} />أوافق على أن يراجع الملف شخص مختص قبل نشره.</label><label className="check-row optional"><input type="checkbox" checked={draft.publicListing} onChange={(event) => setDraft(updateField(draft, "publicListing", event.target.checked))} />أرغب في إرسال الملف للمراجعة بهدف النشر العام عند اكتماله.</label></div>;
}

function BrandStep({ draft, setDraft }: { draft: Draft; setDraft: (value: Draft) => void }) {
  return <div className="step-content"><p className="eyebrow">02 — هوية العلامة</p><h2>من أنتم، وأين تقدمون خدمتكم؟</h2><div className="field-grid"><Field label="اسم العلامة الذي يراه الزائر" value={draft.brandName} onChange={(value) => setDraft(updateField(draft, "brandName", value))} placeholder="مثال: اسم علامتك" /><SelectField label="نوع المزود" value={draft.providerType} onChange={(value) => setDraft(updateField(draft, "providerType", value))} options={["مطعم أو تجربة طعام", "إقامة", "مرشد", "مركز ثقافي", "حرفي", "تجربة أو نشاط", "مؤسسة"]} /><Field label="المنطقة أو المدينة" value={draft.area} onChange={(value) => setDraft(updateField(draft, "area", value))} placeholder="المنطقة التي تريد إظهارها" /><SelectField label="قناة الاستفسار المفضلة" value={draft.contactChannel} onChange={(value) => setDraft(updateField(draft, "contactChannel", value))} options={["طلب تواصل من المنصة", "موقعكم الإلكتروني", "رابط حجز معتمد"]} /></div></div>;
}

function ServiceStep({ draft, setDraft }: { draft: Draft; setDraft: (value: Draft) => void }) {
  const toggleLanguage = (language: string) => setDraft(updateField(draft, "languages", draft.languages.includes(language) ? draft.languages.filter((item) => item !== language) : [...draft.languages, language]));
  return <div className="step-content"><p className="eyebrow">03 — الخدمة الأولى</p><h2>صف التجربة كما يعيشها الضيف.</h2><div className="field-grid"><Field label="فئة الخدمة أو التجربة" value={draft.serviceCategory} onChange={(value) => setDraft(updateField(draft, "serviceCategory", value))} placeholder="مثال: تجربة طعام محلية" /><div className="field"><span>لغات الاستقبال أو المعلومات</span><div className="chip-row">{["العربية", "English"].map((language) => <button type="button" key={language} className={draft.languages.includes(language) ? "chip selected" : "chip"} onClick={() => toggleLanguage(language)}>{language}</button>)}</div></div></div><label className="field full"><span>كيف تبدأ تجربة الضيف، وماذا يحدث حتى النهاية؟</span><textarea value={draft.guestJourney} onChange={(event) => setDraft(updateField(draft, "guestJourney", event.target.value))} placeholder="اكتب ما يحدث فعليًا، بما في ذلك أي حجز أو نقطة لقاء أو خطوة يحتاج الضيف معرفتها." rows={6} /><small>{draft.guestJourney.length}/1800 حرف</small></label><Field label="ملاحظة عن التوفر أو الحجز (اختيارية)" value={draft.availability} onChange={(value) => setDraft(updateField(draft, "availability", value))} placeholder="مثل: يستحسن الاستفسار قبل الزيارة" /></div>;
}

function ReviewStep({ draft }: { draft: Draft }) {
  return <div className="step-content"><p className="eyebrow">04 — ما الذي سيراجعه الإنسان؟</p><h2>راجع المسودة قبل إرسالها.</h2><div className="summary-card"><div><span>العلامة</span><b>{draft.brandName || "لم تكتب بعد"}</b></div><div><span>الفئة</span><b>{draft.serviceCategory || "لم تحدد بعد"}</b></div><div><span>المنطقة</span><b>{draft.area || "لم تحدد بعد"}</b></div><div><span>النشر العام</span><b>{draft.publicListing ? "موافقة مبدئية للمراجعة" : "لم تمنح موافقة نشر"}</b></div></div><article className="review-explainer"><b>ماذا يحدث بعد الحفظ؟</b><p>يرى المراجع بيانات الاتصال داخل مساحة خاصة، ويتحقق من ادعاءات الخدمة قبل ظهورها. لا يعني حفظ المسودة أن الملف أو أي ادعاء أصبح عامًا.</p></article></div>;
}

function ReviewerPreview({ draft }: { draft: Draft }) {
  const complete = Boolean(draft.brandName && draft.providerType && draft.area && draft.serviceCategory && draft.guestJourney.length >= 20);
  return <section className="reviewer-view"><div><p className="eyebrow">مساحة مراجعة منفصلة</p><h2>قرار النشر لا يختلط مع كتابة المزود.</h2><p className="lead">هذه معاينة للحد الأدنى الذي يراه المراجع. بيانات الاتصال لا تظهر في الملف العام.</p></div><div className="review-grid"><article><span>حالة الملف</span><strong>{complete ? "جاهز لمراجعة أولية" : "يحتاج استكمالًا"}</strong><p>{complete ? "المعلومات الأساسية موجودة؛ راجع الادعاءات قبل أي نشر." : "لا يمكن اتخاذ قرار قبل استكمال الحقول الأساسية."}</p></article><article><span>الملف العام المقترح</span><strong>{draft.brandName || "اسم العلامة"}</strong><p>{draft.serviceCategory || "الفئة غير محددة"} · {draft.area || "المنطقة غير محددة"}</p></article><article><span>الادعاءات</span><strong>لا توجد ادعاءات متحققة بعد</strong><p>أي وصول أو سلامة أو استدامة يوضع أولًا بحالة «أفاد به المزود».</p></article></div><div className="review-actions"><button className="secondary">طلب استكمال</button><button className="primary" disabled={!complete || !draft.publicListing}>اعتماد بعد التحقق</button></div></section>;
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="field"><span>{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <label className="field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}><option value="">اختر</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}
