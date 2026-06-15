# Crates Directory

## Purpose

Rust crates, including route crates, service crates, repository crates, API server/service-host/native-host/Tauri-host/gateway/worker crates, and reusable Rust libraries.

## Owner

sdkwork-generations

## Allowed Content

- Rust crate directories
- Cargo.toml files
- Rust source code
- Crate-level tests

## Forbidden Content

- Non-Rust implementation code
- Generated SDK output
- Runtime data
- Secrets or credentials

## Related Specs

- `../sdkwork-specs/RUST_CODE_SPEC.md`
- `../sdkwork-specs/NAMING_SPEC.md`
- `../sdkwork-specs/COMPONENT_SPEC.md`

## Verification

- Crate names follow responsibility-specific families
- No forbidden generic crate names
- src/lib.rs is module assembly only