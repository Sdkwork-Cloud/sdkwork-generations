//! Repository port interfaces for the generations domain.
//!
//! Repositories encapsulate persistence operations for generation records,
//! results, and timeline events. Concrete implementations (e.g. PostgreSQL)
//! are injected at the assembly layer.

use async_trait::async_trait;
use serde_json::Value;

use crate::domain::models::{
    GenerationRecord, GenerationResult, GenerationTimelineEvent,
};
use crate::error::GenerationsError;

// ---------------------------------------------------------------------------
// Generation record repository
// ---------------------------------------------------------------------------

/// Parameters for creating a new generation record.
#[derive(Debug, Clone)]
pub struct CreateGenerationParams {
    pub tenant_id: String,
    pub user_id: String,
    pub modality: String,
    pub operation_type: String,
    pub source_provider: Option<String>,
    pub source_job_id: Option<String>,
    pub prompt_preview: Option<String>,
    pub metadata: Value,
}

/// Parameters for listing generation records.
#[derive(Debug, Clone, Default)]
pub struct ListGenerationsParams {
    pub tenant_id: String,
    pub cursor: Option<String>,
    pub page_size: Option<i32>,
    pub status: Option<String>,
    pub modality: Option<String>,
    pub operation_type: Option<String>,
    pub q: Option<String>,
}

/// Repository port for generation aggregate persistence.
#[async_trait]
pub trait GenerationRepository: Send + Sync {
    /// Create a new generation record.
    async fn create(
        &self,
        params: CreateGenerationParams,
    ) -> Result<GenerationRecord, GenerationsError>;

    /// Retrieve a generation record by id.
    async fn get(&self, id: &str) -> Result<Option<GenerationRecord>, GenerationsError>;

    /// List generation records with cursor pagination.
    async fn list(
        &self,
        params: ListGenerationsParams,
    ) -> Result<(Vec<GenerationRecord>, Option<String>, bool), GenerationsError>;

    /// Cancel a generation by id.
    async fn cancel(
        &self,
        id: &str,
        reason: Option<&str>,
    ) -> Result<Option<GenerationRecord>, GenerationsError>;

    /// Retry a failed or canceled generation.
    async fn retry(
        &self,
        id: &str,
        reason: Option<&str>,
    ) -> Result<Option<GenerationRecord>, GenerationsError>;

    /// Set the favorite flag on a generation.
    async fn set_favorite(
        &self,
        id: &str,
        favorite: bool,
    ) -> Result<Option<GenerationRecord>, GenerationsError>;
}

// ---------------------------------------------------------------------------
// Generation result repository
// ---------------------------------------------------------------------------

/// Parameters for listing generation results.
#[derive(Debug, Clone, Default)]
pub struct ListResultsParams {
    pub generation_id: String,
    pub cursor: Option<String>,
    pub page_size: Option<i32>,
}

/// Repository port for generation result persistence.
#[async_trait]
pub trait GenerationResultRepository: Send + Sync {
    /// Retrieve a single generation result by id.
    async fn get(
        &self,
        generation_id: &str,
        result_id: &str,
    ) -> Result<Option<GenerationResult>, GenerationsError>;

    /// List generation results with cursor pagination.
    async fn list(
        &self,
        params: ListResultsParams,
    ) -> Result<(Vec<GenerationResult>, Option<String>, bool), GenerationsError>;

    /// Update a generation result (e.g. after saving to assets).
    async fn update(
        &self,
        result: &GenerationResult,
    ) -> Result<GenerationResult, GenerationsError>;
}

// ---------------------------------------------------------------------------
// Timeline repository
// ---------------------------------------------------------------------------

/// Parameters for listing timeline events.
#[derive(Debug, Clone, Default)]
pub struct ListTimelineParams {
    pub generation_id: String,
    pub cursor: Option<String>,
    pub page_size: Option<i32>,
}

/// Repository port for generation timeline event persistence.
#[async_trait]
pub trait TimelineRepository: Send + Sync {
    /// List timeline events for a generation with cursor pagination.
    async fn list(
        &self,
        params: ListTimelineParams,
    ) -> Result<(Vec<GenerationTimelineEvent>, Option<String>, bool), GenerationsError>;
}
