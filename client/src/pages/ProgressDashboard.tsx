import {
  ArrowLeft,
  CheckCircle2,
  CircleDashed,
  Compass,
  ExternalLink,
  Globe2,
  LockKeyhole,
  MapPinned,
  Route,
  Store,
  Wrench,
} from "lucide-react";
import { Link } from "wouter";
import {
  domainReadinessHref,
  ecosystemExplorerHref,
  sensePortalHref,
} from "@/lib/sensePortalRoute";

const liveUrl = "https://urbansense-dzfbcdz5.manus.space";
const repositoryUrl = "https://github.com/Solvanix/urban-sense-core";

type ProgressItem = {
  title: string;
  text: string;
  href: string | null;
  action: string;
};

type ProgressLane = {
  title: string;
  summary: string;
  tone: string;
  labelTone: string;
  icon: typeof CheckCircle2;
  items: ProgressItem[];
};

const lanes: ProgressLane[] = [
  {
    title: "يعمل ويمكن زيارته",
    summary: "هذه واجهات منشورة أو مسارات عامة مرئية الآن؛ لا يعني ذلك أن كل مستخدم يملك الوصول إلى العمليات الداخلية.",
    tone: "border-emerald-300/25 bg-emerald-300/[.06]",
    labelTone: "text-emerald-100",
    icon: CheckCircle2,
    items: [
      {
        title: "Urban‑Sense",
        text: "منصة بلاغات بلدية عربية تشمل التقديم والمتابعة ضمن حدود البلدية والدور.",
        href: liveUrl,
        action: "افتح المنصة",
      },
      {
        title: "بوابة SENSE والمستكشف",
        text: "مدخل عام يوضح مستويات المنظومة وروابطها وحالاتها بدل إخفاء الفجوات.",
        href: `${liveUrl}${sensePortalHref}`,
        action: "افتح البوابة",
      },
    ],
  },
  {
    title: "مبني لكنه مقيد",
    summary: "الكود أو النموذج موجود، لكن لا يتحول إلى خدمة عامة قبل بوابات تشغيل وأدوار وبيانات حقيقية مستقلة.",
    tone: "border-sky-300/25 bg-sky-300/[.06]",
    labelTone: "text-sky-100",
    icon: CircleDashed,
    items: [
      {
        title: "SENSE Experience",
        text: "نواة مستقلة لمسار مزودي الخدمات والمراجعة البشرية، بلا نشر مستقل أو تسجيل عام للبيانات الحقيقية حتى الآن.",
        href: `${repositoryUrl}/tree/main/apps/sense-experience`,
        action: "استعرض المصدر",
      },
      {
        title: "الرؤية الحاسوبية",
        text: "مسار بحثي مقيد بالموافقة والرخصة؛ لا توجد كاميرات حية أو مراقبة مفعلة داخل Urban‑Sense.",
        href: `${repositoryUrl}/blob/main/docs/research/YOLO-SMART-CITY-INTEGRATION-BLUEPRINT-2026-08-20.md`,
        action: "راجع المسار",
      },
    ],
  },
  {
    title: "يحتاج قرارًا وتشغيلًا",
    summary: "هذه ليست خدمات متأخرة في الواجهة؛ بل تعتمد على قرار مالك أو كيان أو شريك أو بيانات حقيقية لا يجوز اختلاقها.",
    tone: "border-amber-300/25 bg-amber-300/[.06]",
    labelTone: "text-amber-100",
    icon: LockKeyhole,
    items: [
      {
        title: "الدومين والبريد والكيان",
        text: "لا يوجد اسم أم أو نطاق أو بريد مهني معتمد بعد؛ قرار الاسم يسبق الشراء وDNS والترحيل.",
        href: domainReadinessHref,
        action: "افتح الجاهزية",
      },
      {
        title: "السوق والتجارة",
        text: "يتطلب كتالوجًا حقيقيًا، مزودين معتمدين، مدفوعات وسياسات إرجاع قبل أن يصبح تجربة عامة.",
        href: null,
        action: "يتطلب قرار التجارة",
      },
    ],
  },
];

