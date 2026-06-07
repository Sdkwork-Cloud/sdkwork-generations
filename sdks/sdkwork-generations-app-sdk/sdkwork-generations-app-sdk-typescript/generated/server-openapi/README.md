# sdkwork-generations-app-sdk

Generator-owned TypeScript transport SDK for sdkwork-generations-app-sdk.

## Installation

```bash
npm install sdkwork-generations-app-sdk-generated-typescript
# or
yarn add sdkwork-generations-app-sdk-generated-typescript
# or
pnpm add sdkwork-generations-app-sdk-generated-typescript
```

## Quick Start

```typescript
import { SdkworkAppClient } from 'sdkwork-generations-app-sdk-generated-typescript';

const client = new SdkworkAppClient({
  baseUrl: 'http://127.0.0.1:18090',
  timeout: 30000,
});

// Attach the authenticated SDKWork session tokens
client.setAuthToken('your-auth-token');
client.setAccessToken('your-access-token');

// Use the SDK
const params = {
  cursor: 'cursor',
  page_size: 2,
  status: 'queued',
  modality: 'image',
  operation_type: 'operation_type',
  q: 'q',
};
const result = await client.generations.list(params);
```

## Dual Token Authentication

```typescript
const client = new SdkworkAppClient({ baseUrl: 'http://127.0.0.1:18090' });
client.setAuthToken('your-auth-token');
client.setAccessToken('your-access-token');
// Sends:
// Authorization: Bearer <authToken>
// Access-Token: <accessToken>
```

## Configuration (Non-Auth)

```typescript
import { SdkworkAppClient } from 'sdkwork-generations-app-sdk-generated-typescript';

const client = new SdkworkAppClient({
  baseUrl: 'http://127.0.0.1:18090',
  timeout: 30000, // Request timeout in ms
  headers: {      // Custom headers
    'X-Custom-Header': 'value',
  },
});
```

## API Modules

- `client.generations` - generations API

## Usage Examples

### generations

```typescript
// GET /app/v3/api/generations
const params = {
  cursor: 'cursor',
  page_size: 2,
  status: 'queued',
  modality: 'image',
  operation_type: 'operation_type',
  q: 'q',
};
const result = await client.generations.list(params);
```

## Error Handling

```typescript
import { SdkworkAppClient, NetworkError, TimeoutError, AuthenticationError } from 'sdkwork-generations-app-sdk-generated-typescript';

try {
  const params = {
    cursor: 'cursor',
    page_size: 2,
    status: 'queued',
    modality: 'image',
    operation_type: 'operation_type',
    q: 'q',
  };
  const result = await client.generations.list(params);
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Authentication failed:', error.message);
  } else if (error instanceof TimeoutError) {
    console.error('Request timed out:', error.message);
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  } else {
    throw error;
  }
}
```

## Publishing

This SDK includes cross-platform publish scripts in `bin/`:
- `bin/publish-core.mjs`
- `bin/publish.sh`
- `bin/publish.ps1`

### Check

```bash
./bin/publish.sh --action check
```

### Publish

```bash
./bin/publish.sh --action publish --channel release
```

```powershell
.\bin\publish.ps1 --action publish --channel test --dry-run
```

> Set `NPM_TOKEN` (and optional `NPM_REGISTRY_URL`) before release publish.

## License

MIT

## Regeneration Contract

- Generator-owned files are tracked in `.sdkwork/sdkwork-generator-manifest.json`.
- Each run also writes `.sdkwork/sdkwork-generator-changes.json` so automation can inspect created, updated, deleted, unchanged, scaffolded, and backed-up files plus the classified impact areas, verification plan, and execution decision for the latest generation.
- Apply mode also writes `.sdkwork/sdkwork-generator-report.json` with the full execution report, including `schemaVersion`, `generator`, stable artifact paths, and the execution handoff commands that match CLI `--json` output.
- CLI JSON output also includes an execution handoff with concrete next commands, including reviewed apply commands for dry-run flows.
- Put hand-written wrappers, adapters, and orchestration in `custom/`.
- Files scaffolded under `custom/` are created once and preserved across regenerations.
- If a generated-owned file was modified locally, its previous content is copied to `.sdkwork/manual-backups/` before overwrite or removal.
