# Start Here: Foundation Phase A

## Purpose

This document is the operational entry point for Urban‑Sense Core. It turns the prior technical audit into a safe, testable delivery sequence.

The current code-parity decision is recorded in [تدقيق تطابق Urban‑Sense بين Manus وGitHub](./MANUS-GITHUB-PARITY-AUDIT.md): the central repository is the source of truth for code, while Manus remains the active operating environment.

> **Do not begin feature expansion before the foundation gate is complete.**

## The first outcome

The project will deliver a single, verifiable vertical slice: a secure civic-reporting service. The first milestone is not a large interface or a multi-module platform. It is proof that identities, data, report ownership, staff actions, field evidence, supervision, and audit history can be enforced correctly.

## Phase A: governed baseline

| Work item | Required result | Exit criterion |
|---|---|---|
| Runtime decision | One documented application architecture and canonical web surface. | A decision record is approved. |
| Local environment | Reproducible developer and test setup with no real secrets. | A fresh developer can start the app from documented commands. |
| Database baseline | Reviewable migrations and seeded test data. | A blank test database can be created and reset. |
| Identity model | Roles and municipality scope are defined before routes exist. | Citizens, officers, field staff, supervisors, and admins have explicit permissions. |
| Test harness | Automated unit and integration test runner is available. | A negative authorization test passes in CI. |
| Build gate | Typecheck, build, and test are separate required checks. | All initial checks pass for the scaffold. |

## Phase B: security gate

The team then removes every blocking control gap found in the legacy audit. Public or guest identity must not be used for private reports. Every server action must validate the acting identity, role, municipality scope, report ownership, payload schema, and audit event.

| Control | Required behavior |
|---|---|
| Authentication | Any private report action without a valid session returns `401`. |
| Authorization | A citizen can access only their reports; service personnel operate only within assigned scope. |
| State transition | Only the defined role can move a report to its next legal state. |
| Data validation | The server rejects malformed or oversized payloads. |
| CORS and CSRF | Only approved origins can send credentialed requests. |
| Audit trail | Report changes record actor, timestamp, prior state, new state, and reason. |

## Phase C: civic-reporting vertical slice

Only after the security gate passes will the following workflow be implemented and tested end to end:

1. An authenticated citizen submits a structured report.
2. A service officer reviews, classifies, and accepts or returns it.
3. The officer assigns a field team and due date.
4. The field team uploads evidence through controlled object storage.
5. A supervisor verifies evidence and closes the report with a reason.
6. The citizen sees the final status and can rate the resolved service.

## Phase D: closed pilot

A closed pilot runs for one municipality, one service category, and one geographically bounded area. It must use synthetic or approved pilot data, named operational owners, support procedures, a rollback plan, and a dashboard that measures acknowledgement time, assignment time, evidence-backed closure, reopen rate, and citizen rating.

## Change-control rule

Every implementation task must state its data impact, authorization impact, migration impact, test coverage, and rollback behavior. No change is accepted based on visual completion alone.
