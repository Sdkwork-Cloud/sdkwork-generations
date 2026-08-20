//! Generations readiness checks.

use std::sync::Arc;

use sdkwork_web_bootstrap::ReadinessCheck;

/// Aggregated readiness for the generations application.
pub struct GenerationsReadiness {
    checks: Vec<Arc<dyn ReadinessCheck>>,
}

impl GenerationsReadiness {
    pub fn new(checks: Vec<Arc<dyn ReadinessCheck>>) -> Self {
        Self { checks }
    }

    pub async fn check_all(&self) -> Result<(), String> {
        for check in &self.checks {
            check.check().await?;
        }
        Ok(())
    }
}
