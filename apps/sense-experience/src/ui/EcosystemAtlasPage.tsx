import { useMemo, useState } from "react";

type AtlasLayer = "الكل" | "النواة" | "المعرفة" | "التجربة" | "المجتمع" | "الأثر";
type Confidence = "مؤكد" | "قديم" | "خارجي غير مؤكد";

type AtlasNode = {
  name: string;
  kind: string;
  layer: Exclude<AtlasLayer, "الكل">;
  confidence: Confidence;
  description: string;
  url: string;
  bridge: string;
};

const layers: { key: AtlasLayer; label: string; note: string }[] = [
  { key: "الكل", label: "كل الخريطة", note: "الأثر الكامل من الحساب إلى المنتج" },
  { key: "النواة", label: "النواة", note: "المكان الذي تتجمع فيه القرارات والبيانات" },
  { key: "المعرفة", label: "المعرفة", note: "أدوات التعلم والبيانات والموارد" },
  { key: "التجربة", label: "التجربة", note: "ما يراه الزائر أو يستخدمه الشريك" },
  { key: "المجتمع", label: "المجتمع", note: "المدينة، المشاركة، والتحقق" },
  { key: "الأثر", label: "الأثر", note: "المتجر، المحتوى، والتحويل إلى قيمة" },
];

const nodes: AtlasNode[] = [
  { name: "Solvanix", kind: "الحساب الحالي", layer: "النواة", confidence: "مؤكد", description: "الحساب الحاضن للمنظومة الحالية والمصدر المرجعي للكود الذي نطوره الآن.", url: "https://github.com/Solvanix", bridge: "مرجع الهوية والكود" },
  { name: "urban-sense-core", kind: "المنتج المرجعي", layer: "النواة", confidence: "مؤكد", description: "نواة SENSE: البلاغ المدني، التجربة السياحية، سجل الادعاءات، والمراجعة البشرية.", url: "https://github.com/Solvanix/urban-sense-core", bridge: "المحور الذي يستقبل بقية الطبقات" },
  { name: "sense-hub", kind: "بوابة", layer: "النواة", confidence: "مؤكد", description: "واجهة التجميع والبوابة العامة لعائلة Sense قبل توحيدها في النواة.", url: "https://github.com/Solvanix/sense-hub", bridge: "مدخل → تطبيقات → نواة" },
  { name: "sense-experience-platform", kind: "تجربة عربية", layer: "التجربة", confidence: "مؤكد", description: "منصة تجربة سياحية عربية للمزودين الموثقين والمراجعة المرتبطة بالمصدر.", url: "https://github.com/Solvanix/sense-experience-platform", bridge: "مقترحات التجربة إلى SENSE Experience" },
  { name: "urban_symbolic_city", kind: "مختبر المدينة", layer: "المجتمع", confidence: "مؤكد", description: "نماذج حضرية ذكية وخضراء تربط التعليم والمدينة والأنظمة القابلة للتجريب.", url: "https://github.com/Solvanix/urban_symbolic_city", bridge: "من النموذج الحضري إلى قصص المكان" },
  { name: "switchers-urban-sense", kind: "أرشيف المنهج", layer: "المجتمع", confidence: "مؤكد", description: "مواد Urban-Sense الخاصة بصندوق أدوات Switchers، وتصلح كطبقة سياق لا كنواة تشغيل.", url: "https://github.com/Solvanix/switchers-urban-sense", bridge: "السياق والمنهج → قرارات المنتج" },
  { name: "Data_Core", kind: "بيانات", layer: "المعرفة", confidence: "مؤكد", description: "طبقة البيانات والتجارب التحليلية؛ تُستخدم كمصدر معرفة بعد تنظيف الحدود والخصوصية.", url: "https://github.com/Solvanix/Data_Core", bridge: "بيانات → أدلة قابلة للمراجعة" },
  { name: "Shared_Resources", kind: "موارد مشتركة", layer: "المعرفة", confidence: "مؤكد", description: "مساحة الأصول والقوالب المشتركة التي تمنع تكرار البناء بين المشاريع.", url: "https://github.com/Solvanix/Shared_Resources", bridge: "أصل واحد → استخدامات متعددة" },
  { name: "Switchers_Lab", kind: "تعلم آلي", layer: "المعرفة", confidence: "مؤكد", description: "مختبر تصنيف صور الزهور؛ يمكن تحويله إلى مسار تعلم ومثال على بطاقة دليل، لا إلى خدمة عامة مباشرة.", url: "https://github.com/Solvanix/Switchers_Lab", bridge: "تعلم → تجربة تعليمية موثقة" },
  { name: "STEAM_Forge", kind: "تعليم تطبيقي", layer: "المعرفة", confidence: "مؤكد", description: "مختبر التعرف على النباتات ضمن سياق STEAM، يصلح كنقطة دخول للشباب والمشاريع الحية.", url: "https://github.com/Solvanix/STEAM_Forge", bridge: "مشروع طالب → أثر مجتمعي" },
  { name: "Switchers_Hub", kind: "منصة تجميع", layer: "المعرفة", confidence: "مؤكد", description: "مساحة قديمة تحتاج قرارًا واضحًا: أرشيف معرفة أم واجهة تشغيل، كي لا تنافس النواة.", url: "https://github.com/Solvanix/Switchers_Hub", bridge: "أرشفة منظمة أو إحالة إلى النواة" },
  { name: "System_Gate", kind: "بوابة نظام", layer: "النواة", confidence: "مؤكد", description: "اسم مناسب لطبقة الحوكمة والبوابات، ويحتاج ربطه بعقود صلاحيات SENSE بدل بقائه منفصلًا.", url: "https://github.com/Solvanix/System_Gate", bridge: "صلاحيات وحدود الوصول" },
  { name: "Product_Store", kind: "تجارة", layer: "الأثر", confidence: "مؤكد", description: "هوية المتجر والمنتجات؛ يرتبط بالتجربة عبر المنتج ذي القصة والمصدر، لا عبر قائمة بيع منفصلة.", url: "https://github.com/Solvanix/Product_Store", bridge: "قصة → منتج → أثر" },
  { name: "pizza_hot", kind: "حالة استخدام", layer: "الأثر", confidence: "مؤكد", description: "موقع منشور فعلي يمكن استخدامه كمختبر للطلب المحلي، المحتوى، والحدود بين العرض والتشغيل الحقيقي.", url: "https://github.com/Solvanix/pizza_hot", bridge: "تجربة محلية قابلة للقياس" },
  { name: "digital-media-capstone-review-2026", kind: "محتوى", layer: "الأثر", confidence: "مؤكد", description: "أرشيف داخلي لمعايير ومراجعات مشاريع الإعلام الرقمي، يغذي مسار إنتاج القصص والوسائط.", url: "https://github.com/Solvanix/digital-media-capstone-review-2026", bridge: "معيار إنتاج → قصة منشورة" },
  { name: "Ali-Eco-Pioneer", kind: "حساب قديم", layer: "المجتمع", confidence: "قديم", description: "حساب قديم يحمل اسم Ali Khateb وMABA ورابط الهوية نفسه، بلا مستودعات عامة حاليًا.", url: "https://github.com/Ali-Eco-Pioneer", bridge: "ذاكرة الهوية؛ لا يُعامل كمصدر كود" },
  { name: "eng-khateb", kind: "حساب قديم", layer: "الأثر", confidence: "قديم", description: "حساب قديم محتمل يحتوي My-website؛ نربطه كأثر تاريخي حتى يثبت مالكه ويُرحّل ما يلزم.", url: "https://github.com/eng-khateb", bridge: "أرشيف شخصي → ملف مهني" },
  { name: "sensecitycode", kind: "حساب خارجي", layer: "المجتمع", confidence: "خارجي غير مؤكد", description: "حساب SenseCity قديم له تطبيق ومشاريع إدارية، لكن لا توجد علاقة علنية مؤكدة بصاحب الحساب الحالي.", url: "https://github.com/sensecitycode", bridge: "مرجع خارجي محتمل؛ لا نسحب كودًا بلا إثبات" },
];

