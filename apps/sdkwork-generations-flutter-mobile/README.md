# SDKWork Generations Flutter Mobile

Flutter mobile application for generation commands, history, results, and provenance.

## Architecture

This application follows the SDKWork Flutter App Mobile Architecture Standard (`FLUTTER_APP_MOBILE_ARCHITECTURE_SPEC.md`).

### Directory Structure

- `lib/`: thin bootstrap, providers, shell assembly, and route registry
- `packages/`: app, console, admin, core, commons, shell, and host packages
- `config/`: app, host, server, and container configuration templates
- `sdks/`: application-root SDK workspaces and generator inputs
- `specs/`: local application/component contracts

### Package Taxonomy

- `sdkwork_generations_flutter_mobile_core`: shared Flutter mobile runtime
- `sdkwork_generations_flutter_mobile_commons`: shared mobile UI/runtime
- `sdkwork_generations_flutter_mobile_shell`: app/user shell
- `sdkwork_generations_flutter_mobile_<capability>`: app/user capability packages
- `sdkwork_generations_flutter_mobile_console_*`: user-facing management console packages
- `sdkwork_generations_flutter_mobile_admin_*`: internal operations admin packages
- `sdkwork_generations_flutter_mobile_host`: platform host package

## Development

```bash
flutter pub get
flutter analyze
flutter test
```

## Build

```bash
flutter build apk
flutter build appbundle
flutter build ipa
```

## Related Specs

- `../../../sdkwork-specs/FLUTTER_APP_MOBILE_ARCHITECTURE_SPEC.md`
- `../../../sdkwork-specs/APP_FLUTTER_UI_SPEC.md`
- `../../../sdkwork-specs/COMPONENT_SPEC.md`