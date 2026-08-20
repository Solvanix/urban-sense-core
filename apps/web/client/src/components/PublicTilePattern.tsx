type TileVariant = "home" | "process" | "municipal";

export const tileCopy = {
  home: {
    eyebrow: "من الإشارة إلى الأثر",
    title: "ثلاثة أشياء لا ينبغي أن تضيع في الطريق.",
    tiles: [
      { key: "01", title: "بلاغ مفهوم", text: "وصف وموقع وسياق يكفون لبدء المراجعة.", tone: "bg-[#143b3a] text-white", shape: "square" },
      { key: "02", title: "مسار ظاهر", text: "انتقالات العمل لا تبقى في محادثات أو ملفات منفصلة.", tone: "bg-[#e6eee9] text-[#143534]", shape: "path" },
      { key: "03", title: "أثر مراجع", text: "الإغلاق يمر بدليل وتحقق، ثم يفتح تقييمًا اختياريًا.", tone: "bg-[#f2cf85] text-[#3b2b0d]", shape: "dot" },
    ],
  },
  process: {
    eyebrow: "منطق المسار",
    title: "كل مرحلة تُسلِّم ما تحتاجه المرحلة التالية.",
    tiles: [
      { key: "قبل", title: "سياق", text: "تفاصيل كافية تمنع الدوران في أسئلة البداية.", tone: "bg-[#e7f1ed] text-[#143534]", shape: "square" },
      { key: "أثناء", title: "انتقال", text: "المراجعة والإسناد لا يحدثان في فراغ.", tone: "bg-[#143b3a] text-white", shape: "path" },
      { key: "بعد", title: "تحقق", text: "الدليل يسبق الإغلاق، والتقييم يأتي بعده فقط.", tone: "bg-[#f2cf85] text-[#3b2b0d]", shape: "dot" },
    ],
  },
  municipal: {
    eyebrow: "لوحة التشغيل",
    title: "المنصة لا تختصر الأدوار؛ بل تجعل حدودها مرئية.",
    tiles: [
      { key: "دور", title: "من يقرر؟", text: "كل خطوة مرتبطة بدور معروف داخل البلدية المشاركة.", tone: "bg-[#143b3a] text-white", shape: "square" },
      { key: "دليل", title: "ما الذي يثبت؟", text: "الأدلة تبقى مرتبطة بالمهمة والبلاغ لا بمجلد عائم.", tone: "bg-[#e7f1ed] text-[#143534]", shape: "path" },
      { key: "سجل", title: "ماذا يبقى؟", text: "سجل تدقيق يحفظ تسلسل العمل للمراجعة لاحقًا.", tone: "bg-[#f2cf85] text-[#3b2b0d]", shape: "dot" },
    ],
  },
} satisfies Record<TileVariant, { eyebrow: string; title: string; tiles: { key: string; title: string; text: string; tone: string; shape: "square" | "path" | "dot" }[] }>;

export default function PublicTilePattern({ variant }: { variant: TileVariant }) {
  const content = tileCopy[variant];

  return (
    <section className="mx-auto max-w-7xl px-5 py-5 lg:px-8" aria-label={content.eyebrow}>
      <div className="border-t border-[#cddbd5] pt-7">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs font-extrabold tracking-[0.18em] text-[#0f5b5b]">{content.eyebrow}</p>
            <h2 className="mt-2 text-2xl font-extrabold leading-tight text-[#143534] sm:text-3xl">{content.title}</h2>
          </div>
          <span className="font-mono text-xs font-bold tracking-[0.15em] text-[#a8781f]">URBAN‑SENSE / TILE SYSTEM</span>
        </div>
        <div className="grid gap-3 md:grid-cols-[1.05fr_.85fr_1.1fr]">
          {content.tiles.map((tile, index) => (
            <article key={tile.key} className={`${tile.tone} min-h-[190px] overflow-hidden px-6 py-6 ${index === 1 ? "md:translate-y-6" : ""}`}>
              <div className="flex items-start justify-between gap-5">
                <span className="font-mono text-xs font-extrabold tracking-[0.16em] opacity-70">{tile.key}</span>
                <span className={`relative block h-10 w-14 ${tile.shape === "square" ? "border-2 border-current" : tile.shape === "path" ? "border-b-2 border-r-2 border-current" : "rounded-full bg-current/15"}`}>
                  {tile.shape === "path" ? <i className="absolute bottom-2 right-2 h-2 w-8 bg-current" /> : null}
                  {tile.shape === "dot" ? <i className="absolute right-3 top-3 h-4 w-4 rounded-full bg-current" /> : null}
                </span>
              </div>
              <h3 className="mt-8 text-2xl font-extrabold">{tile.title}</h3>
              <p className="mt-3 max-w-xs text-sm leading-7 opacity-80">{tile.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
