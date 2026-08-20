import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { publicNavigation } from "@/lib/publicSite";
import { Building2, LogIn } from "lucide-react";
import { Link } from "wouter";

export default function PublicHeader() {
  const { isAuthenticated, loading, logout } = useAuth();

  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 lg:px-8">
      <Link href="/?view=urban" className="flex shrink-0 items-center gap-3" aria-label="Urban-Sense، الصفحة الرئيسية">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0f5b5b] text-white shadow-lg shadow-teal-900/15"><Building2 size={23} /></span>
        <span>
          <span className="block text-lg font-extrabold tracking-tight text-[#143534]">Urban‑Sense</span>
          <span className="block text-xs font-semibold text-slate-500">منصة البلاغات البلدية</span>
        </span>
      </Link>

      <nav className="hidden items-center gap-1 lg:flex" aria-label="التنقل العام">
        {publicNavigation.map(item => (
          <Link key={item.href} href={item.href} className="rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-white hover:text-[#0f5b5b]">
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex shrink-0 items-center gap-2">
        {isAuthenticated ? (
          <>
            <Link href="/بلاغاتي" className="hidden rounded-xl px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-white sm:inline-flex">بلاغاتي</Link>
            <Button variant="outline" onClick={() => logout()} className="rounded-xl border-slate-300 font-bold">تسجيل الخروج</Button>
          </>
        ) : (
          <Button disabled={loading} onClick={() => startLogin()} className="gap-2 rounded-xl bg-[#0f5b5b] px-4 font-bold hover:bg-[#0a4848] sm:px-5"><LogIn size={17} /><span className="hidden sm:inline">تسجيل الدخول</span><span className="sm:hidden">دخول</span></Button>
        )}
      </div>
    </header>
  );
}
