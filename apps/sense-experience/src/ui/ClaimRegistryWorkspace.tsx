import { useState } from "react";
import { claimTypes, type ClaimType } from "../onboarding/claimRegistry.js";

type ProviderClaimView = {
  claim: { id: string; type: string; statement: string; state: string; createdAt: string; updatedAt: string };
  evidence: { id: string; kind: string; reference: string; summary: string; createdAt: string }[];
  decisions: { id: string; reviewerId: string; outcome: string; reason: string; decidedAt: string }[];
};

type ReviewerClaimView = { id: string; type: string; statement: string; state: string; createdAt: string; updatedAt: string };

type ClaimDraft = {
  reference: string;
  accessCode: string;
  type: ClaimType;
  statement: string;
  evidenceKind: "provider_note" | "external_url" | "document_reference";
  evidenceReference: string;
  evidenceSummary: string;
};

const draftKey = "sense-experience-claim-draft-v1";
const typeLabels: Record<ClaimType, string> = {
  accessibility: "وصول وتمكين", safety: "سلامة", availability: "توافر", sustainability: "استدامة", certification: "شهادة", membership: "عضوية"
};

function restoreDraft(): ClaimDraft {
  try {
    return { reference: "", accessCode: "", type: "accessibility" as ClaimType, statement: "", evidenceKind: "provider_note", evidenceReference: "", evidenceSummary: "", ...JSON.parse(localStorage.getItem(draftKey) ?? "null") };
  } catch {
    return { reference: "", accessCode: "", type: "accessibility" as ClaimType, statement: "", evidenceKind: "provider_note", evidenceReference: "", evidenceSummary: "" };
  }
}

