# Repository Guidelines

## SDKWORK Soul

Read `../../../sdkwork-specs/SOUL.md` before executing tasks in this application root. Follow specs before memory, dictionary before context, stop on ambiguity, and evidence before completion.

## SDKWORK Standards

Canonical SDKWORK specs path from this app root:

- `../../../sdkwork-specs/README.md`
- `../../../sdkwork-specs/SOUL.md`
- `../../../sdkwork-specs/APP_H5_ARCHITECTURE_SPEC.md`
- `../../../sdkwork-specs/APP_MOBILE_REACT_UI_SPEC.md`
- `../../../sdkwork-specs/COMPONENT_SPEC.md`

Do not copy root standard text into this application. Use relative links into `../../../sdkwork-specs/`.

## Application Identity

This root is the SDKWork Generations H5 application. Read `sdkwork.app.config.json`, `specs/`, and package-local specs before changing app behavior, runtime config, SDK wiring, release metadata, or app-owned capabilities.

## Local Dictionary Structure

- `AGENTS.md`: application-level agent entrypoint.
- `CLAUDE.md`, `GEMINI.md`, `CODEX.md`: compatibility shims that point to `AGENTS.md`.
- `sdkwork.app.config.json`: application manifest.
- `.sdkwork/`: source-controlled app workspace metadata, skills, and plugins.
- `src/`: thin bootstrap, providers, route assembly, and mobile shell entry only.
- `packages/`: app, console, admin, core, commons, shell, capacitor, and host packages.
- `specs/`: local application/component contracts.

## Required Specs By Task Type

- H5 application architecture changes: `../../../sdkwork-specs/APP_H5_ARCHITECTURE_SPEC.md`.
- App/user H5 mobile React package changes: `../../../sdkwork-specs/APP_MOBILE_REACT_UI_SPEC.md`.
- Code changes: `../../../sdkwork-specs/CODE_STYLE_SPEC.md`, `../../../sdkwork-specs/NAMING_SPEC.md`, and the relevant language spec.
- SDK integration: `../../../sdkwork-specs/APP_SDK_INTEGRATION_SPEC.md`, `../../../sdkwork-specs/SDK_SPEC.md`, and `../../../sdkwork-specs/SDK_WORKSPACE_GENERATION_SPEC.md`.
Build scripts, dev runners, and `pnpm clean` must follow `CODE_STYLE_SPEC.md` §7 (Build Source Integrity And Self-Healing). Git-tracked build-critical source files must be verified before builds and self-healed from git when missing; `clean` must not delete them.


## Build, Test, And Verification

Run commands from this application root unless a command explicitly targets the repository root.

- `pnpm test`
- `pnpm typecheck`

Run narrow package tests first, then app-level verification when package boundaries or SDK wiring change.

## Agent Execution Rules

Root `src/` must stay thin. Business screens, services, route metadata, i18n, and domain state belong in packages. App packages consume app-api through generated app SDK clients or approved wrappers. Admin packages, if added later, consume backend-api through backend SDK clients and must use `sdkwork-generations-h5-admin-*` names.

## HTTP API Response Envelope

All L2+ `app-api`, `backend-api`, and SDKWork-owned business `open-api` HTTP contracts `MUST` follow `API_SPEC.md` section 4.5, section 14, and section 15:

- **Input:** typed request bodies, section 14.1 list/search/command input, `SdkWorkListQuery`, and `q` for free-text search.
- **Success output:** `SdkWorkApiResponse` with `{ "code": 0, "data": <payload>, "traceId": "<server-uuid>" }`.
- **Error output:** HTTP 4xx/5xx `application/problem+json` (`ProblemDetail`) with numeric `code` and `traceId`.
- Success `code` is numeric `int32`; HTTP 2xx JSON bodies `MUST` use `0` only. REST semantics remain on HTTP status (`201`, `202`, etc.).
- Platform error codes are numeric non-zero values per section 15.3 (`40001`, `40101`, `40401`, …).
- Single resource: `data.item`
- Lists: `data.items` + `data.pageInfo` (`PageInfo.mode` is `offset` or `cursor`)
- Commands: `data.accepted` plus optional `resourceId` / `status`
- Async accept (`202`): `data.operationId`, `data.status`, optional `pollUrl`

Vendor compatibility `open-api` routes that mirror upstream tool or provider wire (for example OpenAI `/v1/*`, Claude Code, Codex) `MAY` opt out only when every exempt operation declares `x-sdkwork-wire-protocol: external` and `x-sdkwork-external-protocol-id` per `API_SPEC.md` section 4.5.2. SDKWork-owned business `open-api` operations `MUST NOT` opt out.

Errors `MUST` use HTTP 4xx/5xx with `application/problem+json` (`ProblemDetail`) including required numeric `code` and `traceId`. Business failures `MUST NOT` use HTTP 2xx with non-zero `code`, string wire codes, `success`, or human `message`.

Forbidden legacy envelopes and fields: `PlusApiResult`, `AppbaseApiResult`, `StoreApiResult`, `SdkWorkResponse`, per-domain `*ApiResult`, wire field `requestId`, bare domain DTOs at the HTTP root, and top-level `{ items, pageInfo, traceId }` without `data`.

Handlers `MUST` serialize success and map errors through `sdkwork-web-framework` response mapping. Generated HTTP SDKs (`--standard-profile sdkwork-v3`) unwrap `data` by default and expose typed numeric `ProblemDetail.code` / `traceId` on errors; use `.raw` when the full envelope is required.

Before completing API contract, SDK generation, or frontend service work, run:

```bash
node <sdkwork-specs>/tools/check-api-response-envelope.mjs --workspace <workspace-root>
```

Authority: `sdkwork-specs/API_SPEC.md` section 4.5 and sections 14–16, `SDK_SPEC.md` section 4.2, `FRONTEND_SPEC.md`, `MIGRATION_SPEC.md` section 4.2.

## HTTP API Response Envelope

All L2+ `app-api`, `backend-api`, and SDKWork-owned `open-api` success JSON bodies `MUST` use `SdkWorkResponse` from `API_SPEC.md` §15:

- Envelope: `{ "data": <payload>, "requestId": "<server-uuid>" }`
- Single resource: `data.item`
- Lists: `data.items` + `data.pageInfo` (`PageInfo.mode` is `offset` or `cursor`)
- Commands: `data.accepted` plus optional `resourceId` / `status`
- Async accept (`202`): `data.operationId`, `data.status`, optional `pollUrl`

Errors `MUST` use HTTP 4xx/5xx with `application/problem+json` (`ProblemDetail`). Business failures `MUST NOT` use HTTP 2xx with `success`, `code`, or `message`.

Forbidden legacy envelopes: `PlusApiResult`, `AppbaseApiResult`, `StoreApiResult`, per-domain `*ApiResult`, bare domain DTOs at the HTTP root, and top-level `{ items, pageInfo, requestId }` without `data`.

Handlers `MUST` serialize success and map errors through `sdkwork-web-framework` response mapping. Do not hand-build envelopes in controllers or route handlers.

Generated HTTP SDKs (`--standard-profile sdkwork-v3`) unwrap `data` by default; use `.raw` only when correlation headers or the full envelope are required.

Before completing API contract or handler work, run:

```bash
node <sdkwork-specs>/tools/check-api-response-envelope.mjs --workspace <workspace-root>
```

Authority: `sdkwork-specs/API_SPEC.md` §15–§16, `WEB_FRAMEWORK_SPEC.md`, `SDK_SPEC.md` §4.1, `MIGRATION_SPEC.md` §API Response Envelope Migration.
