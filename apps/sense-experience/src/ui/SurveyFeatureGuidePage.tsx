import { useMemo, useState } from "react";

type Audience = "provider" | "visitor" | "reviewer";

const audienceLabels: Record<Audience, string> = {
  provider: "أنا مزود خدمة",
  visitor: "أنا زائر",
  reviewer: "أنا مراجع"
};

const modules = [
  {
    index: "01",
    source: "القطاع، الخدمات، البلدية، والتراث الطبيعي أو الثقافي",
    title: "بطاقة المكان، لا سيرة ذاتية للشركة",
    lead: "نحوّل سؤال «ماذا تقدم وأين؟» إلى بطاقة تساعد الضيف على فهم التجربة قبل أن يقرر التواصل.",
    provider: "تختار قطاعك وخدماتك ومنطقتك كما هي، ثم تكتب وصفًا عمليًا لما يستطيع الضيف أن يعيشه.",
    visitor: "يرى الزائر نوع التجربة والمنطقة العامة وقصة قصيرة مفهومة، لا رقم هاتف أو عنوانًا حساسًا أو ادعاءً غير مثبت.",
    reviewer: "يفصل المراجع بين هوية المكان وبين أي ادعاء عن التراث؛ لا تصبح كلمة «تراث» شارة تلقائية.",
    feature: "بطاقة التجربة: فئة واضحة · خدمة محددة · منطقة عامة · قصة موجزة"
  },
  {
    index: "02",
    source: "الموسمية، الحجز، الموقع الإلكتروني، قيود الوصول، ولغات/قنوات التواصل",
    title: "قبل أن يصل الضيف، يعرف ما يحتاجه",
    lead: "لا نعد بحجز حي أو توافر لحظي. نبني بدلًا من ذلك طبقة «قبل الزيارة» التي تقلل المفاجآت.",
    provider: "تقول فقط ما تعرفه: هل تحتاج التجربة استفسارًا مسبقًا؟ هل هي موسمية؟ وما القناة التي وافقت على إظهارها؟",
    visitor: "يرى ملاحظة توافر أو طريقة استفسار ورابطًا اختار المزود نشره؛ لا يدّعي الموقع أن موعدًا صار مؤكدًا.",
    reviewer: "يفحص المراجع أن الرابط يخص المزود، وأن معلومة الوصول مفيدة ولا تكشف تفاصيل حساسة أو حكمًا غير موثق.",
    feature: "مخطط ما قبل الزيارة: طريقة الاستفسار · ملاحظة التوفر · توقعات الوصول"
  },
  {
    index: "03",
    source: "الجودة، رضا العملاء، الاستدامة، الشهادات، العضويات، والممارسات الابتكارية",
    title: "من قولٍ ذاتي إلى معلومة يمكن الوثوق بها",
    lead: "نص السؤال لا يتحول إلى علامة خضراء. كل ما يطلب المزود عرضه يمر بسلسلة واضحة من القول إلى الدليل إلى المراجعة.",
    provider: "تسجل ممارسة أو شهادة بصفتها معلومة منك، وتضيف الدليل فقط عندما يكون مناسبًا. لا نطلب اختلاق شهادات أو تقييمات.",
    visitor: "لا يرى إلا ما تحقق منه مراجع ووافق المزود على نشره. وما لم يتحقق لا يُستبدل بعبارة تجميلية.",
    reviewer: "يرى المراجع فرقًا واضحًا بين «قال المزود» و«تم التحقق»، ويعيد طلب الاستكمال بدل أن يمنح اعتمادًا مبهمًا.",
    feature: "سجل الثقة: معلومة مزود → دليل اختياري → مراجعة بشرية → ادعاء متحقق"
  },
  {
    index: "04",
    source: "الأولويات، العوائق، الرقمنة، العملاء، الشبكات، المعارض، والتشبيك",
    title: "التقدم لا يتحول إلى ترتيب للمزودين",
    lead: "هذه الأسئلة لا تصنع بطاقة عامة؛ بل تفتح مسار تمكين خاصًا يساعد المزود على معرفة الخطوة التالية المناسبة له.",
    provider: "تحدد ما تريد تطويره وما يعوقك: وصول للسوق، رقمنة، تدريب، استدامة، أو تعاون. تبقى الإجابات ضمن مساحة الدعم.",
    visitor: "لا يرى المبيعات أو حجم العملاء أو المتابعين أو العوائق. يرى الخدمة نفسها وما جرى التحقق منه عنها فقط.",
    reviewer: "يستخدم المراجع هذه الإشارات لتوجيه طلب استكمال أو فرصة تعلم، لا لرفض مزود أو ترتيبه بحسب موارده.",
    feature: "بوصلة الجاهزية: هدف نمو · عائق معلن · خطوة تمكين خاصة · مراجعة تقدم"
  }
] as const;

