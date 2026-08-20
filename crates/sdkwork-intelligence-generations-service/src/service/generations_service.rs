//! Core generations service implementation.

use std::sync::Arc;

use crate::config::GenerationsConfig;
use crate::context::GenerationsRequestContext;
use crate::domain::models::{
    CreateGenerationCommandRequest, FavoriteGenerationRequest, GenerationCommandResponse,
    GenerationModality, GenerationRecord, GenerationResult, GenerationStatus,
    PageInfo, SaveGenerationResultToAssetsRequest,
};
use crate::error::GenerationsError;
use crate::ports::{
    AssetPort, GenerationProvider, GenerationRepository, GenerationResultRepository,
    ListGenerationsParams, ListResultsParams, ListTimelineParams, TimelineRepository,
};

pub use super::handlers::build_app_routes;

// ---------------------------------------------------------------------------
// Service state
// ---------------------------------------------------------------------------

/// Shared service state for HTTP handlers.
#[derive(Clone)]
pub struct GenerationsServiceState {
    repository: Arc<dyn GenerationRepository>,
    result_repository: Arc<dyn GenerationResultRepository>,
    timeline_repository: Arc<dyn TimelineRepository>,
    config: Arc<GenerationsConfig>,
    providers: Arc<Vec<Box<dyn GenerationProvider>>>,
    asset_port: Arc<dyn AssetPort>,
}

impl GenerationsServiceState {
    /// Create a new service state.
    pub fn new(
        repository: Arc<dyn GenerationRepository>,
        result_repository: Arc<dyn GenerationResultRepository>,
        timeline_repository: Arc<dyn TimelineRepository>,
        config: Arc<GenerationsConfig>,
        providers: Arc<Vec<Box<dyn GenerationProvider>>>,
        asset_port: Arc<dyn AssetPort>,
    ) -> Self {
        Self {
            repository,
            result_repository,
            timeline_repository,
            config,
            providers,
            asset_port,
        }
    }

    /// Get a reference to the repository.
    pub fn repository(&self) -> &Arc<dyn GenerationRepository> {
        &self.repository
    }

    /// Get a reference to the result repository.
    pub fn result_repository(&self) -> &Arc<dyn GenerationResultRepository> {
        &self.result_repository
    }

    /// Get a reference to the timeline repository.
    pub fn timeline_repository(&self) -> &Arc<dyn TimelineRepository> {
        &self.timeline_repository
    }

    /// Get a reference to the config.
    pub fn config(&self) -> &GenerationsConfig {
        &self.config
    }

    /// Get a reference to the providers.
    pub fn providers(&self) -> &[Box<dyn GenerationProvider>] {
        &self.providers
    }

    /// Get a reference to the asset port.
    pub fn asset_port(&self) -> &Arc<dyn AssetPort> {
        &self.asset_port
    }
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

/// Core generations service.
///
/// All methods are stateless with respect to the service instance; the shared
/// state and request context are passed explicitly.
pub struct GenerationsService;

impl GenerationsService {
    // -- Create generation --------------------------------------------------

    /// Create a generation by dispatching to the appropriate provider.
    ///
    /// This is the unified entry point for all creation endpoints. It resolves
    /// the provider based on modality and operation type, records the generation
    /// in the repository, and dispatches to the external service.
    pub async fn create_generation(
        state: &GenerationsServiceState,
        context: &GenerationsRequestContext,
        modality: GenerationModality,
        operation_type: &str,
        command: &CreateGenerationCommandRequest,
    ) -> Result<GenerationCommandResponse, GenerationsError> {
        let provider = resolve_provider(state, &modality, operation_type)?;

        let record = provider.dispatch(command, context).await?;

        Ok(GenerationCommandResponse { generation: record })
    }

    /// Convenience entry for text-to-image.
    pub async fn create_text_to_image(
        state: &GenerationsServiceState,
        context: &GenerationsRequestContext,
        command: &CreateGenerationCommandRequest,
    ) -> Result<GenerationCommandResponse, GenerationsError> {
        Self::create_generation(state, context, GenerationModality::Image, "text_to_image", command)
            .await
    }

    /// Convenience entry for image edit.
    pub async fn create_image_edit(
        state: &GenerationsServiceState,
        context: &GenerationsRequestContext,
        command: &CreateGenerationCommandRequest,
    ) -> Result<GenerationCommandResponse, GenerationsError> {
        Self::create_generation(state, context, GenerationModality::Image, "image_edit", command)
            .await
    }

