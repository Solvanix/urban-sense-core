import { ArrowLeft, BadgeCheck, Building2, ClipboardList, LockKeyhole, Scale, ShieldCheck, UsersRound } from "lucide-react";
import { Link } from "wouter";
import { masakenAlKhairHref, sensePortalHref } from "@/lib/sensePortalRoute";

type StandardState = "معيار تصميمي" | "يتطلب اعتمادًا" | "غير متاح الآن";

type Standard = {
  id: string;
  title: string;
  owner: string;
  state: StandardState;
  outcome: string;
  evidence: string;
  boundary: string;
};

export const masakenStandards: Standard[] = [
  { id: "unit", title: "وحدة صادقة وآمنة مبدئيًا", owner: "مالك + مختص مخوّل", state: "يتطلب اعتمادًا", outcome: "وصف صادق، خصوصية، مرافق أساسية، وحالة تحقق بتاريخ.", evidence: "قائمة تحقق يراجعها مختص محلي؛ ليست شهادة هندسية تلقائية.", boundary: "لا صورة عامة أو عنوان دقيق أو ادعاء سلامة بلا فحص مخوّل." },
  { id: "price", title: "سعر ميسر وواضح", owner: "مالك + جهة مشغلة", state: "معيار تصميمي", outcome: "سعر ومدة ورسوم معروفة قبل الإحالة.", evidence: "عرض خاص يوافق عليه المالك قبل أي إحالة.", boundary: "لا تسعير مفروض ولا ضمان إيجار أو دعم غير ممول." },
  { id: "dignity", title: "كرامة وخصوصية الساكن", owner: "شريك الإحالة + مسؤول البيانات", state: "معيار تصميمي", outcome: "لا عرض لظروف الساكن أو صوره على المالك أو الجمهور بلا ضرورة وموافقة.", evidence: "حد أدنى من بيانات الإحالة وسجل موافقات.", boundary: "لا تصنيف آلي خفي ولا طلب «إثبات حاجة» علني." },
  { id: "landlord", title: "حق المالك ومسار حل واضح", owner: "مسؤول العلاقة", state: "يتطلب اعتمادًا", outcome: "نقطة اتصال واحدة وساعات استجابة ومسار تصعيد معلوم.", evidence: "ميثاق مالك وخطة استجابة مع جهة مشغلة مسماة.", boundary: "لا تعد المبادرة بتغطية ضرر أو شغور بلا تمويل مكتوب." },
  { id: "referral", title: "إحالة بشرية منصفة", owner: "شريك إحالة مستقل", state: "يتطلب اعتمادًا", outcome: "اختيار مستفيد من فئة تجربة معلنة، مع قرار مسبب وقابل للتظلم.", evidence: "معايير إحالة ومراجعة قانونية وسياسة منع تمييز.", boundary: "لا خوارزمية تقرر من يستحق السكن ولا مشاركة ملف اجتماعي كامل." },
  { id: "access", title: "وصف وصول لا ادعاء إتاحة", owner: "مالك + فاحص مخوّل", state: "معيار تصميمي", outcome: "معلومات واقعية عن الدرج والمسار والمرافق والاتصال قبل الزيارة.", evidence: "وصف محدث وتاريخ فحص، لا شهادة عامة.", boundary: "لا نقول إن الوحدة مهيأة لذوي الإعاقة قبل تحقق ميداني تشاركي." },
  { id: "governance", title: "حوكمة وعقد مباشر", owner: "عمر الفاروق + كيان مشغّل + محامٍ محلي", state: "غير متاح الآن", outcome: "طرف تشغيل قانوني، عقد مباشر بين أطراف الإيجار، وحذف منضبط للبيانات.", evidence: "كيان معتمد ومراجعة قانونية لنموذج العقد والخصوصية.", boundary: "لا تحصيل إيجار أو وديعة أو توقيع بالنيابة داخل SENSE." },
];

const stateTone: Record<StandardState, string> = {
  "معيار تصميمي": "border-sky-300/30 bg-sky-300/10 text-sky-100",
  "يتطلب اعتمادًا": "border-amber-300/30 bg-amber-300/10 text-amber-100",
  "غير متاح الآن": "border-white/20 bg-white/[.06] text-white/65",
};

