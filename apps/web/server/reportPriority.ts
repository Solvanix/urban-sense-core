export type ReportPriority = "normal" | "high" | "critical";
export type CommunityVote = "support" | "unsure" | "oppose";

export type ReportPriorityInput = {
  administrativePriority: ReportPriority;
  supportCount: number;
  unsureCount: number;
  opposeCount: number;
  duplicateReportCount?: number;
  daysOpen?: number;
};

export type ReportPriorityResult = {
  administrativePriority: ReportPriority;
  communitySignal: "emerging" | "mixed" | "supported" | "contested";
  executionPriority: "normal" | "elevated" | "urgent";
  supportRate: number;
  totalVotes: number;
  score: number;
  explanation: string;
};

const baseScore: Record<ReportPriority, number> = {
  normal: 20,
  high: 50,
  critical: 90,
};

function safeCount(value: number | undefined) {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value ?? 0)) : 0;
}

/**
 * Produces a transparent triage signal. It never changes the report's
 * administrative priority and never treats a vote as proof that a claim is true.
 */
export function calculateReportPriority(input: ReportPriorityInput): ReportPriorityResult {
  const supportCount = safeCount(input.supportCount);
  const unsureCount = safeCount(input.unsureCount);
  const opposeCount = safeCount(input.opposeCount);
  const duplicateReportCount = safeCount(input.duplicateReportCount);
  const daysOpen = safeCount(input.daysOpen);
  const totalVotes = supportCount + unsureCount + opposeCount;
  const supportRate = totalVotes === 0 ? 0 : supportCount / totalVotes;
  const oppositionRate = totalVotes === 0 ? 0 : opposeCount / totalVotes;
  const netSupport = supportCount - opposeCount;
  const score = Math.min(
    100,
    baseScore[input.administrativePriority] +
      Math.min(15, netSupport * 2) +
      Math.min(10, duplicateReportCount * 2) +
      Math.min(10, daysOpen),
  );

  let communitySignal: ReportPriorityResult["communitySignal"] = "emerging";
  if (totalVotes >= 3 && oppositionRate >= 0.35) communitySignal = "contested";
  else if (totalVotes >= 3 && supportRate >= 0.6) communitySignal = "supported";
  else if (totalVotes >= 2) communitySignal = "mixed";

  let executionPriority: ReportPriorityResult["executionPriority"] = "normal";
  if (input.administrativePriority === "critical" || score >= 80) executionPriority = "urgent";
  else if (input.administrativePriority === "high" || score >= 40) executionPriority = "elevated";

  const explanation = [
    `الأولوية الإدارية: ${input.administrativePriority}`,
    `الإشارة المجتمعية: ${communitySignal}`,
    `التصويت المؤيد: ${supportCount} من ${totalVotes}`,
    duplicateReportCount > 0 ? `بلاغات مشابهة: ${duplicateReportCount}` : null,
    daysOpen > 0 ? `أيام الانتظار: ${daysOpen}` : null,
  ].filter(Boolean).join(" · ");

  return {
    administrativePriority: input.administrativePriority,
    communitySignal,
    executionPriority,
    supportRate,
    totalVotes,
    score,
    explanation,
  };
}

export function isAllowedCommunityVote(value: string): value is CommunityVote {
  return value === "support" || value === "unsure" || value === "oppose";
}
