//! Runtime configuration for the generations service.

use std::collections::HashMap;
use std::sync::Arc;

/// Per-provider configuration bag.
#[derive(Debug, Clone, Default, serde::Serialize, serde::Deserialize)]
pub struct ProviderConfig {
    /// Provider implementation identifier.
    pub provider: Option<String>,
    /// Arbitrary provider-specific settings.
    pub settings: Option<HashMap<String, serde_json::Value>>,
}

/// Generations service configuration.
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct GenerationsConfig {
    /// When true, successfully generated media is automatically saved to assets.
    #[serde(default = "default_auto_save")]
    pub auto_save_to_assets: bool,

    /// Default asset project id for auto-saved generations.
    #[serde(default)]
    pub default_asset_project_id: Option<String>,

    /// Image generation provider configuration.
    #[serde(default)]
    pub image_provider: Option<ProviderConfig>,

    /// Video generation provider configuration.
    #[serde(default)]
    pub video_provider: Option<ProviderConfig>,

    /// Music generation provider configuration.
    #[serde(default)]
    pub music_provider: Option<ProviderConfig>,

    /// Sound effects generation provider configuration.
    #[serde(default)]
    pub sfx_provider: Option<ProviderConfig>,

    /// Voice generation provider configuration (speech, transcription, translation).
    #[serde(default)]
    pub voice_provider: Option<ProviderConfig>,
}

fn default_auto_save() -> bool {
    true
}

impl Default for GenerationsConfig {
    fn default() -> Self {
        Self {
            auto_save_to_assets: true,
            default_asset_project_id: None,
            image_provider: None,
            video_provider: None,
            music_provider: None,
            sfx_provider: None,
            voice_provider: None,
        }
    }
}

impl GenerationsConfig {
    /// Load configuration from environment variables.
    pub fn from_env() -> Self {
        Self {
            auto_save_to_assets: std::env::var("GENERATIONS_AUTO_SAVE_TO_ASSETS")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(true),
            default_asset_project_id: std::env::var("GENERATIONS_DEFAULT_ASSET_PROJECT_ID").ok(),
            image_provider: load_provider_config("IMAGE_PROVIDER"),
            video_provider: load_provider_config("VIDEO_PROVIDER"),
            music_provider: load_provider_config("MUSIC_PROVIDER"),
            sfx_provider: load_provider_config("SFX_PROVIDER"),
            voice_provider: load_provider_config("VOICE_PROVIDER"),
        }
    }
}

/// Load a named provider configuration from env var prefix.
fn load_provider_config(prefix: &str) -> Option<ProviderConfig> {
    let provider = std::env::var(format!("GENERATIONS_{prefix}_PROVIDER")).ok()?;
    Some(ProviderConfig {
        provider: Some(provider),
        settings: None,
    })
}

/// Shared configuration type alias.
pub type SharedGenerationsConfig = Arc<GenerationsConfig>;
