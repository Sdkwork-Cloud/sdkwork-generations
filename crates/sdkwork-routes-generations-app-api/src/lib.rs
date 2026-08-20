//! App API route boundary for SDKWork generations.

pub use sdkwork_intelligence_generations_service::{build_app_routes, GenerationsHttpState};
pub use sdkwork_routes_generations_http_shared::{
    app_route_manifest, combined_route_manifest, wrap_router_with_web_framework,
    wrap_router_with_web_framework_from_env, APP_ROUTES,
};

/// Builds the unwrapped app-api router without sdkwork-web-framework middleware.
pub fn build_router() -> axum::Router<GenerationsHttpState> {
    build_app_routes()
}

/// Builds the app-api router with mandatory sdkwork-web-framework middleware.
pub async fn build_served_router(state: GenerationsHttpState) -> axum::Router {
    wrap_router_with_web_framework_from_env(
        app_route_manifest(),
        build_app_routes().with_state(state),
    )
    .await
}

/// Gateway mount entry: builds a served router ready for gateway composition.
pub async fn gateway_mount(state: GenerationsHttpState) -> axum::Router {
    build_served_router(state).await
}
