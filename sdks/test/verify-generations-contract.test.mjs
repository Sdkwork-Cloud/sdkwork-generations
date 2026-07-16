import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(testDir, "..", "..");

const appOpenapiPath = path.join(
  repoRoot,
  "sdks",
  "sdkwork-generations-app-sdk",
  "openapi",
  "sdkwork-generations-app-api.openapi.json",
);
const backendOpenapiPath = path.join(
  repoRoot,
  "sdks",
  "sdkwork-generations-backend-sdk",
  "openapi",
  "sdkwork-generations-backend-api.openapi.json",
);

const appFamilyRoot = path.join(repoRoot, "sdks", "sdkwork-generations-app-sdk");
const backendFamilyRoot = path.join(
  repoRoot,
  "sdks",
  "sdkwork-generations-backend-sdk",
);

const expectedGenerationCreatePaths = [
  "/app/v3/api/generations/images/text_to_image",
  "/app/v3/api/generations/images/image_edit",
  "/app/v3/api/generations/videos/text_to_video",
  "/app/v3/api/generations/videos/image_to_video",
  "/app/v3/api/generations/videos/video_extend",
  "/app/v3/api/generations/music/text_to_music",
  "/app/v3/api/generations/music/lyrics_to_music",
  "/app/v3/api/generations/sound_effects",
  "/app/v3/api/generations/voice/speech",
  "/app/v3/api/generations/voice/transcription",
  "/app/v3/api/generations/voice/translation",
];

const expectedGenerationQueryPaths = [
  "/app/v3/api/generations",
  "/app/v3/api/generations/{generationId}",
  "/app/v3/api/generations/{generationId}/results",
  "/app/v3/api/generations/{generationId}/timeline",
  "/app/v3/api/generations/{generationId}/cancel",
  "/app/v3/api/generations/{generationId}/retry",
  "/app/v3/api/generations/{generationId}/favorite",
  "/app/v3/api/generations/{generationId}/results/{resultId}/save_to_assets",
];

const expectedGenerationTables = [
  "generation_record",
  "generation_record_source_ref",
  "generation_dispatch_job",
  "generation_source_inbox_event",
  "generation_timeline_event",
  "generation_result",
  "generation_record_projection",
  "generation_outbox_event",
];

const expectedProjectionIndexes = [
  "idx_generation_projection_user_updated",
  "idx_generation_projection_user_status_updated",
  "idx_generation_projection_user_modality_updated",
  "idx_generation_dispatch_job_lease",
  "idx_generation_dispatch_job_retry",
  "ux_generation_dispatch_job_idempotency",
];

function readText(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);
  assert.ok(existsSync(absolutePath), `${relativePath} must exist`);
  return readFileSync(absolutePath, "utf8");
}

function readJson(absolutePath) {
  assert.ok(existsSync(absolutePath), `${path.relative(repoRoot, absolutePath)} must exist`);
  return JSON.parse(readFileSync(absolutePath, "utf8"));
}

function operationEntries(openapi) {
  const entries = [];
  for (const [pathKey, pathItem] of Object.entries(openapi.paths || {})) {
    for (const [method, operation] of Object.entries(pathItem || {})) {
      if (!["get", "put", "post", "patch", "delete"].includes(method)) {
        continue;
      }
      entries.push({ pathKey, method, operation });
    }
  }
  return entries;
}

function hasDualTokenSecurity(operation) {
  return Array.isArray(operation.security) && operation.security.some((entry) =>
    Array.isArray(entry.AuthToken) &&
    entry.AuthToken.length === 0 &&
    Array.isArray(entry.AccessToken) &&
    entry.AccessToken.length === 0
  );
}

function assertPathMethod(openapi, pathKey, method) {
  assert.ok(openapi.paths?.[pathKey]?.[method], `${method.toUpperCase()} ${pathKey} must exist`);
  return openapi.paths[pathKey][method];
}

function assertNoForbiddenAppPaths(openapi) {
  for (const { pathKey } of operationEntries(openapi)) {
    assert.ok(
      !pathKey.includes("/tasks"),
      `app contract must not expose technical tasks path: ${pathKey}`,
    );
    assert.ok(
      !pathKey.startsWith("/app/v3/api/generations/assets"),
      `assets must be global, not generation-scoped: ${pathKey}`,
    );
    assert.ok(
      !pathKey.startsWith("/app/v3/api/tasks"),
      `generation app API must not use top-level /tasks: ${pathKey}`,
    );
  }
}