async function rpc<T>(path: string, input?: Record<string, unknown>, method: "GET" | "POST" = "GET"): Promise<T> {
  const url = method === "GET" && input ? `/api/trpc/${path}?input=${encodeURIComponent(JSON.stringify({ json: input }))}` : `/api/trpc/${path}`;
  const response = await fetch(url, {
    method,
    headers: method === "POST" ? { "content-type": "application/json" } : undefined,
    body: method === "POST" ? JSON.stringify({ json: input }) : undefined
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.error) throw new Error(payload.error?.json?.message ?? payload.error?.message ?? "تعذر الاتصال بسجل الادعاءات.");
  return (payload.result?.data?.json ?? payload.result?.data) as T;
}

export function ClaimRegistryWorkspace({ onNavigate }: { onNavigate: (href: string) => void }) {
  const [draft, setDraft] = useState<ClaimDraft>(restoreDraft);
  const [message, setMessage] = useState("هذه المسودة محلية حتى تختار إرسالها للمراجعة.");
  const [claims, setClaims] = useState<ProviderClaimView[]>([]);
  const [reviewClaims, setReviewClaims] = useState<ReviewerClaimView[]>([]);
  const [selected, setSelected] = useState<ProviderClaimView | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  function change<K extends keyof ClaimDraft>(field: K, value: ClaimDraft[K]) { setDraft((current) => ({ ...current, [field]: value })); }

  function saveDraft() {
    localStorage.setItem(draftKey, JSON.stringify(draft));
    setMessage("حُفظت المسودة على هذا الجهاز فقط؛ لا يرى المراجع أو الزائر أيًا منها قبل الإرسال.");
  }

  async function loadMine() {
    setBusy(true);
    try {
      const items = await rpc<ProviderClaimView[]>("providerClaims.listMine", { reference: draft.reference, accessCode: draft.accessCode });
      setClaims(items);
      setMessage(items.length ? "ظهرت ادعاءات هذا الطلب فقط. مراجع الأدلة تبقى داخل هذا المسار الخاص." : "لا توجد ادعاءات مسجلة لهذا الطلب بعد.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "تعذر قراءة سجل الادعاءات."); }
    finally { setBusy(false); }
  }

  async function submitClaim() {
    setBusy(true);
    try {
      const claim = await rpc<{ id: string }>("providerClaims.submit", { reference: draft.reference, accessCode: draft.accessCode, type: draft.type, statement: draft.statement }, "POST");
      if (draft.evidenceReference.trim() || draft.evidenceSummary.trim()) {
        await rpc("providerClaims.addEvidence", { reference: draft.reference, accessCode: draft.accessCode, claimId: claim.id, kind: draft.evidenceKind, evidenceReference: draft.evidenceReference, summary: draft.evidenceSummary }, "POST");
      }
      localStorage.removeItem(draftKey);
      setMessage("أُرسل الادعاء لمسار المراجعة. لا يعني هذا التحقق أو الظهور العام.");
      await loadMine();
    } catch (error) { setMessage(error instanceof Error ? error.message : "تعذر إرسال الادعاء."); }
    finally { setBusy(false); }
  }

  async function loadReviewQueue() {
    setBusy(true);
    try {
      const items = await rpc<ReviewerClaimView[]>("providerClaims.listForReview");
      setReviewClaims(items);
      setMessage("هذه قائمة داخلية للمراجعين المخولين فقط، وليست قائمة عامة.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "تعذر فتح قائمة المراجعة."); }
    finally { setBusy(false); }
  }

  async function openReviewDetail(claimId: string) {
    setBusy(true);
    try {
      setSelected(await rpc<ProviderClaimView>("providerClaims.reviewDetail", { claimId }));
      setMessage("مراجع الأدلة ظاهرة هنا للمراجع فقط؛ لا تُسلسل إلى بطاقة الزائر.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "تعذر فتح تفاصيل الادعاء."); }
    finally { setBusy(false); }
  }

  async function decide(outcome: "needs_evidence" | "verified" | "rejected") {
    if (!selected) return;
    setBusy(true);
    try {
      await rpc("providerClaims.decide", { claimId: selected.claim.id, outcome, reason }, "POST");
      setMessage(outcome === "verified" ? "سُجل قرار التحقق. لا يصبح الادعاء عامًا إلا إذا اكتمل مسار النشر والموافقة المنفصل." : "سُجل القرار والسبب في سجل المراجعة الخاص.");
      await loadReviewQueue();
      setSelected(null);
      setReason("");
    } catch (error) { setMessage(error instanceof Error ? error.message : "تعذر حفظ القرار."); }
    finally { setBusy(false); }
  }

  return <main id="main-content" tabIndex={-1} className="claim-shell" dir="rtl">
    <header className="studio-header"><div><p className="eyebrow">SENSE EXPERIENCE · CLAIM REGISTRY</p><h1>سجل ادعاءات يميّز التصريح عن الدليل والتحقق.</h1><p>لا يتحول قول المزوّد إلى معلومة عامة. لكل ادعاء مسار خاص: تصريح، مرجع دليل، قرار مراجع وسبب موثق، ثم بوابة نشر منفصلة.</p></div><button className="secondary" onClick={() => onNavigate("/")}>العودة للبوابة</button></header>
    <section className="studio-boundary" role="note"><b>حدود هذا الإصدار:</b> يقبل مرجعًا أو ملاحظة دليلية فقط، ولا يرفع ملفات أو صورًا أو موقعًا دقيقًا. لا تنشر هذه الصفحة أي ادعاء أو دليل للزائر.</section>
    <p className="claim-message" role="status">{message}</p>
    <div className="claim-grid">
      <section className="claim-panel" aria-label="تقديم ادعاء خاص بالمزوّد">
        <p className="eyebrow">مسار المزوّد</p><h2>قدّم ادعاءً للمراجعة</h2>
        <div className="claim-fields">
          <label><span>رقم المتابعة</span><input value={draft.reference} onChange={(event) => change("reference", event.target.value)} placeholder="SX-XXXXXXXXXX" autoComplete="off" /></label>
          <label><span>رمز الوصول</span><input value={draft.accessCode} onChange={(event) => change("accessCode", event.target.value)} type="password" placeholder="رمز خاص" autoComplete="off" /></label>
          <label><span>نوع الادعاء</span><select value={draft.type} onChange={(event) => change("type", event.target.value as ClaimType)}>{claimTypes.map((type) => <option value={type} key={type}>{typeLabels[type]}</option>)}</select></label>
          <label className="claim-full"><span>تصريح المزوّد</span><textarea value={draft.statement} onChange={(event) => change("statement", event.target.value)} rows={4} placeholder="اكتب وصفًا واقعيًا يمكن للمراجع تقييمه، من دون وعود تسويقية مطلقة." /></label>
        </div>
        <fieldset className="claim-evidence"><legend>مرجع دليل خاص — اختياري</legend><p>هذا ليس رفع ملف. اكتب مرجعًا داخليًا، عنوان URL خاضعًا للمراجعة، أو وصف ملاحظة. لا تضع بيانات زوار أو ملفات حساسة هنا.</p><div className="claim-fields"><label><span>نوع المرجع</span><select value={draft.evidenceKind} onChange={(event) => change("evidenceKind", event.target.value as ClaimDraft["evidenceKind"])}><option value="provider_note">ملاحظة مزوّد</option><option value="external_url">رابط خارجي</option><option value="document_reference">مرجع مستند</option></select></label><label><span>مرجع الدليل</span><input value={draft.evidenceReference} onChange={(event) => change("evidenceReference", event.target.value)} placeholder="مرجع خاص لا يظهر للزائر" /></label><label className="claim-full"><span>ملخص الدليل</span><textarea value={draft.evidenceSummary} onChange={(event) => change("evidenceSummary", event.target.value)} rows={3} placeholder="ما الذي يستطيع المراجع التأكد منه؟" /></label></div></fieldset>
        <div className="studio-actions"><button className="secondary" onClick={saveDraft} disabled={busy}>حفظ مسودة محلية</button><button className="primary" onClick={submitClaim} disabled={busy}>إرسال للمراجعة</button><button className="quiet" onClick={loadMine} disabled={busy}>عرض سجل طلبي</button></div>
        {claims.length > 0 && <ul className="claim-list" aria-label="ادعاءات طلبي الخاصة">{claims.map(({ claim, decisions }) => <li key={claim.id}><b>{typeLabels[claim.type as ClaimType] ?? claim.type}</b><span>{claim.state}</span><p>{claim.statement}</p>{decisions[0] && <small>آخر قرار: {decisions[0].outcome} — {decisions[0].reason}</small>}</li>)}</ul>}
      </section>
      <aside className="claim-review" aria-label="مسار المراجع">
        <p className="eyebrow">مسار المراجع</p><h2>قرار معلّل، لا زر نشر.</h2><p>تتطلب هذه المساحة جلسة مراجع مخوّل. لا يملك المراجع هنا إنشاء صفحة عامة أو كشف مرجع الدليل.</p><button className="secondary" onClick={loadReviewQueue} disabled={busy}>فتح طابور المراجعة</button>
        <div className="review-queue">{reviewClaims.length ? reviewClaims.map((claim) => <button key={claim.id} onClick={() => openReviewDetail(claim.id)}><b>{typeLabels[claim.type as ClaimType] ?? claim.type}</b><span>{claim.state}</span><small>{claim.statement}</small></button>) : <p>افتح الطابور بعد تسجيل الدخول كمراجع.</p>}</div>
        {selected && <section className="review-detail"><h3>تفاصيل خاصة</h3><p>{selected.claim.statement}</p><h4>مراجع الأدلة</h4><ul>{selected.evidence.map((evidence) => <li key={evidence.id}><b>{evidence.kind}</b><span>{evidence.summary}</span><small>مرجع خاص: {evidence.reference}</small></li>)}</ul><label><span>سبب القرار</span><textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={3} placeholder="سبب واضح لا يقل عن 8 أحرف." /></label><div className="review-actions"><button onClick={() => decide("needs_evidence")} disabled={busy}>اطلب دليلًا</button><button className="primary" onClick={() => decide("verified")} disabled={busy}>تحقق</button><button className="quiet" onClick={() => decide("rejected")} disabled={busy}>ارفض</button></div></section>}
      </aside>
    </div>
  </main>;
}
