import { createHash } from "node:crypto";

export type AuditHashPayload = {
  municipalityId: number | null;
  actorUserId: number | null;
  entityType: string;
  entityId: string;
  action: string;
  previousValue: unknown;
  nextValue: unknown;
  reason: string | null;
  previousHash: string | null;
  createdAt: string;
};

export function buildAuditEventHash(payload: AuditHashPayload) {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}