    /// Convenience entry for text-to-video.
    pub async fn create_text_to_video(
        state: &GenerationsServiceState,
        context: &GenerationsRequestContext,
        command: &CreateGenerationCommandRequest,
    ) -> Result<GenerationCommandResponse, GenerationsError> {
        Self::create_generation(state, context, GenerationModality::Video, "text_to_video", command)
            .await
    }

    /// Convenience entry for image-to-video.
    pub async fn create_image_to_video(
        state: &GenerationsServiceState,
        context: &GenerationsRequestContext,
        command: &CreateGenerationCommandRequest,
    ) -> Result<GenerationCommandResponse, GenerationsError> {
        Self::create_generation(
            state,
            context,
            GenerationModality::Video,
            "image_to_video",
            command,
        )
        .await
    }

    /// Convenience entry for video extend.
    pub async fn create_video_extend(
        state: &GenerationsServiceState,
        context: &GenerationsRequestContext,
        command: &CreateGenerationCommandRequest,
    ) -> Result<GenerationCommandResponse, GenerationsError> {
        Self::create_generation(
            state,
            context,
            GenerationModality::Video,
            "video_extend",
            command,
        )
        .await
    }

    /// Convenience entry for text-to-music.
    pub async fn create_text_to_music(
        state: &GenerationsServiceState,
        context: &GenerationsRequestContext,
        command: &CreateGenerationCommandRequest,
    ) -> Result<GenerationCommandResponse, GenerationsError> {
        Self::create_generation(state, context, GenerationModality::Music, "text_to_music", command)
            .await
    }

    /// Convenience entry for lyrics-to-music.
    pub async fn create_lyrics_to_music(
        state: &GenerationsServiceState,
        context: &GenerationsRequestContext,
        command: &CreateGenerationCommandRequest,
    ) -> Result<GenerationCommandResponse, GenerationsError> {
        Self::create_generation(
            state,
            context,
            GenerationModality::Music,
            "lyrics_to_music",
            command,
        )
        .await
    }

    /// Convenience entry for sound effects generation.
    pub async fn create_sound_effects(
        state: &GenerationsServiceState,
        context: &GenerationsRequestContext,
        command: &CreateGenerationCommandRequest,
    ) -> Result<GenerationCommandResponse, GenerationsError> {
        Self::create_generation(state, context, GenerationModality::Sfx, "sound_effects", command)
            .await
    }

    /// Convenience entry for speech synthesis.
    pub async fn create_speech(
        state: &GenerationsServiceState,
        context: &GenerationsRequestContext,
        command: &CreateGenerationCommandRequest,
    ) -> Result<GenerationCommandResponse, GenerationsError> {
        Self::create_generation(state, context, GenerationModality::Voice, "speech", command)
            .await
    }

    /// Convenience entry for voice transcription.
    pub async fn create_transcription(
        state: &GenerationsServiceState,
        context: &GenerationsRequestContext,
        command: &CreateGenerationCommandRequest,
    ) -> Result<GenerationCommandResponse, GenerationsError> {
        Self::create_generation(
            state,
            context,
            GenerationModality::Voice,
            "transcription",
            command,
        )
        .await
    }

    /// Convenience entry for voice translation.
    pub async fn create_translation(
        state: &GenerationsServiceState,
        context: &GenerationsRequestContext,
        command: &CreateGenerationCommandRequest,
    ) -> Result<GenerationCommandResponse, GenerationsError> {
        Self::create_generation(
            state,
            context,
            GenerationModality::Voice,
            "translation",
            command,
        )
        .await
    }

    // -- Read ---------------------------------------------------------------

    /// Get a generation record by id.
    pub async fn get_generation(
        state: &GenerationsServiceState,
        id: &str,
    ) -> Result<GenerationRecord, GenerationsError> {
        state
            .repository
            .get(id)
            .await?
            .ok_or_else(|| GenerationsError::NotFound(id.to_string()))
    }

    /// List generation records with cursor pagination.
    pub async fn list_generations(
        state: &GenerationsServiceState,
        tenant_id: String,
        params: ListGenerationsParams,
    ) -> Result<(Vec<GenerationRecord>, PageInfo), GenerationsError> {
        let params = ListGenerationsParams {
            tenant_id,
            ..params
        };
        let (items, next_cursor, has_more) = state.repository.list(params).await?;
        Ok((items, PageInfo::cursor(next_cursor, has_more)))
    }

    /// List results for a generation.
    pub async fn list_results(
        state: &GenerationsServiceState,
        generation_id: &str,
        params: ListResultsParams,
    ) -> Result<(Vec<GenerationResult>, PageInfo), GenerationsError> {
        let params = ListResultsParams {
            generation_id: generation_id.to_string(),
            ..params
        };
        let (items, next_cursor, has_more) = state.result_repository.list(params).await?;
        Ok((items, PageInfo::cursor(next_cursor, has_more)))
    }