const checkpoints = [
  ["اهتمام خاص", "لا عنوان دقيق أو صور عامة؛ المالك يقرر فقط إن كان يريد لقاء تعريفيًا."],
  ["مكالمة فهم", "توضيح الفئة والمدة والسعر المقترح والحدود، بلا وعد بتمويل أو ضمان."],
  ["تحقق وحدة", "قائمة تحقق محدودة يراجعها مخوّل قبل إحالة أي ساكن."],
  ["عرض خاص", "سعر ومدة وقواعد وحدة خاصة، لا قائمة عامة ولا خريطة."],
  ["إحالة بشرية", "شريك إحالة يقرر وفق معيار معلن؛ لا قرار خوارزمي."],
  ["عقد مباشر", "المالك والساكن يوقعان وفق القانون المحلي؛ SENSE يوثق الحالة فقط."],
  ["متابعة وتظلم", "مسؤول علاقة وسجل دعم محدود يحترم خصوصية الطرفين."],
] as const;

export default function MasakenAlKhair() {
  return <main dir="rtl" className="min-h-screen bg-[#081517] text-[#f7f8f1]"><div className="mx-auto max-w-7xl px-5 pb-16 pt-5 lg:px-8">
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5"><Link href={sensePortalHref} className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e3a238] text-[#10272b]"><Building2 size={21} /></span><div><p className="font-extrabold tracking-tight">مساكن الخير</p><p className="text-xs font-bold text-white/50">إطار سكن كريم بقيادة عمر الفاروق · ضمن SenseCity/SENSE</p></div></Link><nav className="flex items-center gap-2"><Link href={masakenAlKhairHref} className="rounded-xl border border-[#e3a238]/45 bg-[#e3a238]/10 px-3 py-2 text-sm font-extrabold text-[#f8d68a]">لوحة المعايير</Link><Link href={sensePortalHref} className="rounded-xl border border-white/15 px-3 py-2 text-sm font-extrabold text-white/75">بوابة SENSE</Link></nav></header>

    <section className="grid gap-8 py-12 lg:grid-cols-[1.13fr_.87fr] lg:items-end"><div><p className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1.5 text-xs font-extrabold text-amber-100"><ShieldCheck size={14} />لا قوائم عامة ولا وعود مالية</p><h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-[1.14] tracking-tight sm:text-6xl">سكن كريم يقوم على <span className="text-[#e3a238]">معايير قابلة للمراجعة</span>.</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-white/65">مساكن الخير مبادرة علاقة سكنية منضبطة بين مالك يشارك طوعًا، ومستفيد يُحال بكرامة، وجهة تشغيل واضحة. هذه الصفحة تعرض المعيار وحالته وحدوده؛ لا تعرض وحدة حقيقية ولا تستقبل طلبات سكن.</p></div><aside className="border-t-4 border-[#e3a238] bg-white/[.05] p-6"><p className="text-sm font-extrabold text-[#f7cc71]">قاعدة المبادرة</p><p className="mt-3 text-2xl font-extrabold leading-9">لا نطلب من المالك التنازل عن حقه، ولا نطلب من الساكن التنازل عن كرامته.</p><p className="mt-4 text-sm leading-7 text-white/60">العقد النهائي مباشر ونظامي بين الأطراف بعد مراجعة محلية؛ SENSE طبقة حوكمة ومنتج لا مؤجر ولا ضامن.</p></aside></section>

    <section className="border-y border-white/10 py-10" aria-labelledby="standards-title"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm font-extrabold text-[#e3a238]">سجل المعايير</p><h2 id="standards-title" className="mt-1 text-3xl font-extrabold">ما الذي يجب أن يتحقق قبل الانتقال إلى المرحلة التالية؟</h2></div><p className="max-w-xl text-sm leading-7 text-white/55">الحالة ليست شهادة: «معيار تصميمي» يعني أن المبدأ معتمد في التصور، و«يتطلب اعتمادًا» يعني أنه لا يعمل قبل شريك/قانون/مختص، و«غير متاح» يعني أننا لا نقدمه بعد.</p></div>
      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{masakenStandards.map((standard) => <article key={standard.id} className="min-h-80 border border-white/10 bg-white/[.035] p-5"><div className="flex items-start justify-between gap-3"><span className="flex h-10 w-10 items-center justify-center bg-white/10 text-[#f4c86d]"><BadgeCheck size={20} /></span><span className={`rounded-full border px-2.5 py-1 text-[11px] font-extrabold ${stateTone[standard.state]}`}>{standard.state}</span></div><h3 className="mt-6 text-xl font-extrabold">{standard.title}</h3><p className="mt-3 text-sm font-bold text-[#f3c76a]">المسؤول: {standard.owner}</p><p className="mt-4 text-sm leading-7 text-white/65">{standard.outcome}</p><div className="mt-5 border-t border-white/10 pt-4 text-sm leading-6 text-white/55"><p><b className="text-white/80">دليل القبول:</b> {standard.evidence}</p><p className="mt-3"><b className="text-amber-100">الحد:</b> {standard.boundary}</p></div></article>)}</div>
    </section>

    <section className="grid gap-7 py-12 lg:grid-cols-[.83fr_1.17fr]"><aside className="border border-white/10 bg-[#102e31] p-6"><ClipboardList className="text-[#f3c76a]" size={24} /><h2 className="mt-5 text-2xl font-extrabold">بوابات لا نتجاوزها</h2><ul className="mt-5 space-y-4 text-sm leading-7 text-white/70"><li className="flex gap-3"><LockKeyhole className="mt-1 shrink-0 text-amber-200" size={17} />لا اسم مالك، عنوان دقيق، صورة وحدة، أو قصة مستفيد قبل موافقة منفصلة وسياسة نشر.</li><li className="flex gap-3"><Scale className="mt-1 shrink-0 text-amber-200" size={17} />لا معايير أهلية أو عقد أو تسعير أو منع تمييز من دون مراجعة قانونية محلية.</li><li className="flex gap-3"><UsersRound className="mt-1 shrink-0 text-amber-200" size={17} />لا إحالة بموجب خوارزمية أو «درجة استحقاق»؛ القرار البشري قابل للتفسير والتظلم.</li></ul></aside>
      <section><p className="text-sm font-extrabold text-[#e3a238]">مسار التفعيل</p><h2 className="mt-1 text-3xl font-extrabold">سبع محطات قبل سكن فعلي</h2><ol className="mt-6 grid gap-3 sm:grid-cols-2">{checkpoints.map(([title, text], index) => <li key={title} className="border-r-2 border-[#e3a238] bg-white/[.035] px-4 py-4"><span className="text-xs font-extrabold text-[#f3c76a]">0{index + 1}</span><h3 className="mt-1 text-lg font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/60">{text}</p></li>)}</ol></section>
    </section>

    <section className="border-y border-white/10 bg-amber-300/[.055] py-8"><div className="grid gap-5 md:grid-cols-3"><div><p className="text-sm font-extrabold text-[#f3c76a]">قرار 01</p><h2 className="mt-2 text-xl font-extrabold">حدد النطاق الأول</h2><p className="mt-3 text-sm leading-7 text-white/60">مدينة واحدة وفئة واحدة وشريك إحالة واحد؛ التوصية الأولية هي طلاب أو متدربون موثقون.</p></div><div><p className="text-sm font-extrabold text-[#f3c76a]">قرار 02</p><h2 className="mt-2 text-xl font-extrabold">سمِّ الجهة المشغلة</h2><p className="mt-3 text-sm leading-7 text-white/60">من يتلقى الشكوى؟ من يراجع الإحالة؟ ومن يملك حق التصعيد؟ لا يكفي الاسم أو الواجهة.</p></div><div><p className="text-sm font-extrabold text-[#f3c76a]">قرار 03</p><h2 className="mt-2 text-xl font-extrabold">كن صريحًا في التمويل</h2><p className="mt-3 text-sm leading-7 text-white/60">إما تمويل موثق لأي ضمان/صندوق مخاطر، أو تصريح واضح بأنه لا يوجد ضمان مالي في التجربة.</p></div></div>
    </section>
    <footer className="flex flex-wrap justify-between gap-4 border-t border-white/10 pt-7 text-sm text-white/50"><span>اللوحة تعرض معايير المبادرة لا عروض سكن أو أهلية أفراد.</span><a href="https://github.com/Solvanix/urban-sense-core/blob/main/docs/masaken-al-khair/INITIATIVE-BLUEPRINT.md" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-extrabold text-[#f7cc71]">اقرأ تصور المبادرة الكامل <ArrowLeft size={16} /></a></footer>
  </div></main>;
}
