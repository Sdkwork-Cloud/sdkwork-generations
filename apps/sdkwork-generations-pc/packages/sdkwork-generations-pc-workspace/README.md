# @sdkwork/generations-pc-workspace

## Purpose

User-facing PC workspace for generation history, timeline, run results, result provenance, and result-to-assets actions.

## Placement

- Workspace: `sdkwork-generations-pc`
- Surface: app
- Architecture: `pc-react`
- Domain: `intelligence`
- Capability: `workspace`
- Status: `ready`

## SDK Boundary

This package is an app-side PC React module. It belongs under:

```text
sdkwork-generations/apps/sdkwork-generations-pc/packages/sdkwork-generations-pc-workspace
```

It consumes app-api capability through the `sdkwork-generations-app-sdk` family or a narrow injected app SDK-compatible service port. It must not call backend-api, construct backend SDK clients, create raw HTTP clients, or implement internal admin behavior.

## Entry Points

- `@sdkwork/generations-pc-workspace` for generation workspace contracts, service helpers, and route intents.
- `@sdkwork/generations-pc-workspace/react` for React UI, controller, i18n, and page composition.

## Extraction Sources

- `sdkwork-react-generation-history`
- previous appbase residual generation workspace package

Generation playground UI theme tokens and modality-specific panel styling live in the host app stylesheet (`apps/sdkwork-clawrouter-pc/src/index.css`) and domain packages (`sdkwork-image-pc-generation`, `sdkwork-video-pc-generation`, `sdkwork-music-pc-generation`, `sdkwork-audio-pc-generation`). Workspace exports domain workspace composition only; do not duplicate panel implementations here.

## SDKWork Documentation Contract

Domain: intelligence
Capability: workspace
Package type: react-package
Surface: app
Status: ready

### Public API

Public exports are declared in `specs/component.spec.json` under `contracts.publicExports`.

### Required SDK Surface

- `sdkwork-generations-app-sdk` for user-facing generation records, modality commands, results, timeline, cancel/retry/favorite, and result-to-assets flows.

### Configuration

Configuration keys and runtime entrypoints are declared in `specs/component.spec.json`.

### SaaS/Private/Local Behavior

Runtime/bootstrap owns concrete SDK client construction and token propagation. This package receives services or SDK-compatible clients through typed boundaries.

### Security

Do not add secrets, live tokens, manual auth headers, backend SDK calls, or app-local credential handling to this module.

### Extension Points

Extension points are limited to declared public exports, runtime entrypoints, SDK clients, events, and config keys.

### Verification

- `pnpm --filter @sdkwork/generations-pc-workspace test`
- `pnpm --filter @sdkwork/generations-pc-workspace typecheck`

### Owner And Status

Owner and lifecycle status are tracked in `specs/component.spec.json`.
