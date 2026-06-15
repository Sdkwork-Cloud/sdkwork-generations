# Applications

This directory contains independently runnable application roots, application surfaces, app shells, and demos promoted to runnable apps.

## Application Roots

| Application | Architecture | Standard | Description |
| --- | --- | --- | --- |
| `sdkwork-generations-pc/` | PC browser/desktop | `APP_PC_ARCHITECTURE_SPEC.md` | PC browser application for generation commands, history, results, and provenance |
| `sdkwork-generations-h5/` | H5 mobile web | `APP_H5_ARCHITECTURE_SPEC.md` | H5 mobile application for generation commands, history, results, and provenance |
| `sdkwork-generations-flutter-mobile/` | Flutter mobile | `FLUTTER_APP_MOBILE_ARCHITECTURE_SPEC.md` | Flutter mobile application for generation commands, history, results, and provenance |

## Architecture Alignment

Each application root follows its corresponding SDKWork architecture standard and maintains:

- Standard directory layout (`.sdkwork/`, `src/` or `lib/`, `packages/`, `config/`, `sdks/`, `specs/`)
- Package taxonomy with surface-specific naming
- SDK/IAM integration boundaries
- App/console/admin surface separation
- Platform-specific configuration templates

## Related Specs

- `../../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`
- `../../sdkwork-specs/APPLICATION_SPEC.md`
- `../../sdkwork-specs/APP_CLIENT_ARCHITECTURE_ALIGNMENT_SPEC.md`