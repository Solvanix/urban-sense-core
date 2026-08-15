import { useState } from "react";

type InterestDraft = {
  brandName: string;
  serviceType: string;
  area: string;
  contactName: string;
  contactChannel: string;
  shortDescription: string;
  reviewConsent: boolean;
};

const emptyInterest: InterestDraft = {
  brandName: "",
  serviceType: "",
  area: "",
  contactName: "",
  contactChannel: "",
  shortDescription: "",
  reviewConsent: false
};

export function ProviderInvitationPage({ onOpenOnboarding }: { onOpenOnboarding: () => void }) {
  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [interest, setInterest] = useState<InterestDraft>(emptyInterest);

  const valid = Boolean(
    interest.brandName.trim() &&
    interest.serviceType &&
    interest.area.trim() &&
    interest.contactName.trim() &&
    interest.contactChannel.trim() &&
    interest.shortDescription.trim().length >= 20 &&
    interest.reviewConsent
  );

  function update<K extends keyof InterestDraft>(key: K, value: InterestDraft[K]) {
    setInterest((current) => ({ ...current, [key]: value }));
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
              <p>في النواة الحالية، يحاكي هذا النموذج حالة «اهتمام مسجل» محليًا فقط. في النسخة التشغيلية سيصل الطلب إلى مراجع، ويُدعى المزود لاستكمال الملف فقط إذا كان ضمن نطاق التجربة.</p>
              <button className="secondary" onClick={() => { setSubmitted(false); setFormOpen(false); setInterest(emptyInterest); }}>إغلاق</button>
            </div>
          ) : (
            <>
              <div className="form-heading"><div><p className="eyebrow">تسجيل اهتمام</p><h2 id="interest-title">لنبدأ بأقل قدر من المعلومات اللازمة.</h2></div><button className="quiet" onClick={() => setFormOpen(false)}>إغلاق</button></div>
              <p className="lead">لا تطلب هذه الصفحة وثائق قانونية أو صورًا أو تفاصيل حساسة. نستخدم بياناتك فقط لمراجعة ملاءمة التجربة والتواصل معك.</p>
              <div className="field-grid">
                <InputField label="اسم العلامة" value={interest.brandName} onChange={(value) => update("brandName", value)} placeholder="الاسم الذي تستخدمه خدمتك" />
                <SelectField label="نوع الخدمة" value={interest.serviceType} onChange={(value) => update("serviceType", value)} options={["مطعم أو تجربة طعام", "إقامة", "مرشد", "مركز ثقافي", "حرفي", "تجربة أو نشاط", "مؤسسة"]} />
                <InputField label="المنطقة أو المدينة" value={interest.area} onChange={(value) => update("area", value)} placeholder="المنطقة التي تقدم فيها الخدمة" />
                <InputField label="اسم الشخص المسؤول" value={interest.contactName} onChange={(value) => update("contactName", value)} placeholder="لن يظهر للعامة" />
                <InputField label="قناة الاتصال المفضلة" value={interest.contactChannel} onChange={(value) => update("contactChannel", value)} placeholder="مثل بريد عمل أو رقم مخصص للتواصل" />
                <label className="field"><span>ماذا تقدم للضيف؟</span><textarea value={interest.shortDescription} onChange={(event) => update("shortDescription", event.target.value)} placeholder="صف التجربة أو الخدمة كما تحدث فعليًا، في جملتين أو أكثر." rows={4} /><small>{interest.shortDescription.length}/600 حرف</small></label>
              </div>
              <label className="check-row"><input type="checkbox" checked={interest.reviewConsent} onChange={(event) => update("reviewConsent", event.target.checked)} />أوافق على استخدام هذه المعلومات للتواصل حول مرحلة التجربة ومراجعة ملاءمة الملف. لا تعني هذه الموافقة نشر معلوماتي للعامة.</label>
              <div className="form-actions"><span className="microcopy">ستظهر معلومات النشر وموافقتها في مرحلة مستقلة لاحقًا.</span><button className="primary" disabled={!valid} onClick={() => setSubmitted(true)}>تسجيل الاهتمام</button></div>
            </>
          )}
        </section>
      )}
    </>
  );
}

function InputField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="field"><span>{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <label className="field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}><option value="">اختر</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}
