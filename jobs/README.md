# Jobs Directory

## Purpose

Job definitions, schedules, queue bindings, batch descriptors, maintenance runbooks, and non-Rust job packages.

## Owner

sdkwork-generations

## Allowed Content

- Cron schedules
- Queue consumer bindings
- Batch job definitions
- Maintenance runbooks
- Non-Rust job packages

## Forbidden Content

- Rust worker implementation (belongs in crates/)
- Runtime data
- Secrets or credentials
- Generated SDK output

## Related Specs

- `../sdkwork-specs/RUST_CODE_SPEC.md`
- `../sdkwork-specs/COMPONENT_SPEC.md`

## Verification

- No Rust worker implementation duplicated from crates/
- Schedules and bindings are documented