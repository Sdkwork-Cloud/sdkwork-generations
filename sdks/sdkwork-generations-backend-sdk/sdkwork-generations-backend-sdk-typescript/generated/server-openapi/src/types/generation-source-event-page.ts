import type { GenerationSourceEvent } from './generation-source-event';

export interface GenerationSourceEventPage {
  items: GenerationSourceEvent[];
  nextCursor?: string;
}
