export const growthGoals = ["skill", "offer", "maker"] as const;
export const growthChoices = ["copy", "small-output", "team-first"] as const;

export type GrowthGoal = (typeof growthGoals)[number];
export type GrowthChoice = (typeof growthChoices)[number];
export type GrowthOutcomeKind = "repair" | "ready";

export type GrowthOutcome = {
  kind: GrowthOutcomeKind;
  title: string;
  explanation: string;
  nextAction: string;
  recommendedRoute: "individual" | "team";
};

export function getGrowthOutcome(goal: GrowthGoal, choice: GrowthChoice): GrowthOutcome {
  if (choice === "copy") {
    return {
      kind: "repair",
      title: "المحاولة بدأت من تقليد لا من أثر واضح.",
      explanation: "المحتوى قد يلهمك، لكنه لا يحدد ما الذي ستستطيع إنجازه أو إثباته. اختر مخرجًا صغيرًا يخص هدفك أنت.",
      nextAction: "عد إلى المشهد واختر مخرجًا صغيرًا قابلًا للتجربة.",
      recommendedRoute: "individual"
    };
  }

  if (choice === "team-first") {
    return {
      kind: "repair",
      title: "الفريق ليس أول إجابة لكل هدف.",
      explanation: "ابدأ بتعريف الجزء الذي تستطيع اختباره وحدك. يظهر باب التعاون حين يحتاج التحدي أدوارًا أو خبرات لا يجمعها شخص واحد.",
      nextAction: "حدد مخرجك الفردي أولًا، ثم افحص إن كان يحتاج أدوارًا متكاملة.",
      recommendedRoute: "individual"
    };
  }

  const focus = goal === "skill" ? "دليل تعلّم صغير" : goal === "offer" ? "وصف خدمة أو تجربة يمكن مراجعتها" : "تصميمًا أوليًا قابلًا للمعاينة";
  return {
    kind: "ready",
    title: "اختيارك يصنع خطوة يمكن اختبارها.",
    explanation: `بدل وعد واسع، تبدأ الآن بـ${focus}. هذا المخرج لا يمنح قبولًا أو شهادة، لكنه يوضح ما الذي تريد تطويره بالفعل.`,
    nextAction: "انتقل إلى خريطة خطوتك الفردية، ثم افتح باب التعاون فقط إذا ظهر احتياج حقيقي له.",
    recommendedRoute: "individual"
  };
}

export function needsTeamRoute(answer: "yes" | "not-yet") {
  return answer === "yes" ? "team" : "individual";
}
