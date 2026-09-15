import { useEffect, useMemo, useState } from "react";

type Profile = {
  name: string;
  municipality: string;
  sector: string;
  description: string;
  audience: string;
  cultural: boolean;
  natural: boolean;
  accessibility: string;
  services: string[];
  quality: number;
  sustainability: number;
  innovation: number;
  digital: number;
  finance: number;
  evidence: string;
};
type Output = "overview" | "interview" | "story" | "gaps";

const defaultProfile: Profile = {
  name: "", municipality: "العيزرية", sector: "السياحة الثقافية والتراثية", description: "", audience: "", cultural: true, natural: false, accessibility: "", services: [], quality: 0, sustainability: 0, innovation: 0, digital: 0, finance: 0, evidence: "",
};
const sectors = ["السياحة الثقافية والتراثية", "السياحة الزراعية", "الطبيعة والسياحة الخارجية", "السياحة الذواقة", "السياحة الصحية", "السياحة الدينية", "السياحة التعليمية", "الإقامة والتجارب القروية"];
const serviceOptions = ["إقامة", "طعام ومشروبات", "جولات بصحبة مرشد", "أنشطة خارجية", "ورش وتجارب عملية", "منتجات محلية", "فعاليات", "برامج تعليمية"];
const profileKey = "sense-tourism-profile-v1";

function readProfile(): Profile {
  try { return { ...defaultProfile, ...JSON.parse(localStorage.getItem(profileKey) || "{}") }; } catch { return defaultProfile; }
}

