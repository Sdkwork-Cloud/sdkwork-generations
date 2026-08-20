//! Backend API route boundary for SDKWork generations.

use axum::Router;
use sdkwork_web_core::HttpRouteManifest;

use sdkwork_intelligence_generations_service::GenerationsHttpState;
pub use sdkwork_routes_generations_http_shared::{
    backend_route_manifest, wrap_router_with_web_framework, wrap_router_with_web_framework_from_env,
    BACKEND_ROUTES,
};

mod handlers;

/// Builds the unwrapped backend-api router without sdkwork-web-framework middleware.
pub fn build_router() -> Router<GenerationsHttpState> {
    handlers::build_backend_routes()
}

/// Builds the backend-api router with mandatory sdkwork-web-framework middleware.
pub async fn build_served_router(state: GenerationsHttpState) -> axum::Router {
    wrap_router_with_web_framework_from_env(
        backend_route_manifest(),
        build_router().with_state(state),
    )
    .await
}

/// Gateway mount entry for the backend-api surface.
pub async fn gateway_mount(state: GenerationsHttpState) -> axum::Router {
    build_served_router(state).await
}
