export type RefugeeContextSource = {
  id: "gaza" | "regional" | "qalandia";
  title: string;
  updated: string;
  summary: string;
  href: string;
};

export const refugeeContextSources: RefugeeContextSource[] = [
  {
    id: "gaza",
    title: "غزة: خدمات مستمرة تحت قيود شديدة",
    updated: "تقرير الأونروا، 12 آب/أغسطس 2026",
    summary: "يوثق استمرار خدمات صحية وتعليم مؤقت ودعم مياه وصحة نفسية، مع تعليق عمليات وخدمات بسبب قيود الإمداد والوصول. لا يعني ذلك توفر خدمة مضمونة لكل شخص أو كل موقع.",
    href: "https://www.unrwa.org/resources/reports/unrwa-situation-report-232-humanitarian-crisis-gaza-strip-and-occupied-west-bank",
  },
  {
    id: "regional",
    title: "الأردن وسوريا ولبنان: حماية وخدمات تحت ضغط إقليمي",
    updated: "نداء الأونروا الإنساني 2026",
    summary: "يعرض النداء احتياجات مرتبطة بالسكن والصحة والتعليم والحماية والدعم النفسي والمهارات للاجئي فلسطين في البلدان الثلاثة، في ظل نزوح وصعوبات قانونية واقتصادية متباينة.",
    href: "https://www.unrwa.org/resources/emergency-appeals/syria-lebanon-and-jordan-humanitarian-appeal-2026",
  },
  {
    id: "qalandia",
    title: "قلنديا: تدريب مهني ضمن تفويض أممي قائم",
    updated: "بيان الأونروا، 9 آب/أغسطس 2026",
    summary: "مركز تدريب قلنديا تابع للأونروا ويواصل غرضه التعليمي وفق البيان. SENSE لا يمثل المركز ولا يفتح التسجيل أو البرامج باسمه.",
    href: "https://www.unrwa.org/newsroom/news-releases/unrwa-statement-kalandia-training-centre",
  },
];

export const refugeeContextGuards = [
  "لا توجد هنا استمارة مساعدة أو تسجيل مستفيدين أو بيانات عائلة.",
  "لا توجد تبرعات أو جمع أموال أو وعد بتقديم سلعة أو خدمة إنسانية.",
  "لا تمثيل للأونروا أو للأمم المتحدة أو لأي جهة إغاثة.",
  "الروابط تنقل إلى مصدر رسمي للمعلومة، لا إلى قناة طلب خدمة داخل SENSE.",
];
