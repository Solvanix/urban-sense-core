import { createHash, randomUUID } from "node:crypto";
import mysql from "mysql2/promise";

const connectionString = process.env.SENSE_EXPERIENCE_DATABASE_URL;
const subject = process.env.REVIEWER_OIDC_SUBJECT;
const displayName = process.env.REVIEWER_DISPLAY_NAME;
const role = process.env.REVIEWER_ROLE ?? "administrator";
const reason = process.env.REVIEWER_ASSIGNMENT_REASON ?? "Initial independent reviewer bootstrap.";

if (!connectionString || !subject || !displayName) {
  throw new Error("Set SENSE_EXPERIENCE_DATABASE_URL, REVIEWER_OIDC_SUBJECT, and REVIEWER_DISPLAY_NAME before provisioning a reviewer.");
}
if (role !== "reviewer" && role !== "administrator") {
  throw new Error("REVIEWER_ROLE must be reviewer or administrator.");
}

const connection = await mysql.createConnection(connectionString);
const [existing] = await connection.execute(
  "SELECT id FROM sx_reviewer_identity WHERE provider = 'external_oidc' AND subject = ? LIMIT 1",
  [subject]
);

let reviewerIdentityId;
if (Array.isArray(existing) && existing.length > 0) {
  reviewerIdentityId = existing[0].id;
  await connection.execute(
    "UPDATE sx_reviewer_identity SET display_name = ?, state = 'active', updated_at = UTC_TIMESTAMP() WHERE id = ?",
    [displayName, reviewerIdentityId]
  );
} else {
  reviewerIdentityId = randomUUID();
  await connection.execute(
    "INSERT INTO sx_reviewer_identity (id, provider, subject, display_name, state, created_at, updated_at) VALUES (?, 'external_oidc', ?, ?, 'active', UTC_TIMESTAMP(), UTC_TIMESTAMP())",
    [reviewerIdentityId, subject, displayName]
  );
}

const assignmentId = randomUUID();
const activeKey = createHash("sha256").update(`${reviewerIdentityId}:${role}`).digest("hex").slice(0, 64);
await connection.execute(
  "INSERT INTO sx_reviewer_role_assignment (id, reviewer_identity_id, role, state, active_key, assigned_by_identity_id, reason, assigned_at) VALUES (?, ?, ?, 'active', ?, NULL, ?, UTC_TIMESTAMP()) ON DUPLICATE KEY UPDATE state = 'active', reason = VALUES(reason), revoked_at = NULL",
  [assignmentId, reviewerIdentityId, role, activeKey, reason]
);
await connection.execute(
  "INSERT INTO sx_audit_event (id, event_type, interest_id, reviewer_identity_id, actor_id, occurred_at) VALUES (?, 'reviewer_role_assigned', NULL, ?, ?, UTC_TIMESTAMP())",
  [randomUUID(), reviewerIdentityId, subject]
);
await connection.end();
console.log(`Active ${role} reviewer provisioned for ${displayName}.`);
