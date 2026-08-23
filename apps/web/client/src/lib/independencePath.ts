export type IndependenceGoalId = "mobility" | "study" | "work" | "create" | "housing";

export type IndependenceStep = {
  id: string;
  label: string;
  done: boolean;
  source: "template" | "personal";
};

export type IndependencePlan = {
  goalId: IndependenceGoalId;
  planName: string;
  focus: string;
  steps: IndependenceStep[];
  updatedAt: string;
};

export const independenceStorageKey = "sensecity-independence-path-v1";

export const independenceGoals: Array<{
  id: IndependenceGoalId;
  label: string;
  shortLabel: string;
  description: string;
  boundary: string;
  prompts: string[];
}> = [
  { id: "mobility", label: "الحركة والوصول", shortLabel: "الحركة", description: "خطّط لخروج أو زيارة أو طريق قبل أن تبدأ، بحسب ما يساعدك أنت.", boundary: "لا تحجز الأداة نقلًا ولا تؤكد سلامة الطريق أو إتاحة مكان.", prompts: ["حدّد الوجهة أو النشاط الذي تريد الوصول إليه", "اطلب وصفًا محدثًا للمدخل والمسار والضوضاء إن لزم", "رتّب الوقت أو المرافق أو وسيلة النقل التي تختارها", "راجع خطتك قبل الخروج وحدد بديلًا بسيطًا"] },
  { id: "study", label: "الدراسة والتعلم", shortLabel: "الدراسة", description: "حوّل هدفًا تعليميًا إلى طلبات واضحة وخطوات صغيرة قابلة للمتابعة.", boundary: "لا تتواصل الأداة مع مؤسسة تعليمية ولا تقرر أي تيسير نيابة عنك.", prompts: ["سمِّ المادة أو المهارة أو المؤسسة التي تريد البدء بها", "اكتب شكل المعلومات أو الوقت أو المحتوى الذي يساعدك", "حضّر سؤالًا واضحًا لجهة التعليم أو المدرب", "راجع ما تم الاتفاق عليه وخطوتك التالية"] },
  { id: "work", label: "العمل والمشاركة المهنية", shortLabel: "العمل", description: "نظّم طريقك إلى فرصة أو مشروع صغير، مع التركيز على ما تستطيع إنجازه.", boundary: "لا توفر الأداة وظيفة ولا تقرر الأهلية أو تطلب إفصاحًا صحيًا.", prompts: ["حدّد نوع الدور أو المشروع الذي تريد استكشافه", "اكتب مخرجًا صغيرًا أو مهارة تريد عرضها", "حضّر طلب تيسير أو طريقة تواصل تناسبك إذا رغبت", "حدد شخصًا أو جهة تسألها عن الخطوة التالية"] },
  { id: "create", label: "الإبداع وعرض العمل", shortLabel: "الإبداع", description: "ابدأ بفكرة أو قطعة عمل صغيرة، ثم رتّب الأدوات والوقت وطريقة العرض التي تختارها.", boundary: "لا تنشر الأداة عملك ولا تنشئ صورة أو ملفًا أو حملة باسمك.", prompts: ["سمِّ فكرة أو عملًا صغيرًا تريد إنجازه", "حدد أداة أو مساحة أو وقتًا يساعدك على البدء", "جزّئ العمل إلى نسخة أولى قابلة للمشاركة", "اختر طريقة عرض آمنة ومناسبة لك"] },
  { id: "housing", label: "السكن والعيش المستقل", shortLabel: "السكن", description: "رتّب الأسئلة والخيارات التي تحتاجها عند التفكير في سكن أو انتقال.", boundary: "لا تعرض الأداة وحدات سكنية ولا تطابق أشخاصًا ولا تنشئ عقد إيجار.", prompts: ["حدّد ما تحتاجه للعيش براحة وأمان دون ذكر تشخيص", "اكتب أسئلة عن المدخل والمرافق والمساحة والمعلومات المتاحة", "حدد من يمكن أن يراجع معك العقد أو يساعد في المقارنة", "ضع خطوة دعم أو تصعيد إن ظهرت مشكلة"] },
];

function templateSteps(goalId: IndependenceGoalId): IndependenceStep[] {
  const goal = independenceGoals.find((item) => item.id === goalId) ?? independenceGoals[0]!;
  return goal.prompts.map((label, index) => ({ id: `template-${goal.id}-${index + 1}`, label, done: false, source: "template" }));
}

export function createIndependencePlan(goalId: IndependenceGoalId = "mobility"): IndependencePlan {
  return { goalId, planName: "خطة استقلالي", focus: "", steps: templateSteps(goalId), updatedAt: "" };
}

export function normalizeIndependencePlan(value: unknown): IndependencePlan {
  const fallback = createIndependencePlan();
  if (!value || typeof value !== "object") return fallback;
  const candidate = value as Partial<IndependencePlan>;
  const goalId = independenceGoals.some((goal) => goal.id === candidate.goalId) ? candidate.goalId as IndependenceGoalId : fallback.goalId;
  const steps: IndependenceStep[] = Array.isArray(candidate.steps)
    ? candidate.steps
      .filter((step): step is IndependenceStep => Boolean(step) && typeof step === "object" && typeof (step as IndependenceStep).id === "string" && typeof (step as IndependenceStep).label === "string")
      .map((step): IndependenceStep => ({ id: step.id.slice(0, 80), label: step.label.slice(0, 220), done: Boolean(step.done), source: step.source === "personal" ? "personal" : "template" }))
    : templateSteps(goalId);
  return { goalId, planName: typeof candidate.planName === "string" ? candidate.planName.slice(0, 80) || fallback.planName : fallback.planName, focus: typeof candidate.focus === "string" ? candidate.focus.slice(0, 260) : "", steps: steps.length ? steps : templateSteps(goalId), updatedAt: typeof candidate.updatedAt === "string" ? candidate.updatedAt : "" };
}

export function switchIndependenceGoal(plan: IndependencePlan, goalId: IndependenceGoalId): IndependencePlan {
  return { ...plan, goalId, steps: templateSteps(goalId), updatedAt: "" };
}

export function planProgress(plan: IndependencePlan) {
  const total = plan.steps.length;
  const completed = plan.steps.filter((step) => step.done).length;
  return { total, completed, percent: total ? Math.round((completed / total) * 100) : 0 };
}

export function planSummary(plan: IndependencePlan) {
  const goal = independenceGoals.find((item) => item.id === plan.goalId) ?? independenceGoals[0]!;
  const progress = planProgress(plan);
  const items = plan.steps.map((step) => `${step.done ? "✓" : "□"} ${step.label}`).join("\n");
  return `مسار الاستقلال — ${plan.planName}\nالمسار: ${goal.label}\nالتركيز: ${plan.focus || "لم يضف المستخدم وصفًا"}\nالتقدم: ${progress.completed}/${progress.total}\n\n${items}\n\nهذه خطة شخصية محلية من SenseCity؛ لا تمثل خدمة حجز أو إحالة أو قرار أهلية.`;
}
