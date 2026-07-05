import type { GenerationRecord } from './generation-record';

export interface GenerationsCancelResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
