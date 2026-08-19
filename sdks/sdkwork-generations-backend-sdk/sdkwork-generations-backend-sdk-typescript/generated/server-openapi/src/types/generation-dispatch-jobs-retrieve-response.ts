import type { GenerationDispatchJob } from './generation-dispatch-job';

export interface GenerationDispatchJobsRetrieveResponse {
  code: 0;
  data: unknown & { item: GenerationDispatchJob; };
  /** Server-owned request correlation id. */
  traceId: string;
}
