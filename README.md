# Urban‑Sense Core

> **A secure civic-reporting MVP for the SENSE / Urban‑Sense / Tibyan initiative.**

## Status

This repository is the **governed central source of truth** for the SENSE product portfolio. Its first application, Urban‑Sense, remains a secure civic-reporting core. A second, independently deployable SENSE Experience application will support verified tourism-service providers and visitor-facing discovery. The two applications share repository governance and quality standards, but never share operational databases, municipal-report data, or authorization boundaries.

The first delivery is deliberately narrow: one end-to-end, secure municipal reporting workflow. It will support a citizen submitting a report, an authorized service officer reviewing and assigning it, a field team attaching evidence, a supervisor verifying closure, and the citizen rating the completed service.

## Scope of the first MVP

```text
Authenticated citizen
→ create report
→ staff review and classification
→ assignment to a field team
→ field evidence (before/after)
→ supervisor verification
→ controlled closure
→ citizen rating
→ immutable audit trail
```

The MVP will include Arabic RTL support, role-based access control, PostgreSQL migrations, a controlled object-storage upload path, tests, CI, and a staging-only pilot configuration.

## Product boundaries

Marketplace features, wallet or payment logic, points redemption, AI-driven operational decisions, advanced tourism features, hardware integrations, and multi-municipality operation remain out of scope for the **Urban‑Sense application** until the reporting core passes security, testing, and pilot-readiness gates.

SENSE Experience is developed as a separate application within this same repository. It begins with consented provider onboarding, human review, and source-bound public profiles. It does not publish unverified claims, synthetic providers, ratings, availability, or tourism-service data.

## Repository structure

| Path | Purpose |
|---|---|
| [`docs/START-HERE.md`](docs/START-HERE.md) | Delivery sequence and immediate decisions. |
| [`docs/architecture/MVP-ARCHITECTURE.md`](docs/architecture/MVP-ARCHITECTURE.md) | Target technical architecture and domain model. |
| [`docs/security/SECURITY-BASELINE.md`](docs/security/SECURITY-BASELINE.md) | Security controls required before a pilot. |
| [`docs/LEGACY-SOURCE-REGISTER.md`](docs/LEGACY-SOURCE-REGISTER.md) | Handling rules for the inspected legacy archive. |
| [`docs/decision-records/ADR-001-source-strategy.md`](docs/decision-records/ADR-001-source-strategy.md) | Decision record for the new governed baseline. |
| [`docs/sense-experience/`](docs/sense-experience/) | Scope, provider onboarding, and quality boundaries for the separate tourism application. |
| [`docs/PORTFOLIO-ARCHITECTURE.md`](docs/PORTFOLIO-ARCHITECTURE.md) | Central-repository map for civic reporting, tourism, public site, commerce, and accessibility tools. |
| [`docs/shared/ACCESSIBILITY-BASELINE.md`](docs/shared/ACCESSIBILITY-BASELINE.md) | Shared accessibility baseline for every new application. |

## Rules of engagement

1. Do not copy legacy code into this repository without a file-by-file review and a passing test.
2. Do not use production data, production secrets, or a production database in development or tests.
3. Do not implement public report-writing, report-reading, or report-state transitions without server-enforced authentication, authorization, ownership, and audit logging.
4. Do not merge to `main` until CI, code review, and security acceptance checks are in place.
5. Keep application databases, public APIs, deployment environments, and roles separated even when applications live in this repository.

## Next milestone

The next work item is **Foundation Phase A**: choose the canonical runtime stack, create a reproducible local environment, define schema migrations, and implement an automated security test that proves an unauthenticated caller cannot create, view, or modify a private report.

## Reference

The legacy technical validation found that the old archive contains useful UI, API, mobile, and schema assets, but is not ready for production: authorization gaps exist in report routes; report workflow steps are incomplete; no automated application tests or reviewable SQL migrations were present; and parts of build/typecheck did not pass. See the project documentation before importing any legacy asset.

---

**Project owner:** SENSE / Urban‑Sense / Tibyan
**Repository visibility:** Private
