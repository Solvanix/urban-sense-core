import { useMemo, useState } from "react";

type Campaign = {
  id: string;
  title: string;
  promise: string;
  audience: string;
  action: string;
  channels: string[];
};

const starterCampaigns: Campaign[] = [
  {
    id: "place-care",
    title: "احمِ المكان قبل أن تزوره",
    promise: "زيارة أبطأ، معرفة أعمق، وأثر أخف على المكان وأهله.",
    audience: "زائر مهتم بالطبيعة والقصص المحلية",
    action: "قراءة بطاقة الوصول، الاستئذان قبل التصوير، وطلب مراجعة محلية قبل الزيارة",
    channels: ["قصة WordPress", "إنفوجرافيك", "فيديو قصير"],
  },
  {
    id: "olive-story",
    title: "رحلة تبدأ من شجرة",
    promise: "نحوّل موسم الزيتون من مشهد سريع إلى تجربة تسمع فيها قصة الأرض.",
    audience: "عائلات وطلبة وباحثون عن تجربة ريفية",
    action: "حفظ المسار، دعم منتج محلي، ومشاركة القصة بموافقة أهل المكان",
    channels: ["تقرير ميداني", "مسار صوتي", "محتوى اجتماعي"],
  },
  {
    id: "local-voice",
    title: "اسمع من أهل المكان",
    promise: "لا نتحدث عن المكان من بعيد؛ نبدأ بمن يعيش قصته.",
    audience: "زوار وكتّاب ومصورون ومنتجو محتوى",
    action: "طلب الإذن، الاستماع، ونشر رواية منسوبة إلى صاحبها",
    channels: ["مقابلة", "بطاقة اقتباس", "بودكاست قصير"],
  },
];

const campaignSteps = [
  ["01", "المشكلة", "ما الذي نريد تغييره أو حمايته؟"],
  ["02", "الجمهور", "من الشخص الذي نريد أن يتحرك؟"],
  ["03", "الفعل", "ما الفعل الصغير القابل للملاحظة؟"],
  ["04", "الرسالة", "ما الجملة التي تبقى بعد انتهاء المحتوى؟"],
  ["05", "الاختبار", "ما الذي يحتاج تحققًا قبل النشر؟"],
  ["06", "القياس", "كيف نعرف أن الحملة أحدثت أثرًا؟"],
];

