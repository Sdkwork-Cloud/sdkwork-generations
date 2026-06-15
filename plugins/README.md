# Plugins Directory

## Purpose

Application/runtime plugin source packages, marketplace plugin implementations, or extension packages.

## Owner

sdkwork-generations

## Allowed Content

- Plugin source directories
- Plugin manifests
- Plugin tests
- Plugin documentation

## Forbidden Content

- Repository/application agent plugins (belong in .sdkwork/plugins/)
- Generated SDK output
- Runtime data
- Secrets or credentials

## Related Specs

- `../sdkwork-specs/COMPONENT_SPEC.md`
- `../sdkwork-specs/MODULE_SPEC.md`

## Verification

- Plugin directories have README.md
- Plugin directories have specs/component.spec.json
- No agent plugins in this directory