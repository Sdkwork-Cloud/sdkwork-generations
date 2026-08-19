import type { GenerationSourceEvent } from './generation-source-event';

export interface GenerationSourceEventsListResponse {
  code: 0;
  data: unknown & { items: GenerationSourceEvent[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; };
  /** Server-owned request correlation id. */
  traceId: string;
}
