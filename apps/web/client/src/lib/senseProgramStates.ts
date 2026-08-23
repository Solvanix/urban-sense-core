export type PublicProgramState = {
  id: "provider-readiness" | "learning-program";
  title: string;
  status: string;
  description: string;
  actionLabel: string;
  sourceHref: string;
  enrollmentOpen: false;
};

export const providerReadinessState: PublicProgramState = {
  id: "provider-readiness",
  title: "مسار مزود SENSE Experience",
  status: "قيد التشغيل المستقل",
  description: "توجد نواة جاهزية ومراجعة بشرية في مصدر مستقل، لكن لا توجد خدمة إنتاج عامة أو تسجيل مزودين مفتوح.",
  actionLabel: "افتح حالة الجاهزية في المصدر",
  sourceHref: "https://github.com/Solvanix/urban-sense-core/blob/main/apps/sense-experience/src/ui/TourismPublicSite.tsx#L145-L158",
  enrollmentOpen: false,
};

export const learningProgramState: PublicProgramState = {
  id: "learning-program",
  title: "برامج تعلم مخصصة",
  status: "موثقة كحالة مستقبلية",
  description: "لا توجد دورة أو مقعد أو مدرب أو شراكة معتمدة للنشر. أي برنامج يحتاج مالك محتوى ومدربًا وموافقة بيانات وتشغيلًا واضحًا قبل فتح اهتمام أو قبول.",
  actionLabel: "افتح شروط تحويله إلى برنامج",
  sourceHref: "https://github.com/Solvanix/urban-sense-core/blob/main/docs/LEARNING-AND-GROWTH-INTEGRATION-2026-08-23.md#5-%D8%A8%D9%88%D8%A7%D8%A8%D8%A9-%D8%AA%D8%B4%D8%BA%D9%8A%D9%84-%D8%A8%D8%B1%D9%86%D8%A7%D9%85%D8%AC-%D8%AA%D8%AF%D8%B1%D9%8A%D8%A8-%D8%A3%D9%88-%D8%A7%D8%B3%D8%AA%D9%82%D8%B7%D8%A7%D8%A8-%D8%AD%D9%82%D9%8A%D9%82%D9%8A",
  enrollmentOpen: false,
};
