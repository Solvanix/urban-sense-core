import { useState } from "react";
import type { ProviderInterestInput, ProviderInterestStatusLookup, ProviderInterestStatusView, ProviderInterestSubmissionReceipt } from "../onboarding/contracts.js";

type InterestDraft = Omit<ProviderInterestInput, "providerType" | "reviewConsent"> & {
  providerType: ProviderInterestInput["providerType"] | "";
  reviewConsent: boolean;
};

const providerTypeOptions: Array<{ value: ProviderInterestInput["providerType"]; label: string }> = [
  { value: "restaurant", label: "مطعم أو تجربة طعام" },
  { value: "accommodation", label: "إقامة" },
  { value: "guide", label: "مرشد" },
  { value: "cultural_center", label: "مركز ثقافي" },
  { value: "artisan", label: "حرفي" },
  { value: "activity_operator", label: "تجربة أو نشاط" },
  { value: "institution", label: "مؤسسة" }
];

const emptyInterest: InterestDraft = {
  brandName: "",
  providerType: "",
  area: "",
  contactName: "",
  contactChannel: "",
  shortDescription: "",
  reviewConsent: false
};

export function ProviderInvitationPage({ onOpenOnboarding, onSubmitInterest, onLookupStatus }: { onOpenOnboarding: () => void; onSubmitInterest: (input: ProviderInterestInput) => Promise<ProviderInterestSubmissionReceipt>; onLookupStatus: (input: ProviderInterestStatusLookup) => Promise<ProviderInterestStatusView> }) {
  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [receipt, setReceipt] = useState<ProviderInterestSubmissionReceipt | null>(null);
  const [interest, setInterest] = useState<InterestDraft>(emptyInterest);

  const valid = Boolean(
    interest.brandName.trim() &&
    interest.providerType &&
    interest.area.trim() &&
    interest.contactName.trim() &&
    interest.contactChannel.trim() &&
    interest.shortDescription.trim().length >= 20 &&
    interest.reviewConsent
  );

  function update<K extends keyof InterestDraft>(key: K, value: InterestDraft[K]) {
    setInterest((current) => ({ ...current, [key]: value }));
  }

  async function submitInterest() {
    if (!valid || !interest.providerType) return;
    try {
      const submittedReceipt = await onSubmitInterest({ ...interest, providerType: interest.providerType, reviewConsent: true });
      setSubmitError("");
      setReceipt(submittedReceipt);
      setSubmitted(true);
    } catch (caught) {
      setSubmitError(caught instanceof Error ? caught.message : "تعذر إرسال طلب الاهتمام إلى الخدمة المستقلة. راجع الحقول وحاول مجددًا.");
    }
  }

  return (
    <>
      <section className="invitation-hero">
        <div className="hero-copy">
          <p className="eyebrow">دعوة للتجربة الأولى</p>
          <h2>خدمتك تستحق أن تُفهم قبل أن تُعرض.</h2>
          <p>نفتح تجربة محدودة لمزودي الخدمات والتجارب. نساعدك على بناء ملف عربي واضح، ثم يراجعه شخص مختص قبل أن يظهر أي شيء للعامة.</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => setFormOpen(true)}>أبدِ اهتمامك</button>
            <button className="secondary" onClick={onOpenOnboarding}>استكشف مسار الملف</button>
          </div>
          <p className="microcopy">تسجيل الاهتمام لا يعني القبول أو النشر أو إنشاء حجز. ولا نعرض وسيلة اتصالك للعامة تلقائيًا.</p>
        </div>
        <div className="hero-tiles" aria-label="مراحل التجربة">
          <article className="tile tile-large"><span>01</span><b>تعرّف</b><p>نراجع نوع الخدمة ونطاق التجربة.</p></article>
          <article className="tile tile-gold"><span>02</span><b>ابنِ الملف</b><p>تصف الخدمة بلغتك، من دون وعود زائفة.</p></article>
          <article className="tile tile-soft"><span>03</span><b>راجع وانشر</b><p>لا يظهر الملف قبل الموافقة والتحقق.</p></article>
        </div>
      </section>

      <section className="invitation-explainer">
        <article><span>لمن هذه الدعوة؟</span><p>للمطاعم والإقامات والمرشدين والمراكز الثقافية والحرفيين ومنظمي التجارب والمؤسسات التي تريد ملفًا واضحًا ومراجعًا.</p></article>
        <article><span>ما الذي نحتاجه بداية؟</span><p>اسم العلامة، نوع الخدمة، المنطقة، شخصًا مسؤولًا، ووصفًا قصيرًا لما يعيشه الضيف. التفاصيل الأعمق تأتي بعد الدعوة.</p></article>
        <article><span>ما الذي لا نفعله؟</span><p>لا ننشئ مزودين أو صورًا أو تقييمات وهمية، ولا ننشر أسعارًا أو توافرًا أو ميزات وصول قبل تحقق واضح.</p></article>
      </section>

      {formOpen && (
        <section className="interest-form" aria-labelledby="interest-title">
          {submitted ? (
            <div className="interest-success">
              <p className="eyebrow">وصل الاهتمام</p>
              <h2>شكرًا. هذه الخطوة ليست نشرًا عامًا.</h2>
              <p>أُرسل الطلب إلى مساحة مراجعة مستقلة، ولا يظهر للعامة. يُدعى المزود لاستكمال الملف فقط إذا كان ضمن نطاق التجربة وبعد قرار مسبب من مراجع مخوّل.</p>
              {receipt && <div className="decision-record"><b>مرجع المتابعة: {receipt.reference}</b><p>مفتاح المتابعة: <code>{receipt.accessCode}</code></p><p>احفظ المرجع والمفتاح الآن في مكان آمن. لا نحفظ المفتاح في المتصفح ولا يمكن استعادته لاحقًا.</p></div>}
              <button className="secondary" onClick={() => { setSubmitted(false); setFormOpen(false); setInterest(emptyInterest); setReceipt(null); }}>إغلاق</button>
            </div>
          ) : (
            <>
              <div className="form-heading"><div><p className="eyebrow">تسجيل اهتمام</p><h2 id="interest-title">لنبدأ بأقل قدر من المعلومات اللازمة.</h2></div><button className="quiet" onClick={() => setFormOpen(false)}>إغلاق</button></div>
              <p className="lead">لا تطلب هذه الصفحة وثائق قانونية أو صورًا أو تفاصيل حساسة. نستخدم بياناتك فقط لمراجعة ملاءمة التجربة والتواصل معك.</p>
              <div className="field-grid">
                <InputField label="اسم العلامة" value={interest.brandName} onChange={(value) => update("brandName", value)} placeholder="الاسم الذي تستخدمه خدمتك" />
                <label className="field"><span>نوع الخدمة</span><select value={interest.providerType} onChange={(event) => update("providerType", event.target.value as InterestDraft["providerType"])}><option value="">اختر</option>{providerTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
                <InputField label="المنطقة أو المدينة" value={interest.area} onChange={(value) => update("area", value)} placeholder="المنطقة التي تقدم فيها الخدمة" />
                <InputField label="اسم الشخص المسؤول" value={interest.contactName} onChange={(value) => update("contactName", value)} placeholder="لن يظهر للعامة" />
                <InputField label="قناة الاتصال المفضلة" value={interest.contactChannel} onChange={(value) => update("contactChannel", value)} placeholder="مثل بريد عمل أو رقم مخصص للتواصل" />
                <label className="field"><span>ماذا تقدم للضيف؟</span><textarea value={interest.shortDescription} onChange={(event) => update("shortDescription", event.target.value)} placeholder="صف التجربة أو الخدمة كما تحدث فعليًا، في جملتين أو أكثر." rows={4} /><small>{interest.shortDescription.length}/600 حرف</small></label>
              </div>
              <label className="check-row"><input type="checkbox" checked={interest.reviewConsent} onChange={(event) => update("reviewConsent", event.target.checked)} />أوافق على استخدام هذه المعلومات للتواصل حول مرحلة التجربة ومراجعة ملاءمة الملف. لا تعني هذه الموافقة نشر معلوماتي للعامة.</label>
              {submitError && <p className="form-error" role="alert">{submitError}</p>}
              <div className="form-actions"><span className="microcopy">ستظهر معلومات النشر وموافقتها في مرحلة مستقلة لاحقًا.</span><button className="primary" disabled={!valid} onClick={submitInterest}>تسجيل الاهتمام</button></div>
            </>
          )}
        </section>
      )}
      <InterestStatusLookup onLookupStatus={onLookupStatus} />
    </>
  );
}

