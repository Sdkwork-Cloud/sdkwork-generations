import type { GenerationResult } from './generation-result';

export interface GenerationResultPage {
  items: GenerationResult[];
  nextCursor?: string;
}
