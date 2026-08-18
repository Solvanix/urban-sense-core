type PublicPage = "home" | "discover" | "partners";

export function getPublicPage(pathname: string): PublicPage {
  const decodedPath = decodeURIComponent(pathname);
  if (decodedPath === "/اكتشف" || decodedPath === "/discover") return "discover";
  if (decodedPath === "/للشركاء" || decodedPath === "/partners") return "partners";
  return "home";
}

const publicLinks = [
  { href: "/", label: "البوابة" },
  { href: "/اكتشف", label: "اكتشف" },
  { href: "/للشركاء", label: "الثقة والشراكة" },
  { href: "/انضم", label: "انضم كمزود" }
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

      {page === "home" ? <GatewayPage onNavigate={onNavigate} /> : page === "discover" ? <DiscoverPage onNavigate={onNavigate} /> : <PartnerPage onNavigate={onNavigate} />}

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
            <button className="secondary tourism-action" onClick={() => onNavigate("/انضم")}>أنا مزود خدمة</button>
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
        {lenses.map((lens, index) => <article key={lens.number} className={`lens-card lens-${index + 1}`}><span>{lens.number}</span><h2>{lens.title}</h2><p>{lens.body}</p><button onClick={() => onNavigate("/انضم")}>اقتراح جهة لهذه الفئة</button></article>)}
      </section>
      <section className="empty-discovery">
        <div className="empty-map" aria-hidden="true"><span>مناطق وتجارب<br />تظهر بعد التحقق</span></div>
        <div><p className="eyebrow">قائمة الانتظار المعلنة</p><h2>الدليل لا يزال يتلقى ملفات، لذلك لا نخفي هذه الحقيقة خلف بطاقات مزيفة.</h2><p>يمكن لمزود خدمة أو جهة ثقافية أن يسجل اهتمامه؛ وبعد المراجعة المستقلة والموافقة على ما ينشر، يصبح الملف مؤهلًا للظهور في دليل فعلي.</p><button className="primary tourism-action" onClick={() => onNavigate("/انضم")}>ابدأ ملف مزود</button></div>
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
      <section className="partner-callout"><div><p className="eyebrow">للمزودين والجهات</p><h2>إن كانت خدمتك حقيقية، نريد أن نسمعها كما هي.</h2></div><button className="primary tourism-action" onClick={() => onNavigate("/انضم")}>تسجيل اهتمام خاص</button></section>
    </>
  );
}
