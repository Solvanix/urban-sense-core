import { cn } from "@/lib/utils";
import { getGrowthOutcome, type GrowthChoice, type GrowthGoal } from "@/lib/growthJourney";
import { ArrowLeft, BookOpen, Compass, RotateCcw, ShieldCheck, UserRound, UsersRound, Wrench } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { sensePortalHref } from "@/lib/sensePortalRoute";
import { learningProgramState, providerReadinessState } from "@/lib/senseProgramStates";

const goals: Array<{ id: GrowthGoal; icon: typeof BookOpen; label: string; title: string; text: string; output: string }> = [
  { id: "skill", icon: BookOpen, label: "مهارة أو مسار مهني", title: "أريد أن أطوّر مهارة لدي", text: "ابدأ من نتيجة تستطيع ملاحظتها، لا من اسم دورة فقط.", output: "مخرج تعلم قصير أو ملف عمل أولي" },
  { id: "offer", icon: Compass, label: "خدمة أو تجربة", title: "أريد أن أحسن ما أقدمه للناس", text: "حوّل الفكرة إلى وصف صادق وخطوة يختبرها شخص حقيقي.", output: "عرض خدمة أو تجربة قابلة للمراجعة" },
  { id: "maker", icon: Wrench, label: "فكرة أو نموذج", title: "أريد أن أحول فكرة إلى نموذج", text: "ابدأ بمواصفات ورسم أو نموذج أولي قبل التفكير في آلة أو بيع.", output: "مواصفات أو تصميم أولي قابل للمعاينة" }
];

const choices: Array<{ id: GrowthChoice; label: string; text: string }> = [
  { id: "copy", label: "أبحث عن دورة أو فكرة لأقلدها كما هي", text: "الإلهام مفيد، لكنه لا يصنع اتجاهًا شخصيًا أو مخرجًا يمكن مراجعته." },
  { id: "small-output", label: "أختار مخرجًا صغيرًا أستطيع تجربته", text: "أحدد ما الذي سأصنعه أو أصفه أو أتعلمه، ثم أراجع النتيجة." },
  { id: "team-first", label: "أجمع فريقًا قبل أن أحدد ما سأفعل", text: "قد يصبح الفريق ضروريًا لاحقًا، لكن لا ينبغي أن يخفي غياب الهدف الفردي." }
];

const makerResearchSource = "https://github.com/Solvanix/urban-sense-core/blob/main/docs/research/GITHUB-AND-PALESTINIAN-REFERENCE-SCAN-2026-08-23.md";

