import type { GenerationCommandResponse } from './generation-command-response';

export interface GenerationsRetryResponse202 {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