const confidenceStyle: Record<Confidence, string> = { "مؤكد": "atlas-confidence-verified", "قديم": "atlas-confidence-legacy", "خارجي غير مؤكد": "atlas-confidence-external" };
const relations = [
  ["Solvanix", "urban-sense-core", "يملك النواة المرجعية"],
  ["urban-sense-core", "sense-experience-platform", "يحوّل الخبرة إلى تطبيق موثوق"],
  ["urban-sense-core", "Data_Core", "يستقبل بيانات قابلة للمراجعة"],
  ["urban-sense-core", "System_Gate", "يطبق حدود الصلاحيات"],
  ["urban-sense-core", "Product_Store", "يربط القصة بالمنتج"],
  ["urban-sense-core", "STEAM_Forge", "يحوّل التعلم إلى أثر"],
  ["Ali-Eco-Pioneer", "Solvanix", "أثر هوية قديم يحتاج توثيقًا"],
  ["eng-khateb", "Solvanix", "أرشيف مهني محتمل"],
  ["sensecitycode", "urban-sense-core", "مرجع خارجي غير مؤكد"],
] as const;

export function EcosystemAtlasPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  const [activeLayer, setActiveLayer] = useState<AtlasLayer>("الكل");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => nodes.filter((node) => {
    const matchesLayer = activeLayer === "الكل" || node.layer === activeLayer;
    const haystack = `${node.name} ${node.kind} ${node.description} ${node.bridge}`.toLowerCase();
    return matchesLayer && haystack.includes(query.trim().toLowerCase());
  }), [activeLayer, query]);
  const verified = nodes.filter((node) => node.confidence === "مؤكد").length;
  const legacy = nodes.filter((node) => node.confidence === "قديم").length;
  function downloadRegistry() {
    const payload = { version: 1, generatedFor: "Solvanix ecosystem atlas", nodes, relations: relations.map(([from, to, relation]) => ({ from, to, relation })) };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = "solvanix-ecosystem-registry.json";
    link.click();
    URL.revokeObjectURL(href);
  }

  return <>
    <style>{`
      .atlas-shell{max-width:1220px;margin:0 auto;padding:28px 5vw 72px;color:#173f3c}.atlas-hero{display:grid;grid-template-columns:1.18fr .82fr;gap:28px;align-items:stretch;padding:clamp(30px,6vw,76px);border-radius:34px;background:radial-gradient(circle at 88% 8%,#e6c36e 0 9%,transparent 30%),linear-gradient(132deg,#123f3a,#23695d 60%,#173f3c);color:#f7fbf5;overflow:hidden}.atlas-kicker{font:700 11px/1.4 'DM Mono',monospace;letter-spacing:.14em;color:#f4d37e}.atlas-hero h1{max-width:780px;margin:16px 0;font-size:clamp(44px,6.2vw,84px);line-height:1.01;letter-spacing:-.06em}.atlas-hero h1 em{color:#f4d37e;font-style:normal}.atlas-hero p{max-width:690px;color:#d5e9e1;font-size:16px;line-height:2}.atlas-hero-aside{align-self:end;padding:24px;border:1px solid rgba(255,255,255,.24);border-radius:20px;background:rgba(7,36,34,.3);backdrop-filter:blur(8px)}.atlas-hero-aside span{display:block;color:#f4d37e;font:700 10px 'DM Mono',monospace;letter-spacing:.12em}.atlas-hero-aside strong{display:block;margin:38px 0 8px;font-size:28px;line-height:1.25}.atlas-hero-aside small{color:#c7dfd6;line-height:1.8}.atlas-stat-row{display:flex;flex-wrap:wrap;gap:10px;margin-top:25px}.atlas-stat{min-width:112px;padding:13px 15px;border:1px solid rgba(255,255,255,.2);border-radius:14px;background:rgba(255,255,255,.08)}.atlas-stat b{display:block;font-size:24px;color:#f4d37e}.atlas-stat span{font-size:11px;color:#cfe3db}.atlas-toolbar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:26px 0 18px}.atlas-search{flex:1 1 240px;min-height:46px;padding:0 16px;border:1px solid rgba(23,63,60,.2);border-radius:999px;background:#fffdf7;color:#173f3c;font:inherit}.atlas-layer-tabs{display:flex;flex-wrap:wrap;gap:7px}.atlas-layer-tabs button{padding:11px 14px;border:1px solid rgba(23,63,60,.2);border-radius:999px;background:#fffdf7;color:#385a52;font:inherit;font-size:12px;cursor:pointer}.atlas-layer-tabs button.active{border-color:#173f3c;background:#173f3c;color:#fff}.atlas-export{padding:11px 14px;border:1px solid #b68425;border-radius:999px;background:#f4dfae;color:#5f4817;font:inherit;font-size:12px;cursor:pointer}.atlas-intro{display:grid;grid-template-columns:.78fr 1.22fr;gap:24px;margin:25px 0 34px;padding:26px 0;border-top:1px solid rgba(23,63,60,.18);border-bottom:1px solid rgba(23,63,60,.18)}.atlas-intro h2{margin:0;font-size:30px;line-height:1.2}.atlas-intro p{margin:0;color:#5c746c;line-height:2;font-size:14px}.atlas-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.atlas-card{display:flex;min-height:270px;flex-direction:column;padding:22px;border:1px solid rgba(23,63,60,.15);border-radius:18px;background:#fffdf7;box-shadow:0 8px 24px rgba(22,63,58,.04)}.atlas-card:nth-child(3n+2){background:#f4f0e5}.atlas-card:nth-child(3n){background:#e8f0e9}.atlas-card-top{display:flex;justify-content:space-between;gap:10px;align-items:start}.atlas-kind{color:#a57822;font:700 10px 'DM Mono',monospace;letter-spacing:.08em}.atlas-card h3{margin:22px 0 8px;font-size:24px;line-height:1.2;letter-spacing:-.03em}.atlas-card p{margin:0;color:#5d746c;font-size:13px;line-height:1.85}.atlas-confidence{display:inline-flex;align-items:center;padding:5px 8px;border-radius:999px;font-size:10px;white-space:nowrap}.atlas-confidence-verified{background:#dceddf;color:#17604d}.atlas-confidence-legacy{background:#f4dfae;color:#765314}.atlas-confidence-external{background:#ead9dd;color:#80404c}.atlas-bridge{margin-top:auto;padding-top:17px;border-top:1px solid rgba(23,63,60,.15);color:#173f3c;font-size:12px;font-weight:700}.atlas-card a{display:inline-block;margin-top:10px;color:#166255;font-size:12px;text-decoration:none}.atlas-empty{padding:42px;text-align:center;border:1px dashed rgba(23,63,60,.3);border-radius:18px;color:#5c746c}.atlas-relations{display:grid;grid-template-columns:.72fr 1.28fr;gap:24px;margin-top:42px;padding:28px;border:1px solid rgba(23,63,60,.15);border-radius:22px;background:#f4f0e5}.atlas-relations h2{margin:12px 0 8px;font-size:30px;line-height:1.2}.atlas-relations p{margin:0;color:#5c746c;line-height:1.9;font-size:13px}.atlas-relation-list{display:grid;gap:8px}.atlas-relation{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;padding:12px 14px;border-radius:12px;background:#fffdf7;color:#173f3c;font-size:12px}.atlas-relation span{color:#b68425;font-size:18px}.atlas-relation small{grid-column:1 / -1;color:#6b7c76;font-size:11px}.atlas-closing{display:grid;grid-template-columns:.92fr 1.08fr;gap:30px;margin-top:54px;padding:30px;border-radius:22px;background:#173f3c;color:#edf8f1}.atlas-closing h2{margin:0;font-size:32px;line-height:1.25}.atlas-closing p{margin:0;color:#c8ded5;line-height:2}.atlas-closing button{margin-top:18px;padding:12px 16px;border:0;border-radius:999px;background:#e7c36e;color:#173f3c;font:inherit;cursor:pointer}@media(max-width:900px){.atlas-hero,.atlas-intro,.atlas-closing,.atlas-relations{grid-template-columns:1fr}.atlas-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.atlas-shell{padding-inline:18px}.atlas-grid{grid-template-columns:1fr}.atlas-hero{padding:32px 22px}.atlas-hero h1{font-size:50px}.atlas-card{min-height:0}}
    `}</style>
    <main className="atlas-shell" dir="rtl" id="main-content">
      <section className="atlas-hero">
        <div>
          <span className="atlas-kicker">SOLVANIX / DEEP SYSTEM ATLAS</span>
          <h1>كل أثرٍ قديم<br /><em>يصير بابًا.</em></h1>
          <p>أطلس حيّ يربط الحساب الحالي بالحسابات القديمة والمستودعات والمشاريع في رحلة واحدة: من التعلم والبيانات، إلى المدينة والتجربة، ثم إلى منتج له قصة ومصدر وحدود واضحة.</p>
          <div className="atlas-stat-row"><div className="atlas-stat"><b>{nodes.length}</b><span>عقدة في الخريطة</span></div><div className="atlas-stat"><b>{verified}</b><span>مرتبطة ومؤكدة</span></div><div className="atlas-stat"><b>{legacy}</b><span>آثار قديمة</span></div></div>
        </div>
        <aside className="atlas-hero-aside"><span>الفكرة العميقة</span><strong>لا ندمج الماضي في النواة؛ نعيده إلى مكانه الصحيح داخل قصة قابلة للبناء.</strong><small>المؤكد يصبح كودًا أو عقدًا. القديم يصبح ذاكرة قابلة للترحيل. الخارجي غير المؤكد يبقى رابطًا لا ادعاءً.</small></aside>
      </section>
      <section className="atlas-intro"><h2>من مستودعات متفرقة إلى منظومة تتنفس.</h2><p>المشروع ليس صفحة روابط. كل عقدة تجيب عن سؤال: ما الذي تحفظه؟ ما الذي تمنحه للنواة؟ وما الحد الذي يمنعها من التحول إلى مشروع موازٍ؟ استخدم المرشحات لرؤية طبقة واحدة، أو ابحث باسم حساب أو مشروع.</p></section>
      <div className="atlas-toolbar"><input className="atlas-search" aria-label="ابحث في الأطلس" placeholder="ابحث في الحسابات والمشاريع..." value={query} onChange={(event) => setQuery(event.target.value)} /><div className="atlas-layer-tabs" role="tablist" aria-label="طبقات المنظومة">{layers.map((layer) => <button key={layer.key} className={activeLayer === layer.key ? "active" : ""} onClick={() => setActiveLayer(layer.key)} role="tab" aria-selected={activeLayer === layer.key}>{layer.label}</button>)}</div><button className="atlas-export" type="button" onClick={downloadRegistry}>نزّل سجل العلاقات ↧</button></div>
      <p className="atlas-kicker" style={{ color: "#a57822", margin: "0 0 18px" }}>{layers.find((layer) => layer.key === activeLayer)?.note} · {filtered.length} نتيجة</p>
      <section className="atlas-grid" aria-label="عقد المنظومة">{filtered.length ? filtered.map((node) => <article className="atlas-card" key={node.name}><div className="atlas-card-top"><span className="atlas-kind">{node.kind} · {node.layer}</span><span className={`atlas-confidence ${confidenceStyle[node.confidence]}`}>{node.confidence}</span></div><h3>{node.name}</h3><p>{node.description}</p><div className="atlas-bridge">الرابط المقترح: {node.bridge}</div><a href={node.url} target="_blank" rel="noreferrer">افتح المصدر ↗</a></article>) : <div className="atlas-empty">لم نجد عقدة بهذا البحث. جرّب اسم الحساب أو الطبقة.</div>}</section>
      <section className="atlas-relations" aria-label="العلاقات الأساسية"><div><span className="atlas-kicker" style={{ color: "#a57822" }}>RELATION REGISTRY</span><h2>الخريطة لا تكتفي بالأسماء.</h2><p>هذه هي العلاقات التي تجعل التشعب منظمًا: ملكية، تحويل، حماية، أو مرجع يحتاج إثباتًا.</p></div><div className="atlas-relation-list">{relations.slice(0, activeLayer === "الكل" ? relations.length : 6).map(([from, to, relation]) => <div className="atlas-relation" key={`${from}-${to}`}><strong>{from}</strong><span>→</span><strong>{to}</strong><small>{relation}</small></div>)}</div></section>
      <section className="atlas-closing"><div><span className="atlas-kicker">NEXT CONNECTION</span><h2>الخطوة التالية ليست مستودعًا جديدًا.</h2><button onClick={() => onNavigate("/جواز-المشروع")}>افتح جواز المشروع ↗</button></div><p>نحوّل الأطلس لاحقًا إلى سجل علاقات قابل للتصدير: كل مشروع يملك بطاقة، وكل بطاقة تذكر المصدر، وكل انتقال يحتاج قرارًا. هكذا يصبح SENSE جسرًا بين التعليم والمدينة والمحتوى والتجارة، لا مجرد واجهة تجمع الروابط.</p></section>
    </main>
  </>;
}