export default function GrowthJourney() {
  const [goal, setGoal] = useState<GrowthGoal | null>(null);
  const [choice, setChoice] = useState<GrowthChoice | null>(null);
  const [teamNeed, setTeamNeed] = useState<"yes" | "not-yet" | null>(null);

  const selectedGoal = goals.find((item) => item.id === goal) ?? null;
  const outcome = useMemo(() => goal && choice ? getGrowthOutcome(goal, choice) : null, [goal, choice]);

  function chooseGoal(nextGoal: GrowthGoal) {
    setGoal(nextGoal);
    setChoice(null);
    setTeamNeed(null);
  }

  function resetJourney() {
    setGoal(null);
    setChoice(null);
    setTeamNeed(null);
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f7f7f1] text-[#183a39]">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-5 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#173f3c]/15 pb-5">
          <Link href={sensePortalHref} className="inline-flex items-center gap-3 rounded-xl text-right hover:text-[#93651e]"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#173f3c] text-[#f5ce75]"><Compass size={22} /></span><span><b className="block text-lg">SENSE / نمو</b><small className="font-bold text-[#58706a]">تجربة قرار فردي قبل أن تصبح خطة</small></span></Link>
          <button type="button" onClick={resetJourney} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#173f3c]/20 px-3 text-sm font-extrabold text-[#35564f] hover:border-[#b98529]"><RotateCcw size={16} />ابدأ من جديد</button>
        </header>

        <section className="grid gap-8 py-10 lg:grid-cols-[1.12fr_.88fr] lg:items-end lg:py-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[#e9d098]/45 px-3 py-1.5 text-xs font-extrabold text-[#6c4e19]"><UserRound size={14} />رحلة فردية أولًا</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.16] tracking-tight sm:text-6xl">لا تبدأ من اسم فريق أو اسم دورة. ابدأ من <span className="text-[#a87521]">الخطوة التي تريد أن تثبتها.</span></h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#527068]">هذه تجربة تفاعلية عامة تساعدك على اختيار اتجاه فردي قابل للتجربة، ثم تشرح متى يصبح التعاون مفيدًا. لا تسجل اسمك، ولا تعدك بدورة أو شهادة أو قبول.</p>
          </div>
          <aside className="rounded-[2rem] bg-[#173f3c] p-6 text-[#f4f8f3] sm:p-8"><p className="text-sm font-extrabold text-[#f5ce75]">قاعدة المسار</p><p className="mt-6 text-2xl font-extrabold leading-9">الهدف يسبق الفريق. والمخرج يسبق العنوان الكبير.</p><p className="mt-4 leading-7 text-[#c8ddd5]">يظهر الفريق حين تحتاج المهمة فعلًا إلى أدوار متكاملة، لا لأن المسار يفترض أن التطور الفردي ناقص وحده.</p></aside>
        </section>

        {!goal ? <section aria-labelledby="goal-title"><div className="mb-6"><p className="text-sm font-extrabold text-[#a87521]">01 · اختر نقطة البداية</p><h2 id="goal-title" className="mt-1 text-3xl font-extrabold">ماذا تريد أن تدفعه خطوة إلى الأمام؟</h2></div><div className="grid gap-4 md:grid-cols-3">{goals.map((item) => { const Icon = item.icon; return <button key={item.id} type="button" onClick={() => chooseGoal(item.id)} className="group min-h-72 rounded-[1.7rem] border border-[#173f3c]/15 bg-white p-6 text-right shadow-sm transition-transform duration-150 hover:-translate-y-1 hover:border-[#b98529] active:scale-[.98]"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef2e9] text-[#9b6c1f]"><Icon size={21} /></span><p className="mt-7 text-xs font-extrabold text-[#98712c]">{item.label}</p><h3 className="mt-2 text-2xl font-extrabold">{item.title}</h3><p className="mt-4 text-sm leading-7 text-[#58716a]">{item.text}</p><span className="mt-7 inline-flex items-center gap-1 text-sm font-extrabold text-[#173f3c]">ابدأ هذا المشهد <ArrowLeft size={16} /></span></button>; })}</div></section> : <section className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <aside className="rounded-[1.8rem] bg-[#e9d098]/50 p-6"><p className="text-sm font-extrabold text-[#8a631e]">هدفك المختار</p><h2 className="mt-3 text-3xl font-extrabold">{selectedGoal?.title}</h2><p className="mt-5 leading-7 text-[#5b5131]">المخرج الأول المقترح: <b>{selectedGoal?.output}</b>.</p><button type="button" onClick={resetJourney} className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-[#6d4c14]"><RotateCcw size={16} />غيّر نقطة البداية</button></aside>
          <div><p className="text-sm font-extrabold text-[#a87521]">02 · مشهد القرار</p><h2 className="mt-2 text-3xl font-extrabold">وصلت إلى بداية المسار. كيف تتصرف؟</h2><p className="mt-3 max-w-2xl leading-7 text-[#58716a]">اختر قرارًا واحدًا لترى أثره. هذا ليس اختبارًا للنجاح أو الفشل؛ بل تمرين على تحويل النية إلى فعل قابل للمراجعة.</p><div className="mt-6 grid gap-3">{choices.map((item) => <button key={item.id} type="button" onClick={() => { setChoice(item.id); setTeamNeed(null); }} className={cn("rounded-2xl border p-5 text-right transition-colors", choice === item.id ? "border-[#a87521] bg-[#fff8e8]" : "border-[#173f3c]/15 bg-white hover:border-[#a87521]/55")}><b className="block text-lg">{item.label}</b><span className="mt-2 block text-sm leading-6 text-[#5d756d]">{item.text}</span></button>)}</div></div>
        </section>}

        {outcome && <section className={cn("mt-8 rounded-[2rem] border p-6 sm:p-8", outcome.kind === "ready" ? "border-emerald-600/20 bg-[#e5f0e7]" : "border-amber-500/30 bg-[#fff3d7]")} aria-live="polite"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-extrabold text-[#8d641e]">03 · أثر القرار</p><h2 className="mt-2 text-3xl font-extrabold">{outcome.title}</h2><p className="mt-4 max-w-3xl leading-8 text-[#4e685f]">{outcome.explanation}</p></div><span className="rounded-full bg-white/65 px-3 py-1.5 text-xs font-extrabold text-[#416057]">{outcome.kind === "ready" ? "خطوة قابلة للتجربة" : "فرصة إصلاح"}</span></div><div className="mt-7 rounded-2xl bg-white/65 p-5"><p className="font-extrabold">الخطوة التالية</p><p className="mt-2 leading-7 text-[#58716a]">{outcome.nextAction}</p></div>{outcome.kind === "repair" ? <button type="button" onClick={() => { setChoice(null); setTeamNeed(null); }} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#173f3c] px-4 text-sm font-extrabold text-white"><RotateCcw size={16} />حاول قرارًا آخر</button> : <div className="mt-7 grid gap-4 lg:grid-cols-2"><article className="rounded-2xl border border-[#173f3c]/15 bg-white/70 p-5"><div className="flex items-center gap-2"><UserRound className="text-[#a87521]" size={20} /><h3 className="text-xl font-extrabold">أبني خطوتي الفردية</h3></div><p className="mt-3 leading-7 text-[#58716a]">احتفظ بالمخرج الصغير، وابحث لاحقًا عن مراجعة أو برنامج معتمد يناسبه. لا يوجد تسجيل دورات أو قبول مفتوح هنا.</p><p className="mt-4 text-sm font-extrabold text-[#49635c]">الحالة: {learningProgramState.status}</p><p className="mt-1 text-sm leading-6 text-[#58716a]">{learningProgramState.description}</p><a href={learningProgramState.sourceHref} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#805c1b]">{learningProgramState.actionLabel} <ArrowLeft size={16} /></a></article><article className="rounded-2xl border border-[#173f3c]/15 bg-white/70 p-5"><div className="flex items-center gap-2"><UsersRound className="text-[#a87521]" size={20} /><h3 className="text-xl font-extrabold">هل يحتاج المخرج فريقًا؟</h3></div><p className="mt-3 leading-7 text-[#58716a]">اسأل فقط إن كنت تحتاج خبرة أو دورًا آخر لا يتوافر في خطوتك الفردية.</p><div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={() => setTeamNeed("not-yet")} className={cn("rounded-xl border px-3 py-2 text-sm font-extrabold", teamNeed === "not-yet" ? "border-[#173f3c] bg-[#173f3c] text-white" : "border-[#173f3c]/20 text-[#35564f]")}>ليس بعد</button><button type="button" onClick={() => setTeamNeed("yes")} className={cn("rounded-xl border px-3 py-2 text-sm font-extrabold", teamNeed === "yes" ? "border-[#173f3c] bg-[#173f3c] text-white" : "border-[#173f3c]/20 text-[#35564f]")}>نعم، أحتاج أدوارًا متكاملة</button></div>{teamNeed === "yes" ? <p className="mt-4 rounded-xl bg-[#eef2e9] p-3 text-sm leading-6 text-[#35564f]"><b>مسار التعاون:</b> عرّف التحدي، ثم الأدوار الناقصة، ثم الاتفاق على مخرج مشترك. لا يطلب هذا الموقع أسماء أعضاء أو ينشئ فريقًا الآن.</p> : teamNeed === "not-yet" ? <p className="mt-4 rounded-xl bg-[#eef2e9] p-3 text-sm leading-6 text-[#35564f]">احتفظ بالمسار فرديًا الآن. يمكنك إعادة فحص الحاجة إلى تعاون بعد ظهور حدود المخرج الأول.</p> : null}</article></div>}</section>}

        <section className="mt-12 grid gap-4 border-t border-[#173f3c]/15 pt-10 lg:grid-cols-3"><article className="rounded-[1.5rem] bg-[#173f3c] p-6 text-[#f4f8f3]"><ShieldCheck className="text-[#f5ce75]" size={22} /><h2 className="mt-5 text-xl font-extrabold">لا بيانات مخفية</h2><p className="mt-3 leading-7 text-[#c6dad2]">هذه الرحلة لا تطلب اسمًا أو هاتفًا أو سيرة ذاتية ولا تحفظ قرارك في قاعدة بيانات.</p></article><article className="rounded-[1.5rem] border border-[#173f3c]/15 bg-white p-6"><BookOpen className="text-[#a87521]" size={22} /><h2 className="mt-5 text-xl font-extrabold">التعلم المعتمد لاحقًا</h2><p className="mt-3 leading-7 text-[#58716a]">{learningProgramState.description}</p><p className="mt-3 text-sm font-extrabold text-[#49635c]">الحالة: {learningProgramState.status}</p></article><article className="rounded-[1.5rem] border border-[#173f3c]/15 bg-white p-6"><Compass className="text-[#a87521]" size={22} /><h2 className="mt-5 text-xl font-extrabold">مسارات متخصصة مستقلة</h2><p className="mt-3 leading-7 text-[#58716a]">{providerReadinessState.description}</p><p className="mt-3 text-sm font-extrabold text-[#49635c]">الحالة: {providerReadinessState.status}</p><div className="mt-5 flex flex-wrap gap-3"><a href={providerReadinessState.sourceHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-extrabold text-[#805c1b]">{providerReadinessState.actionLabel} <ArrowLeft size={15} /></a><a href={makerResearchSource} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-extrabold text-[#805c1b]">مسار التصنيع <ArrowLeft size={15} /></a></div></article></section>
      </div>
    </main>
  );
}
