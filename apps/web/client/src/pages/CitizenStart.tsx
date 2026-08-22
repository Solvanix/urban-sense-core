import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { ArrowLeft, CheckCircle2, ClipboardPenLine, ShieldCheck, Siren, UserRoundCheck } from "lucide-react";
import { Link } from "wouter";

const steps = [
  { icon: ClipboardPenLine, title: "حدّد المشكلة بوضوح", text: "ستختار البلدية وتصف المكان والمشكلة بلغة تساعد على المراجعة." },
  { icon: UserRoundCheck, title: "سجّل الدخول لحماية المتابعة", text: "يرتبط البلاغ بصاحبه كي يستطيع متابعة حالته، لا ليصبح بلاغًا مجهولًا بلا مسؤولية." },
  { icon: CheckCircle2, title: "تابع ما يحدث بعد الإرسال", text: "ينتقل البلاغ إلى المراجعة والتنفيذ والتحقق، ثم يظهر سجل المتابعة في حسابك." },
];

export default function CitizenStart() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <main className="min-h-screen bg-[#f6f8f7]" dir="rtl">
      <section className="overflow-hidden bg-[#143b3a] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-bold text-[#f6c76d]"><ClipboardPenLine size={17} />رحلة المواطن</p>
            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.22] sm:text-5xl">لدي مشكلة خدمية. ماذا يحدث عندما أرسل بلاغًا؟</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-teal-50/85">تبدأ بتسجيل دخول آمن، ثم تكتب بلاغًا واضحًا ضمن بلدية مشاركة، ثم تتابع انتقاله من المراجعة إلى التحقق. لا نطلب منك بيانات في هذه الصفحة.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {isAuthenticated ? <Link href="/بلاغ-جديد"><Button className="h-12 gap-2 rounded-xl bg-[#e3a238] px-6 text-base font-extrabold text-[#372308] hover:bg-[#d19126]">ابدأ كتابة بلاغك <ArrowLeft size={18} /></Button></Link> : <Button disabled={loading} onClick={startLogin} className="h-12 gap-2 rounded-xl bg-[#e3a238] px-6 text-base font-extrabold text-[#372308] hover:bg-[#d19126]">سجّل دخولك ثم ابدأ <ArrowLeft size={18} /></Button>}
              <Link href="/كيف-تعمل" className="inline-flex h-12 items-center rounded-xl border border-white/30 px-6 font-bold text-white hover:bg-white/10">شاهد تفاصيل المسار</Link>
            </div>
            <p className="mt-6 flex max-w-2xl gap-2 text-sm leading-7 text-teal-50/75"><Siren className="mt-1 shrink-0 text-[#f6c76d]" size={18} />هذه ليست قناة طوارئ. في الحالات التي تتطلب استجابة فورية، استخدم أرقام الطوارئ والخدمات المختصة المحلية.</p>
          </div>
          <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:p-8">
            <p className="font-extrabold text-[#f6c76d]">قبل أن تبدأ</p>
            <h2 className="mt-3 text-2xl font-extrabold">ما الذي يفيد البلاغ؟</h2>
            <ul className="mt-6 space-y-4 text-teal-50/85">
              <li className="flex gap-3"><ShieldCheck className="shrink-0 text-[#f6c76d]" size={20} /><span>وصف مختصر ودقيق للمشكلة، لا معلومات شخصية لا يحتاجها البلاغ.</span></li>
              <li className="flex gap-3"><ShieldCheck className="shrink-0 text-[#f6c76d]" size={20} /><span>موقع أو معلم قريب يساعد فريق البلدية على التحقق.</span></li>
              <li className="flex gap-3"><ShieldCheck className="shrink-0 text-[#f6c76d]" size={20} /><span>اختيار البلدية المشاركة التي يقع البلاغ ضمن نطاقها.</span></li>
            </ul>
          </aside>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="max-w-2xl"><p className="font-bold text-[#0f5b5b]">ثلاث خطوات فعلية</p><h2 className="mt-2 text-3xl font-extrabold text-[#143534] sm:text-4xl">من المشكلة إلى متابعة يمكن فهمها.</h2></div>
        <div className="mt-9 grid gap-5 md:grid-cols-3">{steps.map(({ icon: Icon, title, text }, index) => <article key={title} className="rounded-3xl border border-slate-200 bg-white p-7"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#0f5b5b]"><Icon size={23} /></span><span className="mt-7 block text-sm font-extrabold text-[#e3a238]">0{index + 1}</span><h3 className="mt-1 text-xl font-extrabold text-slate-900">{title}</h3><p className="mt-3 leading-7 text-slate-600">{text}</p></article>)}</div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-5 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200"><div><p className="font-bold text-[#0f5b5b]">هل سبق أن أرسلت بلاغًا؟</p><p className="mt-1 text-slate-600">يمكنك الرجوع إلى قائمة بلاغاتك المسجلة ومتابعة ما تغير فيها.</p></div>{isAuthenticated ? <Link href="/بلاغاتي" className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#0f5b5b] px-5 font-bold text-[#0f5b5b]">اذهب إلى بلاغاتي <ArrowLeft size={17} /></Link> : <Button variant="outline" disabled={loading} onClick={startLogin} className="h-11 border-[#0f5b5b] font-bold text-[#0f5b5b]">سجّل الدخول للمتابعة</Button>}</div>
      </section>
    </main>
  );
}
