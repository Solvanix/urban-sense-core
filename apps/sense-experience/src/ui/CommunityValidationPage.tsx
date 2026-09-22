import { useState, type FormEvent } from "react";

const responseOptions = [
  { id: "stories", label: "قصص محلية موثوقة", detail: "أريد فهم المكان من أصحابه لا من قائمة عامة." },
  { id: "routes", label: "مسارات واضحة", detail: "أحتاج وقتًا وطريقة وصول ونقطة بداية مفهومة." },
  { id: "hosts", label: "تجارب من أصحابها", detail: "أريد معرفة من يقود التجربة وما الذي سيحدث." },
  { id: "care", label: "زيارة تحترم المكان", detail: "أهم ما عندي أن أعرف كيف أزور دون إزعاج أو استهلاك." },
] as const;

const responseKey = "sense-community-pulse-v1";

export function CommunityValidationPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  const [selected, setSelected] = useState<string>(() => localStorage.getItem(responseKey) || "");
  const [submitted, setSubmitted] = useState(false);

  function submitResponse(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    localStorage.setItem(responseKey, selected);
    setSubmitted(true);
  }

  return (
    <main className="sense-community-page" dir="rtl">
      <section className="sense-community-hero">
        <div>
          <span className="sense-section-label">SENSE / نختبر معًا</span>
          <h1>قبل أن نبني<br /><em>نسأل المكان.</em></h1>
          <p>نريد أن نعرف ما الذي يحتاجه الزائر وأصحاب التجارب فعلًا قبل توسيع المنصة. هذه نسخة أولية من أسئلة التحقق، وليست استبيانًا رسميًا أو نتيجة بحث مكتملة.</p>
          <div className="sense-hero-actions">
            <button className="sense-primary" onClick={() => document.getElementById("community-pulse")?.scrollIntoView({ behavior: "smooth" })}>شارك سؤالًا واحدًا <span>↓</span></button>
            <button className="sense-text-button" onClick={() => onNavigate("/رؤية-مسؤولة")}>كيف نحمي البيانات؟ <span>↗</span></button>
          </div>
        </div>
        <div className="sense-community-signal"><span>01</span><strong>سؤال صغير</strong><p>لا نطلب اسمًا أو هاتفًا أو هوية. نختبر الأولوية فقط.</p></div>
      </section>

      <section className="sense-community-grid" id="community-pulse">
        <form className="sense-community-form" onSubmit={submitResponse}>
          <span className="sense-section-label">نبضة المجتمع</span>
          <h2>ما الذي تحتاجه أولًا؟</h2>
          <p>اختر إجابة واحدة. في هذه النسخة التجريبية تُحفظ الإجابة على جهازك فقط ولا تُرسل إلى خادم.</p>
          <div className="sense-community-options">
            {responseOptions.map((option) => (
              <label key={option.id} className={selected === option.id ? "selected" : ""}>
                <input type="radio" name="priority" value={option.id} checked={selected === option.id} onChange={() => { setSelected(option.id); setSubmitted(false); }} />
                <span><strong>{option.label}</strong><small>{option.detail}</small></span>
              </label>
            ))}
          </div>
          <button className="sense-primary" type="submit" disabled={!selected}>{submitted ? "تم حفظ النموذج المحلي ✓" : "احفظ إجابتي التجريبية ↗"}</button>
          {submitted && <div className="sense-form-success"><strong>شكرًا. هذه ليست موافقة نشر أو تسجيلًا في رحلة.</strong><p>عندما نطلق الاستبيان الميداني، سنطلب موافقة واضحة وننشر النتائج بصورة مجمعة.</p></div>}
        </form>

        <aside className="sense-community-aside">
          <span className="sense-section-label">شراكة محلية</span>
          <h2>البلدية شريك وصول، لا مالك للأصوات.</h2>
          <p>نطلب من البلدية أو الجهة المحلية المساعدة في نشر الاستبيان والوصول إلى أصحاب التجارب والتحقق من المعلومات العامة، دون تسليمها بيانات المشاركين أو السماح بتعديل النتائج.</p>
          <div className="sense-community-checklist"><div><span>01</span><strong>استبيان قصير</strong><p>5–8 دقائق، بلا كلمات مرور أو معلومات مالية.</p></div><div><span>02</span><strong>أصوات متعددة</strong><p>سكان، زوار، أصحاب تجارب، وشباب محليون.</p></div><div><span>03</span><strong>نتيجة قابلة للمراجعة</strong><p>نعلن ما عرفناه وما بقي افتراضًا.</p></div></div>
          <button className="sense-secondary" onClick={() => onNavigate("/للشركاء")}>افتح مسار الشراكة المحلية ←</button>
        </aside>
      </section>

      <section className="sense-community-impact"><span className="sense-section-label">من الفكرة إلى الاختبار</span><h2>لا نعد بأثر قبل أن<br /><em>نقيسه مع الناس.</em></h2><div className="sense-community-impact-grid"><div><strong>01</strong><h3>نحدد سؤالًا</h3><p>ما الذي يجعل تجربة محلية قابلة للاكتشاف ومحترمة؟</p></div><div><strong>02</strong><h3>نستمع بتنوع</h3><p>لا نمثل غزة والضفة والداخل والشتات بعينة واحدة.</p></div><div><strong>03</strong><h3>نختبر مسارًا</h3><p>نبدأ بمنطقة وتجربة واحدة، ثم نقرر إن كان التوسع منطقيًا.</p></div></div></section>
    </main>
  );
}

export default CommunityValidationPage;
