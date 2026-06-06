export interface GenerationDispatchJob {
  id: string;
  generationId: string;
  sourceProvider: string;
  operationType: string;
  status: string;
  attemptCount: number;
  leaseOwner?: string;
  leaseExpiresAt?: string;
  nextAttemptAt?: string;
  createdAt: string;
  updatedAt: string;
}
