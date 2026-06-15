# SDKWork Generations H5

H5 mobile application for generation commands, history, results, and provenance.

## Architecture

This application follows the SDKWork H5 Application Architecture Standard (`APP_H5_ARCHITECTURE_SPEC.md`).

### Directory Structure

- `src/`: thin bootstrap, providers, route assembly, and mobile shell entry
- `packages/`: app, console, admin, core, commons, shell, capacitor, and host packages
- `config/`: browser, host, server, and container configuration templates
- `sdks/`: application-root SDK workspaces and generator inputs
- `specs/`: local application/component contracts

### Package Taxonomy

- `sdkwork-generations-h5-core`: shared H5 runtime
- `sdkwork-generations-h5-commons`: shared mobile UI/runtime
- `sdkwork-generations-h5-shell`: app/user shell
- `sdkwork-generations-h5-<capability>`: app/user capability packages
- `sdkwork-generations-h5-console-*`: user-facing management console packages
- `sdkwork-generations-h5-admin-*`: internal operations admin packages
- `sdkwork-generations-h5-capacitor`: Capacitor host package

## Development

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm test
```

## Build

```bash
pnpm h5:build
pnpm h5:build:staging
pnpm h5:build:prod
```

## Related Specs

- `../../../sdkwork-specs/APP_H5_ARCHITECTURE_SPEC.md`
- `../../../sdkwork-specs/APP_MOBILE_REACT_UI_SPEC.md`
- `../../../sdkwork-specs/COMPONENT_SPEC.md`