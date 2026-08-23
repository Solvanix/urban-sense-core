import { useMemo, useState } from "react";

const preferenceOptions = [
  { id: "step_free", label: "أفضّل أن أعرف مسبقًا إن كان الوصول يحتاج درجات أو منحدرًا" },
  { id: "sensory", label: "أحتاج معلومات عن الضوضاء أو الازدحام أو مساحة أهدأ" },
  { id: "easy_read", label: "أفضل معلومات واضحة وسهلة القراءة قبل الزيارة" },
  { id: "support", label: "قد أزور مع مرافق أو أحتاج وقتًا إضافيًا" },
  { id: "transport", label: "أحتاج أن أخطط نقطة الوصول والنقل قبل اختيار التجربة" }
] as const;

const planInstructions: Record<(typeof preferenceOptions)[number]["id"], string> = {
  step_free: "اسأل قبل الاختيار عن الدرج والمنحدرات ومسافة المسار، واطلب وصفًا محدثًا بدل افتراض الإتاحة.",
  sensory: "اسأل عن الضوضاء والازدحام وخيار وقت أو مساحة أهدأ قبل تثبيت الزيارة.",
  easy_read: "اطلب وصفًا مختصرًا وواضحًا للبرنامج ونقطة اللقاء وما يحتاجه الضيف قبل الوصول.",
  support: "اسأل مسبقًا إن كان وجود مرافق أو وقت إضافي يحتاج تنسيقًا، ولا تفترض توافره.",
  transport: "تحقق من نقطة الوصول وخيارات النقل والجزء الأخير من الطريق قبل اختيار التجربة."
};

export function AccessPlanner({ onNavigate }: { onNavigate: (href: string) => void }) {
  const [selected, setSelected] = useState<string[]>(() => {
    try { return JSON.parse(window.localStorage.getItem("sense-access-planner-v1") ?? "[]") as string[]; } catch { return []; }
  });
  const plan = useMemo(() => preferenceOptions.filter((item) => selected.includes(item.id)), [selected]);

  function toggle(id: string) {
    setSelected((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      window.localStorage.setItem("sense-access-planner-v1", JSON.stringify(next));
      return next;
    });
  }

  return <main id="main-content" tabIndex={-1} className="access-planner" dir="rtl">
    <section className="access-planner-hero"><p className="eyebrow">خطة وصول شخصية</p><h1>خطّط لتجربتك وفق ما يساعدك أنت.</h1><p>هذه أداة تخطيط محلية لا تجمع تشخيصًا صحيًا ولا ترسل اختياراتك إلى أي مزوّد. عندما تتوفر تجارب منشورة ومتحققة، تساعدك على قراءة معلومات الوصول قبل اتخاذ قرار الزيارة.</p><button className="secondary" onClick={() => onNavigate("/")}>العودة إلى البوابة</button></section>
    <section className="access-planner-grid"><fieldset><legend>ما المعلومات التي تساعدك؟</legend>{preferenceOptions.map((option) => <label key={option.id}><input type="checkbox" checked={selected.includes(option.id)} onChange={() => toggle(option.id)} />{option.label}</label>)}</fieldset><article className="personal-plan"><p className="eyebrow">قائمة استعدادك</p><h2>{plan.length ? "قبل أن تختار تجربة" : "ابدأ باختيار ما يهمك"}</h2>{plan.length ? <ol>{plan.map((item) => <li key={item.id}>{planInstructions[item.id]}</li>)}</ol> : <p>اختر بندًا أو أكثر، ثم احفظ هذه الصفحة على جهازك أو اطبعها كمذكرة شخصية.</p>}<div><button className="primary" onClick={() => window.print()}>طباعة الخطة</button><button className="quiet" onClick={() => { window.localStorage.removeItem("sense-access-planner-v1"); setSelected([]); }}>مسح الاختيارات</button></div></article></section>
    <section className="access-boundary"><h2>ما الذي لا تدّعيه الأداة؟</h2><p>لا تؤكد هذه الأداة إتاحة مكان أو سلامته، ولا تحجز مركبة أو تنشئ مسارًا على الخريطة. عندما تُنشر معلومات وصول مستقبلًا، يجب أن تكون موثقة ومراجعة ومحدثة، مع وسيلة واضحة لطرح سؤال على المزوّد.</p></section>
  </main>;
}
