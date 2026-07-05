import type { GenerationResult } from './generation-result';

export interface GenerationsResultsListResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
