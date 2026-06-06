CREATE TABLE IF NOT EXISTS generation_record (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    organization_id TEXT,
    user_id TEXT NOT NULL,
    modality TEXT NOT NULL,
    operation_type TEXT NOT NULL,
    source_provider TEXT NOT NULL,
    source_job_id TEXT,
    idempotency_key TEXT,
    prompt_hash TEXT,
    prompt_preview TEXT,
    input_refs_json TEXT NOT NULL DEFAULT '[]',
    parameter_snapshot TEXT NOT NULL DEFAULT '{}',
    status TEXT NOT NULL,
    favorite INTEGER NOT NULL DEFAULT 0,
    result_count INTEGER NOT NULL DEFAULT 0,
    error_code TEXT,
    error_message TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TEXT,
    CHECK (modality IN ('image', 'video', 'music', 'voice')),
    CHECK (status IN ('queued', 'running', 'requires_action', 'succeeded', 'failed', 'canceled')),
    CHECK (favorite IN (0, 1)),
    CHECK (result_count >= 0)
);

CREATE TABLE IF NOT EXISTS generation_record_source_ref (
    id TEXT PRIMARY KEY,
    generation_id TEXT NOT NULL,
    source_provider TEXT NOT NULL,
    source_resource_type TEXT NOT NULL,
    source_resource_id TEXT NOT NULL,
    source_status TEXT,
    source_payload TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (generation_id) REFERENCES generation_record(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS generation_dispatch_job (
    id TEXT PRIMARY KEY,
    generation_id TEXT NOT NULL,
    tenant_id TEXT NOT NULL,
    source_provider TEXT NOT NULL,
    operation_type TEXT NOT NULL,
    idempotency_key TEXT NOT NULL,
    request_payload TEXT NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending',
    priority INTEGER NOT NULL DEFAULT 0,
    attempt_count INTEGER NOT NULL DEFAULT 0,
    max_attempts INTEGER NOT NULL DEFAULT 3,
    lease_owner TEXT,
    lease_expires_at TEXT,
    next_attempt_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_error_code TEXT,
    last_error_message TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (generation_id) REFERENCES generation_record(id) ON DELETE CASCADE,
    CHECK (status IN ('pending', 'leased', 'sent', 'retrying', 'succeeded', 'failed', 'canceled')),
    CHECK (attempt_count >= 0),
    CHECK (max_attempts >= 1)
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_generation_dispatch_job_idempotency
    ON generation_dispatch_job (tenant_id, source_provider, operation_type, idempotency_key);
CREATE INDEX IF NOT EXISTS idx_generation_dispatch_job_lease
    ON generation_dispatch_job (status, lease_expires_at, priority, created_at);
CREATE INDEX IF NOT EXISTS idx_generation_dispatch_job_retry
    ON generation_dispatch_job (status, next_attempt_at, priority, created_at);

CREATE TABLE IF NOT EXISTS generation_source_inbox_event (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    source_provider TEXT NOT NULL,
    source_event_id TEXT NOT NULL,
    source_job_id TEXT,
    generation_id TEXT,
    event_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'received',
    payload TEXT NOT NULL DEFAULT '{}',
    received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at TEXT,
    error_code TEXT,
    error_message TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_generation_source_inbox_provider_event
    ON generation_source_inbox_event (source_provider, source_event_id);
CREATE INDEX IF NOT EXISTS idx_generation_source_inbox_status
    ON generation_source_inbox_event (status, received_at);

CREATE TABLE IF NOT EXISTS generation_timeline_event (
    id TEXT PRIMARY KEY,
    generation_id TEXT NOT NULL,
    tenant_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    message TEXT,
    payload TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (generation_id) REFERENCES generation_record(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_generation_timeline_generation_created
    ON generation_timeline_event (generation_id, created_at, id);

CREATE TABLE IF NOT EXISTS generation_result (
    id TEXT PRIMARY KEY,
    generation_id TEXT NOT NULL,
    tenant_id TEXT NOT NULL,
    result_type TEXT NOT NULL,
    ordinal INTEGER NOT NULL DEFAULT 0,
    drive_space_id TEXT,
    drive_node_id TEXT,
    drive_uri TEXT,
    media_resource_id TEXT,
    resource_snapshot TEXT NOT NULL DEFAULT '{}',
    asset_id TEXT,
    preview_text TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (generation_id) REFERENCES generation_record(id) ON DELETE CASCADE,
    CHECK (ordinal >= 0)
);

CREATE INDEX IF NOT EXISTS idx_generation_result_generation_ordinal
    ON generation_result (generation_id, ordinal, created_at);
CREATE INDEX IF NOT EXISTS idx_generation_result_asset
    ON generation_result (tenant_id, asset_id)
    WHERE asset_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS generation_record_projection (
    generation_id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    organization_id TEXT,
    user_id TEXT NOT NULL,
    modality TEXT NOT NULL,
    operation_type TEXT NOT NULL,
    status TEXT NOT NULL,
    favorite INTEGER NOT NULL DEFAULT 0,
    title TEXT,
    prompt_preview TEXT,
    thumbnail_drive_node_id TEXT,
    latest_result_asset_id TEXT,
    result_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (generation_id) REFERENCES generation_record(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_generation_projection_user_updated
    ON generation_record_projection (tenant_id, user_id, updated_at DESC, generation_id);
CREATE INDEX IF NOT EXISTS idx_generation_projection_user_status_updated
    ON generation_record_projection (tenant_id, user_id, status, updated_at DESC, generation_id);
CREATE INDEX IF NOT EXISTS idx_generation_projection_user_modality_updated
    ON generation_record_projection (tenant_id, user_id, modality, updated_at DESC, generation_id);

CREATE TABLE IF NOT EXISTS generation_outbox_event (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    aggregate_type TEXT NOT NULL,
    aggregate_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload TEXT NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending',
    attempt_count INTEGER NOT NULL DEFAULT 0,
    next_attempt_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published_at TEXT,
    CHECK (status IN ('pending', 'publishing', 'published', 'failed')),
    CHECK (attempt_count >= 0)
);

CREATE INDEX IF NOT EXISTS idx_generation_outbox_status
    ON generation_outbox_event (status, next_attempt_at, created_at);
