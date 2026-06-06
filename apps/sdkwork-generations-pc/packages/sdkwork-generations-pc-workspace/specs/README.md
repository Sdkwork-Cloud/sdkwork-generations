# SDKWork Generations PC Workspace Component Specs

This directory is the local standards index for `@sdkwork/generations-pc-workspace`.

Root SDKWork standards remain authoritative. Local component specs can narrow or document this component, but they must not contradict the root standards under `../../../../../sdkwork-specs/`.

## Component

| Field | Value |
| --- | --- |
| Name | `@sdkwork/generations-pc-workspace` |
| Type | `react-package` |
| Root | `sdkwork-generations/apps/sdkwork-generations-pc/packages/sdkwork-generations-pc-workspace` |
| Surface | `app` |
| Domain | `intelligence` |
| Capability | `workspace` |
| Languages | `typescript`, `react` |
| Status | `ready` |

## Contract Manifest

- [component.spec.json](./component.spec.json) is the machine-readable component contract.
- Consumers should integrate through public exports, runtime entrypoints, SDK clients, or adapters declared in the manifest.
- Generated SDK language outputs are represented at their SDK family root instead of duplicating local specs in generated folders.

## Public Exports

- `.`
- `./react`
- `./generation`
- `./generation-asset-config`
- `./generation-history`
- `./generation-service`

## SDK Clients

- `sdkwork-generations-app-sdk`

## Verification

- `pnpm --filter @sdkwork/generations-pc-workspace typecheck`
