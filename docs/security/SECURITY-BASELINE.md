# Security Baseline

## Non-negotiable release rule

No public pilot, municipality onboarding, or citizen data collection may begin until every **critical** control in this document is implemented and verified by automated tests.

## Identity and authorization

| Control | Baseline requirement | Verification |
|---|---|---|
| No shared guest identity | Private commands require an authenticated actor; a shared fallback user is prohibited. | Integration test expects `401` for unauthenticated private actions. |
| Role-based access | Server procedures enforce citizen, officer, field worker, supervisor, and admin permissions. | Tests cover both allowed and denied role combinations. |
| Municipality scope | Every service-side read and write is constrained by authorized `municipalityId`. | Cross-municipality access test returns `403` or no data. |
| Ownership | Citizens can access only reports they created, except explicitly delegated cases. | Cross-user read/update test fails. |
| Legal transitions | Only authorized roles can move a report through the state machine. | Transition matrix test covers all legal and illegal changes. |

## Data and file protection

The database stores report metadata, status history, and references to evidence. It does not store image bytes. Evidence is uploaded through controlled storage operations that validate ownership, file size, MIME type, retention class, and malware-scanning status where the storage provider supports it.

| Control | Baseline requirement |
|---|---|
| Request validation | Server-side schema validation, length limits, category allow-lists, and geographic bounds. |
| File upload | Signed upload path; approved MIME list; size limit; storage key never directly chosen by client. |
| Sensitive data | Minimize personal data in reports. Location precision and attachments follow the approved privacy policy. |
| Migrations | All schema changes are versioned migrations reviewed in pull requests. |
| Backups and restore | Test backup/restore before pilot data is accepted. |
| Audit events | Append-only actor/action/entity/timestamp/event-context log for report operations. |

## Web and API protections

| Control | Baseline requirement |
|---|---|
| CORS | Explicit allow-list of frontend origins; never reflect arbitrary credentialed origins. |
| CSRF | Protection for cookie-authenticated mutation routes. |
| Session security | `httpOnly`, `secure`, appropriate `sameSite`, session rotation, expiry, and revocation behavior. |
| Secrets | Secrets only in environment/secret management; never in repository, logs, frontend bundles, or screenshots. |
| Rate limiting | Report submission, login, upload initiation, and search endpoints are rate-limited. |
| Error handling | Clients receive safe error messages; detailed diagnostics remain server-side. |

## Security tests required before merge

1. Unauthenticated report creation/read/update is rejected.
2. A citizen cannot read or modify another citizen's report.
3. A field worker cannot close a report; a supervisor cannot close without verified evidence.
4. A user from municipality A cannot access municipality B data.
5. File-upload initiation rejects unauthorized owner, invalid MIME, and oversize payload.
6. Credentialed request from an unapproved origin is rejected.
7. Every successful report state change emits an immutable audit event.

## Incident readiness before pilot

The pilot must have a named service owner, access-removal procedure, key/session revocation procedure, incident contact, data retention window, and manual rollback runbook. These are operational requirements, not optional documentation.
