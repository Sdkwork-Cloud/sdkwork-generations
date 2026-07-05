import type { GenerationDispatchJob } from './generation-dispatch-job';

export interface GenerationDispatchJobsListResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
