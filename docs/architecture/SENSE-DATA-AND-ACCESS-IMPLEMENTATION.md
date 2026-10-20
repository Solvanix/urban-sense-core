# SENSE Data + MABA Access Implementation

## Purpose

This is the first implementation slice of SENSE as a unified national tourism platform and national store. It turns the recent design decisions into portable records, validation, and access-control rules.

The Al-Eizariya records are a **prototype vertical slice**, not a claim that every field has been verified in the field. Public copy, prices, bookings, inventory, NFC keys, and payments remain non-production.

## Implemented contract

- `data/schemas/common.schema.json` defines common identity, lifecycle, bilingual, and municipality fields.
- `data/schemas/sense-entity.schema.json` defines the shared entity contract for destinations, routes, experiences, artisans, merchants, products, stories, media, and municipalities.
- `data/entities/` contains the first connected graph:

```text
destination-al-eizariya
  ├── route-al-eizariya-memory
  ├── route-al-eizariya-crafts
  ├── story-al-eizariya-main
  ├── story-hands-that-remember
  ├── artisan-local-crafts-demo
  │     └── product-olive-wood-demo
  └── merchant-local-crafts-demo
```

- `scripts/validate-sense-data.mjs` checks JSON records, duplicate IDs, common fields, and local references.

## Access model

MABA now supports the content graph without removing the existing operational resource types:

| Role | Scope | Example entity access |
|---|---|---|
| `public_visitor` | published public content | read published story, route, destination, artisan, product |
| `municipality_manager` | matching `municipalityId` | manage local destination, route, story, artisan, product, merchant |
| `merchant` | matching `merchantId` | read/create/update own product, offer, transaction |
| `transport_operator` | matching `operatorId` | read/update/sync own route, vehicle, device |
| `gate_officer` | matching `accessPointId` | read the assigned access point only |
| `auditor` | read-only | read reports and records without mutation |

The decision formula is:

```text
role permission + action + resource type + ownership/municipality scope + publication state
```

For example, a merchant may update `product-olive-wood-demo` only when the resource carries the merchant's own `merchantId`. A public visitor can read a story only when `status=published` and `visibility` is not private.

## Validation commands

```bash
node scripts/validate-sense-data.mjs
node visualize/maba-access-policy.test.mjs
node visualize/maba-entity-access.test.mjs
```

## WordPress / Blocksy handoff

GitHub remains the source contract and audit trail. WordPress remains the editorial and public publishing surface:

1. Review or enrich a record in GitHub.
2. Move it into a WordPress draft.
3. Apply RTL, Blocksy design tokens, alt text, source, and rights.
4. Human-review the field claim.
5. Publish only after approval.

The first national-store representation is a **catalog**, not checkout. `paymentEnabled=false` and `commerceStatus=catalog_only` are intentional safeguards.

## Next implementation slice

1. Build a public SENSE discovery page from the entity graph.
2. Add a catalog view that links each product to its artisan, story, and destination.
3. Add the same graph identifiers to the MABA Bridge demo.
4. Create a WordPress import map for destination, route, story, artisan, and product content types.
5. Keep production authentication, NFC signing keys, payment, booking, and orders outside the public repository until the security boundary is approved.
