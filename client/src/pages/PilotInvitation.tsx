import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, CheckCircle2, ClipboardList, LogIn, MessageSquareText, ShieldCheck, TriangleAlert, UsersRound } from "lucide-react";
import { Link } from "wouter";

const participationSteps = [
  {
    icon: LogIn,
    title: "سجّل الدخول أولًا",
    text: "يحتاج كل مشارك إلى حسابه الخاص حتى تُنسب البلاغات والتحديثات والتقييمات إلى صاحبها الحقيقي.",
  },
  {
    icon: ClipboardList,
    title: "أرسل بلاغًا حقيقيًا غير عاجل",
    text: "اختر بلدية مشاركة، ثم أضف وصفًا وموقعًا واضحين. لا تستخدم التجربة للإبلاغ عن خطر فوري أو حالة طارئة.",
  },
  {
    icon: ShieldCheck,
    title: "تابع المسار الموثق",
    text: "تظهر لك مراحل المراجعة والإسناد والتنفيذ والتحقق، مع أدلة ميدانية عند إضافتها من الفريق المعيّن.",
  },
  {
    icon: MessageSquareText,
    title: "أضف رأيك الحقيقي بعد الإغلاق",
    text: "عند إغلاق البلاغ واعتماده، يمكنك إرسال تقييم اختياري يعكس تجربتك الفعلية فقط.",
  },
];

export default function PilotInvitation() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <main className="min-h-screen bg-[#f6f8f7]" dir="rtl">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 lg:px-8">
        <Link href="/?view=urban" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0f5b5b] text-white shadow-lg shadow-teal-900/15"><Building2 size={23} /></span>
          <span><span className="block text-lg font-extrabold tracking-tight text-[#143534]">Urban‑Sense</span><span className="block text-xs font-semibold text-slate-500">منصة البلاغات البلدية</span></span>
        </Link>
        <Link href="/?view=urban" className="inline-flex items-center gap-2 text-sm font-bold text-[#0f5b5b]"><ArrowLeft size={17} />العودة للرئيسية</Link>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-14 pt-8 lg:px-8 lg:pt-14">
        <div className="rounded-[2rem] bg-[#0f5b5b] px-6 py-10 text-white shadow-2xl shadow-teal-950/15 sm:px-10 lg:px-14 lg:py-14">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-[#f6c76d]"><UsersRound size={18} />دعوة للمشاركة في التجربة التجريبية</span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.25] sm:text-5xl">ساعدنا على اختبار تجربة بلاغ بلدي أكثر وضوحًا وشفافية.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-teal-50">نبحث عن مشاركين يرغبون في تجربة إرسال بلاغ حقيقي غير عاجل، متابعته عبر مراحله الموثقة، ثم مشاركة رأيهم الحقيقي بعد الإغلاق إن اختاروا ذلك.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {isAuthenticated ? <Link href="/بلاغ-جديد"><Button className="h-12 gap-2 bg-[#e3a238] px-6 text-base font-extrabold text-[#372308] hover:bg-[#d19126]">ابدأ المشاركة <ArrowLeft size={18} /></Button></Link> : <Button disabled={loading} onClick={() => startLogin()} className="h-12 gap-2 bg-[#e3a238] px-6 text-base font-extrabold text-[#372308] hover:bg-[#d19126]"><LogIn size={18} />سجّل للمشاركة</Button>}
              {isAuthenticated && <Link href="/بلاغاتي"><Button variant="outline" className="h-12 border-white/40 bg-transparent px-6 font-bold text-white hover:bg-white/10 hover:text-white">متابعة بلاغاتي</Button></Link>}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
          <aside className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
            <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-100"><TriangleAlert size={21} /></span><h2 className="text-xl font-extrabold">حدود التجربة بوضوح</h2></div>
            <p className="mt-4 leading-8">هذه بيئة تجريبية محدودة وليست قناة طوارئ أو وعدًا بزمن استجابة أو معالجة ميدانية. للحالات العاجلة أو الأخطار المباشرة، استخدم قنوات الطوارئ والجهات المختصة في منطقتك.</p>
            <p className="mt-4 leading-8">يرجى عدم إدخال بيانات شخصية حساسة، أو معلومات لا تملك حق مشاركتها، أو محتوى مسيء. تتوفر المشاركة فقط ضمن البلديات التي تُفعّل التجربة.</p>
          </aside>
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <p className="font-bold text-[#0f5b5b]">كيف أشارك؟</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#143534]">أربع خطوات بسيطة ومسؤولة</h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              {participationSteps.map(({ icon: Icon, title, text }, index) => <article key={title} className="rounded-2xl bg-[#f7faf9] p-5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#0f5b5b]"><Icon size={20} /></span><p className="mt-4 text-xs font-extrabold text-[#e3a238]">الخطوة 0{index + 1}</p><h3 className="mt-1 text-lg font-extrabold text-slate-900">{title}</h3><p className="mt-2 leading-7 text-slate-600">{text}</p></article>)}
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-teal-100 bg-white p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><div className="flex items-center gap-2 font-extrabold text-[#0f5b5b]"><CheckCircle2 size={20} />ما الذي نحتاجه منك؟</div><p className="mt-2 max-w-3xl leading-8 text-slate-600">مشاركة واعية وتغذية راجعة صادقة فقط. لا توجد نقاط أو مكافآت أو طلب لتقييم إيجابي؛ الرأي الحقيقي، أو عدم التقييم، كلاهما مقبول.</p></div>{isAuthenticated && <Link href="/بلاغ-جديد"><Button className="shrink-0 bg-[#0f5b5b] font-bold hover:bg-[#0a4848]">انتقل إلى نموذج البلاغ</Button></Link>}</div>
        </section>
      </section>
    </main>
  );
}
