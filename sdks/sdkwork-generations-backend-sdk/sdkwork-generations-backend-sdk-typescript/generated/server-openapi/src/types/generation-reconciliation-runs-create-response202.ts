import type { ReconciliationRun } from './reconciliation-run';

export interface GenerationReconciliationRunsCreateResponse202 {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
