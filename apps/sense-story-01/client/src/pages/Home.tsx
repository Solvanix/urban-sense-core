import { useState } from "react";
import { story } from "../content/story";
import { ArrowLeft, Headphones, MapPin, Menu, Play, Quote, Radio, Sparkles, Volume2, X } from "lucide-react";

const heroImage = "/manus-storage/sense-story-hero_efda8edf.jpg";
const detailImage = "/manus-storage/sense-story-detail_e1c12ffd.jpg";

const media = [
  { title: "الطريق قبل الباب", text: "لا تبدأ تجربة المكان عند العتبة؛ تبدأ من المعلومة التي تسبقها.", color: "bg-[#d8c29c]" },
  { title: "تفصيل لا يراه الجميع", text: "قد يكون الفرق بين الوصول والتعثر في ملمس صغير تحت القدم.", color: "bg-[#b9c7bd]" },
  { title: "صوت يشرح المكان", text: "حين يصبح السرد جزءًا من التصميم، لا يعود الصوت إضافة.", color: "bg-[#c5b1a4]" },
  { title: "المكان بوصفه وعدًا", text: "الإتاحة ليست إعلانًا؛ إنها ما يحدث عندما يصل الناس فعلًا.", color: "bg-[#9caeaa]" },
];

export default function Home() {
  const [playing, setPlaying] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-[#f4f0e9] text-[#183c3a] selection:bg-[#e2b45d] selection:text-[#183c3a]">
      <a href="#story" className="skip-link">انتقل إلى القصة</a>
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-[#173d3a] text-[#f4e5bd] shadow-lg shadow-[#173d3a]/10"><span className="font-display text-xl">س</span></div>
          <div><div className="font-display text-lg font-bold tracking-tight">صوت المكان</div><div className="text-[10px] uppercase tracking-[0.24em] text-[#64807a]">SENSE / STORIES</div></div>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-[#496862] md:flex" aria-label="التنقل الرئيسي">
          <a href="#story" className="nav-link">القصة</a><a href="#voices" className="nav-link">أصوات</a><a href="#method" className="nav-link">كيف نعمل</a>
        </nav>
        <button aria-label="فتح القائمة" onClick={() => setMenuOpen(!menuOpen)} className="rounded-full border border-[#cad5cf] p-3 text-[#173d3a] transition hover:bg-white md:hidden">{menuOpen ? <X size={20}/> : <Menu size={20}/>}</button>
      </header>
      {menuOpen && <div className="absolute right-5 top-20 z-30 w-48 rounded-2xl bg-white p-4 text-sm font-semibold shadow-xl md:hidden"><a className="block p-3" href="#story">القصة</a><a className="block p-3" href="#voices">أصوات</a><a className="block p-3" href="#method">كيف نعمل</a></div>}

      <section className="relative mx-auto max-w-7xl px-5 pb-12 lg:px-10 lg:pb-20">
        <div className="hero-grid relative min-h-[590px] overflow-hidden rounded-[2rem] bg-[#173d3a] shadow-2xl shadow-[#173d3a]/15">
          <img src={heroImage} alt="ممر حجري مضاء يقود إلى ساحة في بلدة فلسطينية" className="absolute inset-0 h-full w-full object-cover opacity-75" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#102d2b]/95 via-[#163b38]/55 to-transparent" />
          <div className="relative z-10 flex max-w-2xl flex-col justify-end p-7 pb-9 text-[#fff8ea] lg:p-14 lg:pb-16">
            <div className="mb-7 flex items-center gap-3 text-xs font-semibold tracking-wide text-[#f0cf8a]"><span className="h-px w-10 bg-[#f0cf8a]"/> {story.kicker}</div>
            <h1 className="font-display text-5xl font-black leading-[1.1] tracking-tight md:text-7xl">حين يصبح<br/><em className="not-italic text-[#e9c77e]">الطريق</em> سؤالًا</h1>
            <p className="mt-6 max-w-lg text-lg leading-9 text-[#e7e9dd]">{story.subtitle}</p>
            <div className="mt-9 flex flex-wrap items-center gap-4"><button className="primary-btn" onClick={() => document.getElementById("story")?.scrollIntoView({behavior:"smooth"})}>اقرأ القصة <ArrowLeft size={17}/></button><button className="audio-btn" onClick={() => setPlaying(!playing)} aria-pressed={playing}>{playing ? <Volume2 size={18}/> : <Play size={17}/>} {playing ? "جاري التشغيل" : "استمع إلى المقدمة"}</button></div>
          </div>
          <div className="absolute bottom-7 left-7 z-10 hidden text-left text-xs text-[#d9dfd1] lg:block"><span className="block text-[#f0cf8a]">01 / 08</span><span>صوت المكان، لا واجهة المكان</span></div>
        </div>
      </section>

      <section id="story" className="mx-auto grid max-w-7xl gap-12 px-5 pb-24 lg:grid-cols-[0.62fr_1.38fr] lg:px-10">
        <aside className="order-2 lg:order-1 lg:pt-20"><div className="sticky top-8"><div className="mb-5 flex items-center gap-2 text-xs font-bold text-[#af7b2c]"><MapPin size={15}/> البلدة القديمة / قصة سردية</div><div className="rounded-3xl bg-[#e5dfd2] p-6"><div className="mb-3 flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-[#f4f0e9]"><Headphones size={18}/></div><div><div className="font-bold">الصوت جزء من الوصول</div><div className="text-xs text-[#667c74]">نسخة صوتية ستُرفق بالمادة</div></div></div><p className="text-sm leading-7 text-[#526961]">المساعد لا يختزل القصة؛ يساعد على تجهيزها وقراءتها وتحويلها إلى مسودة قابلة للمراجعة.</p><button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#173d3a] py-3 text-sm font-bold text-white transition hover:bg-[#245b55]" onClick={() => setPlaying(!playing)}><Radio size={16}/>{playing ? "إيقاف الصوت" : "استمع إلى الملخص"}</button></div><div className="mt-5 border-t border-[#cbd4cd] pt-5 text-xs leading-6 text-[#668078]">آخر فصل في القصة<br/><strong className="text-[#183c3a]">حين يصبح الطريق سؤالًا</strong></div></div></aside>
        <article className="order-1 lg:order-2"><div className="mb-8 flex items-center gap-3 text-sm text-[#6c8179]"><span className="rounded-full bg-[#d9e2d9] px-3 py-1 font-bold text-[#35615a]">قصة ميدانية</span><span>•</span><span>6 دقائق قراءة</span></div><p className="lead-copy">{story.deck}</p><div className="article-copy">{story.paragraphs.slice(0, 3).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<blockquote><Quote size={25}/><p>{story.quote}</p></blockquote><h2>ليست المشكلة في العتبة وحدها</h2>{story.paragraphs.slice(3, 6).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<img src={detailImage} alt="مدخل حجري مع مسار ملمسي وسماعات تتيح الاستماع إلى شرح المكان" className="my-9 aspect-[4/3] w-full rounded-3xl object-cover shadow-lg"/><h2>من المعلومة إلى الفعل</h2>{story.paragraphs.slice(6).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></article>
      </section>

      <section id="voices" className="bg-[#e7e1d4] py-24"><div className="mx-auto max-w-7xl px-5 lg:px-10"><div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><div className="eyebrow"><Sparkles size={14}/> من دفتر الميدان</div><h2 className="section-title">القصة لا تُروى من صورة واحدة</h2></div><p className="max-w-sm text-sm leading-7 text-[#5d746c]">كل إطار هنا يؤدي وظيفة مختلفة: يضيف معلومة، يفتح سؤالًا، أو يقرّبنا من تجربة لا تختصر في عنوان.</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{media.map((item, i) => <article key={item.title} className={`story-card ${item.color}`}><span className="text-xs font-bold text-[#45645d]">0{i+1} / 04</span><div className="mt-24"><h3 className="font-display text-2xl font-black">{item.title}</h3><p className="mt-3 text-sm leading-6 text-[#4e665e]">{item.text}</p></div></article>)}</div></div></section>

      <section id="method" className="mx-auto max-w-7xl px-5 py-24 lg:px-10"><div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]"><div><div className="eyebrow"><span className="h-2 w-2 rounded-full bg-[#d99e3e]"/> طريقة العمل</div><h2 className="section-title max-w-md">من تسجيل صغير إلى أثر قابل للنشر</h2><p className="mt-6 max-w-md text-base leading-8 text-[#5d746c]">هذه الصفحة نموذج لطريقة عمل أوسع: يجمع المساعد المادة، يرتبها، يوضح ما يحتاج تحققًا، ثم يحفظها كمسودة في WordPress قبل النشر.</p></div><div className="grid gap-3 md:grid-cols-2">{["نجمع الصوت والصورة والملاحظة", "نكتب القصة بلغة المكان", "نراجع المصدر والموافقة", "نحفظ مسودة قابلة للوصول"].map((t,i)=><div key={t} className="flex items-start gap-4 rounded-2xl border border-[#d5ddd5] bg-white/55 p-5"><span className="font-display text-3xl font-black text-[#c79440]">0{i+1}</span><div><h3 className="font-bold">{t}</h3><p className="mt-2 text-sm leading-6 text-[#6a7f77]">مرحلة واضحة، وقرار قابل للمراجعة، دون ادعاء أن ما لم يُبنَ أصبح جاهزًا.</p></div></div>)}</div></div></section>
      <footer className="border-t border-[#d2dbd2] px-5 py-8 text-center text-sm text-[#6a7f77]">صوت المكان · نموذج تحريري لمنظومة SENSE · <a href="https://github.com/Solvanix/urban-sense-core" className="font-bold text-[#285c55] underline">المستودع المرجعي</a></footer>
    </main>
  );
}