    /// List timeline events for a generation.
    pub async fn list_timeline(
        state: &GenerationsServiceState,
        generation_id: &str,
        params: ListTimelineParams,
    ) -> Result<(Vec<crate::domain::models::GenerationTimelineEvent>, PageInfo), GenerationsError>
    {
        let params = ListTimelineParams {
            generation_id: generation_id.to_string(),
            ..params
        };
        let (items, next_cursor, has_more) = state.timeline_repository.list(params).await?;
        Ok((items, PageInfo::cursor(next_cursor, has_more)))
    }

    // -- Actions ------------------------------------------------------------

    /// Cancel a generation.
    pub async fn cancel_generation(
        state: &GenerationsServiceState,
        id: &str,
        reason: Option<&str>,
    ) -> Result<GenerationRecord, GenerationsError> {
        state
            .repository
            .cancel(id, reason)
            .await?
            .ok_or_else(|| GenerationsError::NotFound(id.to_string()))
    }

    /// Retry a generation.
    pub async fn retry_generation(
        state: &GenerationsServiceState,
        id: &str,
        reason: Option<&str>,
    ) -> Result<GenerationRecord, GenerationsError> {
        state
            .repository
            .retry(id, reason)
            .await?
            .ok_or_else(|| GenerationsError::NotFound(id.to_string()))
    }

    /// Set the favorite flag on a generation.
    pub async fn favorite_generation(
        state: &GenerationsServiceState,
        id: &str,
        request: &FavoriteGenerationRequest,
    ) -> Result<GenerationRecord, GenerationsError> {
        state
            .repository
            .set_favorite(id, request.favorite)
            .await?
            .ok_or_else(|| GenerationsError::NotFound(id.to_string()))
    }

    // -- Asset integration --------------------------------------------------

    /// Save a generation result to the asset catalog.
    pub async fn save_to_assets(
        state: &GenerationsServiceState,
        context: &GenerationsRequestContext,
        generation_id: &str,
        result_id: &str,
        request: &SaveGenerationResultToAssetsRequest,
    ) -> Result<GenerationResult, GenerationsError> {
        let result = state
            .asset_port
            .save_generation_result(generation_id, result_id, request, context)
            .await?;
        state.result_repository.update(&result).await
    }

    // -- Auto-save ---------------------------------------------------------

    /// Conditionally auto-save all results for a completed generation.
    ///
    /// Called by the job dispatch layer when a generation reaches `succeeded`
    /// status and `auto_save_to_assets` is enabled in configuration. Failures
    /// are traced but do not propagate as errors.
    pub async fn auto_save_results(
        state: &GenerationsServiceState,
        context: &GenerationsRequestContext,
        generation: &GenerationRecord,
    ) {
        if !state.config.auto_save_to_assets {
            return;
        }

        if generation.status != GenerationStatus::Succeeded {
            return;
        }

        let params = ListResultsParams {
            generation_id: generation.id.clone(),
            cursor: None,
            page_size: Some(100),
        };

        let (results, _, _) = match state.result_repository.list(params).await {
            Ok(page) => page,
            Err(error) => {
                tracing::warn!(
                    generation_id = %generation.id,
                    error = %error,
                    "auto-save: failed to list results"
                );
                return;
            }
        };

        let request = SaveGenerationResultToAssetsRequest {
            tenant_id: generation.tenant_id.clone(),
            collection_id: state.config.default_asset_project_id.clone(),
            title: generation.prompt_preview.clone(),
            tags: None,
        };

        for result in &results {
            if result.asset_id.is_some() {
                continue;
            }

            if let Err(error) =
                state
                    .asset_port
                    .save_generation_result(&generation.id, &result.id, &request, context)
                    .await
            {
                tracing::warn!(
                    generation_id = %generation.id,
                    result_id = %result.id,
                    error = %error,
                    "auto-save: failed to save result"
                );
            }
        }
    }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/// Resolve a provider for the given modality and operation type.
fn resolve_provider<'a>(
    state: &'a GenerationsServiceState,
    modality: &GenerationModality,
    operation_type: &str,
) -> Result<&'a dyn GenerationProvider, GenerationsError> {
    for provider in state.providers().iter() {
        if provider.modality() == *modality
            && provider.operation_types().iter().any(|op| *op == operation_type)
        {
            return Ok(provider.as_ref());
        }
    }

    if let Some(fallback) = state.providers().iter().find(|p| p.modality() == *modality) {
        return Ok(fallback.as_ref());
    }

    Err(GenerationsError::Provider(format!(
        "no provider registered for modality={modality}, operation_type={operation_type}"
    )))
}

