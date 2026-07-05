import type { GenerationRecord } from './generation-record';

export interface GenerationsFavoriteResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
