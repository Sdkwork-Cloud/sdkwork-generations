# GENERATIONS Database Module

Canonical lifecycle assets for `sdkwork-generations` per `DATABASE_FRAMEWORK_SPEC.md`.

- moduleId: `generations`
- serviceCode: `GENERATIONS`
- tablePrefix: `generation_` (physical tables; manifest module prefix remains `generations_`)

## Commands

```bash
pnpm run db:materialize:contract
pnpm run db:validate
pnpm run db:bootstrap
```

## Baseline

Legacy PostgreSQL schema: `storage/postgres/generation_core.sql` → `database/ddl/baseline/postgres/0001_generations_legacy_baseline.sql`.

This repository is Node-only; use `pnpm run db:bootstrap` via `sdkwork-database-cli` for lifecycle operations.
