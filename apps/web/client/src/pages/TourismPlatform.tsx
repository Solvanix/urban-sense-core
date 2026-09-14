import { ArrowLeft, CalendarDays, Check, Compass, MapPin, Printer, ShieldCheck, Sparkles, Ticket, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { sensePortalHref, experienceAccessHref } from "@/lib/sensePortalRoute";

type Place = {
  id: string;
  name: string;
  area: string;
  type: string;
  duration: string;
  summary: string;
  highlights: string[];
  access: string;
  status: string;
};

const places: Place[] = [
  { id: "old-town", name: "مسار البلدة القديمة", area: "العيزرية", type: "ذاكرة ومشي", duration: "90 دقيقة", summary: "مسار قصير يربط تفاصيل المكان بالحكاية المحلية دون اختزال البلدة في طريق عبور.", highlights: ["نقاط توقف قابلة للتعديل", "حكاية مكانية قصيرة", "مناسب للتخطيط المسبق"], access: "تحتاج معلومات ميدانية مؤكدة عن الدرج وسطح الطريق قبل وصفه بأنه مهيأ.", status: "نموذج مسار تجريبي" },
  { id: "stone-detail", name: "تفاصيل الحجر والعتبات", area: "العيزرية", type: "ثقافة وبصريات", duration: "45 دقيقة", summary: "تجربة تأمل وتصوير تركز على العمارة والتفاصيل اليومية، مع احترام الخصوصية وعدم تصوير الأشخاص دون إذن.", highlights: ["تجربة هادئة", "مخرج بصري بسيط", "لا حجز مطلوب في النموذج"], access: "المعلومات الحالية وصفية؛ يلزم تحقق محلي من نقطة اللقاء والضوضاء والوصول.", status: "محتوى تحريري تجريبي" },
  { id: "human-map", name: "خريطة بشرية للمكان", area: "العيزرية", type: "تعلم ومشاركة", duration: "60 دقيقة", summary: "ورشة صغيرة لتحويل معرفة السكان إلى أسئلة وملاحظات تحترم المصدر قبل نشر أي ادعاء.", highlights: ["مشاركة جماعية", "سجل مصادر", "مناسبة للطلبة والباحثين"], access: "يتطلب شريكًا مستضيفًا ومراجعًا قبل فتح التسجيل العام.", status: "مسودة برنامج" },
];

const filters = ["الكل", "ذاكرة ومشي", "ثقافة وبصريات", "تعلم ومشاركة"];

export default function TourismPlatform() {
  const [filter, setFilter] = useState("الكل");
  const [selectedId, setSelectedId] = useState(places[0].id);
  const [plan, setPlan] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("sense-tourism-plan-v1") ?? "[]") as string[]; } catch { return []; }
  });
  const visiblePlaces = useMemo(() => filter === "الكل" ? places : places.filter((place) => place.type === filter), [filter]);
  const selected = places.find((place) => place.id === selectedId) ?? places[0];
  function togglePlan(id: string) {
    setPlan((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem("sense-tourism-plan-v1", JSON.stringify(next));
      return next;
    });
  }

  return <main dir="rtl" className="min-h-screen bg-[#f5f1e8] text-[#17393b]">
    <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#17393b]/15 pb-5">
        <Link href={sensePortalHref} className="inline-flex items-center gap-3 font-extrabold"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#d8912d] text-white"><Compass size={22} /></span><span>SENSE · منصة المكان والرحلة</span></Link>
        <nav className="flex flex-wrap gap-2 text-sm font-bold"><a href="#places" className="rounded-full border border-[#17393b]/20 px-4 py-2">اكتشف</a><a href="#plan" className="rounded-full border border-[#17393b]/20 px-4 py-2">خطتي</a><Link href={experienceAccessHref} className="rounded-full border border-[#17393b]/20 px-4 py-2">الوصول</Link></nav>
      </header>

      <section className="grid gap-8 py-12 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
        <div><p className="inline-flex items-center gap-2 rounded-full bg-[#17393b] px-4 py-2 text-sm font-extrabold text-[#f8d68a]"><Sparkles size={16} />نسخة أولى قابلة للاستخدام</p><h1 className="mt-6 max-w-4xl text-5xl font-black leading-[1.12] tracking-tight sm:text-7xl">السياحة تبدأ من <span className="text-[#b86b23]">فهم المكان.</span></h1><p className="mt-6 max-w-2xl text-xl leading-9 text-[#17393b]/70">اكتشف مسارات صغيرة، افهم ما هو معروف وما يحتاج تحققًا، وابنِ يومك قبل أن تخرج. لا قوائم وهمية ولا حجوزات مزعومة؛ كل بطاقة تشرح حدودها.</p><div className="mt-7 flex flex-wrap gap-3"><a href="#places" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#17393b] px-5 font-extrabold text-white">ابدأ الاكتشاف <ArrowLeft size={18} /></a><button onClick={() => window.print()} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-[#17393b]/25 px-5 font-extrabold"><Printer size={18} />اطبع خطتي</button></div></div>
        <aside className="rounded-[2rem] border border-[#17393b]/15 bg-white p-7 shadow-sm"><div className="flex items-center gap-3"><ShieldCheck className="text-[#b86b23]" size={24} /><p className="font-extrabold">ماذا تعني هذه المنصة؟</p></div><p className="mt-5 text-2xl font-black leading-9">دليل رحلة موثوق تدريجيًا، وليس متجر حجوزات.</p><p className="mt-4 leading-7 text-[#17393b]/65">المحتوى الحالي تجريبي ومبني على مواد المشروع. لا توجد أسعار أو حجوزات أو أوقات فتح حية حتى يضاف مصدر ومالك ومراجعة.</p><div className="mt-6 grid grid-cols-3 gap-2 text-center text-sm"><div className="rounded-xl bg-[#f5f1e8] p-3"><b className="block text-2xl">3</b>مسارات</div><div className="rounded-xl bg-[#f5f1e8] p-3"><b className="block text-2xl">1</b>منطقة</div><div className="rounded-xl bg-[#f5f1e8] p-3"><b className="block text-2xl">0</b>حجوزات</div></div></aside>
      </section>

      <section id="places" className="border-t border-[#17393b]/15 py-10"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm font-extrabold text-[#b86b23]">اكتشاف منظم</p><h2 className="mt-2 text-3xl font-black">اختر ما يناسب يومك</h2></div><div className="flex flex-wrap gap-2" aria-label="تصفية المسارات">{filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-4 py-2 text-sm font-extrabold ${filter === item ? "bg-[#17393b] text-white" : "border border-[#17393b]/20"}`}>{item}</button>)}</div></div><div className="mt-7 grid gap-5 lg:grid-cols-[.95fr_1.05fr]"><div className="grid gap-3">{visiblePlaces.map((place) => <button key={place.id} onClick={() => setSelectedId(place.id)} className={`text-right rounded-2xl border p-5 transition ${selected.id === place.id ? "border-[#b86b23] bg-white shadow-sm" : "border-[#17393b]/15 bg-white/50 hover:bg-white"}`}><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-extrabold text-[#b86b23]">{place.type} · {place.area}</p><h3 className="mt-2 text-xl font-black">{place.name}</h3></div><span className="rounded-full bg-[#f5f1e8] px-3 py-1 text-xs font-bold">{place.duration}</span></div><p className="mt-3 text-sm leading-7 text-[#17393b]/65">{place.summary}</p></button>)}</div><article className="rounded-[2rem] bg-[#17393b] p-7 text-white"><div className="flex flex-wrap items-center justify-between gap-3"><span className="inline-flex items-center gap-2 text-sm font-extrabold text-[#f8d68a]"><MapPin size={17} />{selected.area}</span><span className="rounded-full border border-white/20 px-3 py-1 text-xs">{selected.status}</span></div><h3 className="mt-6 text-4xl font-black">{selected.name}</h3><p className="mt-4 text-lg leading-8 text-white/70">{selected.summary}</p><ul className="mt-6 grid gap-3 sm:grid-cols-3">{selected.highlights.map((highlight) => <li key={highlight} className="rounded-xl bg-white/10 p-3 text-sm font-bold"><Check className="mb-2 text-[#f8d68a]" size={17} />{highlight}</li>)}</ul><div className="mt-7 border-t border-white/15 pt-5"><p className="text-sm font-extrabold text-[#f8d68a]">معلومة الوصول</p><p className="mt-2 leading-7 text-white/70">{selected.access}</p></div><button onClick={() => togglePlan(selected.id)} className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#d8912d] px-5 font-extrabold text-[#17393b]">{plan.includes(selected.id) ? "أزيلت من خطتي" : "أضف إلى خطتي"}<CalendarDays size={18} /></button></article></div></section>

      <section id="plan" className="grid gap-6 border-t border-[#17393b]/15 py-10 lg:grid-cols-[1fr_.8fr]"><div><p className="text-sm font-extrabold text-[#b86b23]">خطتي لليوم</p><h2 className="mt-2 text-3xl font-black">رحلة قابلة للتعديل، لا وعدًا جاهزًا</h2><p className="mt-4 max-w-2xl leading-8 text-[#17393b]/65">اختر مساراتك من البطاقات أعلاه. تحفظ الخطة على جهازك ويمكن طباعتها. قبل الزيارة، تحقق من نقطة اللقاء، الوقت، الوصول، والخصوصية مع الجهة المحلية.</p></div><div className="rounded-2xl border border-[#17393b]/15 bg-white p-6">{plan.length ? <ol className="space-y-3">{plan.map((id, index) => <li key={id} className="flex items-center gap-3 rounded-xl bg-[#f5f1e8] p-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#17393b] text-sm font-black text-white">{index + 1}</span><span className="font-extrabold">{places.find((place) => place.id === id)?.name}</span></li>)}</ol> : <p className="leading-7 text-[#17393b]/60">لم تضف مسارًا بعد. اختر بطاقة وأضفها إلى خطتك.</p>}<div className="mt-5 flex flex-wrap gap-2"><button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl bg-[#17393b] px-4 py-3 text-sm font-extrabold text-white"><Printer size={16} />طباعة</button><button onClick={() => { setPlan([]); localStorage.removeItem("sense-tourism-plan-v1"); }} className="rounded-xl border border-[#17393b]/20 px-4 py-3 text-sm font-extrabold">مسح</button></div></div></section>
      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[#17393b]/15 py-7 text-sm text-[#17393b]/55"><p className="inline-flex items-center gap-2"><UsersRound size={16} />النسخة التجريبية لا تجمع حسابات أو بيانات شخصية.</p><Link href={sensePortalHref} className="font-extrabold text-[#b86b23]">العودة إلى البوابة <ArrowLeft size={16} className="inline" /></Link></footer>
    </div>
  </main>;
}
