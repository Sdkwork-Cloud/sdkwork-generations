//! Generations API assembly contribution types.

use std::sync::Arc;

pub use sdkwork_web_bootstrap::ApiAssemblyContribution;
use sdkwork_web_bootstrap::AlwaysReady;
use sdkwork_web_core::HttpRouteManifest;

/// Build the app-api contribution for gateway composition.
pub fn assemble_app_api_contribution(
    manifest: HttpRouteManifest,
    router: axum::Router,
) -> Result<ApiAssemblyContribution, String> {
    ApiAssemblyContribution::from_manifest(
        "sdkwork-generations",
        "SDKWork Generations App API",
        router,
        manifest,
        vec![],
        Arc::new(AlwaysReady),
    )
}

/// Build the backend-api contribution for gateway composition.
pub fn assemble_backend_api_contribution(
    manifest: HttpRouteManifest,
    router: axum::Router,
) -> Result<ApiAssemblyContribution, String> {
    ApiAssemblyContribution::from_manifest(
        "sdkwork-generations",
        "SDKWork Generations Backend API",
        router,
        manifest,
        vec![],
        Arc::new(AlwaysReady),
    )
}

/// App-api route manifest.
pub fn app_api_route_manifest() -> HttpRouteManifest {
    sdkwork_routes_generations_app_api::app_route_manifest()
}
