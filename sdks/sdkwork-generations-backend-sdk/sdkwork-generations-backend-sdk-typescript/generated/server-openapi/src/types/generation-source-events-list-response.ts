import type { GenerationSourceEvent } from './generation-source-event';

export interface GenerationSourceEventsListResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
