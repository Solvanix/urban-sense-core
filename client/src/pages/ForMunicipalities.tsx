import PublicFooter from "@/components/PublicFooter";
import PublicHeader from "@/components/PublicHeader";
import PublicTilePattern from "@/components/PublicTilePattern";
import { ArrowLeft, Building2, ClipboardCheck, Eye, FileCheck2, ShieldCheck, UsersRound } from "lucide-react";
import { Link } from "wouter";

const capabilities = [
  { icon: UsersRound, title: "أدوار واضحة", text: "يفصل النموذج بين المواطن وموظف الخدمة والعامل الميداني والمشرف ومدير البلدية، مع نطاق عضوية قابل للإدارة." },
  { icon: ClipboardCheck, title: "دورة قرار منظمة", text: "تبدأ المراجعة قبل الإسناد، ويُربط التنفيذ بالمهمة، ثم يمر الإغلاق بالتحقق والإسناد التوثيقي." },
  { icon: FileCheck2, title: "أدلة مرتبطة بالعمل", text: "يمكن إرفاق أدلة قبل وبعد من الفريق الميداني ضمن مسار البلاغ، بدل تداول ملفات غير مرتبطة بسياقها." },
  { icon: ShieldCheck, title: "سجل تدقيق مترابط", text: "تُسجل أحداث العمل في سجل تدقيق يرتبط ببصمات SHA‑256 لتسهيل مراجعة التسلسل والحوكمة." },
];

export default function ForMunicipalities() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f8f7]" dir="rtl">
      <PublicHeader />
      <section className="mx-auto max-w-7xl px-5 pb-14 pt-8 lg:px-8 lg:pb-20 lg:pt-14">
        <div className="grid gap-8 rounded-[2rem] border border-teal-900/10 bg-white p-7 shadow-xl shadow-teal-950/5 lg:grid-cols-[1.05fr_.95fr] lg:p-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm font-bold text-[#0f5b5b]"><Building2 size={18} />مسار تشغيلي للبلديات المشاركة</span>
            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.25] text-[#143534] sm:text-5xl">إدارة البلاغات لا تحتاج إلى مزيد من القنوات المتفرقة.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Urban‑Sense نواة تشغيلية لربط استقبال البلاغات بالمراجعة والإسناد والعمل الميداني والتحقق، ضمن نموذج أدوار وسجل تدقيق قابل للمراجعة.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/التجربة" className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#0f5b5b] px-6 font-bold text-white transition-colors hover:bg-[#0a4848]">فهم نطاق التجربة <ArrowLeft size={18} /></Link>
              <Link href="/كيف-تعمل" className="inline-flex h-12 items-center rounded-xl border border-slate-300 px-6 font-bold text-slate-700 transition-colors hover:bg-slate-50">عرض مسار البلاغ</Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-[#0f5b5b] p-6 text-white">
            <div className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-[#e3a238]/20 blur-2xl" />
            <div className="relative"><p className="font-extrabold text-[#f6c76d]">صورة تشغيلية مبسطة</p><div className="mt-5 space-y-3">{["المواطن: تقديم ومتابعة", "موظف الخدمة: مراجعة وتصنيف", "الفريق الميداني: تنفيذ وأدلة", "المشرف: تحقق وإغلاق"].map((item, index) => <div key={item} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-sm font-extrabold">{index + 1}</span><p className="font-bold">{item}</p></div>)}</div></div>
          </div>
        </div>
      </section>
      <PublicTilePattern variant="municipal" />
      <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8"><div className="max-w-2xl"><p className="font-bold text-[#0f5b5b]">داخل المنصة</p><h2 className="mt-2 text-3xl font-extrabold text-[#143534] sm:text-4xl">أدوات تخدم الحوكمة قبل المظهر.</h2><p className="mt-4 leading-8 text-slate-600">هذه القدرات مطبقة في النسخة الحالية كنواة للعمليات؛ تفعيلها على نطاق واقعي يحتاج ترتيبًا تشغيليًا واضحًا داخل كل بلدية.</p></div><div className="mt-9 grid gap-5 md:grid-cols-2">{capabilities.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-3xl border border-slate-200 bg-white p-7"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#0f5b5b]"><Icon size={23} /></span><h3 className="mt-6 text-xl font-extrabold text-slate-900">{title}</h3><p className="mt-3 leading-8 text-slate-600">{text}</p></article>)}</div></section>
      <section className="bg-[#143b3a] text-white"><div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 lg:grid-cols-[.8fr_1.2fr] lg:px-8"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#f6c76d]"><Eye size={27} /></div><div><p className="font-extrabold text-[#f6c76d]">مبدأ تشغيلي</p><h2 className="mt-3 text-3xl font-extrabold">لا تعني الرقمنة تلقائيًا وعدًا بالأداء.</h2><p className="mt-4 max-w-4xl leading-8 text-teal-50/80">المنصة تعرض مسارًا منظمًا وقابلًا للتدقيق، لكنها لا تنسب لبلدية أي نتائج أو شراكات أو مستويات استجابة قبل تفعيلها وتشغيلها فعليًا. تبقى التجربة الميدانية وبياناتها الحقيقية هي معيار التقييم.</p></div></div></section>
      <PublicFooter />
    </main>
  );
}
