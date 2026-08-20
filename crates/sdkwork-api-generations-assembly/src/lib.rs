//! API assembly for sdkwork-generations.
//!
//! Application bootstrap lives in `bootstrap.rs`; route inventory is in `assembly-manifest.json`.

mod bootstrap;
mod contribution;
mod generated;
mod readiness;

pub use bootstrap::{assemble_api_router, assemble_api_router_with_pool, ApiAssembly};
pub use contribution::{
    assemble_app_api_contribution, assemble_backend_api_contribution,
    app_api_route_manifest, ApiAssemblyContribution,
};
pub use bootstrap::{bootstrap_database_from_env as bootstrap_generations_database_from_env};

/// Apply the generations managed-store lifecycle from the canonical environment profile.
pub async fn bootstrap_application_database_from_env() -> anyhow::Result<()> {
    sdkwork_generations_database_host::bootstrap_generations_database_from_env()
        .await
        .map(|_| ())
        .map_err(anyhow::Error::msg)
}

pub fn assembly_route_count() -> usize {
    generated::ROUTE_CRATE_COUNT
}
