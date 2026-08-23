import { Accessibility, ArrowLeft, BookOpenCheck, BriefcaseBusiness, Check, CheckCircle2, ChevronLeft, Copy, House, LockKeyhole, MapPinned, Palette, Plus, Printer, RotateCcw, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { independenceGoals, independenceStorageKey, createIndependencePlan, normalizeIndependencePlan, planProgress, planSummary, switchIndependenceGoal, type IndependenceGoalId, type IndependencePlan } from "@/lib/independencePath";
import { sensePortalHref } from "@/lib/sensePortalRoute";

const goalIcons = { mobility: MapPinned, study: BookOpenCheck, work: BriefcaseBusiness, create: Palette, housing: House } as const;

function loadPlan() {
  try { return normalizeIndependencePlan(JSON.parse(window.localStorage.getItem(independenceStorageKey) ?? "null")); } catch { return createIndependencePlan(); }
}

export default function IndependencePath() {
  const [plan, setPlan] = useState<IndependencePlan>(loadPlan);
  const [newStep, setNewStep] = useState("");
  const [notice, setNotice] = useState("");
  const activeGoal = useMemo(() => independenceGoals.find((goal) => goal.id === plan.goalId) ?? independenceGoals[0]!, [plan.goalId]);
  const progress = useMemo(() => planProgress(plan), [plan]);

  useEffect(() => { window.localStorage.setItem(independenceStorageKey, JSON.stringify(plan)); }, [plan]);

  function updatePlan(next: IndependencePlan) { setPlan({ ...next, updatedAt: new Date().toISOString() }); }
  function toggleStep(id: string) { updatePlan({ ...plan, steps: plan.steps.map((step) => step.id === id ? { ...step, done: !step.done } : step) }); }
  function addStep() {
    const label = newStep.trim();
    if (!label) return;
    updatePlan({ ...plan, steps: [...plan.steps, { id: `personal-${Date.now()}`, label: label.slice(0, 220), done: false, source: "personal" }] });
    setNewStep("");
  }
  async function copySummary() {
    const summary = planSummary(plan);
    try { await navigator.clipboard.writeText(summary); setNotice("نُسخ ملخص خطتك محليًا. راجع ما تشاركه قبل إرساله لأي جهة."); } catch { setNotice("تعذر النسخ من المتصفح. استخدم الطباعة أو انسخ الخطوات يدويًا."); }
  }
  function resetPlan() { const next = createIndependencePlan(); setPlan(next); setNewStep(""); setNotice("بدأت خطة جديدة على هذا الجهاز فقط."); }

  return <main dir="rtl" className="min-h-screen bg-[#eef4f3] text-[#17383a]">
    <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8 lg:py-9">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#17383a]/10 pb-5">
        <div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#126b69] text-white"><Accessibility size={24} /></span><div><p className="text-lg font-extrabold">SenseCity</p><p className="text-sm font-bold text-[#17383a]/60">مسار الاستقلال — أداة شخصية بلا حساب</p></div></div>
        <Link href={sensePortalHref} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#17383a]/15 bg-white px-4 text-sm font-extrabold text-[#17383a] hover:border-[#126b69]"><ArrowLeft size={17} />بوابة SenseCity</Link>
      </header>

      <section className="grid gap-7 py-9 lg:grid-cols-[1.08fr_.92fr] lg:items-start">
        <div><p className="inline-flex items-center gap-2 rounded-full bg-[#126b69]/10 px-3 py-1.5 text-xs font-extrabold text-[#0a4d4b]"><ShieldCheck size={14} />تُحفظ خطتك على جهازك فقط</p><h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.18] tracking-tight sm:text-5xl">حوّل ما تريد أن تفعله إلى <span className="text-[#126b69]">خطوات تخصك.</span></h1><p className="mt-5 max-w-3xl text-lg leading-8 text-[#17383a]/70">اختر مسارًا، عدّل الخطوات، وتتبع ما أنجزته. لا نطلب تشخيصًا أو هوية، ولا نرسل خطتك إلى مزود أو جهة توظيف أو مالك سكن.</p></div>
        <aside className="rounded-[1.8rem] border border-[#126b69]/15 bg-[#17383a] p-6 text-white"><p className="text-xs font-extrabold text-[#b4e5dd]">حدود الأداة</p><h2 className="mt-2 text-2xl font-extrabold">قرارك لك.</h2><ul className="mt-5 space-y-3 text-sm leading-6 text-white/75"><li className="flex gap-3"><Check size={17} className="mt-1 shrink-0 text-[#92d7ca]" />تساعدك على ترتيب ما تريد أن تسأل عنه أو تفعله.</li><li className="flex gap-3"><LockKeyhole size={17} className="mt-1 shrink-0 text-[#92d7ca]" />لا تحفظ تشخيصًا ولا تجمع تفاصيل شخصية أو موقعًا دقيقًا.</li><li className="flex gap-3"><CheckCircle2 size={17} className="mt-1 shrink-0 text-[#92d7ca]" />لا تحجز نقلًا أو سكنًا، ولا تقدم وعدًا بخدمة أو وظيفة.</li></ul></aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <aside className="rounded-[1.8rem] border border-[#17383a]/10 bg-white p-5 sm:p-6"><p className="text-sm font-extrabold text-[#126b69]">1. اختر مسارك</p><div className="mt-4 grid gap-2">{independenceGoals.map((goal) => { const Icon = goalIcons[goal.id]; const active = plan.goalId === goal.id; return <button type="button" key={goal.id} aria-pressed={active} onClick={() => { updatePlan(switchIndependenceGoal(plan, goal.id)); setNotice("تغيّر المسار وبدأت خطواته المقترحة من جديد."); }} className={cn("flex min-h-16 items-center justify-between gap-3 rounded-2xl border p-4 text-right", active ? "border-[#126b69] bg-[#126b69] text-white" : "border-[#17383a]/10 bg-[#f7fbfa] hover:border-[#126b69]/45")}><span className="flex items-center gap-3"><Icon size={20} /><span><span className="block font-extrabold">{goal.shortLabel}</span><span className={cn("mt-0.5 block text-xs", active ? "text-white/75" : "text-[#17383a]/55")}>{goal.description}</span></span></span><ChevronLeft size={18} /></button>; })}</div>
          <div className="mt-6 border-t border-[#17383a]/10 pt-5"><label className="block text-sm font-extrabold" htmlFor="plan-name">اسم الخطة</label><input id="plan-name" value={plan.planName} maxLength={80} onChange={(event) => updatePlan({ ...plan, planName: event.target.value })} className="mt-2 min-h-11 w-full rounded-xl border border-[#17383a]/15 bg-white px-3 text-sm outline-none focus:border-[#126b69] focus:ring-2 focus:ring-[#126b69]/20" /><label className="mt-4 block text-sm font-extrabold" htmlFor="plan-focus">ما الذي تريد أن تركز عليه؟</label><textarea id="plan-focus" value={plan.focus} maxLength={260} onChange={(event) => updatePlan({ ...plan, focus: event.target.value })} placeholder="مثال: أريد تنظيم أسئلتي قبل زيارة مكان أو بدء مشروع صغير." className="mt-2 min-h-24 w-full resize-y rounded-xl border border-[#17383a]/15 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-[#126b69] focus:ring-2 focus:ring-[#126b69]/20" /></div>
        </aside>

        <section className="rounded-[1.8rem] border border-[#17383a]/10 bg-white p-5 sm:p-7" aria-labelledby="plan-title"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-extrabold text-[#126b69]">2. خطتك القابلة للتعديل</p><h2 id="plan-title" className="mt-1 text-3xl font-extrabold">{activeGoal.label}</h2><p className="mt-2 max-w-2xl leading-7 text-[#17383a]/65">{activeGoal.description}</p></div><div className="min-w-28 rounded-2xl bg-[#e5f4f0] px-4 py-3 text-center"><p className="text-2xl font-extrabold text-[#126b69]">{progress.completed}/{progress.total}</p><p className="text-xs font-bold text-[#17383a]/60">خطوات مكتملة</p></div></div>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#17383a]/10" aria-label={`التقدم ${progress.percent}%`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.percent}><div className="h-full rounded-full bg-[#126b69]" style={{ width: `${progress.percent}%` }} /></div>
          <div className="mt-6 space-y-3">{plan.steps.map((step, index) => <label key={step.id} className={cn("flex min-h-16 cursor-pointer items-start gap-3 rounded-2xl border p-4", step.done ? "border-[#126b69]/25 bg-[#e9f7f3]" : "border-[#17383a]/10 bg-[#fbfcfc]")}><input type="checkbox" checked={step.done} onChange={() => toggleStep(step.id)} className="mt-1 h-5 w-5 accent-[#126b69]" /><span className="min-w-0 flex-1"><span className={cn("block font-extrabold", step.done && "text-[#126b69] line-through decoration-[#126b69]/45")}>{index + 1}. {step.label}</span><span className="mt-1 block text-xs text-[#17383a]/50">{step.source === "personal" ? "خطوة أضفتها أنت" : "خطوة مقترحة — عدّلها أو تجاهلها كما تريد"}</span></span></label>)}</div>
          <div className="mt-5 grid gap-3 border-t border-[#17383a]/10 pt-5 sm:grid-cols-[1fr_auto]"><label className="sr-only" htmlFor="new-step">أضف خطوة خاصة</label><input id="new-step" value={newStep} maxLength={220} onChange={(event) => setNewStep(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addStep(); }} placeholder="أضف خطوة تناسبك أنت…" className="min-h-12 rounded-xl border border-[#17383a]/15 px-4 text-sm outline-none focus:border-[#126b69] focus:ring-2 focus:ring-[#126b69]/20" /><button type="button" onClick={addStep} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#126b69] px-4 text-sm font-extrabold text-white hover:bg-[#0c5553]"><Plus size={18} />إضافة خطوة</button></div>
          <div className="mt-5 rounded-2xl border border-amber-300/45 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><strong>تذكير صادق:</strong> {activeGoal.boundary}</div>
          {notice && <p className="mt-4 rounded-xl bg-[#e5f4f0] px-4 py-3 text-sm font-bold text-[#0a4d4b]" role="status">{notice}</p>}
          <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => window.print()} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#126b69]/25 bg-white px-4 text-sm font-extrabold text-[#126b69] hover:bg-[#e9f7f3]"><Printer size={17} />طباعة الخطة</button><button type="button" onClick={copySummary} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#126b69]/25 bg-white px-4 text-sm font-extrabold text-[#126b69] hover:bg-[#e9f7f3]"><Copy size={17} />نسخ ملخص</button><button type="button" onClick={resetPlan} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#17383a]/15 bg-white px-4 text-sm font-extrabold text-[#17383a]/70 hover:bg-[#f7fbfa]"><RotateCcw size={17} />خطة جديدة</button></div>
        </section>
      </section>
    </div>
  </main>;
}
