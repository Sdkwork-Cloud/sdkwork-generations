export interface GenerationTimelineEvent {
  id: string;
  generationId: string;
  eventType: string;
  message?: string;
  payload?: Record<string, unknown>;
  createdAt: string;
}
