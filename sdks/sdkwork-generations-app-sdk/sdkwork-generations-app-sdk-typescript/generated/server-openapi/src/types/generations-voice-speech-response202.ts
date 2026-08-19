import type { GenerationCommandResponse } from './generation-command-response';

export interface GenerationsVoiceSpeechResponse202 {
  code: 0;
  data: unknown & { item: GenerationCommandResponse; };
  /** Server-owned request correlation id. */
  traceId: string;
}
