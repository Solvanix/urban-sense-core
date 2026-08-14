# Legacy Source Register

## Registered source

| Field | Value |
|---|---|
| Archive | `paltur-interactive-main.zip` |
| Legacy product labels | PalTur / Urban‑Up |
| Audit status | Technically inspected in an isolated worktree. |
| Production status | **Not approved for production or municipal pilot.** |
| Source-control status | No Git history, release tag, or authoritative commit was present in the archive. |

## Why this repository starts clean

The legacy archive contains reusable ideas and potentially reusable components, including a React/Vite web application, an Express API, an Expo mobile app, Drizzle schemas, OpenAPI assets, and partial Arabic RTL support. However, the technical audit also found critical authorization concerns in report routes, incomplete workflow stages, no automated application tests, no reviewable SQL migrations, and build/typecheck gaps.

Therefore, this repository is a **governed successor**, not a bulk import of the legacy archive.

## Import policy

A legacy file may be considered for reuse only when all conditions below are met:

1. Its license and ownership are understood.
2. The file is reviewed for secrets, unsafe defaults, and unsupported dependencies.
3. Its authorization and data-handling behavior is compatible with this repository's security baseline.
4. It passes typecheck, linting, unit or integration tests appropriate to its role, and code review.
5. Its origin is recorded in the pull request description and the decision log.

## Prohibited legacy behaviors

The successor codebase must not import or recreate the following legacy patterns:

- Shared default identities for private reports or operational actions.
- Unauthenticated or unscoped report list, detail, or state-change routes.
- Direct schema push workflows in shared environments without reviewable migrations.
- Open credentialed CORS policies that reflect arbitrary origins.
- Client-controlled file paths, unvalidated attachments, or database storage of file bytes.
- Product claims of readiness based only on successful frontend bundling.

## Future archive handling

The original archive should be retained outside the active application tree as an immutable reference. Its checksum, audit summary, and any imported-file record must remain available to maintain traceability.
