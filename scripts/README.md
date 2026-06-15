# Scripts Directory

## Purpose

Thin command entrypoints for build, verification, generation, migration, packaging, and release workflows.

## Owner

sdkwork-generations

## Allowed Content

- Shell scripts
- Node scripts
- Python scripts
- PowerShell scripts
- Script documentation

## Forbidden Content

- Reusable logic (belongs in tools/)
- Generated SDK output
- Runtime data
- Secrets or credentials

## Related Specs

- `../sdkwork-specs/CODE_STYLE_SPEC.md`
- `../sdkwork-specs/COMPONENT_SPEC.md`

## Verification

- Scripts are thin entrypoints
- Reusable logic is in tools/
- No secrets in scripts