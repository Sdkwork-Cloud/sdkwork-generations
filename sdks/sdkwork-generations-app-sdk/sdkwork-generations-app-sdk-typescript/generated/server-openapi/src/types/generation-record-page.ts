import type { GenerationRecord } from './generation-record';

export interface GenerationRecordPage {
  items: GenerationRecord[];
  nextCursor?: string;
}
