import type { GenerationResult } from './generation-result';

export interface GenerationsResultsSaveToAssetsResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
