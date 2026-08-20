//! Provider port interfaces for the generations domain.
//!
//! Providers encapsulate the external AI service integrations (image, video,
//! music, sfx, voice). Concrete implementations are injected at the assembly
//! layer; the service crate only defines the trait contracts.

use async_trait::async_trait;

use crate::domain::models::{CreateGenerationCommandRequest, GenerationModality, GenerationRecord};
use crate::error::GenerationsError;

/// Business-level request context passed to providers.
pub use crate::context::GenerationsRequestContext;

/// Provider capable of dispatching generation commands to an external AI service.
///
/// Each provider handles one or more modalities and operation types. The
/// service layer routes incoming commands to the appropriate provider based on
/// modality and operation type matching.
#[async_trait]
pub trait GenerationProvider: Send + Sync {
    /// Returns the modality this provider handles.
    fn modality(&self) -> GenerationModality;

    /// Returns the operation types this provider supports.
    fn operation_types(&self) -> Vec<&str>;

    /// Dispatch a generation command to the external service.
    ///
    /// On success, returns the created `GenerationRecord` with the provider
    /// assigned fields populated (sourceProvider, sourceJobId, status, etc.).
    async fn dispatch(
        &self,
        command: &CreateGenerationCommandRequest,
        context: &GenerationsRequestContext,
    ) -> Result<GenerationRecord, GenerationsError>;
}

/// Port for saving generation results to the asset catalog.
///
/// Concrete implementations integrate with the sdkwork-assets system to persist
/// generated media as managed assets.
#[async_trait]
pub trait AssetPort: Send + Sync {
    /// Save a generation result to the asset catalog.
    ///
    /// Returns the updated `GenerationResult` with the `assetId` field populated
    /// on success.
    async fn save_generation_result(
        &self,
        generation_id: &str,
        result_id: &str,
        request: &crate::domain::models::SaveGenerationResultToAssetsRequest,
        context: &GenerationsRequestContext,
    ) -> Result<crate::domain::models::GenerationResult, GenerationsError>;
}