export function TourismCampaignLabPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  const [selected, setSelected] = useState(starterCampaigns[0]);
  const [mode, setMode] = useState<"strategist" | "critic" | "audience">("strategist");
  const [idea, setIdea] = useState("");

  const review = useMemo(() => {
    if (mode === "critic") return ["هل الوعد واضح دون مبالغة؟", "هل توجد موافقة من أصحاب القصة؟", "هل يوجد فعل يتجاوز الإعجاب؟"];
    if (mode === "audience") return ["ماذا سيعرف الزائر قبل الوصول؟", "هل يستطيع تنفيذ الفعل فورًا؟", "ما السؤال الذي سيطرحه قبل الحجز؟"];
    return ["ما المشهد الأول؟", "من الصوت المحلي؟", "ما الخطوة التالية القابلة للقياس؟"];
  }, [mode]);

  return <main className="campaign-lab-page" dir="rtl">
    <header className="campaign-lab-nav"><button onClick={() => onNavigate("/")}>س <b>SENSE</b></button><span>مختبر الحملات السياحية</span><button onClick={() => onNavigate("/launchpad")}>جواز المشروع ↗</button></header>
    <section className="campaign-lab-hero">
      <div><span className="sense-section-label">SENSE / CAMPAIGN LAB</span><h1>من إجابة المشروع<br /><em>إلى حملة تتحرك.</em></h1><p>نستخدم منهجية الحوار القصير، وتحديد الفعل، ومحاكاة الجمهور، والنقد قبل النشر كي تتحول تفاصيل المشروع إلى حملة سياحية مسؤولة.</p><div className="campaign-lab-actions"><button className="sense-primary" onClick={() => document.getElementById("campaign-workspace")?.scrollIntoView({ behavior: "smooth" })}>ابدأ من فكرة ↙</button><button className="sense-text-button" onClick={() => onNavigate("/دليل-الميزات")}>كيف استُخدمت الإجابات؟ ↗</button></div></div>
      <div className="campaign-lab-orbit"><strong>6</strong><span>قرارات قبل النشر</span><small>لا نبدأ بالبوستر</small></div>
    </section>
    <section className="campaign-lab-steps"><div className="campaign-lab-section-head"><span className="sense-section-label">طريقة العمل</span><h2>كل سؤال يجب أن<br /><em>ينتج خطوة.</em></h2></div><div className="campaign-lab-step-grid">{campaignSteps.map(([number, title, description]) => <article key={number}><span>{number}</span><strong>{title}</strong><p>{description}</p></article>)}</div></section>
    <section id="campaign-workspace" className="campaign-lab-workspace"><aside><span className="sense-section-label">بدايات مقترحة</span><h2>اختر زاوية<br /><em>تجربتك.</em></h2><p>هذه أمثلة سياحية مستخرجة من منطق SENSE، وليست موادًا من مشاريع خارجية.</p><div className="campaign-lab-list">{starterCampaigns.map((campaign) => <button key={campaign.id} className={selected.id === campaign.id ? "active" : ""} onClick={() => setSelected(campaign)}><span>{campaign.title}</span><small>{campaign.audience}</small></button>)}</div></aside><div className="campaign-lab-card"><div className="campaign-lab-card-top"><span className="sense-section-label">المسودة الاستراتيجية</span><span className="campaign-lab-status">مسودة · تحتاج مراجعة</span></div><h2>{selected.title}</h2><p className="campaign-lab-promise">{selected.promise}</p><div className="campaign-lab-fields"><div><small>الجمهور</small><strong>{selected.audience}</strong></div><div><small>الفعل المطلوب</small><strong>{selected.action}</strong></div><div><small>القنوات الأولى</small><strong>{selected.channels.join(" · ")}</strong></div></div><label className="campaign-lab-idea">فكرة المشروع أو القصة<textarea value={idea} onChange={(event) => setIdea(event.target.value)} placeholder="اكتب مشهدًا أو مشكلة أو عادة تريد تغييرها..." rows={4} /></label><div className="campaign-lab-modes"><span>اختبرها بدور:</span>{([["strategist", "استراتيجي"], ["critic", "ناقد"], ["audience", "محاكاة الجمهور"]] as const).map(([value, label]) => <button key={value} className={mode === value ? "active" : ""} onClick={() => setMode(value)}>{label}</button>)}</div><div className="campaign-lab-review"><strong>{mode === "critic" ? "قبل أن ننشر، افحص" : mode === "audience" ? "اسأل كزائر" : "طوّر الفكرة"}</strong><ul>{review.map((item) => <li key={item}>{item}</li>)}</ul></div><button className="sense-primary" onClick={() => onNavigate("/جواز-المشروع")}>حوّلها إلى جواز مشروع ←</button></div></section>
    <footer className="campaign-lab-footer"><strong>SENSE Campaign Lab</strong><span>المحتوى السياحي يحتاج قصة، موافقة، تحققًا، وفعلًا قابلًا للقياس.</span></footer>
  </main>;
}

export default TourismCampaignLabPage;

// The examples are intentionally generic and belong to SENSE; no external campaign content is copied into the product.
// The reusable method comes from the supplied files: short questioning, strategist alternatives, critic review, and audience simulation.
// External campaign ownership remains separate from SENSE.

export const CAMPAIGN_LAB_METHOD_NOTE = "استُخدمت منهجية الملفات المرفقة فقط: الحوار القصير، تحديد الفعل، البدائل، النقد، ومحاكاة الجمهور.";
