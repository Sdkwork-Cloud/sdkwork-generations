import type { HttpClient } from '../http/client';
import type { CreateReconciliationRunRequest, GenerationDispatchJob, GenerationDispatchJobPage, GenerationSourceEventPage, ReconciliationRun } from '../types';
export interface GenerationsBackendGenerationReconciliationRunsCreateParams {
    idempotencyKey?: string;
}
export declare class GenerationsBackendGenerationReconciliationRunsApi {
    private client;
    constructor(client: HttpClient);
    create(body: CreateReconciliationRunRequest, params?: GenerationsBackendGenerationReconciliationRunsCreateParams): Promise<ReconciliationRun>;
}
export interface GenerationsBackendGenerationSourceEventsListParams {
    cursor?: string;
    sourceProvider?: string;
    status?: string;
}
export declare class GenerationsBackendGenerationSourceEventsApi {
    private client;
    constructor(client: HttpClient);
    list(params?: GenerationsBackendGenerationSourceEventsListParams): Promise<GenerationSourceEventPage>;
}
export interface GenerationsBackendGenerationDispatchJobsListParams {
    cursor?: string;
    pageSize?: number;
    status?: string;
    leaseOwner?: string;
}
export declare class GenerationsBackendGenerationDispatchJobsApi {
    private client;
    constructor(client: HttpClient);
    list(params?: GenerationsBackendGenerationDispatchJobsListParams): Promise<GenerationDispatchJobPage>;
    get(dispatchJobId: string): Promise<GenerationDispatchJob>;
}
export declare class GenerationsBackendApi {
    private client;
    readonly generationDispatchJobs: GenerationsBackendGenerationDispatchJobsApi;
    readonly generationSourceEvents: GenerationsBackendGenerationSourceEventsApi;
    readonly generationReconciliationRuns: GenerationsBackendGenerationReconciliationRunsApi;
    constructor(client: HttpClient);
}
export declare function createGenerationsBackendApi(client: HttpClient): GenerationsBackendApi;
//# sourceMappingURL=generations-backend.d.ts.map