export function SurveyFeatureGuidePage({ onNavigate }: { onNavigate: (href: string) => void }) {
  const [audience, setAudience] = useState<Audience>("provider");
  const activeLabel = audienceLabels[audience];
  const summary = useMemo(() => {
    if (audience === "provider") return "ترى ما ستكتبه، وما سيبقى خاصًا، وما يحتاج فقط إلى وصف صادق أو دليل عند وجوده.";
    if (audience === "visitor") return "ترى لماذا لا نعرض كل ما يسأل عنه نموذج الأعمال: الدليل العام يحمي الخصوصية ويقدم المعلومة المفيدة فقط.";
    return "ترى أين ينتهي دور النظام ويبدأ القرار البشري: لا نشر ولا اعتماد ولا شارة من دون سبب ومراجعة.";
  }, [audience]);

  return (
    <>
      <style>{`
        .survey-guide-hero{display:grid;grid-template-columns:1.08fr .92fr;gap:32px;align-items:end;padding:clamp(30px,6vw,76px);border-radius:30px;background:linear-gradient(135deg,#163f3c,#1f665b 62%,#d3a94c);color:#f8fbf8}
        .survey-guide-hero h1{max-width:700px;margin:10px 0 18px;font-size:clamp(42px,5.3vw,72px);line-height:1.06;letter-spacing:-.055em}.survey-guide-hero h1 em{color:#ffe19b;font-style:normal}.survey-guide-hero>div>p:not(.eyebrow){max-width:690px;margin:0;color:#d8ebe4;font-size:16px;line-height:2}
        .survey-source-chip{display:inline-flex;margin-top:22px;padding:7px 11px;border:1px solid rgba(255,255,255,.26);border-radius:999px;color:#ecf3ef;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.04em}.survey-guide-promise{padding:28px;border:1px solid rgba(20,63,60,.22);background:rgba(250,250,243,.93);color:#173f3c}.survey-guide-promise span{display:block;color:#b68425;font-family:'DM Mono',monospace;font-size:11px;font-weight:800;letter-spacing:.1em}.survey-guide-promise b{display:block;margin-top:52px;font-size:25px;line-height:1.28}.survey-guide-promise p{margin:12px 0 0;color:#5a726b;font-size:14px;line-height:1.9}
        .survey-audience{display:flex;flex-wrap:wrap;gap:8px;margin:22px 0 20px}.survey-audience button{padding:11px 15px;border:1px solid rgba(19,62,57,.22);border-radius:999px;background:#fffdf6;color:#35534c;font:inherit;font-size:13px;cursor:pointer}.survey-audience button.active{border-color:#174943;background:#174943;color:#fff}.survey-audience-note{margin:0 0 28px;padding:16px 18px;border-right:3px solid #d6a33e;background:#f4f0e5;color:#526e66;line-height:1.9;font-size:14px}
        .survey-flow{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:46px}.survey-flow article{min-height:188px;padding:20px;background:#f6f4eb;border-top:3px solid #d7a741}.survey-flow span{display:block;color:#b68425;font-family:'DM Mono',monospace;font-size:11px;font-weight:800}.survey-flow h2{margin:37px 0 8px;color:#173f3c;font-size:20px;line-height:1.3}.survey-flow p{margin:0;color:#60756e;font-size:12px;line-height:1.8}
        .survey-modules{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-bottom:52px}.survey-module{display:flex;min-height:460px;flex-direction:column;padding:28px;border:1px solid rgba(20,63,61,.16);border-radius:18px;background:#fffdf8}.survey-module:nth-child(2){background:#f4f0e5}.survey-module:nth-child(3){background:#173f3c;color:#eff7f2}.survey-module:nth-child(4){background:#e7c36e;color:#3e310d}.survey-module .module-number{color:#bd8424;font-family:'DM Mono',monospace;font-size:11px;font-weight:800;letter-spacing:.13em}.survey-module:nth-child(3) .module-number{color:#edcb75}.survey-module h2{margin:45px 0 10px;font-size:31px;line-height:1.17;letter-spacing:-.03em}.survey-module .module-lead{margin:0;color:#5b726b;font-size:14px;line-height:1.9}.survey-module:nth-child(3) .module-lead{color:#c9ded7}.survey-module:nth-child(4) .module-lead{color:#66501c}.survey-module .module-source{margin-top:18px;color:#8a7140;font-size:11px;line-height:1.7}.survey-module:nth-child(3) .module-source{color:#d8bd7b}.survey-module:nth-child(4) .module-source{color:#6f571e}
        .survey-active{margin-top:auto;padding-top:22px;border-top:1px solid rgba(20,63,61,.18)}.survey-module:nth-child(3) .survey-active{border-color:rgba(240,255,247,.22)}.survey-module:nth-child(4) .survey-active{border-color:rgba(62,49,13,.23)}.survey-active span{display:block;color:#b68425;font-family:'DM Mono',monospace;font-size:10px;font-weight:800;letter-spacing:.1em}.survey-module:nth-child(3) .survey-active span{color:#edcb75}.survey-module:nth-child(4) .survey-active span{color:#735b1f}.survey-active p{margin:8px 0 0;font-size:14px;line-height:1.9}.survey-module:not(:nth-child(3)):not(:nth-child(4)) .survey-active p{color:#234740}.survey-module:nth-child(3) .survey-active p{color:#edf7f2}.survey-module:nth-child(4) .survey-active p{color:#3e310d}
        .survey-guide-closing{display:grid;grid-template-columns:.9fr 1.1fr;gap:36px;align-items:start;margin:10px 0 66px;padding:38px 0;border-top:1px solid rgba(20,63,61,.2);border-bottom:1px solid rgba(20,63,61,.2)}.survey-guide-closing h2{margin:9px 0 0;color:#173f3c;font-size:32px;line-height:1.25}.survey-guide-closing p:last-child{margin:0;color:#567068;font-size:14px;line-height:2}.survey-guide-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:20px}
        @media(max-width:900px){.survey-guide-hero,.survey-guide-closing{grid-template-columns:1fr}.survey-guide-promise{max-width:580px}.survey-flow{grid-template-columns:1fr 1fr}.survey-modules{grid-template-columns:1fr}.survey-module{min-height:0}}@media(max-width:560px){.survey-guide-hero{padding:33px 22px}.survey-guide-hero h1{font-size:47px}.survey-flow{grid-template-columns:1fr}.survey-flow article{min-height:0}.survey-flow h2{margin-top:25px}.survey-modules{gap:12px}.survey-module{padding:23px}.survey-module h2{margin-top:32px;font-size:28px}}
      `}</style>
      <section className="survey-guide-hero">
        <div>
          <p className="eyebrow">من السؤال إلى التجربة</p>
          <h1>السؤال الجيد لا يصبح <em>خانةً</em> فقط.</h1>
          <p>استخدمنا محاور استبانة مزودي السياحة لنصمم دليلًا يوضح للمزود ماذا يقدّم، وللزائر ماذا يمكن أن يثق به، وللمراجع أين يحتاج القرار إلى دليل. لا توجد في هذه الصفحة أسماء مزودين أو بيانات أعمال أو حجوزات حقيقية.</p>
          <span className="survey-source-chip">SOURCE-BOUND · CRS-001 · SENSE EXPERIENCE</span>
        </div>
        <aside className="survey-guide-promise"><span>قاعدة التصميم</span><b>نعرض ما يحتاجه الضيف، ونحمي ما يحتاجه العمل.</b><p>لا تتحول المبيعات أو العملاء أو المتابعون إلى ترتيب. ولا تتحول الاستدامة أو الشهادة أو التراث إلى شارة قبل أن يراجعها إنسان.</p></aside>
      </section>

      <section aria-label="اختر منظورك في الدليل">
        <div className="survey-audience" role="tablist" aria-label="منظور الدليل">
          {(Object.keys(audienceLabels) as Audience[]).map((key) => <button key={key} type="button" role="tab" aria-selected={audience === key} className={audience === key ? "active" : ""} onClick={() => setAudience(key)}>{audienceLabels[key]}</button>)}
        </div>
        <p className="survey-audience-note"><b>{activeLabel}:</b> {summary}</p>
      </section>

      <section className="survey-flow" aria-label="سلسلة تحويل المعلومة إلى قيمة">
        <article><span>01</span><h2>قل ما تعرفه</h2><p>يبدأ المزود بمعلومة صادقة عن الخدمة والمكان، لا بقالب ترويجي.</p></article>
        <article><span>02</span><h2>اختر ما ينشر</h2><p>بيانات الاتصال والتشخيص تبقى خاصة؛ يحدد المزود ما يمكن أن يراه الضيف.</p></article>
        <article><span>03</span><h2>أضف دليلًا عند الحاجة</h2><p>الادعاء القابل للثقة يطلب مرجعًا أو تفسيرًا، لا لغة تسويقية فقط.</p></article>
        <article><span>04</span><h2>إنسان يراجع</h2><p>المراجع يطلب استكمالًا أو يتحقق؛ لا يصبح الإدخال نشرًا أو اعتمادًا تلقائيًا.</p></article>
      </section>

      <section className="survey-modules" aria-label="مزايا مستخرجة من الاستبانة">
        {modules.map((module) => <article className="survey-module" key={module.index}>
          <span className="module-number">{module.index} · FEATURE LENS</span>
          <h2>{module.title}</h2>
          <p className="module-lead">{module.lead}</p>
          <p className="module-source">محاور المصدر: {module.source}</p>
          <div className="survey-active"><span>{activeLabel}</span><p>{module[audience]}</p></div>
          <div className="survey-active"><span>الميزة التي نبنيها</span><p>{module.feature}</p></div>
        </article>)}
      </section>

      <section className="survey-guide-closing">
        <div><p className="eyebrow">ليست استبانة ثانية</p><h2>هذا دليل قرار قبل أن يكون نموذجًا.</h2></div>
        <div><p>عندما يفتح انضمام المزودين تشغيلًا مستقلًا، تظهر هذه العدسات على شكل خطوات قصيرة لا حقلًا طويلًا واحدًا: بطاقة التجربة، قبل الزيارة، ما يحتاج دليلًا، وبوصلة تمكين خاصة. أما الدليل العام فلا يستقبل إلا ما راجعه المزود والمراجع معًا.</p><div className="survey-guide-actions"><button className="primary tourism-action" onClick={() => onNavigate("/انضم")}>شاهد مسار المزود</button><button className="secondary tourism-action" onClick={() => onNavigate("/للشركاء")}>كيف نحمي الثقة؟</button></div></div>
      </section>
    </>
  );
}