function downloadText(filename: string, content: string, type = "text/markdown;charset=utf-8") {
  const blob = new Blob(["\ufeff", content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function reportFor(profile: Profile, score: number, label: string, output: Output) {
  const title = profile.name || "مشروع سياحي غير مسمى";
  const services = profile.services.length ? profile.services.join("، ") : "لم تحدد بعد";
  const header = `# ${title}\n\n- البلدية: ${profile.municipality}\n- القطاع: ${profile.sector}\n- مؤشر الجاهزية: ${score}% — ${label}\n- الخدمات: ${services}\n\n> هذا الملف مسودة داخلية قابلة للتحرير، وليس اعتمادًا أو وعدًا بالحجز أو التمويل.\n\n`;
  if (output === "overview") return `${header}## بطاقة العرض\n\n${profile.description || "أضف وصفًا قصيرًا للتجربة."}\n\n### الفئة المستفيدة\n${profile.audience || "لم تحدد بعد"}\n\n### حدود النشر\nيحتاج السعر والتوافر والسعة والوصول ووسيلة التواصل إلى مراجعة مستقلة وموافقة الشريك قبل النشر.\n`;
  if (output === "interview") return `${header}## ملخص المقابلة\n\n1. ما الذي سيعيشه الزائر خطوة بخطوة؟\n2. ما الدليل على الطلب أو رضا الزوار؟\n3. ما الذي يمنع التجربة من التوسع الآن؟\n4. كيف تحميون المكان والضيف والمضيف؟\n5. ما الشريك الذي تحتاجونه خلال الأشهر الثلاثة القادمة؟\n`;
  if (output === "story") return `${header}## مخطط قصة WordPress\n\n### المشهد\n${profile.description || "أضف المشهد الذي يبدأ منه الزائر."}\n\n### الصوت المحلي\nمقابلة قصيرة مع صاحب المشروع أو أحد أفراد المجتمع.\n\n### الأثر\nما الذي يتغير للزائر والمكان بعد الزيارة؟\n\n> أضف الصور والمصادر والموافقة قبل النشر.\n`;
  const gaps = [
    ["وصف التجربة والفئة المستفيدة", !!profile.description && !!profile.audience], ["خدمات واضحة للزائر", profile.services.length > 0], ["دليل يمكن مراجعته", !!profile.evidence], ["الجودة ورضا الزوار", profile.quality >= 2], ["الاستدامة والأثر", profile.sustainability >= 2], ["التسويق والحجز الرقمي", profile.digital >= 2], ["منطق مالي قابل للشرح", profile.finance >= 2],
  ];
  return `${header}## خريطة فجوات التطوير\n\n${gaps.map(([item, done]) => `- [${done ? "x" : " "}] ${item}`).join("\n")}\n\nهذه قائمة عمل قبل المقابلة أو طلب التمويل، وليست نتيجة رفض.\n`;
}

export function TourismReadinessPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  const [profile, setProfile] = useState<Profile>(readProfile);
  const [saved, setSaved] = useState(false);
  const [output, setOutput] = useState<Output>("overview");
  const score = useMemo(() => Math.round(([profile.quality, profile.sustainability, profile.innovation, profile.digital, profile.finance, profile.evidence ? 3 : 0, profile.description && profile.audience ? 3 : 0].reduce((sum, value) => sum + value, 0) / 28) * 100), [profile]);
  const label = score >= 80 ? "جاهزية قوية للمراجعة" : score >= 60 ? "جاهزية عرض أولي" : score >= 35 ? "مشروع في طور البناء" : "قصة تحتاج تأسيسًا";
  const update = <K extends keyof Profile>(key: K, value: Profile[K]) => { setProfile((current) => ({ ...current, [key]: value })); setSaved(false); };
  const toggleService = (service: string) => update("services", profile.services.includes(service) ? profile.services.filter((item) => item !== service) : [...profile.services, service]);
  function save() { localStorage.setItem(profileKey, JSON.stringify(profile)); setSaved(true); }
  useEffect(() => { const timer = window.setTimeout(() => { localStorage.setItem(profileKey, JSON.stringify(profile)); setSaved(true); }, 700); return () => window.clearTimeout(timer); }, [profile]);
  function exportCurrent() { downloadText(`${(profile.name || "sense-tourism-project").replace(/\s+/g, "-")}-${output}.md`, reportFor(profile, score, label, output)); }
  function exportJson() { downloadText(`${(profile.name || "sense-tourism-project").replace(/\s+/g, "-")}-profile.json`, JSON.stringify({ ...profile, readinessScore: score, readinessLabel: label }, null, 2), "application/json;charset=utf-8"); }
  async function copyCurrent() { await navigator.clipboard?.writeText(reportFor(profile, score, label, output)); setSaved(true); }

  return <section className="readiness-studio" dir="rtl"><div className="studio-hero"><div><span className="sense-section-label">SENSE / جواز المشروع</span><h1>حوّل الاستبانة<br /><em>إلى قصة قابلة للعمل.</em></h1><p>ملف واحد يجهزك للظهور السياحي، المقابلة، التقرير، وقصة WordPress — دون إعادة تعبئة النماذج كل مرة.</p></div><div className="studio-score"><span>مؤشر الجاهزية</span><strong>{score}%</strong><b>{label}</b><small>إرشادي وليس شهادة أو اعتمادًا رسميًا</small></div></div><div className="studio-layout"><form className="studio-form" onSubmit={(event) => { event.preventDefault(); save(); }}><div className="studio-form-header"><span className="sense-section-label">الخطوة 01 / 04</span><h2>هوية المشروع ومكانه</h2><p>نبدأ بما يمكن للزائر فهمه، ثم نضيف طبقات التشغيل والجودة والاستدامة.</p></div><label>اسم المشروع أو العلامة<input value={profile.name} onChange={(event) => update("name", event.target.value)} placeholder="مثال: بيت الزيتون" /></label><div className="studio-two-col"><label>البلدية<input value={profile.municipality} onChange={(event) => update("municipality", event.target.value)} /></label><label>القطاع<select value={profile.sector} onChange={(event) => update("sector", event.target.value)}>{sectors.map((sector) => <option key={sector}>{sector}</option>)}</select></label></div><label>وصف النشاط والتجربة<textarea rows={4} value={profile.description} onChange={(event) => update("description", event.target.value)} placeholder="ماذا سيعيش الزائر؟ وما الذي يجعله محليًا ومختلفًا؟" /></label><label>من تخدم هذه التجربة؟<input value={profile.audience} onChange={(event) => update("audience", event.target.value)} placeholder="عائلات، طلبة، زوار دوليون، باحثون..." /></label><div className="studio-check-grid"><label className="studio-check"><input type="checkbox" checked={profile.cultural} onChange={(event) => update("cultural", event.target.checked)} /><span>تراث ثقافي</span></label><label className="studio-check"><input type="checkbox" checked={profile.natural} onChange={(event) => update("natural", event.target.checked)} /><span>تراث طبيعي</span></label></div><label>الخدمات التي تقدمونها</label><div className="studio-pills">{serviceOptions.map((service) => <button type="button" key={service} className={profile.services.includes(service) ? "active" : ""} onClick={() => toggleService(service)}>{service}</button>)}</div><div className="studio-form-header compact"><span className="sense-section-label">الخطوة 02 / 04</span><h2>القدرة التي يراها الزائر</h2><p>قيّم الواقع الحالي بصدق. يمكن تحسين الدرجة بدل تجميلها.</p></div><Rating label="الجودة وإدارة رضا الزوار" value={profile.quality} onChange={(value) => update("quality", value)} /><Rating label="الاستدامة وتقليل الأثر" value={profile.sustainability} onChange={(value) => update("sustainability", value)} /><Rating label="الابتكار وتجربة جديدة" value={profile.innovation} onChange={(value) => update("innovation", value)} /><Rating label="الوصول الرقمي والتسويق" value={profile.digital} onChange={(value) => update("digital", value)} /><Rating label="النموذج المالي وقابلية الاستمرار" value={profile.finance} onChange={(value) => update("finance", value)} /><label>ما الدليل أو المادة التي يمكن مراجعتها؟<textarea rows={3} value={profile.evidence} onChange={(event) => update("evidence", event.target.value)} placeholder="صور، سجل زوار، شهادات، روابط، إجراءات، قصص عملاء..." /></label><div className="studio-actions"><button className="sense-primary" type="submit">{saved ? "حُفظ تلقائيًا ✓" : "احفظ جواز المشروع"}</button><button type="button" className="sense-secondary" onClick={() => { save(); setOutput("overview"); }}>ولّد بطاقة العرض ↗</button></div><small className="studio-privacy">يحفظ الملف تلقائيًا بعد التعديل في هذا المتصفح. لا ننشر بيانات الاتصال أو الأرقام المالية تلقائيًا.</small></form><aside className="studio-output"><div className="studio-output-tabs">{([ ["overview", "بطاقة العرض"], ["interview", "ملخص المقابلة"], ["story", "قصة WordPress"], ["gaps", "فجوات التطوير"]] as const).map(([key, text]) => <button type="button" key={key} className={output === key ? "active" : ""} onClick={() => setOutput(key)}>{text}</button>)}</div><div className="studio-export-bar"><button type="button" onClick={exportCurrent}>تنزيل هذا المخرج ↓</button><button type="button" onClick={copyCurrent}>نسخ النص</button><button type="button" onClick={exportJson}>تنزيل الملف JSON</button></div>{output === "overview" && <OverviewOutput profile={profile} score={score} label={label} />}{output === "interview" && <InterviewOutput profile={profile} />}{output === "story" && <StoryOutput profile={profile} />}{output === "gaps" && <GapsOutput profile={profile} score={score} />}</aside></div><div className="studio-bottom"><button onClick={() => onNavigate("/للشركاء")}>تعرف على مسار الشراكة ←</button><span>هذا المؤشر يساعدك على الاستعداد؛ لا يمنح اعتمادًا ولا يضمن التمويل.</span></div></section>;
}

function Rating({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) { return <div className="studio-rating"><div><strong>{label}</strong><span>{value}/4</span></div><div className="rating-buttons">{[0, 1, 2, 3, 4].map((item) => <button type="button" key={item} className={value === item ? "active" : ""} onClick={() => onChange(item)}>{item}</button>)}</div></div>; }
function OverviewOutput({ profile, score, label }: { profile: Profile; score: number; label: string }) { return <div className="output-content"><span className="output-kicker">ملف عام قابل للتحرير</span><h2>{profile.name || "اسم المشروع يظهر هنا"}</h2><p className="output-location">{profile.municipality || "الموقع غير محدد"} · {profile.sector}</p><div className="output-score"><strong>{score}%</strong><span>{label}</span></div><p>{profile.description || "أضف وصفًا قصيرًا للتجربة حتى تظهر قصتها للزائر."}</p><div className="output-tags">{profile.services.length ? profile.services.map((item) => <span key={item}>{item}</span>) : <span>أضف الخدمات</span>}</div><div className="output-boundary"><strong>ما يحتاج تحققًا</strong><p>التوافر، السعر، السعة، الوصول، ووسيلة التواصل لا تُنشر من هذا الملف قبل مراجعة مستقلة وموافقة الشريك.</p></div></div>; }
function InterviewOutput({ profile }: { profile: Profile }) { return <div className="output-content"><span className="output-kicker">ورقة مقابلة قصيرة</span><h2>{profile.name || "المشروع"}</h2><ol className="interview-list"><li>ما الذي سيعيشه الزائر خطوة بخطوة؟</li><li>ما الدليل على الطلب أو رضا الزوار؟</li><li>ما الذي يمنع التجربة من التوسع الآن؟</li><li>كيف تحميون المكان والضيف والمضيف؟</li><li>ما الشريك الذي تحتاجونه خلال الأشهر الثلاثة القادمة؟</li></ol><p className="output-note">استخدم هذه الأسئلة في المقابلة بدل إعادة قراءة الاستبانة كاملة.</p></div>; }
function StoryOutput({ profile }: { profile: Profile }) { return <div className="output-content"><span className="output-kicker">مخطط قصة تحريرية</span><h2>{profile.name || "عنوان القصة"}: من المكان إلى التجربة</h2><p className="story-lead">في {profile.municipality || "المكان"}، تتحول {profile.sector || "الفكرة المحلية"} إلى تجربة تمنح الزائر سببًا للتوقف والسؤال.</p><div className="story-sections"><div><b>المشهد</b><span>{profile.description || "أضف المشهد الذي يبدأ منه الزائر."}</span></div><div><b>الصوت المحلي</b><span>مقابلة قصيرة مع صاحب المشروع أو أحد أفراد المجتمع.</span></div><div><b>الأثر</b><span>ما الذي يتغير للزائر والمكان بعد الزيارة؟</span></div></div><p className="output-note">هذا مخطط WordPress، وليس مقالًا منشورًا. أضف صورًا ومصادر وموافقة قبل النشر.</p></div>; }
function GapsOutput({ profile, score }: { profile: Profile; score: number }) { const gaps = [{ label: "وصف التجربة والفئة المستفيدة", done: !!profile.description && !!profile.audience }, { label: "خدمات واضحة للزائر", done: profile.services.length > 0 }, { label: "دليل يمكن مراجعته", done: !!profile.evidence }, { label: "الجودة ورضا الزوار", done: profile.quality >= 2 }, { label: "الاستدامة والأثر", done: profile.sustainability >= 2 }, { label: "التسويق والحجز الرقمي", done: profile.digital >= 2 }, { label: "منطق مالي قابل للشرح", done: profile.finance >= 2 }]; return <div className="output-content"><span className="output-kicker">خريطة فجوات قبل التقديم</span><h2>{score < 60 ? "ثلاثة أشياء ابدأ بها" : "خطوتان لرفع الجاهزية"}</h2><div className="gap-list">{gaps.map((gap) => <div key={gap.label} className={gap.done ? "done" : ""}><span>{gap.done ? "✓" : "!"}</span><strong>{gap.label}</strong><small>{gap.done ? "موجود في الملف" : "يحتاج إضافة أو دليل"}</small></div>)}</div><p className="output-note">هذه ليست نتيجة رفض. إنها قائمة عمل قابلة للتنفيذ قبل المقابلة أو طلب التمويل.</p></div>; }
