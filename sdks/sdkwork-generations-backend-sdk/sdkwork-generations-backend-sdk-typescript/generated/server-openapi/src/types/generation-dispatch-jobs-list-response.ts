import type { GenerationDispatchJob } from './generation-dispatch-job';

export interface GenerationDispatchJobsListResponse {
  code: 0;
  data: unknown & { items: GenerationDispatchJob[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; };
  /** Server-owned request correlation id. */
  traceId: string;
}
