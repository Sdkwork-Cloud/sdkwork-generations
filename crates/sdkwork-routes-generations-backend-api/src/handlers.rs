//! Backend API handlers for generations.

use axum::extract::{Path, Query, State};
use serde::Deserialize;

use sdkwork_intelligence_generations_service::GenerationsHttpState;

/// Build the backend-api router.
pub(super) fn build_backend_routes() -> axum::Router<GenerationsHttpState> {
    axum::Router::new()
        .route(
            "/backend/v3/api/generations/dispatch_jobs",
            axum::routing::get(list_dispatch_jobs),
        )
        .route(
            "/backend/v3/api/generations/dispatch_jobs/{dispatch_job_id}",
            axum::routing::get(get_dispatch_job),
        )
        .route(
            "/backend/v3/api/generations/source_events",
            axum::routing::get(list_source_events),
        )
        .route(
            "/backend/v3/api/generations/reconciliation/runs",
            axum::routing::post(create_reconciliation_run),
        )
}

#[derive(Debug, Deserialize)]
pub struct ListDispatchJobsQuery {
    pub cursor: Option<String>,
    pub page_size: Option<i32>,
    pub status: Option<String>,
    pub lease_owner: Option<String>,
}

async fn list_dispatch_jobs(
    State(_state): State<GenerationsHttpState>,
    Query(_query): Query<ListDispatchJobsQuery>,
) -> axum::Json<serde_json::Value> {
    // TODO: implement when dispatch job repository port is available
    axum::Json(serde_json::json!({
        "code": 0,
        "data": {
            "items": [],
            "pageInfo": {
                "mode": "cursor",
                "nextCursor": null,
                "hasMore": false
            }
        },
        "traceId": uuid::Uuid::new_v4().to_string()
    }))
}

async fn get_dispatch_job(
    State(_state): State<GenerationsHttpState>,
    Path(dispatch_job_id): Path<String>,
) -> axum::Json<serde_json::Value> {
    axum::Json(serde_json::json!({
        "code": 0,
        "data": {
            "item": {
                "id": dispatch_job_id,
                "status": "pending"
            }
        },
        "traceId": uuid::Uuid::new_v4().to_string()
    }))
}

#[derive(Debug, Deserialize)]
pub struct ListSourceEventsQuery {
    pub cursor: Option<String>,
    pub source_provider: Option<String>,
    pub status: Option<String>,
}

async fn list_source_events(
    State(_state): State<GenerationsHttpState>,
    Query(_query): Query<ListSourceEventsQuery>,
) -> axum::Json<serde_json::Value> {
    axum::Json(serde_json::json!({
        "code": 0,
        "data": {
            "items": [],
            "pageInfo": {
                "mode": "cursor",
                "nextCursor": null,
                "hasMore": false
            }
        },
        "traceId": uuid::Uuid::new_v4().to_string()
    }))
}

#[derive(Debug, Deserialize)]
pub struct CreateReconciliationRunRequest {
    pub tenant_id: String,
    pub operator_id: String,
    pub source_provider: Option<String>,
    pub dry_run: Option<bool>,
}

async fn create_reconciliation_run(
    State(_state): State<GenerationsHttpState>,
    axum::Json(_body): axum::Json<CreateReconciliationRunRequest>,
) -> axum::Json<serde_json::Value> {
    axum::Json(serde_json::json!({
        "code": 0,
        "data": {
            "item": {
                "id": uuid::Uuid::new_v4().to_string(),
                "status": "accepted"
            }
        },
        "traceId": uuid::Uuid::new_v4().to_string()
    }))
}
