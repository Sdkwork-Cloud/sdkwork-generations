# Generations Global Assets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the SDKWork Generations app-api/backend-api contract, persistence contract, SDK workspace, and the global Assets capability in sdkwork-drive.

**Architecture:** `sdkwork-generations` owns AI generation records, results, timeline, and dispatch/source synchronization contracts. `sdkwork-drive` owns global `/assets` as an independent asset catalog capability that references Drive resources and `MediaResource` snapshots without duplicating upload, presign, object-key, or storage-provider lifecycle. SDK generation uses owner-only OpenAPI inputs and canonical `sdkgen` wrapper scripts.

**Tech Stack:** Node.js contract tooling and tests, OpenAPI 3.1.x authority JSON, SQL schema contracts for PostgreSQL/SQLite, Rust Axum route discovery in sdkwork-drive, SDKWork generator wrappers.

---

### Task 1: Generations Contract Workspace

**Files:**
- Create: `package.json`
- Create: `tools/generations_sdk_generator_runner.mjs`
- Create: `tools/generations_sdk_generate.mjs`
- Create: `sdks/test/verify-generations-contract.test.mjs`
- Create: `sdks/sdkwork-generations-app-sdk/.sdkwork-assembly.json`
- Create: `sdks/sdkwork-generations-app-sdk/specs/component.spec.json`
- Create: `sdks/sdkwork-generations-app-sdk/bin/generate-sdk.mjs`
- Create: `sdks/sdkwork-generations-app-sdk/openapi/sdkwork-generations-app-api.openapi.json`
- Create: `sdks/sdkwork-generations-backend-sdk/.sdkwork-assembly.json`
- Create: `sdks/sdkwork-generations-backend-sdk/specs/component.spec.json`
- Create: `sdks/sdkwork-generations-backend-sdk/bin/generate-sdk.mjs`
- Create: `sdks/sdkwork-generations-backend-sdk/openapi/sdkwork-generations-backend-api.openapi.json`

- [ ] **Step 1: Write failing contract test**

Run: `pnpm test` from `sdkwork-generations`
Expected: FAIL because contract files and routes do not exist yet.

- [ ] **Step 2: Add app/backend OpenAPI authorities**

Implement app routes under `/app/v3/api/generations`, modality-specific create commands under `/app/v3/api/generations/images|videos|music|voice`, and backend technical routes under `/backend/v3/api/generations`. Do not expose `/tasks` or `/generations/assets`.

- [ ] **Step 3: Add SDK family metadata and generation wrappers**

Declare `sdkwork-generations-app-sdk` and `sdkwork-generations-backend-sdk`, both owner-only and dependency-aware. App SDK depends on Drive app SDK and the four modality SDK families. Backend SDK has no dependency-owned copied routes.

- [ ] **Step 4: Run contract test**

Run: `pnpm test` from `sdkwork-generations`
Expected: PASS for route shape, schemas, metadata, and generator wrapper checks.

### Task 2: Generations Persistence Contract

**Files:**
- Create: `storage/postgres/generation_core.sql`
- Create: `storage/sqlite/generation_core.sql`
- Create: `docs/schema-registry/tables/001-generation-core.yaml`
- Modify: `sdks/test/verify-generations-contract.test.mjs`

- [ ] **Step 1: Extend failing test for required tables and indexes**

Expected tables: `generation_record`, `generation_record_source_ref`, `generation_dispatch_job`, `generation_source_inbox_event`, `generation_timeline_event`, `generation_result`, `generation_result_drive_sync`, `generation_record_projection`, `generation_outbox_event`.

- [ ] **Step 2: Add SQL/schema registry**

Implement tenant/user scoped records, projection indexes for high-performance lists, dispatch lease/retry/idempotency indexes, and Drive/MediaResource references for results.

- [ ] **Step 3: Run contract test**

Run: `pnpm test` from `sdkwork-generations`
Expected: PASS.

### Task 3: Drive Global Assets Contract

**Files:**
- Modify: `services/sdkwork-drive-app-api/tests/drive_routes.rs`
- Modify: `services/sdkwork-drive-app-api/src/lib.rs`
- Modify: `generated/openapi/drive-app-api.openapi.json`
- Modify: `tools/drive_schema_quality_gate.mjs`
- Create: `docs/schema-registry/tables/005-global-assets.yaml`

- [ ] **Step 1: Write failing Drive app route/OpenAPI test**

Assert `/app/v3/api/assets` routes exist, `/app/v3/api/generations/assets` and duplicate upload/presign routes do not exist, and asset schemas use Drive refs/MediaResource snapshots.

- [ ] **Step 2: Add minimal route discovery handlers**

Add app-api route stubs for list/create/get/update/archive/restore, collections, collection items, and relations. Stubs may return validation/not-implemented problem details until product services are implemented, but must route under `/assets`.

- [ ] **Step 3: Add app OpenAPI contract**

Add Assets paths, schemas, operationIds, security, owner metadata, and no upload/presign operations.

- [ ] **Step 4: Extend schema quality gate**

Assert asset paths/schemas and forbidden route absence.

### Task 4: Drive Global Assets Persistence

**Files:**
- Modify: `services/sdkwork-drive-product/src/infrastructure/sql/postgres_core.sql`
- Modify: `services/sdkwork-drive-product/src/infrastructure/sql/sqlite_core.sql`
- Modify: `services/sdkwork-drive-product/tests/sqlite_schema_contract.rs`
- Modify: `services/sdkwork-drive-product/tests/postgres_schema_contract.rs`
- Modify: `docs/schema-registry/tables/005-global-assets.yaml`

- [ ] **Step 1: Write failing schema tests**

Assert `dr_asset_item`, `dr_asset_resource_ref`, `dr_asset_version`, `dr_asset_relation`, `dr_asset_collection`, `dr_asset_collection_item`, `dr_asset_event`, and `dr_asset_projection` exist with high-volume list indexes.

- [ ] **Step 2: Add SQL tables**

Implement Drive-backed references, media snapshots, source provenance, lifecycle/moderation fields, collection/relation tables, event and projection tables.

- [ ] **Step 3: Run narrow Rust tests**

Run: `cargo test -p sdkwork-drive-product sqlite_schema_contract`
Expected: PASS.

### Task 5: SDK Generation And Verification

**Files:**
- Generated output only through wrapper scripts if canonical generator exists.

- [ ] **Step 1: Run contract/materialization checks**

Run: `node tools/drive_sdk_generate.mjs --check` from `sdkwork-drive`
Run: `pnpm test` from `sdkwork-generations`

- [ ] **Step 2: Attempt SDK regeneration**

Run Drive TypeScript generation: `node tools/drive_sdk_generate.mjs --language typescript`
Run Generations TypeScript generation: `node tools/generations_sdk_generate.mjs --language typescript`

Expected: If `..\sdkwork-sdk-generator\bin\sdkgen.js` is missing, scripts fail fast and the blocker is reported with source OpenAPI/metadata prepared.

- [ ] **Step 3: Run final verification**

Run narrow tests first, then `cargo fmt --all -- --check` and relevant `cargo test` subsets from `sdkwork-drive`.
