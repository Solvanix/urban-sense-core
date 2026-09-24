import { demoVisitSignals, summarizeVisitStatus, type LiveMode, type VisitSignal } from "../live/visitStatus.js";

type LiveVisitStatusProps = {
  mode?: LiveMode;
  signals?: VisitSignal[];
};

const signalIcon: Record<VisitSignal["status"], string> = {
  clear: "✓",
  limited: "!",
  closed: "×",
  needs_confirmation: "?",
  unknown: "—",
};

export function LiveVisitStatus({ mode = "normal", signals = demoVisitSignals }: LiveVisitStatusProps) {
  const summary = summarizeVisitStatus(signals, mode);
  return <section className={`live-visit-status live-visit-status-${summary.tone}`} aria-labelledby="live-visit-title">
    <div className="live-visit-header">
      <div><span className="sense-section-label">SENSE LIVE · حالة الزيارة</span><h2 id="live-visit-title">{summary.headline}</h2><p>{summary.detail}</p></div>
      <span className="live-visit-mode">{mode === "emergency" ? "طوارئ" : mode === "paused" ? "متوقفة" : "آخر حالة موثقة"}</span>
    </div>
    <div className="live-visit-signals">{signals.map((signal) => <article key={signal.id} className="live-visit-signal"><span className="live-visit-signal-icon" aria-hidden="true">{signalIcon[signal.status]}</span><div><strong>{signal.label}</strong><span>{signal.statusLabel}</span><small>{signal.note}</small><small>المصدر: {signal.sourceLabel} · صالح حتى {new Date(signal.validUntil).toLocaleDateString("ar")}</small></div></article>)}</div>
    <p className="live-visit-boundary">هذه ليست قراءة مرور مباشرة ولا حجزًا نهائيًا. نعرض المصدر ووقت الصلاحية ونقول بوضوح عندما تحتاج المعلومة إلى تأكيد.</p>
  </section>;
}