test("generations app OpenAPI exposes user-facing generation records and modality commands", () => {
  const openapi = readJson(appOpenapiPath);

  assert.match(openapi.openapi, /^3\.1\./);
  assert.equal(openapi["x-sdkwork-owner"], "sdkwork-generations");
  assert.equal(openapi["x-sdkwork-api-authority"], "sdkwork-generations-app-api");

  for (const pathKey of expectedGenerationCreatePaths) {
    const operation = assertPathMethod(openapi, pathKey, "post");
    assert.ok(hasDualTokenSecurity(operation), `${pathKey} must require dual-token auth`);
    assert.ok(
      operation.parameters?.some(
        (parameter) => parameter.in === "header" && parameter.name === "Idempotency-Key",
      ),
      `${pathKey} must expose Idempotency-Key for retry-safe creation`,
    );
  }

  assertPathMethod(openapi, "/app/v3/api/generations", "get");
  assertPathMethod(openapi, "/app/v3/api/generations/{generationId}", "get");
  assertPathMethod(openapi, "/app/v3/api/generations/{generationId}/results", "get");
  assertPathMethod(openapi, "/app/v3/api/generations/{generationId}/timeline", "get");
  assertPathMethod(openapi, "/app/v3/api/generations/{generationId}/cancel", "post");
  assertPathMethod(openapi, "/app/v3/api/generations/{generationId}/retry", "post");
  assertPathMethod(openapi, "/app/v3/api/generations/{generationId}/favorite", "post");
  assertPathMethod(
    openapi,
    "/app/v3/api/generations/{generationId}/results/{resultId}/save_to_assets",
    "post",
  );

  for (const { operation } of operationEntries(openapi)) {
    assert.equal(operation["x-sdkwork-owner"], "sdkwork-generations");
    assert.equal(operation["x-sdkwork-api-authority"], "sdkwork-generations-app-api");
  }

  assertNoForbiddenAppPaths(openapi);
});

test("generations app schemas preserve Drive-backed results and high-volume list filters", () => {
  const openapi = readJson(appOpenapiPath);
  const schemas = openapi.components?.schemas || {};
  assert.ok(
    schemas.GenerationModality.enum.includes("sfx"),
    "GenerationModality must expose sfx for sound effect generation",
  );
  assert.ok(
    schemas.GenerationModality.enum.includes("audio"),
    "GenerationModality must expose audio for Playground speech synthesis history and filtering",
  );

  for (const schemaName of [
    "GenerationRecord",
    "GenerationRecordPage",
    "GenerationResult",
    "GenerationTimelineEvent",
    "MediaResource",
    "SaveGenerationResultToAssetsRequest",
  ]) {
    assert.ok(schemas[schemaName], `missing schema ${schemaName}`);
  }

  const resultProperties = schemas.GenerationResult.properties || {};
  for (const propertyName of [
    "driveSpaceId",
    "driveNodeId",
    "driveUri",
    "resourceSnapshot",
    "assetId",
  ]) {
    assert.ok(resultProperties[propertyName], `GenerationResult.${propertyName} must exist`);
  }
  assert.equal(
    resultProperties.resourceSnapshot.$ref,
    "#/components/schemas/MediaResource",
    "GenerationResult.resourceSnapshot must reuse MediaResource",
  );

  const listOperation = assertPathMethod(openapi, "/app/v3/api/generations", "get");
  const queryNames = new Set(
    (listOperation.parameters || [])
      .filter((parameter) => parameter.in === "query")
      .map((parameter) => parameter.name),
  );
  for (const name of [
    "cursor",
    "page_size",
    "status",
    "modality",
    "operation_type",
    "q",
  ]) {
    assert.ok(queryNames.has(name), `GET /generations must expose ${name} filter`);
  }
});

test("generations backend OpenAPI keeps technical dispatch APIs off the app surface", () => {
  const openapi = readJson(backendOpenapiPath);

  assert.match(openapi.openapi, /^3\.1\./);
  assert.equal(openapi["x-sdkwork-owner"], "sdkwork-generations");
  assert.equal(openapi["x-sdkwork-api-authority"], "sdkwork-generations-backend-api");

  for (const [pathKey, method] of [
    ["/backend/v3/api/generations/dispatch_jobs", "get"],
    ["/backend/v3/api/generations/dispatch_jobs/{dispatchJobId}", "get"],
    ["/backend/v3/api/generations/source_events", "get"],
    ["/backend/v3/api/generations/reconciliation/runs", "post"],
  ]) {
    const operation = assertPathMethod(openapi, pathKey, method);
    assert.ok(hasDualTokenSecurity(operation), `${method.toUpperCase()} ${pathKey} auth`);
  }

  for (const { pathKey, operation } of operationEntries(openapi)) {
    assert.ok(
      pathKey.startsWith("/backend/v3/api/generations"),
      `backend operation must stay under generations backend prefix: ${pathKey}`,
    );
    assert.equal(operation["x-sdkwork-owner"], "sdkwork-generations");
    assert.equal(operation["x-sdkwork-api-authority"], "sdkwork-generations-backend-api");
  }
});

