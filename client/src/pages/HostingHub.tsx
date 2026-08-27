import { ArrowLeft, BadgeCheck, CalendarDays, Check, Handshake, Home, LockKeyhole, MapPin, MessageCircle, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { sensePortalHref, loyaltyExplainerHref, recoveryIdentityHref } from "@/lib/sensePortalRoute";
import { isStudentNeed, isStudentWindow, studentInterestPrivacyNotice, summarizeStudentInterest, type StudentNeed, type StudentWindow } from "@/lib/studentInterestModel";

type HostingMode = "home" | "hosts" | "guests" | "programs";

const modes: Array<{ id: HostingMode; label: string; description: string; icon: typeof Home }> = [
  { id: "home", label: "مدخل الاستضافة", description: "من الحاجة إلى الجلوس والعمل والمشاركة.", icon: Home },
  { id: "hosts", label: "للمضيفين", description: "حوّل مكانك إلى مساحة واضحة الاستضافة والحدود.", icon: Handshake },
  { id: "guests", label: "للمستضافين", description: "اعثر على بيئة مناسبة لمهمة أو اجتماع.", icon: UsersRound },
  { id: "programs", label: "البرامج والرعاة", description: "نسّق لقاءً أو نشاطًا أو مبادرة محلية.", icon: CalendarDays },
];

const principles = [
  "استضافة واضحة الغرض والمدة، لا وعدًا مفتوحًا أو حجزًا غير مؤكد.",
  "تقدير متبادل بين المضيف والمستضاف، دون تحويل العلاقة إلى رصيد نقدي تلقائي.",
  "إتاحة تدريجية: نبدأ بالحاجة، ثم نفتح باب الرفاهية والمشاركة.",
  "خصوصية عملية: لا تتبع دائم للموقع، ولا نشر لأسماء الضيوف أو بياناتهم للعامة.",
];

export default function HostingHub() {
  const initialMode = getModeFromLocation();
  const [mode, setMode] = useState<HostingMode>(initialMode);
  const [notice, setNotice] = useState<string | null>(null);
  const [interest, setInterest] = useState("");
  const [studentNeed, setStudentNeed] = useState<StudentNeed>("quiet");
  const [studentWindow, setStudentWindow] = useState<StudentWindow>("short");
  const active = modes.find((item) => item.id === mode)!;

  const submitInterest = () => {
    if (!interest) {
      setNotice("اختر نوع المشاركة أولًا؛ النموذج لا يرسل بيانات خارجية.");
      return;
    }
    const extra = interest === "student-space" ? ` ${summarizeStudentInterest(studentNeed, studentWindow)}` : "";
    setNotice(`سُجلت تفضيلاتك داخل هذه المعاينة فقط.${extra} لا تُرسل بياناتك ولا ينشأ حجز أو التزام.`);
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#f4f6f2] text-[#173c3b]">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-5 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#173c3b]/15 pb-5">
          <Link href={sensePortalHref} className="inline-flex items-center gap-3 font-extrabold hover:text-[#a87521]">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#173f3c] text-[#f5ce75]"><Home size={21} /></span>
            <span><b className="block text-lg">SENSE / الاستضافة</b><small className="text-[#58706a]">مضيفون، مستضافون، وبرامج تنمو بوضوح</small></span>
          </Link>
          <span className="inline-flex items-center gap-2 rounded-xl border border-[#173f3c]/15 px-3 py-2 text-sm font-extrabold text-[#526c65]"><LockKeyhole size={16} />لا حجز أو دفع في هذه النسخة</span>
        </header>

        <section className="grid gap-8 py-12 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <div><p className="inline-flex rounded-full bg-[#e7cf99]/50 px-3 py-1.5 text-xs font-extrabold text-[#765617]">الاستضافة كحق وصول ومشاركة</p><h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-[1.15] sm:text-6xl">مكانٌ يرحّب بك، <span className="text-[#a87521]">ومسارٌ يحمي وقتك.</span></h1><p className="mt-5 max-w-3xl text-lg leading-8 text-[#527068]">تجمع SENSE بين حاجة الجلوس والعمل والاجتماع وبين تجربة الاستضافة المجتمعية. يبدأ المسار بمهمة محددة، ثم يفتح المجال لأنشطة أوسع: تعلم، ترفيه، لقاء، أو تعاون.</p></div>
          <aside className="rounded-[2rem] bg-[#173f3c] p-7 text-white"><ShieldCheck className="text-[#f5ce75]" size={24} /><h2 className="mt-5 text-2xl font-extrabold">الولاء هنا متبادل</h2><p className="mt-3 leading-7 text-[#c7ddd4]">يقدّم المضيف وضوح المكان وكرم الاستضافة، ويصل المستضاف باحترام للوقت والخصوصية. بطاقة الولاء قد تصبح لاحقًا وسيلة تقدير معتمدة، لكنها ليست رصيدًا أو وعدًا ماليًا في هذه النسخة.</p><Link href={loyaltyExplainerHref} className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#f5ce75]">افهم نموذج الاستحقاق <ArrowLeft size={16} /></Link></aside>
        </section>

        <nav aria-label="مسارات الاستضافة" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{modes.map((item) => { const Icon = item.icon; const selected = item.id === mode; return <button key={item.id} type="button" onClick={() => { setMode(item.id); setNotice(null); }} className={`min-h-32 rounded-2xl border p-5 text-right transition-colors ${selected ? "border-[#a87521] bg-[#fff8e9]" : "border-[#173f3c]/15 bg-white hover:border-[#a87521]/60"}`}><Icon className={selected ? "text-[#a87521]" : "text-[#55716a]"} size={22} /><b className="mt-5 block text-lg">{item.label}</b><span className="mt-1 block text-sm leading-6 text-[#58716a]">{item.description}</span></button>; })}</nav>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <article className="rounded-[1.7rem] border border-[#173f3c]/15 bg-white p-6"><p className="text-sm font-extrabold text-[#a87521]">{mode === "home" ? "01 · الفكرة" : `01 · ${active.label}`}</p><h2 className="mt-2 text-3xl font-extrabold">{mode === "home" ? "من الحاجة إلى الرفاهية، بلا قفزة غير محسوبة." : active.label}</h2>{mode === "home" && <div className="mt-6 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl bg-[#eef2e9] p-5"><Sparkles className="text-[#a87521]" size={21} /><h3 className="mt-4 font-extrabold">الحاجة</h3><p className="mt-2 text-sm leading-6 text-[#58716a]">مكان هادئ لمهمة، جلسة تعلم، أو اجتماع قصير.</p></div><div className="rounded-2xl bg-[#f8f0df] p-5"><MessageCircle className="text-[#a87521]" size={21} /><h3 className="mt-4 font-extrabold">الاستضافة</h3><p className="mt-2 text-sm leading-6 text-[#58716a]">ترحيب واضح من مكان يحدد ما يستطيع تقديمه.</p></div><div className="rounded-2xl bg-[#e9f0f3] p-5"><BadgeCheck className="text-[#a87521]" size={21} /><h3 className="mt-4 font-extrabold">المشاركة</h3><p className="mt-2 text-sm leading-6 text-[#58716a]">نشاط أو برنامج يوسّع الوصول حين تتوافر الشراكة.</p></div></div>}{mode === "hosts" && <HostPanel />}{mode === "guests" && <GuestPanel />}{mode === "programs" && <ProgramsPanel />}</article>
          <aside className="rounded-[1.7rem] border border-[#173f3c]/15 bg-[#fdfcf6] p-6"><MapPin className="text-[#a87521]" size={22} /><h2 className="mt-4 text-2xl font-extrabold">المكان الذي تحدثنا عنه</h2><p className="mt-3 leading-7 text-[#58716a]">يمكن لمقهى أو مساحة شريكة أن تستضيف اجتماعًا أو جلسة عمل أو نشاطًا تعليميًا ترفيهيًا، مثل ورشة أو لقاء تعارف أو وقتًا اجتماعيًا. لا نعلن اسمًا أو توافرًا قبل موافقة المضيف وتحديد العرض.</p><div className="mt-5 border-t border-[#173f3c]/10 pt-5"><h3 className="font-extrabold">ما الذي يحتاج إلى شريك؟</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-[#58716a]">{principles.map((item) => <li key={item} className="flex gap-2"><Check className="mt-1 shrink-0 text-[#a87521]" size={15} />{item}</li>)}</ul></div><Link href={recoveryIdentityHref} className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#805c1b]">اربطها بهوية المنتج والوصول <ArrowLeft size={16} /></Link></aside>
        </section>

        <section className="mt-8 rounded-[1.7rem] border border-[#173f3c]/15 bg-[#173f3c] p-6 text-white"><p className="text-sm font-extrabold text-[#f5ce75]">02 · مبادرات قابلة للتوسع</p><h2 className="mt-2 text-3xl font-extrabold">من الاستضافة إلى مساكن الخير وفرص الطلاب.</h2><p className="mt-3 max-w-4xl leading-7 text-[#c7ddd4]">هذا مدخل أولي لمبادرات لاحقة: فرص سكن أو مكان للطلاب، مساحات عمل، برامج رعاية، ومحتوى يوثق قصص المضيفين وحديث الشارع. لا يعني ظهوره أن شواغر أو مساكن أو منحًا مفتوحة الآن.</p><div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end"><label className="text-sm font-bold text-[#d9e7df]">اختر اهتمامك الأولي<select value={interest} onChange={(event) => setInterest(event.target.value)} className="mt-2 block min-h-11 w-full rounded-xl border border-white/15 bg-white/10 px-3 text-white outline-none"><option value="" className="text-[#173c3b]">اختر مسارًا</option><option value="student-space" className="text-[#173c3b]">مكان مؤقت للطلاب</option><option value="host" className="text-[#173c3b]">أرغب في الاستضافة</option><option value="program" className="text-[#173c3b]">أرغب في رعاية برنامج</option></select></label><button type="button" onClick={submitInterest} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#f5ce75] px-5 font-extrabold text-[#173c3b]">عرض الخطوة التالية <ArrowLeft size={16} /></button></div>{interest === "student-space" && <div className="mt-4 grid gap-4 rounded-2xl border border-white/15 bg-white/5 p-4 sm:grid-cols-2"><label className="text-sm font-bold text-[#d9e7df]">نوع المساحة<select value={studentNeed} onChange={(event) => { if (isStudentNeed(event.target.value)) setStudentNeed(event.target.value); }} className="mt-2 block min-h-11 w-full rounded-xl border border-white/15 bg-white/10 px-3 text-white outline-none"><option value="quiet" className="text-[#173c3b]">مكان هادئ</option><option value="study" className="text-[#173c3b]">جلسة تعلم</option><option value="team" className="text-[#173c3b]">عمل جماعي</option></select></label><label className="text-sm font-bold text-[#d9e7df]">الإطار التقريبي<select value={studentWindow} onChange={(event) => { if (isStudentWindow(event.target.value)) setStudentWindow(event.target.value); }} className="mt-2 block min-h-11 w-full rounded-xl border border-white/15 bg-white/10 px-3 text-white outline-none"><option value="short" className="text-[#173c3b]">جلسة قصيرة</option><option value="day" className="text-[#173c3b]">جزء من يوم</option><option value="recurring" className="text-[#173c3b]">احتياج متكرر</option></select></label><p className="sm:col-span-2 text-xs leading-6 text-[#c7ddd4]">{studentInterestPrivacyNotice}</p></div>}{notice && <p className="mt-4 text-sm font-bold text-[#f5ce75]" role="status">{notice}</p>}</section>
        <section className="mt-8 grid gap-4 border-t border-[#173f3c]/15 pt-8 sm:grid-cols-2"><figure className="overflow-hidden rounded-[1.7rem] bg-[#e7eee8]"><img src="/manus-storage/SENSE_mutual_loyalty_square_75467e5a.png" alt="مشهد رمزي لمساحة مشتركة وبطاقة تقدير بين طرفين" className="h-64 w-full object-contain" /><figcaption className="px-5 pb-5 text-sm leading-6 text-[#58716a]">صورة رمزية: الولاء بوصفه علاقة تقدير متبادل، لا رصيدًا ماليًا جاهزًا.</figcaption></figure><figure className="overflow-hidden rounded-[1.7rem] bg-[#f5ecd9]"><img src="/manus-storage/SENSE_mutual_hosting_vertical_98e0c120.png" alt="مساحة مجتمعية رمزية تستقبل مستضافًا للعمل أو الاجتماع" className="h-64 w-full object-contain" /><figcaption className="px-5 pb-5 text-sm leading-6 text-[#58716a]">صورة رمزية: المكان يرحب بالمهمة ويحمي خصوصية من يستخدمه.</figcaption></figure></section>\n\n        <section className="mt-8 border-t border-[#173f3c]/15 pt-8"><p className="text-sm font-extrabold text-[#a87521]">03 · ذاكرة المكان</p><div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-3xl font-extrabold">نوثّق ما يفعله المضيف، لا ما نتخيله عنه.</h2><p className="mt-3 max-w-3xl leading-7 text-[#58716a]">يمكن أن يصبح كل مكان مصدرًا لمحتوى مسؤول: فيديو قصير بإذن، صورة للمساحة دون وجوه، مقالة عن التجربة، أو حديث شارع يوافق أصحابه على نشره. يبقى النشر منفصلًا عن الحجز، ولا نعرض عنوانًا أو اسمًا قبل موافقة صريحة.</p></div><span className="rounded-xl bg-[#e7cf99]/50 px-3 py-2 text-xs font-extrabold text-[#765617]">محتوى بإذن · بلا تتبع</span></div><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[{ title: "فيديو", text: "لقطة من التحضير أو النشاط، بلا كشف هوية غير مصرح بها." }, { title: "صورة", text: "تفاصيل المكان والمنتج والجو العام بدل تصوير الأشخاص." }, { title: "مقالة", text: "قصة تشرح الحاجة والمسار والأثر القابل للتحقق." }, { title: "حديث الشارع", text: "صوت المجتمع كما يختار أصحابه أن يُسمع." }].map((item) => <div key={item.title} className="rounded-2xl bg-white p-5"><b className="text-lg">{item.title}</b><p className="mt-2 text-sm leading-6 text-[#58716a]">{item.text}</p></div>)}</div></section>
      </div>
    </main>
  );
}

function getModeFromLocation(): HostingMode {
  const queryMode = new URLSearchParams(window.location.search).get("mode");
  if (queryMode === "hosts" || queryMode === "guests" || queryMode === "programs") return queryMode;
  if (window.location.pathname.includes("المضيفون")) return "hosts";
  if (window.location.pathname.includes("المستضافون")) return "guests";
  if (window.location.pathname.includes("البرامج")) return "programs";
  return "home";
}

function HostPanel() { return <div className="mt-6 space-y-4 text-[#58716a]"><p className="leading-7">المضيف ليس مجرد صاحب مكان؛ هو شريك يحدد ساعات الاستضافة، نوع النشاط، السعة، ما هو مجاني، وما يحتاج مساهمة أو شراءً اختياريًا. يبدأ كل شيء بملف عرض قابل للمراجعة، لا بإعلان توافر غير مؤكد.</p><div className="grid gap-3 sm:grid-cols-2">{["بطاقة عرض المكان وحدوده", "مواعيد قابلة للتنسيق", "سياسة احترام وخصوصية", "توثيق محتوى بإذن المضيف"].map((item) => <div key={item} className="rounded-xl bg-[#eef2e9] p-4 font-bold">{item}</div>)}</div></div>; }
function GuestPanel() { return <div className="mt-6 space-y-4 text-[#58716a]"><p className="leading-7">المستضاف يحدد حاجته بدل أن يطلب «أي مكان»: جلسة فردية، عمل جماعي، اجتماع، تعلم، أو نشاط. لا نعرض عنوانًا دقيقًا أو حجزًا مؤكدًا قبل وجود مضيف مصادق عليه وموافقة واضحة.</p><div className="grid gap-3 sm:grid-cols-2">{["مهمة ومدة واضحتان", "إتاحة وهدوء مناسب", "وصول دون تتبع دائم", "تقييم تجربة بإذن مستقل"].map((item) => <div key={item} className="rounded-xl bg-[#e9f0f3] p-4 font-bold">{item}</div>)}</div></div>; }
function ProgramsPanel() { return <div className="mt-6 space-y-4 text-[#58716a]"><p className="leading-7">البرنامج هو الحلقة التي تجمع مضيفًا ومستضافين وراعيًا حول نشاط قابل للقياس: جلسة تعلم، لقاء مجتمع، ورشة، نشاط ترفيهي، أو تسجيل حديث شارع. الرعاية هنا دعم لنطاق محدد، وليست تبرعًا أو وعدًا بأثر غير موثق.</p><div className="grid gap-3 sm:grid-cols-3">{["لقاءات", "أنشطة", "محتوى"].map((item) => <div key={item} className="rounded-xl bg-[#f8f0df] p-4 text-center font-bold">{item}</div>)}</div></div>; }
