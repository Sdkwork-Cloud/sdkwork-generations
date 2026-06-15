# Repository Guidelines

## SDKWORK Soul

Read `../../../sdkwork-specs/SOUL.md` before executing tasks in this application root. Follow specs before memory, dictionary before context, stop on ambiguity, and evidence before completion.

## SDKWORK Standards

Canonical SDKWORK specs path from this app root:

- `../../../sdkwork-specs/README.md`
- `../../../sdkwork-specs/SOUL.md`
- `../../../sdkwork-specs/FLUTTER_APP_MOBILE_ARCHITECTURE_SPEC.md`
- `../../../sdkwork-specs/APP_FLUTTER_UI_SPEC.md`
- `../../../sdkwork-specs/COMPONENT_SPEC.md`

Do not copy root standard text into this application. Use relative links into `../../../sdkwork-specs/`.

## Application Identity

This root is the SDKWork Generations Flutter mobile application. Read `sdkwork.app.config.json`, `specs/`, and package-local specs before changing app behavior, runtime config, SDK wiring, release metadata, or app-owned capabilities.

## Local Dictionary Structure

- `AGENTS.md`: application-level agent entrypoint.
- `CLAUDE.md`, `GEMINI.md`, `CODEX.md`: compatibility shims that point to `AGENTS.md`.
- `sdkwork.app.config.json`: application manifest.
- `.sdkwork/`: source-controlled app workspace metadata, skills, and plugins.
- `lib/`: thin bootstrap, providers, shell assembly, and route registry only.
- `packages/`: app, console, admin, core, commons, shell, and host packages.
- `specs/`: local application/component contracts.

## Required Specs By Task Type

- Flutter application architecture changes: `../../../sdkwork-specs/FLUTTER_APP_MOBILE_ARCHITECTURE_SPEC.md`.
- App/user Flutter UI package changes: `../../../sdkwork-specs/APP_FLUTTER_UI_SPEC.md`.
- Code changes: `../../../sdkwork-specs/CODE_STYLE_SPEC.md`, `../../../sdkwork-specs/NAMING_SPEC.md`, and the relevant language spec.
- SDK integration: `../../../sdkwork-specs/APP_SDK_INTEGRATION_SPEC.md`, `../../../sdkwork-specs/SDK_SPEC.md`, and `../../../sdkwork-specs/SDK_WORKSPACE_GENERATION_SPEC.md`.

## Build, Test, And Verification

Run commands from this application root unless a command explicitly targets the repository root.

- `flutter test`
- `flutter analyze`

Run narrow package tests first, then app-level verification when package boundaries or SDK wiring change.

## Agent Execution Rules

Root `lib/` must stay thin. Business screens, widgets, controllers, services, i18n, and navigation metadata belong in packages. App packages consume app-api through generated Dart/Flutter app SDK clients or approved wrappers. Admin packages, if added later, consume backend-api through backend SDK clients and must use `sdkwork_generations_flutter_mobile_admin_*` names.