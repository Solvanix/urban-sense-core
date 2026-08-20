type PublicPage = "home" | "discover" | "partners" | "vision" | "readiness";

export function getPublicPage(pathname: string): PublicPage {
  const decodedPath = decodeURIComponent(pathname);
  if (decodedPath === "/اكتشف" || decodedPath === "/discover") return "discover";
  if (decodedPath === "/للشركاء" || decodedPath === "/partners") return "partners";
  if (decodedPath === "/رؤية-مسؤولة" || decodedPath === "/responsible-vision") return "vision";
  if (decodedPath === "/جاهزية-المزود" || decodedPath === "/provider-readiness") return "readiness";
  return "home";
}

const publicLinks = [
  { href: "/", label: "البوابة" },
  { href: "/اكتشف", label: "اكتشف" },
  { href: "/للشركاء", label: "الثقة والشراكة" },
  { href: "/رؤية-مسؤولة", label: "الرؤية المسؤولة" },
  { href: "/جاهزية-المزود", label: "مسار المزود" }
];

export function TourismPublicSite({
  pathname,
  onNavigate
}: {
  pathname: string;
  onNavigate: (href: string) => void;
}) {
  const page = getPublicPage(pathname);

  return (
    <main className="tourism-site" dir="rtl">
      <header className="tourism-nav">
        <button className="tourism-brand" onClick={() => onNavigate("/")} aria-label="العودة إلى بوابة SENSE Experience">
          <span className="tourism-brand-mark">س</span>
          <span><b>SENSE</b><small>EXPERIENCE</small></span>
        </button>
        <nav aria-label="التنقل الرئيسي">
          {publicLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={(getPublicPage(link.href) === page && link.href !== "/انضم") ? "active" : ""}
              onClick={(event) => { event.preventDefault(); onNavigate(link.href); }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      {page === "home" ? <GatewayPage onNavigate={onNavigate} /> : page === "discover" ? <DiscoverPage onNavigate={onNavigate} /> : page === "partners" ? <PartnerPage onNavigate={onNavigate} /> : page === "vision" ? <ResponsibleVisionPage onNavigate={onNavigate} /> : <ProviderReadinessPage onNavigate={onNavigate} />}

      <footer className="tourism-footer">
        <div><span className="eyebrow">SENSE EXPERIENCE</span><p>طبقة تعريف وثقة للمكان، تُبنى مع مزودي الخدمة لا بدلًا عنهم.</p></div>
        <p>هذه معاينة للواجهة العامة. لا تحتوي مزودين منشورين أو حجزًا أو متجرًا تشغيليًا حتى الآن.</p>
      </footer>
    </main>
  );
}

function GatewayPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <>
      <section className="gateway-hero">
        <div className="gateway-copy">
          <p className="eyebrow">مكان · مسار · أثر</p>
          <h1>لا نعرض المكان قبل أن نفهم <em>قصته.</em></h1>
          <p>بوابة عربية هادئة لتجارب فلسطين المحلية: تساعد الزائر على الوصول إلى سياق المكان، وتساعد المزود على تقديم خدمته بلغته وبصورة يمكن مراجعتها.</p>
          <div className="gateway-actions">
            <button className="primary tourism-action" onClick={() => onNavigate("/اكتشف")}>شاهد تصور الدليل</button>
            <button className="secondary tourism-action" onClick={() => onNavigate("/جاهزية-المزود")}>أنا مزود خدمة</button>
          </div>
          <p className="status-line"><span />الواجهة العامة قيد التكوين — لا توجد قوائم أو حجوزات منشورة بعد.</p>
        </div>
        <div className="place-collage" aria-label="تكوين بصري مفاهيمي يعبر عن المكان والحرفة والطريق">
          <article className="collage-card collage-warm"><small>من المكان</small><b>مساحة للفن<br />والحكاية</b><i /></article>
          <article className="collage-card collage-stone"><small>من المسار</small><b>تفاصيل تقود<br />إلى تجربة</b><i /></article>
          <article className="collage-card collage-teal"><small>من الأثر</small><b>مهارة تتصل<br />بالسوق</b><i /></article>
          <div className="collage-stamp">2026<br /><span>IN THE MAKING</span></div>
        </div>
      </section>

      <section className="gateway-principles" aria-label="ما الذي يجعل التجربة مختلفة">
        <article><span>01</span><h2>لا قوائم فارغة</h2><p>لا نملأ الدليل بأسماء أو تقييمات مصطنعة. يبدأ كل ملف من صاحب الخدمة ثم يمر بمراجعة واضحة.</p></article>
        <article><span>02</span><h2>الضيف أولًا</h2><p>نرتب المعلومات التي يحتاجها الزائر فعلًا: ماذا سيحدث، كيف يصل، ومن يتواصل معه قبل أن يقرر.</p></article>
        <article><span>03</span><h2>المكان ليس منتجًا وحسب</h2><p>نصمم مساحة يمكن أن تربط الحرفة والتعلم والثقافة والخدمات المحلية، من دون أن تذيب هوية أصحابها.</p></article>
      </section>

      <section className="gateway-bridge">
        <div><p className="eyebrow">من التجربة إلى الفرصة</p><h2>للجهة المحلية هويتها. ولـSense دور في إظهارها لا احتكارها.</h2></div>
        <p>ضمن الرؤية الأوسع، يمكن للدليل السياحي أن يعرّف الزائر بالمكان، بينما يفتح المتجر العام — عند بنائه — مسارًا منفصلًا للمنتجات والمشاريع. ويظل كل جزء مستقلًا في البيانات والصلاحيات وقرار النشر.</p>
      </section>
    </>
  );
}

function DiscoverPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  const lenses = [
    { number: "A", title: "فن وحرفة", body: "مسارات للحرف والتجارب التي تشرح كيف يصنع المكان قيمته، لا مجرد ما يبيعه." },
    { number: "B", title: "طعام وذاكرة", body: "مساحة مستقبليّة لخدمات الطعام والتجارب المحلية بعد التحقق من العرض ومعلومات الوصول." },
    { number: "C", title: "طريق وإقامة", body: "معلومات تخطط للرحلة بهدوء: نقطة البداية، التواصل، وما يحتاج الزائر معرفته قبل الوصول." },
    { number: "D", title: "مؤسسات ومبادرات", body: "جهات ثقافية ومجتمعية لها حضور وخدمة أو نشاط واضح، لا مجرد شعار في قائمة." }
  ];

  return (
    <>
      <section className="discover-intro">
        <div><p className="eyebrow">تصور الدليل</p><h1>بدل أن تبدأ من أسماء كثيرة، ابدأ بما تريد أن <em>تعيشه.</em></h1></div>
        <p>هذه ليست نتائج بحث حية ولا توصيات لمزودين؛ إنها بنية صفحة الاكتشاف التي ستستقبل ملفات موثقة بعد فتح برنامج المزودين.</p>
      </section>
      <section className="discovery-board" aria-label="تصنيفات الدليل المستقبلية">
        {lenses.map((lens, index) => <article key={lens.number} className={`lens-card lens-${index + 1}`}><span>{lens.number}</span><h2>{lens.title}</h2><p>{lens.body}</p><button onClick={() => onNavigate("/جاهزية-المزود")}>اعرف مسار الجاهزية</button></article>)}
      </section>
      <section className="empty-discovery">
        <div className="empty-map" aria-hidden="true"><span>مناطق وتجارب<br />تظهر بعد التحقق</span></div>
        <div><p className="eyebrow">قائمة الانتظار المعلنة</p><h2>الدليل لا يزال يتلقى ملفات، لذلك لا نخفي هذه الحقيقة خلف بطاقات مزيفة.</h2><p>يمكن لمزود خدمة أو جهة ثقافية أن يتعرف على متطلبات الجاهزية؛ وعند تشغيل الخدمة المستقلة، تمر الملفات بمراجعة مستقلة وموافقة قبل أي ظهور عام.</p><button className="primary tourism-action" onClick={() => onNavigate("/جاهزية-المزود")}>اعرف قبل أن تبدأ</button></div>
      </section>
    </>
  );
}

function PartnerPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <>
      <section className="partner-hero">
        <p className="eyebrow">قبل الظهور العام</p>
        <h1>الثقة ليست شارة. إنها <em>مسار عمل.</em></h1>
        <p>صممنا الانضمام ليبدأ ببيانات قليلة، ثم بموافقة واضحة ومراجعة بشرية مستقلة قبل أي ظهور عام. لا تتحول الرغبة في الانضمام إلى نشر تلقائي.</p>
      </section>
      <section className="trust-grid">
        <article><span>01</span><h2>الجهة تقول ما تقدمه</h2><p>يُكتب الملف من منظور الخدمة الفعلية، وليس من قالب تسويقي يضيف وعودًا من عنده.</p></article>
        <article><span>02</span><h2>مراجع مستقل يقرر</h2><p>تُفصل هوية المراجع وصلاحياته عن بيانات Urban‑Sense وعن أي ترويسات يرسلها المتصفح.</p></article>
        <article><span>03</span><h2>النشر موافقة منفصلة</h2><p>بيانات الاتصال والوصف لا تصبح عامة بمجرد التسجيل؛ للنشر قرار وموافقة منفصلان.</p></article>
        <article><span>04</span><h2>التوسع لا يسبق الأمان</h2><p>الحجز والدفع والتقييمات والمتجر ليست مفتوحة الآن، ولن تُضاف قبل وجود البيانات والحوكمة المناسبة.</p></article>
      </section>
      <section className="partner-callout"><div><p className="eyebrow">للمزودين والجهات</p><h2>إن كانت خدمتك حقيقية، نريد أن نسمعها كما هي.</h2></div><button className="primary tourism-action" onClick={() => onNavigate("/جاهزية-المزود")}>اعرف شروط الجاهزية</button></section>
    </>
  );
}

function ProviderReadinessPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  const steps = [
    { number: "01", title: "حدد دورك الحقيقي", body: "هل تقدم تجربة أو حرفة أو ضيافة أو خدمة ثقافية؟ نبدأ من ما تقدمه فعلًا، لا من وصف تسويقي جاهز." },
    { number: "02", title: "أكمل بطاقات الجاهزية", body: "عرض الخدمة، ما يتوقعه الزائر، أساسيات الوصول والسلامة، وموافقة مستقلة على التواصل." },
    { number: "03", title: "مراجعة بشرية مستقلة", body: "لا تنتج الإجابات ملفًا عامًا تلقائيًا. المراجع المخوّل يطلب إيضاحًا أو يقرر ملاءمة التجربة المحدودة." },
    { number: "04", title: "إطلاق مقيد ومراجع", body: "أي ظهور لاحق يحتاج قرار نشر مستقل. الحجز والدفع والتقييمات والمتجر ليست جزءًا من هذه المرحلة." }
  ];

  return <>
    <style>{`.readiness-hero{padding:clamp(32px,7vw,88px);border-radius:30px;background:linear-gradient(135deg,#143f3d,#1f665b 62%,#d5a94d);color:#f7fbf8}.readiness-hero h1{max-width:760px;margin:10px 0 18px;font-size:clamp(38px,5vw,68px);line-height:1.1;letter-spacing:-.05em}.readiness-hero h1 em{color:#ffe29a;font-style:normal}.readiness-hero p:not(.eyebrow){max-width:700px;margin:0;color:#d6ebe3;font-size:16px;line-height:2}.readiness-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:18px 0 44px}.readiness-step{min-height:290px;padding:25px;border:1px solid rgba(20,63,61,.14);border-radius:18px;background:#f7f5ed}.readiness-step span{display:block;color:#b68425;font-family:'DM Mono',monospace;font-weight:800}.readiness-step h2{margin:50px 0 9px;color:#173f3c;font-size:25px;line-height:1.25}.readiness-step p{margin:0;color:#5c726a;font-size:13px;line-height:1.9}.readiness-boundary{display:grid;grid-template-columns:.95fr 1.05fr;gap:34px;align-items:start;margin-bottom:66px;padding:36px;border-top:1px solid rgba(20,63,61,.18);border-bottom:1px solid rgba(20,63,61,.18)}.readiness-boundary h2{margin:8px 0 0;font-size:30px;line-height:1.35}.readiness-boundary p:last-child{margin:0;color:#5a726b;line-height:2;font-size:14px}@media(max-width:900px){.readiness-grid{grid-template-columns:1fr 1fr}.readiness-boundary{grid-template-columns:1fr}}@media(max-width:560px){.readiness-hero{padding:33px 22px}.readiness-grid{grid-template-columns:1fr}.readiness-step{min-height:0}.readiness-step h2{margin-top:30px}}`}</style>
    <section className="readiness-hero"><p className="eyebrow">مسار المزود</p><h1>لا نطلب ملفك قبل أن تعرف ما تعنيه <em>الجاهزية.</em></h1><p>هذه تجربة تعلم مصغرة أصلية لـSENSE Experience: تهيئ المزود لتقديم وصف مسؤول وقابل للمراجعة. ليست دورة Maharat، ولا تمنح شهادة، ولا تحفظ أو تنشر بياناتك في هذه المعاينة.</p></section>
    <section className="readiness-grid" aria-label="خطوات جاهزية المزود">{steps.map((step) => <article className="readiness-step" key={step.number}><span>{step.number}</span><h2>{step.title}</h2><p>{step.body}</p></article>)}</section>
    <section className="readiness-boundary"><div><p className="eyebrow">الحد الذي نحميه</p><h2>الاستعداد ليس قبولًا، والقبول ليس نشرًا.</h2></div><div><p>الخدمة المستقلة وهوية المراجعين لم تُنشرا بعد، لذلك لا نفتح نموذج تسجيل فعليًا ولا نعد بظهور في الدليل. حين تصبح الخدمة جاهزة، يكون هذا المسار مدخلًا اختياريًا قبل مراجعة بشرية، لا بديلًا عنها.</p><button className="secondary tourism-action" onClick={() => onNavigate("/للشركاء")}>راجع مبادئ الثقة</button></div></section>
  </>;
}

function ResponsibleVisionPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <>
      <style>{`.vision-hero{display:grid;grid-template-columns:1fr .92fr;gap:46px;align-items:center;min-height:540px;padding:clamp(28px,6vw,74px);border:1px solid rgba(18,58,53,.15);border-radius:30px;background:linear-gradient(135deg,#f7fbf8,#e7f0eb 60%,#f4e7c2);overflow:hidden}.vision-hero h1{max-width:650px;margin:9px 0 18px;font-size:clamp(40px,5vw,70px);line-height:1.08;letter-spacing:-.055em}.vision-hero h1 em{color:#bd8424;font-style:normal}.vision-hero>div>p:not(.eyebrow){max-width:610px;color:#526e66;line-height:2;font-size:16px}.vision-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:26px}.vision-signal{display:grid;grid-template-columns:1fr 34px 1fr 34px 1fr;align-items:center;color:#eef8f3;background:#143f3d;padding:34px}.vision-signal div{min-height:186px;padding:16px 12px;border-top:4px solid #e4bd5b;background:rgba(255,255,255,.06)}.vision-signal span,.vision-signal b,.vision-signal small{display:block}.vision-signal span{color:#e7c875;font-family:'DM Mono',monospace;font-size:11px}.vision-signal b{margin-top:34px;font-size:19px;line-height:1.35}.vision-signal small{margin-top:10px;color:#c5ddd6;font-size:11px;line-height:1.7}.vision-signal i{height:2px;background:#e4bd5b;position:relative}.vision-signal i:after{position:absolute;right:0;top:-6px;border-top:7px solid transparent;border-bottom:7px solid transparent;border-right:10px solid #e4bd5b;content:''}.vision-tiles{display:grid;grid-template-columns:1.05fr .9fr 1.05fr;gap:14px;margin:18px 0}.vision-tile{min-height:270px;padding:26px;border-radius:18px}.vision-tile span{font-family:'DM Mono',monospace;font-size:11px;font-weight:700}.vision-tile h2{margin:58px 0 10px;font-size:27px;line-height:1.25}.vision-tile p{margin:0;line-height:1.9;font-size:13px}.vision-teal{color:#ecf7f2;background:#174943}.vision-teal span{color:#e8c878}.vision-teal p{color:#c8dfd8}.vision-paper{color:#21433d;background:#f4f1e7}.vision-paper p{color:#60746e}.vision-gold{color:#3a2e10;background:#e8c26e}.vision-gold p{color:#66501b}.vision-bridge{display:grid;grid-template-columns:.95fr 1.05fr;gap:50px;align-items:start;margin:44px 0 72px;padding:38px;border-top:1px solid rgba(19,54,50,.2);border-bottom:1px solid rgba(19,54,50,.2)}.vision-bridge h2{max-width:560px;margin:7px 0 0;font-size:31px;line-height:1.3}.vision-bridge p:last-child{margin:0;color:#5a726b;line-height:2;font-size:14px}@media(max-width:900px){.vision-hero,.vision-bridge{grid-template-columns:1fr}.vision-hero{min-height:0}.vision-signal{max-width:620px}.vision-tiles{grid-template-columns:1fr 1fr}.vision-tile:last-child{grid-column:span 2}}@media(max-width:560px){.vision-hero{padding:32px 21px}.vision-hero h1{font-size:46px}.vision-signal{grid-template-columns:1fr}.vision-signal i{width:2px;height:20px;justify-self:center}.vision-signal i:after{top:auto;bottom:-1px;right:-4px;border-right:6px solid transparent;border-left:6px solid transparent;border-top:8px solid #e4bd5b;border-bottom:0}.vision-tiles{grid-template-columns:1fr}.vision-tile:last-child{grid-column:auto}.vision-tile{min-height:0}.vision-tile h2{margin-top:35px}}`}</style>
      <section className="vision-hero">
        <div>
          <p className="eyebrow">إشارة · إنسان · أثر</p>
          <h1>نرى ما يكفي للفهم، ولا نحوّل المكان إلى <em>مراقبة.</em></h1>
          <p>هذه صفحة تعريف لمسار بحثي مقترح داخل منظومة SENSE. لا يوجد نموذج رؤية حاسوبية أو بث كاميرات أو بيانات حية في هذه الواجهة أو في منصة Urban‑Sense.</p>
          <div className="vision-actions">
            <button className="primary tourism-action" onClick={() => onNavigate("/للشركاء")}>اقرأ مبدأ الثقة</button>
            <button className="secondary tourism-action" onClick={() => onNavigate("/انضم")}>انضم كمزود خدمة</button>
          </div>
        </div>
        <div className="vision-signal" aria-label="مخطط مفاهيمي لمسار الرؤية المسؤولة">
          <div><span>01</span><b>غرض محدد</b><small>وسيط مصرح به فقط</small></div>
          <i />
          <div><span>02</span><b>مراجعة بشرية</b><small>الاقتراح ليس قرارًا</small></div>
          <i />
          <div><span>03</span><b>أثر محدود</b><small>ملخص لا مراقبة</small></div>
        </div>
      </section>
      <section className="vision-tiles">
        <article className="vision-tile vision-teal"><span>ليس الآن</span><h2>لا كاميرات عامة.<br />لا بث حي.</h2><p>لا تبدأ المنظومة من الحسّاسات أو التتبع أو تصنيف الأشخاص، ولا تعد بأي منها.</p></article>
        <article className="vision-tile vision-paper"><span>عند الموافقة فقط</span><h2>تجربة واحدة<br />بغرض واحد.</h2><p>أي بحث لاحق يحتاج حق استخدام، مالك موقع، موافقة، سياسة حذف، ومراجعًا بشريًا.</p></article>
        <article className="vision-tile vision-gold"><span>القاعدة</span><h2>التكامل عقد<br />لا شعار.</h2><p>لا تنتقل سوى ملاحظة ضيقة مراجعَة؛ لا وجوه أو لوحات أو فيديو خام أو قرار آلي.</p></article>
      </section>
      <section className="vision-bridge">
        <div><p className="eyebrow">المدينة المتصلة</p><h2>الاتصال والبيانات والرؤية طبقات تمكين، لا بديل عن الحوكمة.</h2></div>
        <p>تتعلم SENSE من مسارات التقنية والمدينة الذكية كيف تبني التدرج: بيانات موثوقة، تشغيل واضح، تكامل محدود، وحوكمة قابلة للمراجعة. وتبقى هذه الصفحة تعريفًا بالمسار لا إعلانًا عن خدمة منشورة.</p>
      </section>
    </>
  );
}
