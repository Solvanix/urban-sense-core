import { useMemo, useState } from "react";
import { Link } from "wouter";
import { AlertTriangle, ArrowLeft, CheckCircle2, Clock3, FileCheck2, Plus, ShieldCheck, Sparkles, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type VerificationStatus = "draft" | "checking" | "supported" | "conflicted";
export const verificationStatusValues: VerificationStatus[] = ["draft", "checking", "supported", "conflicted"];
export function isValidClaim(value: string) { return value.trim().length >= 12; }
export function isValidSource(value: string) { return value.trim().length >= 3; }
type VerificationCard = {
  id: string;
  claim: string;
  source: string;
  observedAt: string;
  status: VerificationStatus;
  note: string;
};

const STORAGE_KEY = "urban-sense-verification-room-v1";
const statusCopy: Record<VerificationStatus, { label: string; tone: string; icon: typeof Clock3 }> = {
  draft: { label: "مسودة لم تُراجع", tone: "bg-slate-100 text-slate-700", icon: Clock3 },
  checking: { label: "قيد التحقق", tone: "bg-amber-100 text-amber-800", icon: AlertTriangle },
  supported: { label: "مدعوم بدليل", tone: "bg-emerald-100 text-emerald-800", icon: CheckCircle2 },
  conflicted: { label: "مصادر متعارضة", tone: "bg-rose-100 text-rose-800", icon: AlertTriangle },
};

function loadCards(): VerificationCard[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function VerificationRoom() {
  const [cards, setCards] = useState<VerificationCard[]>(loadCards);
  const [claim, setClaim] = useState("");
  const [source, setSource] = useState("");
  const [note, setNote] = useState("");
  const [filter, setFilter] = useState<"all" | VerificationStatus>("all");

  const visibleCards = useMemo(() => filter === "all" ? cards : cards.filter(card => card.status === filter), [cards, filter]);
  const counts = useMemo(() => cards.reduce<Record<string, number>>((acc, card) => ({ ...acc, [card.status]: (acc[card.status] ?? 0) + 1 }), {}), [cards]);

  function persist(next: VerificationCard[]) {
    setCards(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function addCard() {
    if (!isValidClaim(claim) || !isValidSource(source)) return;
    persist([{ id: crypto.randomUUID(), claim: claim.trim(), source: source.trim(), observedAt: new Date().toISOString(), status: "draft", note: note.trim() }, ...cards]);
    setClaim("");
    setSource("");
    setNote("");
  }

  function setStatus(id: string, status: VerificationStatus) {
    persist(cards.map(card => card.id === id ? { ...card, status } : card));
  }

  function removeCard(id: string) {
    persist(cards.filter(card => card.id !== id));
  }

  return (
    <main className="min-h-screen bg-[#f6f8f7] pb-16 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/?view=sense" className="inline-flex items-center gap-2 text-sm font-bold text-[#0f5b5b]"><ArrowLeft size={16} />العودة إلى بوابة SenseCity</Link>
            <p className="mt-7 text-sm font-extrabold tracking-wide text-[#b7791f]">URBAN-SENSE / غرفة التحقق</p>
            <h1 className="mt-2 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">لا ننشر الادعاء قبل أن نعرف حدوده.</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">مساحة عمل أولية تحول المعلومة الخام إلى بطاقة يمكن مراجعتها: ما الادعاء؟ من مصدره؟ متى رُصد؟ وما الذي لا نعرفه بعد؟</p>
          </div>
          <div className="rounded-2xl border border-[#d8e6df] bg-white p-4 text-sm text-slate-600 shadow-sm sm:max-w-xs"><ShieldCheck className="mb-2 text-[#0f5b5b]" size={22} /><strong className="block text-slate-900">خصوصية أولًا</strong><span className="mt-1 block leading-6">المسودات تحفظ محليًا في هذا المتصفح ولا تُنشر تلقائيًا.</span></div>
        </header>

        <section className="mt-9 grid gap-5 lg:grid-cols-[1.05fr_.95fr]" aria-label="إضافة ادعاء ومؤشرات الغرفة">
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><Plus size={20} className="text-[#b7791f]" />أضف ادعاءً للمراجعة</CardTitle><p className="text-sm leading-6 text-slate-500">هذا لا ينشر خبرًا. إنه ينشئ مسودة داخلية تحتاج قرارًا بشريًا.</p></CardHeader>
            <CardContent className="space-y-4">
              <Textarea value={claim} onChange={event => setClaim(event.target.value)} placeholder="مثال: رُصد توفر خدمة معينة في منطقة محددة..." aria-label="نص الادعاء" className="min-h-28" />
              <Input value={source} onChange={event => setSource(event.target.value)} placeholder="المصدر أو رابط الدليل" aria-label="المصدر أو رابط الدليل" />
              <Input value={note} onChange={event => setNote(event.target.value)} placeholder="ملاحظة للمراجع (اختياري)" aria-label="ملاحظة للمراجع" />
              <Button onClick={addCard} disabled={!isValidClaim(claim) || !isValidSource(source)} className="gap-2 bg-[#0f5b5b] font-bold hover:bg-[#0b4848]"><FileCheck2 size={17} />حفظ كمسودة محلية</Button>
            </CardContent>
          </Card>
          <Card className="border-0 bg-[#143b3a] text-white shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2 text-xl"><Sparkles className="text-[#f2cf85]" size={20} />مؤشر الغرفة</CardTitle><p className="text-sm leading-6 text-white/65">المؤشرات تصف حالة المراجعة، ولا تدعي دقة الخبر.</p></CardHeader><CardContent className="grid grid-cols-2 gap-3">{(["all", "draft", "checking", "supported", "conflicted"] as const).map(key => <button key={key} onClick={() => setFilter(key)} className={`rounded-xl p-4 text-right ring-1 ring-white/10 transition ${filter === key ? "bg-[#f2cf85] text-[#143b3a]" : "bg-white/[.07] text-white"}`}><span className="block text-xs font-bold opacity-75">{key === "all" ? "كل البطاقات" : statusCopy[key].label}</span><strong className="mt-2 block text-2xl">{key === "all" ? cards.length : counts[key] ?? 0}</strong></button>)}</CardContent></Card>
        </section>

        <section className="mt-10" aria-labelledby="cards-title"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-extrabold text-[#b7791f]">سجل المراجعة المحلي</p><h2 id="cards-title" className="mt-1 text-2xl font-black">بطاقات لم تُنشر تلقائيًا</h2></div><p className="text-sm text-slate-500">{visibleCards.length} بطاقة في العرض الحالي</p></div>
          {visibleCards.length === 0 ? <Card className="mt-5 border-dashed border-slate-300 bg-white/70"><CardContent className="p-10 text-center"><FileCheck2 className="mx-auto text-slate-400" size={30} /><h3 className="mt-4 text-lg font-extrabold">لا توجد بطاقات في هذا المرشح</h3><p className="mx-auto mt-2 max-w-lg leading-7 text-slate-500">ابدأ بادعاء واحد ومصدر واحد. تبقى البطاقة محلية حتى تُربط لاحقًا بدورة مراجعة وصلاحيات خادم.</p></CardContent></Card> : <div className="mt-5 grid gap-4 md:grid-cols-2">{visibleCards.map(card => { const meta = statusCopy[card.status]; const Icon = meta.icon; return <Card key={card.id} className="border-0 shadow-sm"><CardContent className="p-6"><div className="flex items-start justify-between gap-3"><Badge className={`border-0 ${meta.tone}`}><Icon size={14} className="ml-1" />{meta.label}</Badge><button onClick={() => removeCard(card.id)} aria-label="حذف بطاقة التحقق" className="text-slate-400 hover:text-rose-600"><Trash2 size={17} /></button></div><h3 className="mt-5 text-lg font-extrabold leading-8">{card.claim}</h3><p className="mt-3 break-words text-sm leading-6 text-slate-600"><span className="font-bold text-slate-900">المصدر:</span> {card.source}</p>{card.note && <p className="mt-2 text-sm leading-6 text-slate-500"><span className="font-bold text-slate-900">ملاحظة:</span> {card.note}</p>}<time className="mt-4 block text-xs text-slate-400">رُصدت المسودة: {new Date(card.observedAt).toLocaleString("ar-PS")}</time><div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">{(["draft", "checking", "supported", "conflicted"] as VerificationStatus[]).map(status => <Button key={status} variant="outline" size="sm" onClick={() => setStatus(card.id, status)} className="text-xs">{statusCopy[status].label}</Button>)}</div></CardContent></Card> })}</div>}
        </section>
        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm leading-7 text-slate-500">هذه نسخة أولية محلية: لا تستقبل بيانات سرية ولا تنشر خبرًا ولا تستبدل المراجع. الخطوة التالية هي ربطها بسجل خادم محمي، ومصادر، وأدوار مراجعة، وسياسة إسقاط عام.</footer>
      </div>
    </main>
  );
}
