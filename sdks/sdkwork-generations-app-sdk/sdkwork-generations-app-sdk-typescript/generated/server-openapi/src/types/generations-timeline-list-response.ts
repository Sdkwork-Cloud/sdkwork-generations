import type { GenerationTimelineEvent } from './generation-timeline-event';

export interface GenerationsTimelineListResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
