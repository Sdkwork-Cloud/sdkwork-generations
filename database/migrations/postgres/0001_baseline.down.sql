-- sdkwork:migration
-- id: 0001_baseline
-- engine: postgres
-- module: sdkwork-generations
-- purpose: Rollback baseline schema — drops all 8 core tables and their indexes.
-- reversible: true
-- transactional: true
-- lock: lightweight
-- lock_timeout: 5s
-- statement_timeout: 60s

BEGIN;

DROP INDEX IF EXISTS idx_generation_outbox_unpub;
DROP INDEX IF EXISTS idx_generation_result_gen;
DROP INDEX IF EXISTS idx_generation_timeline_gen;
DROP INDEX IF EXISTS idx_generation_source_inbox_status;
DROP INDEX IF EXISTS idx_generation_dispatch_job_lease;
DROP INDEX IF EXISTS idx_generation_dispatch_job_status;
DROP INDEX IF EXISTS idx_generation_record_modality;
DROP INDEX IF EXISTS idx_generation_record_status;
DROP INDEX IF EXISTS idx_generation_record_tenant;

DROP TABLE IF EXISTS generation_outbox_event;
DROP TABLE IF EXISTS generation_record_projection;
DROP TABLE IF EXISTS generation_result;
DROP TABLE IF EXISTS generation_timeline_event;
DROP TABLE IF EXISTS generation_source_inbox_event;
DROP TABLE IF EXISTS generation_dispatch_job;
DROP TABLE IF EXISTS generation_record_source_ref;
DROP TABLE IF EXISTS generation_record;

COMMIT;
