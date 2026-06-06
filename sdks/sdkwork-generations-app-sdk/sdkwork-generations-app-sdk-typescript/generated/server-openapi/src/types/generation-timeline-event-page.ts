import type { GenerationTimelineEvent } from './generation-timeline-event';

export interface GenerationTimelineEventPage {
  items: GenerationTimelineEvent[];
  nextCursor?: string;
}
