import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpLeft,
  BookOpen,
  Camera,
  ChevronDown,
  Clock3,
  ExternalLink,
  Instagram,
  MapPin,
  Menu,
  Mic2,
  Play,
  Search,
  Sparkles,
  X,
  Youtube,
} from "lucide-react";

type Story = {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  time: string;
  image?: string;
  media?: string;
};

const imagePath = "/manus-storage/ahlina-site-image-square_bbef3c5f.jpg";

const stories: Story[] = [
  {
    id: 1,
    category: "رام الله",
    title: "المدينة حين تُرى من أهلها لا من خرائطها",
    excerpt:
      "جولة بصرية في وسط رام الله؛ بين الحركة اليومية، الوجوه العابرة، والأماكن التي تمنح المدينة ذاكرتها الخاصة.",
    author: "فريق صوت التلميذ",
    time: "ملف بصري · 6 دقائق",
    image: imagePath,
    media: "صورة + نص",
  },
  {
    id: 2,
    category: "حكاية مكان",
    title: "تحت التوتة: ما الذي تحفظه شجرة واحدة؟",
    excerpt:
      "حين تصبح الشجرة دفترًا مفتوحًا لذاكرة البلدة، يروي أهلها أسماءً وأصواتًا لا تظهر في الخرائط.",
    author: "حنين",
    time: "مدونة · 4 دقائق",
    media: "صوت + مقابلة",
  },
  {
    id: 3,
    category: "طولكرم",
    title: "24 خبرًا من المكان: النبض المحلي في أسبوع",
    excerpt:
      "نشرة تدريبية مختصرة تجمع أخبار المجتمع والجامعة والشارع مع روابط المصادر الأصلية.",
    author: "إيناس",
    time: "موجز · دقيقتان",
    media: "نص + روابط",
  },
  {
    id: 4,
    category: "الخليل",
    title: "دورة الخليل كما يرويها المشاركون",
    excerpt:
      "تغطية ميدانية تضع التجربة في سياقها، وتستمع إلى أصوات المشاركين بدل الاكتفاء بصورة الحدث.",
    author: "مراد",
    time: "تقرير · 5 دقائق",
    media: "فيديو + صورة",
  },
];

const categories = ["الكل", "رام الله", "طولكرم", "الخليل", "حكاية مكان"];