function InterestStatusLookup({ onLookupStatus }: { onLookupStatus: (input: ProviderInterestStatusLookup) => Promise<ProviderInterestStatusView> }) {
  const [reference, setReference] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [result, setResult] = useState<ProviderInterestStatusView | null>(null);
  const [error, setError] = useState("");

  async function lookup() {
    try {
      const status = await onLookupStatus({ reference: reference.trim().toUpperCase(), accessCode: accessCode.trim() });
      setResult(status);
      setError("");
    } catch {
      setResult(null);
      setError("تعذر العثور على طلب بهذه بيانات المتابعة. راجع المرجع والمفتاح.");
    }
  }

  return <section className="interest-form" aria-labelledby="status-lookup-title">
    <div className="form-heading"><div><p className="eyebrow">متابعة خاصة</p><h2 id="status-lookup-title">تحقق من حالة طلبك.</h2></div></div>
    <p className="lead">لا تحتاج إلى حساب عام. أدخل مرجع الطلب ومفتاح المتابعة اللذين ظهرا لك عند الإرسال. لا يعرض هذا الاستعلام بيانات الاتصال أو اسم المراجع.</p>
    <div className="field-grid"><InputField label="مرجع الطلب" value={reference} onChange={setReference} placeholder="SX-XXXXXXXXXX" /><InputField label="مفتاح المتابعة" value={accessCode} onChange={setAccessCode} placeholder="المفتاح الذي ظهر مرة واحدة" /></div>
    {error && <p className="form-error" role="alert">{error}</p>}
    {result && <div className="decision-record"><b>الحالة: {result.status === "interest_submitted" ? "بانتظار المراجعة" : result.status === "invited_to_onboard" ? "دُعيت لاستكمال الملف" : "ليست ضمن التجربة الحالية"}</b>{result.decision && <><p>{result.decision.reason}</p><p>آخر قرار: {new Date(result.decision.decidedAt).toLocaleString("ar")}</p></>}</div>}
    <div className="form-actions"><span className="microcopy">لا تعرض هذه الشاشة ملفات مزودين أو بيانات أعمال أو قرارات داخلية غير موجهة لصاحب الطلب.</span><button className="primary" disabled={!reference.trim() || !accessCode.trim()} onClick={lookup}>تحقق من الحالة</button></div>
  </section>;
}

function InputField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="field"><span>{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}
