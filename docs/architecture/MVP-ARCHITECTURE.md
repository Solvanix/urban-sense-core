# MVP Architecture

## Architectural goal

Urban‑Sense Core will be built as one governed application with a browser-facing citizen experience, a protected operations console, a server-enforced authorization layer, PostgreSQL migrations, object storage for evidence, and a test suite that proves the critical workflow.

The implementation may reuse reviewed parts of the legacy archive, but its architecture must be intentionally rebuilt around the security and data rules below.

## Recommended logical components

| Component | Responsibility | Boundary |
|---|---|---|
| Citizen web app | Arabic-first report creation, tracking, notifications, and ratings. | Public routes plus authenticated citizen routes. |
| Operations console | Review, classification, assignment, field coordination, verification, and KPI views. | Protected roles only. |
| API service | Authentication enforcement, role checks, scoped queries, state transitions, validation, and audit emission. | The only component allowed to mutate domain data. |
| PostgreSQL | Transactional domain data, sessions, audit events, and report workflow state. | All schema changes use reviewed migrations. |
| Object storage | Photos and attachments, stored outside the database through controlled upload URLs. | Size, MIME, ownership, and retention rules enforced by the API. |
| Notification adapter | Pilot-stage status notifications. | Queue or provider isolated behind an interface. |
| Test harness and CI | Unit, integration, authorization, migration, and build checks. | Required before merge. |

## Identity and scope model

The system must never use a shared default user to represent private civic actions. Every command carries an authenticated actor or follows a separately designed anonymous-report policy.

| Role | Allowed responsibilities |
|---|---|
| Citizen | Create, read, and rate only their own reports. |
| Service officer | Review and classify reports only within assigned municipality and service domain. |
| Field worker | Access assigned tasks, upload evidence, and request completion. |
| Supervisor | Verify evidence and approve or reject closure within scope. |
| Municipality administrator | Manage scoped staff access, categories, service areas, and operational reports. |
| Platform administrator | Platform configuration and audit access under strict controls. |

Every user-facing record with operational significance includes `municipalityId`, a creator/owner identity where applicable, timestamps, and audit links. Queries are scope-first: the API filters by authorized municipality and role before selecting any data.

## Domain entities for the MVP

| Entity | Purpose |
|---|---|
| `municipalities` | Tenant/service-scope boundary for the pilot and future expansion. |
| `users` and `role_assignments` | Identity and scoped authorization. |
| `service_categories` | Controlled classification of reports. |
| `reports` | Citizen report, location, status, severity, owner, and policy-relevant metadata. |
| `report_reviews` | Classification, decision, notes, and reviewer identity. |
| `work_assignments` | Field responsibility, due date, task status, and assignee. |
| `report_evidence` | Metadata and object-storage key for submitted evidence. |
| `report_status_history` | Immutable legal state transitions and reasons. |
| `report_ratings` | Citizen rating permitted only after validated closure. |
| `audit_events` | Append-only actor/action/entity/timestamp/request-context record. |

## State machine

```text
submitted
→ under_review
→ assigned
→ in_progress
→ awaiting_verification
→ resolved

submitted / under_review / assigned / in_progress
→ rejected | cancelled

resolved
→ reopened
```

The API, not the client, enforces legal transitions. Every transition records the actor, reason, prior state, target state, and timestamp. A `resolved` transition requires supervisor authorization and at least one approved evidence record.

## Security principles

1. Authenticate before private access.
2. Authorize by role, municipality scope, and ownership.
3. Validate all request bodies on the server using schemas.
4. Store file content in object storage; store only safe metadata and a storage key in PostgreSQL.
5. Generate reviewable SQL migrations; never rely on destructive schema pushing in shared environments.
6. Restrict credentialed CORS to named origins and apply CSRF protection where cookie sessions are used.
7. Treat the audit trail as append-only and make report history visible to authorized roles only.

## Pilot deployment shape

The initial pilot has one municipality and one category of report. It uses separate development, test, staging, and production-like pilot environments. The first environment may be staging only; production data is not introduced until operational ownership, privacy notice, retention policy, access procedures, and incident handling are approved.
