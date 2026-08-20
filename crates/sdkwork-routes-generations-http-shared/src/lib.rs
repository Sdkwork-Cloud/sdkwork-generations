//! Shared HTTP route manifests and sdkwork-web-framework bootstrap for generations surfaces.

mod generated {
    include!(concat!(env!("OUT_DIR"), "/generation_app_routes.rs"));
    include!(concat!(env!("OUT_DIR"), "/generation_backend_routes.rs"));
    include!(concat!(env!("OUT_DIR"), "/generation_combined_routes.rs"));
}

mod web_bootstrap;

pub use generated::{APP_ROUTES, BACKEND_ROUTES, COMBINED_ROUTES};

pub use web_bootstrap::{
    app_route_manifest, backend_route_manifest, build_served_combined_router,
    combined_route_manifest, generations_request_context_injector,
    wrap_router_with_web_framework, wrap_router_with_web_framework_from_env,
};

pub use sdkwork_intelligence_generations_service::{GenerationsHttpState, GenerationsRequestContext};