function Meta({ children }: { children: React.ReactNode }) {
  return <span className="meta-item">{children}</span>;
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const filteredStories = useMemo(
    () =>
      activeCategory === "الكل"
        ? stories
        : stories.filter((story) => story.category === activeCategory),
    [activeCategory],
  );

  return (
    <div dir="rtl" className="site-shell">
      <div className="top-strip">
        <div className="container top-strip-inner">
          <span>من مختبر الإعلام الرقمي</span>
          <span className="top-strip-note">نسخة تدريبية · كل قصة تبدأ من مكان</span>
        </div>
      </div>

      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#top" aria-label="صوت التلميذ - الصفحة الرئيسية">
            <span className="brand-mark">ص</span>
            <span>
              <strong>صوت التلميذ</strong>
              <small>نرى المكان من أهله</small>
            </span>
          </a>

          <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="التنقل الرئيسي">
            <a href="#stories" onClick={() => setMenuOpen(false)}>القصص</a>
            <a href="#students" onClick={() => setMenuOpen(false)}>مشاريع الطلاب</a>
            <a href="#media" onClick={() => setMenuOpen(false)}>مختبر الوسائط</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>عن المشروع</a>
          </nav>

          <div className="header-actions">
            <button className="icon-button" aria-label="البحث"><Search size={18} /></button>
            <button className="menu-button" aria-label="فتح القائمة" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero container">
          <div className="hero-copy">
            <div className="eyebrow"><span /> افتتاحية العدد</div>
            <h1>الخبر ليس بعيدًا.<br /><em>إنه هنا.</em></h1>
            <p className="hero-lede">
              منصة تدريبية يصنع فيها الطلاب صحافة رقمية من المكان: خبرًا، صورةً، صوتًا، فيديو، وروابط تقود القارئ إلى القصة الأصلية.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#stories">اكتشف القصص <ArrowLeft size={17} /></a>
              <a className="text-link" href="#about">كيف نعمل؟ <ArrowUpLeft size={15} /></a>
            </div>
            <div className="hero-proof">
              <div><strong>04</strong><span>مشاريع فردية</span></div>
              <div><strong>06</strong><span>أنواع وسائط</span></div>
              <div><strong>01</strong><span>غرفة تحرير</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-wrap">
              <img src={imagePath} alt="مشهد من وسط رام الله وحركة الناس في الشارع" />
              <div className="image-caption"><Camera size={14} /> رام الله · صورة أرشيفية مرخّصة</div>
            </div>
            <div className="hero-note"><Sparkles size={16} /><span>القصة تبدأ من الناس</span></div>
          </div>
        </section>

        <section className="ticker" aria-label="موجز صوت التلميذ">
          <div className="container ticker-inner"><span className="ticker-label">على الموجة الآن</span><span>نحن لا ننسخ الخبر؛ نذهب إليه، نتحقق منه، ثم نعيد روايته.</span><Clock3 size={15} /></div>
        </section>

        <section id="stories" className="container section-block">
          <div className="section-heading">
            <div><div className="eyebrow"><span /> من غرفة التحرير</div><h2>قصص تستحق أن تُرى</h2></div>
            <a className="text-link" href="#media">كل المواد <ArrowLeft size={15} /></a>
          </div>
          <div className="category-row" role="tablist" aria-label="تصفية القصص حسب المنطقة">
            {categories.map((category) => <button key={category} className={activeCategory === category ? "category-chip active" : "category-chip"} onClick={() => setActiveCategory(category)}>{category}</button>)}
          </div>
          <div className="story-grid">
            {filteredStories.map((story, index) => (
              <article key={story.id} className={index === 0 && activeCategory === "الكل" ? "story-card featured" : "story-card"}>
                {story.image ? <div className="story-image"><img src={story.image} alt="" /><span className="story-tag">{story.category}</span></div> : <div className="story-image story-placeholder"><span className="placeholder-number">0{story.id}</span><span className="story-tag">{story.category}</span></div>}
                <div className="story-body"><div className="story-kicker">{story.media}</div><h3>{story.title}</h3><p>{story.excerpt}</p><div className="story-footer"><Meta>{story.author}</Meta><Meta>{story.time}</Meta><button className="read-button" onClick={() => setSelectedStory(story)} aria-label={`قراءة ${story.title}`}><ArrowLeft size={17} /></button></div></div>
              </article>
            ))}
          </div>
        </section>

        <section id="students" className="students-section">
          <div className="container">
            <div className="section-heading light-heading"><div><div className="eyebrow"><span /> أصوات مستقلة</div><h2>كل طالب غرفة تحرير</h2></div><span className="section-count">01 — 04</span></div>
            <div className="student-grid">
              {[{name: "علي", place: "رام الله", role: "البلدية كما يراها الناس", icon: <MapPin size={17} />}, {name: "حنين", place: "مدونة شخصية", role: "ذاكرة المكان وحكاياته", icon: <BookOpen size={17} />}, {name: "إيناس", place: "طولكرم", role: "موجز محلي من 24 خبرًا", icon: <Clock3 size={17} />}, {name: "مراد", place: "الخليل", role: "تغطية من قلب الدورة", icon: <Mic2 size={17} />}].map((student) => <a href="#stories" className="student-card" key={student.name}><div className="student-avatar">{student.name[0]}</div><div><span>{student.icon} {student.place}</span><h3>{student.name}</h3><p>{student.role}</p></div><ArrowLeft size={18} /></a>)}
            </div>
          </div>
        </section>

        <section id="media" className="container section-block media-section">
          <div className="media-intro"><div className="eyebrow"><span /> مختبر الوسائط</div><h2>القصة الواحدة<br /><em>بست نوافذ</em></h2><p>نص، صورة، فيديو، صوت، تصميم، ورابط. لا نملأ الصفحة بالوسائط؛ نختار منها ما يجعل القصة أوضح.</p><a className="primary-button" href="#about">شاهد منهج العمل <ArrowLeft size={17} /></a></div>
          <div className="media-list">
            {[{icon: <BookOpen />, title: "النص", desc: "لغة أصلية ومقدمة تقود القارئ."}, {icon: <Camera />, title: "الصورة", desc: "دليل بصري يحفظ حق المكان."}, {icon: <Play />, title: "الفيديو", desc: "حركة وصوت ومشهد من الميدان."}, {icon: <Mic2 />, title: "الصوت", desc: "شهادة لا تنقلها الصورة وحدها."}, {icon: <Sparkles />, title: "التصميم", desc: "معلومة تختصرها عين القارئ."}, {icon: <ExternalLink />, title: "الرابط", desc: "طريق واضح إلى المصدر الأصلي."}].map((item, index) => <div className="media-item" key={item.title}><span className="media-index">0{index + 1}</span><span className="media-icon">{item.icon}</span><div><h3>{item.title}</h3><p>{item.desc}</p></div></div>)}
          </div>
        </section>

        <section id="about" className="about-section">
          <div className="container about-inner"><div><div className="eyebrow"><span /> عن المشروع</div><h2>من WordPress إلى غرفة تحرير حقيقية.</h2></div><div className="about-copy"><p>صوت التلميذ مساحة تطبيقية لطلاب الإعلام الرقمي. كل مشروع فردي، وكل مادة تمر عبر الفكرة، المصدر، النص، الوسائط، والمراجعة قبل النشر.</p><div className="about-links"><a href="https://github.com/Solvanix/urban-sense-core" target="_blank" rel="noreferrer">الأرشيف التحريري على GitHub <ExternalLink size={15} /></a><a href="https://www.youtube.com/" target="_blank" rel="noreferrer">قناة الفيديو <Youtube size={15} /></a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">القصص المصورة <Instagram size={15} /></a></div></div></div>
        </section>
      </main>

      <footer className="site-footer"><div className="container footer-inner"><div className="brand footer-brand"><span className="brand-mark">ص</span><span><strong>صوت التلميذ</strong><small>مختبر الصحافة الرقمية</small></span></div><p>مشروع تدريبي · فلسطين</p><span className="footer-note">© 2026 · نكتب من المكان</span></div></footer>

      {selectedStory && <div className="modal-backdrop" role="presentation" onClick={() => setSelectedStory(null)}><div className="story-modal" role="dialog" aria-modal="true" aria-labelledby="story-modal-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedStory(null)} aria-label="إغلاق"><X size={20} /></button>{selectedStory.image && <img src={selectedStory.image} alt="" />}<div className="story-modal-body"><div className="story-kicker">{selectedStory.category} · {selectedStory.media}</div><h2 id="story-modal-title">{selectedStory.title}</h2><p>{selectedStory.excerpt}</p><p className="modal-note">هذه بطاقة معاينة تدريبية. تُضاف المادة الكاملة بعد كتابة الطالب ومراجعة المصادر وحقوق الوسائط.</p><button className="primary-button" onClick={() => setSelectedStory(null)}>العودة إلى القصص <ArrowLeft size={16} /></button></div></div></div>}
    </div>
  );
}