function ProgressItemCard({ item }: { item: ProgressItem }) {
  const isExternal = Boolean(item.href?.startsWith("http"));

  return (
    <div className="rounded-[1.35rem] border border-white/10 bg-[#071216]/45 p-5">
      <h3 className="text-lg font-extrabold">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/60">{item.text}</p>
      {item.href ? (
        <a
          href={item.href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noreferrer" : undefined}
          className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#f7cc71]"
        >
          {item.action}
          <ArrowLeft size={15} />
        </a>
      ) : (
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-white/45">
          {item.action}
          <Store size={15} />
        </span>
      )}
    </div>
  );
}

export default function ProgressDashboard() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#071216] text-[#f7f8f1]">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-5 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <Link href={ecosystemExplorerHref} className="inline-flex items-center gap-2 text-sm font-extrabold text-[#f7cc71]">
            <ArrowLeft size={16} />
            العودة إلى خريطة الوصول
          </Link>
          <Link href={sensePortalHref} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 px-3 text-sm font-extrabold text-white/80">
            بوابة SENSE
            <Compass size={16} />
          </Link>
        </header>

        <section className="grid gap-8 py-12 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#e3a238]/35 bg-[#e3a238]/10 px-3 py-1.5 text-xs font-extrabold text-[#ffd881]">
              <Route size={14} />
              لوحة تقدم تشغيلية
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-[1.14] sm:text-6xl">
              لا نقيس التقدم بوعود كبيرة، بل بما <span className="text-[#e3a238]">يمكن زيارته ومسؤوليته واضحة.</span>
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/65">
              هذه ليست نسبة إنجاز مصطنعة. إنها خريطة عمل: ما نُشر، وما بُني لكنه مقيد، وما يحتاج قرارًا أو تشغيلًا حقيقيًا قبل أن يصبح خدمة.
            </p>
          </div>
          <aside className="rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,#17343a,#0d1b20)] p-7">
            <MapPinned className="text-[#e3a238]" size={28} />
            <h2 className="mt-5 text-2xl font-extrabold">كيف تقرأ اللوحة؟</h2>
            <p className="mt-3 leading-7 text-white/65">لكل مسار حالة واحدة فقط. لا نعرض متجرًا أو تجربة مزودين أو بريدًا مهنيًا كأنها جاهزة قبل وجود بيانات وقرار وتشغيل فعلي.</p>
          </aside>
        </section>

        <section className="grid gap-5 xl:grid-cols-3" aria-label="حالات تشغيل المنظومة">
          {lanes.map((lane) => {
            const Icon = lane.icon;
            return (
              <article key={lane.title} className={`flex min-h-[440px] flex-col rounded-[2rem] border p-6 ${lane.tone}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={`text-sm font-extrabold ${lane.labelTone}`}>{lane.title}</p>
                    <p className="mt-3 text-sm leading-7 text-white/60">{lane.summary}</p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10"><Icon size={22} /></span>
                </div>
                <div className="mt-7 space-y-4">
                  {lane.items.map((item) => <ProgressItemCard key={item.title} item={item} />)}
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="rounded-[1.7rem] border border-white/10 bg-white/[.04] p-6">
            <Globe2 className="text-sky-200" size={23} />
            <h2 className="mt-5 text-xl font-extrabold">الدومين ليس خطوة تجميلية</h2>
            <p className="mt-3 leading-7 text-white/65">عندما يعتمد الاسم، تتبع الخطوات بالترتيب: فحص علامة ومسجل، شراء صريح، DNS وبريد، ثم ترحيل متدرج.</p>
            <Link href={domainReadinessHref} className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-sky-100">راجع ترتيب الدومين <ArrowLeft size={16} /></Link>
          </article>
          <article className="rounded-[1.7rem] border border-white/10 bg-white/[.04] p-6">
            <Wrench className="text-[#f3c86e]" size={23} />
            <h2 className="mt-5 text-xl font-extrabold">ما الذي يجب أن يأتي من الواقع؟</h2>
            <p className="mt-3 leading-7 text-white/65">مراجعون فعليون، موافقة تشغيلية، مزودون حقيقيون، وشركاء بعقود معلنة عند وجودها. لا تنشئ الواجهة هذه الأشياء بدل أصحابها.</p>
            <a href={`${repositoryUrl}/blob/main/docs/architecture/MVP-ARCHITECTURE.md`} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#f7cc71]">افتح معمارية التشغيل <ExternalLink size={16} /></a>
          </article>
        </section>
      </div>
    </main>
  );
}
