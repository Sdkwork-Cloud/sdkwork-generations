//! Generations database lifecycle bootstrap.

use sdkwork_database_config::DatabaseConfig;
use sdkwork_database_sqlx::{create_pool_from_config, DatabasePool};

/// Bootstrap the generations database from the canonical environment profile.
pub async fn bootstrap_generations_database_from_env() -> Result<DatabasePool, String> {
    let _ = dotenvy::dotenv();
    let config = DatabaseConfig::from_env("GENERATIONS")
        .map_err(|error| format!("read generations database config failed: {error}"))?;
    let pool = create_pool_from_config(config)
        .await
        .map_err(|error| format!("create generations database pool failed: {error}"))?;
    Ok(pool)
}
