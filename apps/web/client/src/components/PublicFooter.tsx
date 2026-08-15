import { publicFootnotes, publicNavigation } from "@/lib/publicSite";
import { Building2 } from "lucide-react";
import { Link } from "wouter";

export default function PublicFooter() {
  return (
    <footer className="border-t border-teal-950/10 bg-[#123b3a] text-teal-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[1.2fr_.8fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-[#f6c76d]"><Building2 size={21} /></span><div><p className="font-extrabold">Urban‑Sense</p><p className="text-sm text-teal-100/70">منصة البلاغات البلدية</p></div></div>
          <p className="mt-5 max-w-xl leading-8 text-teal-50/80">خدمة رقمية تساعد على تنظيم البلاغات الخدمية ومتابعتها ضمن مسار واضح يخدم المواطن وفريق البلدية.</p>
          <div className="mt-5 space-y-2 text-sm leading-6 text-teal-100/70">{publicFootnotes.map((note) => <p key={note}>• {note}</p>)}</div>
        </div>
        <nav className="grid grid-cols-2 gap-3 self-start text-sm font-bold" aria-label="روابط التذييل">
          {publicNavigation.map((item) => <Link key={item.href} href={item.href} className="rounded-xl px-3 py-2 text-teal-50/85 transition-colors hover:bg-white/10 hover:text-white">{item.label}</Link>)}
          <Link href="/بلاغ-جديد" className="rounded-xl px-3 py-2 text-teal-50/85 transition-colors hover:bg-white/10 hover:text-white">إرسال بلاغ</Link>
          <Link href="/العمليات" className="rounded-xl px-3 py-2 text-teal-50/85 transition-colors hover:bg-white/10 hover:text-white">بوابة العمليات</Link>
        </nav>
      </div>
    </footer>
  );
}