test("generations SDK family metadata declares owner-only SDK generation and dependencies", () => {
  const appAssembly = readJson(path.join(appFamilyRoot, "sdk-manifest.json"));
  const appManifest = readJson(path.join(appFamilyRoot, "sdk-manifest.json"));
  const backendAssembly = readJson(path.join(backendFamilyRoot, "sdk-manifest.json"));
  const appComponent = readJson(path.join(appFamilyRoot, "specs", "component.spec.json"));
  const backendComponent = readJson(path.join(backendFamilyRoot, "specs", "component.spec.json"));

  assert.equal(appAssembly.workspace, "sdkwork-generations-app-sdk");
  assert.equal(appAssembly.sdkOwner, "sdkwork-generations");
  assert.equal(appAssembly.apiAuthority, "sdkwork-generations-app-api");
  assert.equal(
    appAssembly.generationInputSpec,
    "openapi/sdkwork-generations-app-api.openapi.json",
  );

  const appDependencies = new Set(
    (appAssembly.sdkDependencies || []).map((dependency) => dependency.workspace),
  );
  for (const dependency of [
    "sdkwork-drive-app-sdk",
    "sdkwork-image-app-sdk",
    "sdkwork-video-app-sdk",
    "sdkwork-music-app-sdk",
    "sdkwork-voice-app-sdk",
  ]) {
    assert.ok(appDependencies.has(dependency), `missing app dependency ${dependency}`);
  }
  const voiceDependency = (appAssembly.sdkDependencies || []).find(
    (dependency) => dependency.workspace === "sdkwork-voice-app-sdk",
  );
  assert.ok(voiceDependency, "missing voice dependency");
  assert.ok(
    voiceDependency.role.includes("sound-effect"),
    "sdkwork-voice-app-sdk dependency role must cover sound effect generation",
  );

  assert.equal(backendAssembly.workspace, "sdkwork-generations-backend-sdk");
  assert.equal(backendAssembly.sdkOwner, "sdkwork-generations");
  assert.equal(backendAssembly.apiAuthority, "sdkwork-generations-backend-api");
  assert.equal(
    backendAssembly.generationInputSpec,
    "openapi/sdkwork-generations-backend-api.openapi.json",
  );

  assert.deepEqual(
    appComponent.contracts.sdkDependencies,
    appAssembly.sdkDependencies,
    "app component dependencies must mirror assembly dependencies",
  );
  assert.deepEqual(
    appManifest.sdkDependencies,
    appAssembly.sdkDependencies,
    "app manifest dependencies must mirror assembly dependencies",
  );
  assert.deepEqual(
    backendComponent.contracts.sdkDependencies,
    backendAssembly.sdkDependencies || [],
    "backend component dependencies must mirror assembly dependencies",
  );
});

test("generations persistence contract defines projection and dispatch tables for high concurrency", () => {
  const postgresSql = readText("storage/postgres/generation_core.sql");
  const sqliteSql = readText("storage/sqlite/generation_core.sql");
  const schemaRegistry = readText("docs/schema-registry/tables/001-generation-core.yaml");

  for (const tableName of expectedGenerationTables) {
    assert.match(postgresSql, new RegExp(`CREATE TABLE IF NOT EXISTS ${tableName}\\b`));
    assert.match(sqliteSql, new RegExp(`CREATE TABLE IF NOT EXISTS ${tableName}\\b`));
    assert.ok(schemaRegistry.includes(`table: ${tableName}`), `schema registry missing ${tableName}`);
  }

  for (const indexName of expectedProjectionIndexes) {
    assert.ok(postgresSql.includes(indexName), `postgres SQL missing ${indexName}`);
    assert.ok(sqliteSql.includes(indexName), `sqlite SQL missing ${indexName}`);
    assert.ok(schemaRegistry.includes(indexName), `schema registry missing ${indexName}`);
  }

  for (const forbidden of [
    "generation_task",
    "generations_assets",
    "generation_result_drive_sync",
    "dr_asset_item",
    "dr_asset_resource_ref",
    "bucket_name",
    "object_key",
    "presigned_url",
  ]) {
    assert.ok(!postgresSql.includes(forbidden), `postgres SQL must not include ${forbidden}`);
    assert.ok(!sqliteSql.includes(forbidden), `sqlite SQL must not include ${forbidden}`);
  }
});
