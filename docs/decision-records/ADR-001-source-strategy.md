# ADR-001: Governed successor repository

**Status:** Accepted
**Date:** 2026-08-14

## Context

The PalTur / Urban‑Up archive contains useful functional and visual assets, but the completed technical validation found critical authorization gaps in civic-report routes, an incomplete report workflow, absent automated application tests and reviewable migrations, unresolved typecheck/build gaps, and no authoritative source-control history.

A direct import would make it difficult to distinguish reviewed, safe components from inherited assumptions and would preserve an unclear release lineage.

## Decision

Create a new private repository, `urban-sense-core`, as the governed source of truth for the first Urban‑Sense civic-reporting MVP.

The legacy archive remains immutable reference material. Components may be ported selectively, only after review, tests, and an explicit pull-request provenance note. The first implementation target is the secure reporting vertical slice, not a broad port of marketplace, wallet, tourism, AI, or multi-tenant functions.

## Consequences

### Positive

- Security, migrations, tests, roles, and audit behavior can be designed intentionally.
- The delivery scope remains small enough to validate in a controlled pilot.
- Code lineage and review standards begin cleanly.
- Reuse remains possible without accepting unreviewed routes or configurations.

### Trade-offs

- Initial delivery may take longer than modifying existing screens superficially.
- Some legacy UI or mobile work may be deferred or rewritten.
- A decision is required about the long-term identity/runtime platform before production deployment.

## Acceptance criteria

This decision is implemented when the repository has a reproducible environment, reviewed migrations, a security-tested identity model, a working reporting workflow, and a documented closed-pilot gate.
